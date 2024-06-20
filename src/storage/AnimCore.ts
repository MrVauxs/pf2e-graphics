import { ErrorMsg } from "src/utils.ts";
import type { PresetKeys } from "./presets";
import type { TokenOrDoc } from "src/extensions";

if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        if (newModule) {
            AnimCore = newModule?.AnimCore;
            window.pf2eGraphics.AnimCore = newModule?.AnimCore;
            ui.notifications.info("AnimCore updated!");
        }
    })
}

export let AnimCore = class AnimCore {
    static getAnimations(): Record<string, string | ReferenceObject | AnimationDataObject[]> {
        return Object.keys(window.pf2eGraphics.modules)
            // Sort "pf2e-graphics" module to be the last one
            .sort((a, b) => a === "pf2e-graphics" ? 1 : b === "pf2e-graphics" ? -1 : 0)
            .reduce((acc, key) => ({ ...acc, ...window.pf2eGraphics.modules[key] }), {})
    }

    static getKeys(): string[] {
        return Object.keys(this.getAnimations())
    }

    static getAnimationObject(key: string | undefined): AnimationDataObject[] | undefined {
        if (!key || typeof key !== "string") {
            throw new ErrorMsg(`PF2e Animations | You are trying to call 'getAnimationObject' with a non-string value (${key})!`)
        }

        const animationObject = this.getAnimations()[key]

        if (typeof animationObject === "string") {
            return AnimCore.getAnimationObject(animationObject)
        }

        if (this.isReference(animationObject)) {
            const reference = AnimCore.getAnimationObject(animationObject.reference)
            if (!reference) {
                return undefined;
            }

            // References can have their own properties which override anything upstream
            return foundry.utils.mergeObject(reference, { ...animationObject, reference: undefined })
        }

        return animationObject
            .flatMap((x: AnimationDataObject | FolderObject) => this.isFolder(x) ? AnimCore.unfoldAnimations(x) : x)
            .map((a) => ({ ...a, file: this.parseFile(a.file) }));
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

    static getMatchingAnimationTrees(array: string[] | undefined): Record<string, AnimationDataObject[]> {
        if (!array) return {};
        return AnimCore.getKeys()
            .filter(key => array.includes(key))
            .reduce((acc, key) => ({ ...acc, [key]: AnimCore.getAnimationObject(key) }), {})
    }

    // Unfold a folder object consisting of `contents: AnimationDataObject[] | FolderObject` into a flat array of AnimationDataObject
    // All children under this folder inherit any other properties of the folder, such as `options`, `predicate`, etc.
    // The properties of children are not to be overriden by the parent folder, only concatenated or merged.
    static unfoldAnimations(folder: FolderObject): AnimationDataObject[] {
        const { contents, ...parentProps } = folder;

        // Function to merge two arrays without duplicates
        const mergeArrays = (arr1: PredicateStatement[], arr2: PredicateStatement[]) => {
            return Array.from(new Set([...(arr1 || []), ...(arr2 || [])]));
        };

        const mergeProps = (parent: FolderObject, child: AnimationDataObject) => {
            const result = foundry.utils.mergeObject(child, parent, { overwrite: false });

            // Merge predicate arrays
            if (parent.predicate) result.predicate = mergeArrays(parent.predicate, child.predicate || []);

            return result;
        };

        return (contents || [])
            .flatMap((x: AnimationDataObject | FolderObject) => this.isFolder(x) ? AnimCore.unfoldAnimations(x) : x)
            .map((child) => mergeProps(parentProps, child))
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

export type FolderObject = Partial<AnimationDataObject> & { contents?: (AnimationDataObject | FolderObject)[] }

export type ReferenceObject = Partial<AnimationDataObject> & { reference: string }

export type AnimationDataObject = {
    type: 'attack-roll' | 'damage-roll' | 'spell-cast',
    preset: PresetKeys,
    file: string,
    default: true,
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