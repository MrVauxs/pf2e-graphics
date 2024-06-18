import type { AnimationSequenceData } from ".";

export const presets = {
    ranged: (seq: Sequence, { file, target, token }: AnimationSequenceData) => {
        return seq.effect()
            .file(file)
            .stretchTo(target)
            .atLocation(token)
    },
    melee: (seq: Sequence, { file, target, token }: AnimationSequenceData) => {
        return seq.effect()
            .file(file)
            .atLocation(token)
            .rotateTowards(target)
    }
} as const;

export type PresetKeys = keyof typeof presets;

Hooks.on("sequencerReady", () => {
    Object.keys(presets).forEach(key => {
        const preset = presets[key as PresetKeys];
        if (typeof preset !== "function") {
            throw new Error(`Invalid preset ${key}`);
        }

        Sequencer.Presets.add(key, preset);
    });
})