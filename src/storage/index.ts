import type { TokenOrDoc } from "src/extensions";
import json from "../animations.json"
import "./presets.ts"
import type { PresetKeys } from "./presets.ts";
import { ErrorMsg } from "src/utils.ts";

declare global {
    interface Window {
        pf2eGraphics: pf2eGraphics
    }
    type pf2eGraphics = {
        core: Record<keyof typeof json, string | ReferenceObject | AnimationDataObject[]>
        modules: Record<string, Record<string, string | ReferenceObject | AnimationDataObject[]>>
    }
}

window.pf2eGraphics ??= {
    core: json as any,
    modules: {},
}

Hooks.on("ready", async () => {
    for (const mod of game.modules) {
        if (!mod.active) continue;
        const animations: string | undefined = mod.flags?.["pf2e-graphics"] as unknown as string
        if (!animations || animations.includes("/pf2e-graphics/")) continue;
        window.pf2eGraphics.modules[mod.id] = await (await fetch(animations)).json()
    }
});


if (import.meta.hot) {
    import.meta.hot.on('updateAnims', (data) => {
        window.pf2eGraphics.core = JSON.parse(data)
        ui.notifications.info("Animations updated!");
    })
}

export class AnimationsStorage {
    static getAnimationObject(key: string | undefined): AnimationDataObject[] | undefined {
        if (!key || typeof key !== "string") {
            throw new ErrorMsg(`PF2e Animations | You are trying to call 'getAnimationObject' with a non-string value (${key})!`)
        }

        const animationObject = window.pf2eGraphics.core[key as keyof typeof window.pf2eGraphics.core]

        if (typeof animationObject === "string") {
            return AnimationsStorage.getAnimationObject(animationObject)
        }

        if (this.isReference(animationObject)) {
            const reference = AnimationsStorage.getAnimationObject(animationObject.reference)
            if (!reference) {
                return undefined;
            }

            return foundry.utils.mergeObject(reference, { ...animationObject, reference: undefined })
        }

        return animationObject.map((a) => ({ ...a, file: this.parseFile(a.file) }));
    }

    // Removes any inline {randomOptions} from the file path and returns the valid file path with one of the options randomly picked
    static parseFile(file: string): string {
        const match = file.match(/{(.*?)}/)
        if (!match) return file

        const [_, options] = match
        const parsedOptions = options.split(",")
        const randomOption = Sequencer.Helpers.random_array_element(parsedOptions)
        return file.replace(`{${options}}`, randomOption)
    }

    static isReference(reference: AnimationDataObject[] | ReferenceObject): reference is ReferenceObject {
        return typeof (reference as ReferenceObject).reference === "string";
    }

    static isFolder(folder: AnimationDataObject | FolderObject): folder is FolderObject {
        return (folder as FolderObject).contents !== undefined;
    }

    static getArray() {
        return Object.keys(window.pf2eGraphics.core)
    }

    static getMatchingAnimations(array: string[] | undefined): AnimationDataObject[] {
        if (!array) return [];
        return AnimationsStorage.getArray()
            .filter(key => array.includes(key))
            .flatMap(key => AnimationsStorage.getAnimationObject(key))
            .filter(<T>(n?: T): n is T => Boolean(n))
            .flatMap((x: AnimationDataObject | FolderObject) => this.isFolder(x) ? AnimationsStorage.unfoldAnimations(x) : x)
    }


    static unfoldAnimations(folder: FolderObject): AnimationDataObject[] {
        return folder.contents.flatMap((entry: AnimationDataObject | FolderObject) => {
            entry = foundry.utils.mergeObject(entry, { ...folder, contents: undefined }, { overwrite: false })

            return this.isFolder(entry) ? this.unfoldAnimations(entry) : entry
        })
    }

    static animate(preset: AnimationDataObject["preset"], options: AnimationSequenceData): void {
        if (!Sequencer.Presets.getAll().has(preset)) {
            throw new ErrorMsg(`PF2e Graphics | Animation preset "${preset}" not found!`)
        }

        if (options.sequence) {
            options.sequence.preset(preset, options);
        } else {
            new Sequence({ inModuleName: "pf2e-graphics" }).preset(preset, options).play();
        }
    }
}

type FolderObject = Partial<AnimationDataObject> & { contents: (AnimationDataObject | FolderObject)[] }

type ReferenceObject = Partial<AnimationDataObject> & { reference: string }

export type AnimationDataObject = {
    type: 'attack-roll' | 'damage-roll' | 'spell-cast',
    preset: PresetKeys,
    file: string,
    predicate?: PredicateStatement[],
    options?: {}
}

export type AnimationSequenceData = {
    sequence?: Sequence,
    file: string,
    target?: TokenOrDoc,
    source: TokenOrDoc,
    options?: Record<string, any>
}

export type MacroSequenceData = {
    macro: string | Macro,
    sequence?: Sequence,
    target?: TokenOrDoc,
    token: TokenOrDoc,
    source: TokenOrDoc,
    trigger?: any,
    options?: Record<string, any>
}