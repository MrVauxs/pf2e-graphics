import type { AnimationSequenceData, MacroSequenceData } from "."
import type { TokenOrDoc } from "src/extensions";

export const helpers = {
    measureDistance(token: TokenOrDoc, target: TokenOrDoc) {
        return canvas.grid.measurePath([token, target]);
    },
    measureDistanceFeet(token: TokenOrDoc, target: TokenOrDoc) {
        return this.measureDistance(token, target).distance;
    },
    measureDistanceSpaces(token: TokenOrDoc, target: TokenOrDoc) {
        return this.measureDistance(token, target).spaces;
    },
    parseOffset(offset: { x: number, y: number, flip: { x: true, y: true } }, source: TokenOrDoc, target: TokenOrDoc) {
        const result = { x: offset.x, y: offset.y }
        if (offset.flip.x && source.x > target.x) result.x *= -1;
        if (offset.flip.y && source.y > target.y) result.y *= -1;
        return result;
    }
}

export const presets = {
    ranged: (seq: Sequence, { file, target, source, options: _options }: AnimationSequenceData) => {
        if (!target) throw Error("Ranged animation requires a target");
        return seq.effect()
            .file(file)
            .randomizeMirrorY()
            .missed(_options?.missed ?? false)
            .persist(_options?.persist ?? false)
            .stretchTo(target)
            .atLocation(source)
            .rotate(_options?.rotate ?? 0)
    },
    melee: (seq: Sequence, { file, target, source, options: _options }: AnimationSequenceData) => {
        if (!target) throw Error("Melee animation requires a target");
        const result = seq.effect()
            .file(file)
            .randomizeMirrorY()
            .missed(_options?.missed ?? false)
            .persist(_options?.persist ?? false)
            .attachTo(source, _options?.attachTo ? { ..._options?.attachTo, offset: helpers.parseOffset(_options?.attachTo?.offset, source, target) } : undefined)
            .rotateTowards(target)

        if (_options?.scale) result.scale(_options.scale.value, _options.scale)
        if (_options?.scaleToObject) result.scaleToObject(_options.scaleToObject.value, _options.scaleToObject)

        return result
    },
    onToken: (seq: Sequence, { file, target, source, options: _options }: AnimationSequenceData) => {
        const affectedToken = _options?.preset === "target" ? target : source;

        const result = seq.effect()
            .file(file)
            .randomizeMirrorY()
            .missed(_options?.missed ?? false)
            .persist(_options?.persist ?? false)
            .attachTo(affectedToken, _options?.attachTo)
            .waitUntilFinished(_options?.waitUntilFinished)
            .filter(_options?.filter.type, _options?.filter.options)
            .rotate(_options?.rotate ?? 0)

        if (_options?.scale) result.scale(_options.scale.value, _options.scale)
        if (_options?.scaleToObject) result.scaleToObject(_options.scaleToObject.value, _options.scaleToObject)

        return result
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