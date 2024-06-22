import { ErrorMsg } from "src/utils";
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
    ranged: (seq: Sequence, { file, targets, source, options: _options }: PresetIndex["ranged"]) => {
        const target = targets[0];
        if (!target) throw new ErrorMsg("Ranged animation requires a target!");
        return seq.effect()
            .file(file)
            .randomizeMirrorY()
            .missed(_options?.missed ?? false)
            .persist(_options?.persist ?? false)
            .stretchTo(target)
            .atLocation(source)
            .rotate(_options?.rotate ?? 0)
    },
    melee: (seq: Sequence, { file, targets, source, options: _options }: PresetIndex["melee"]) => {
        const target = targets[0];
        if (!target) throw new ErrorMsg("Melee animation requires a target!");
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
    onToken: (seq: Sequence, { file, targets, source, options: _options }: PresetIndex["onToken"]) => {
        const target = targets[0];
        const affectedToken = _options?.preset === "target" ? target : source;
        if (_options?.preset === "target" && !target) throw new ErrorMsg("This \"onToken\" animation requires a target!");

        const result = seq.effect()
            .file(file)
            .randomizeMirrorY()
            .missed(_options?.missed ?? false)
            .persist(_options?.persist ?? false)
            .attachTo(affectedToken, _options?.attachTo)
            .waitUntilFinished(_options?.waitUntilFinished)
            .rotate(_options?.rotate ?? 0)
            .fadeIn(_options?.fadeIn ?? 0)
            .fadeOut(_options?.fadeOut ?? 0)

        if (_options?.scale) result.scale(_options.scale.value, _options.scale)
        if (_options?.scaleToObject) result.scaleToObject(_options.scaleToObject.value, _options.scaleToObject)
        if (_options?.filter) result.filter(_options.filter.type, _options.filter.options)

        return result
    },
    macro: (seq: Sequence, data: PresetIndex["macro"]) => {
        return seq.macro(data.macro, data)
    },
} as const;

export type PresetKeys = keyof typeof presets;

export type PresetIndex = {
    ranged: GenericSequenceData,
    melee: GenericSequenceData,
    onToken: GenericSequenceData,
    macro: MacroSequenceData
}

type GenericSequenceData = {
    sequence: Sequence,
    file: string,
    source: TokenOrDoc,
    targets: TokenOrDoc[],
    options?: Record<string, any>
}

type MacroSequenceData = GenericSequenceData & {
    macro: string
}

Hooks.on("sequencerReady", () => {
    Object.keys(presets).forEach(key => {
        const preset = presets[key as PresetKeys];
        if (typeof preset !== "function") {
            throw new Error(`Invalid preset ${key}`);
        }

        Sequencer.Presets.add(key, preset);
    });
})