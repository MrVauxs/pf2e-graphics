import type { AnimationSequenceData, MacroSequenceData } from ".";

export const presets = {
    ranged: (seq: Sequence, { file, target, token, options: _options }: AnimationSequenceData) => {
        return seq.effect()
            .file(file)
            .stretchTo(target)
            .atLocation(token)
    },
    melee: (seq: Sequence, { file, target, token, options: _options }: AnimationSequenceData) => {
        return seq.effect()
            .file(file)
            .atLocation(token)
            .rotateTowards(target)
    },
    onToken: (seq: Sequence, { file, target, token, options: _options }: AnimationSequenceData) => {
        return seq.effect()
            .file(file)
            .attachTo(token, { offset: _options?.offset, gridUnits: _options?.gridUnits })
            .scaleToObject(_options?.scale)
            .rotateTowards(target)
            .waitUntilFinished(_options?.waitUntilFinished)
            .filter(_options?.filter.type, _options?.filter.options)
    },
    macro: (seq: Sequence, data: MacroSequenceData) => {
        return seq.macro(data.macro, data)
    },
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