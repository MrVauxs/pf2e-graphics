import type { AnimationObject } from 'src/storage/AnimCore';
import { type GameData, genericEffectOptions, parseOffsets, type SequencerTypes } from '.';

export default function template(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { options } = animation;
	let { targets = [] } = data;

	if (options?.preset?.targets) targets = options.preset.targets;

	for (const template of targets) {
		const effect = seq
			.effect()
			.file(window.AnimCore.parseFiles(animation.file))
			.attachTo(template, parseOffsets(options?.preset?.attachTo));

		if (
			options?.preset?.stretchTo
			|| (
				typeof template === 'object'
				&& 't' in template
				&& (template.t === 'ray' || template.t === 'cone')
			)
		) {
			effect.stretchTo(template, parseOffsets({ ...options?.preset?.stretchTo, attachTo: true }));
		}

		genericEffectOptions(effect, animation, data);
	}

	return seq;
}
