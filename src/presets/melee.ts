import type { AnimationObject } from 'src/storage/animCore';
import { type GameData, genericEffectOptions, parseOffsets, type SequencerTypes } from '.';

export default function melee(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	let { sources, targets = [] } = data;

	if (animation.options?.preset?.targets) targets = animation.options.preset.targets;

	animation.options = foundry.utils.mergeObject({
		randomizeMirrorY: true,
		anchor: {
			x: 0.4,
			y: 0.5 * Sequencer.Helpers.random_float_between(0.8, 1.2),
		},
		scaleToObject: {
			value: 4,
		},
	}, animation.options);

	for (const source of sources) {
		for (const target of targets) {
			const effect = seq
				.effect()
				.file(window.AnimCore.parseFiles(animation.file))
				.attachTo(source, parseOffsets(animation.options?.preset?.attachTo))
				.rotateTowards(target, parseOffsets(animation.options?.preset?.rotateTowards));

			genericEffectOptions(effect, animation, data);
		}
	}

	return seq;
}
