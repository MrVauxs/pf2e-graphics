import animations from "../animations.json"
import "./presets.ts"
import type { PresetKeys } from "./presets.ts";

const typedAnimations: Record<keyof typeof animations, AnimationDataObject[]> = animations as any;

export class AnimationsStorage {
    static getAnimationObject(key: string | undefined): AnimationDataObject[] | undefined {
        if (!key) {
            console.warn("Item has no sourceId! Or the provided key is undefined.")
            return undefined
        }

        return typedAnimations[key as keyof typeof typedAnimations]
    }

    static getArray() {
        return Object.keys(typedAnimations)
    }

    static getMatchingAnimations(array: string[] | undefined): AnimationDataObject[] {
        if (!array) return [];
        return AnimationsStorage.getArray().filter(key => array.includes(key)).map(key => AnimationsStorage.getAnimationObject(key)).flat().filter(<T>(n?: T): n is T => Boolean(n))
    }

    static animate(preset: AnimationDataObject["preset"], options: AnimationSequenceData): void {
        if (!Sequencer.Presets.getAll().has(preset)) {
            ui.notifications.error(`PF2e Graphics | Animation preset "${preset}" not found!`)
            return;
        }

        new Sequence({ inModuleName: "pf2e-graphics" }).preset(preset, options).play()
    }
}

export type AnimationDataObject = {
    type: 'attack-roll' | 'damage-roll' | 'spell-cast',
    preset: PresetKeys,
    file: string,
    predicate?: PredicateStatement[],
    options?: {}
}

export type AnimationSequenceData = {
    file: string,
    target?: Token | TokenDocument,
    token: Token | TokenDocument,
    options?: {}
}