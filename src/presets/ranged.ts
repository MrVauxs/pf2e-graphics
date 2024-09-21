import type { AnimationObject } from 'src/storage/animCore';
import { addAnimationToSequence, type GameData, genericEffectOptions, type SequencerTypes } from '.';
import { nonNullable } from '../utils';

export default function ranged(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { options } = animation;
	let { sources, targets = [] } = data;

	if (options?.preset?.targets) targets = options.preset.targets;

	sources.forEach((source, sourceIndex) => {
		targets.forEach((target, targetIndex) => {
			// Only bounce one animation, we dont want two source tokens causing the same bounce twice.
			if (options?.preset?.bounce && targetIndex > 0 && sourceIndex !== 0) return;

			const attacker = options?.preset?.bounce && targetIndex > 0 ? targets[targetIndex - 1] : source;

			if (nonNullable(options?.preset?.bounce?.sound?.id) && targetIndex > 0) {
				const found = data.animations.find(a => nonNullable(a.options?.id) && a.options?.id === options?.preset?.bounce?.sound?.id);
				if (found) {
					const mergedAnimation = {
						...found,
						...(options?.preset?.bounce?.sound?.overrides ?? {}),
					};
					addAnimationToSequence(seq, mergedAnimation, data);
				}
			}

			const effect = seq
				.effect()
				.stretchTo(target);

			if (options?.preset?.bounce && targetIndex > 0) {
				effect.file(window.AnimCore.parseFiles(options.preset.bounce.file));
			} else {
				effect.file(window.AnimCore.parseFiles(animation.file));
			}

			if (options?.preset?.attachTo) {
				effect.attachTo(attacker);
			} else {
				effect.atLocation(attacker);
			}

			genericEffectOptions(effect, animation, data);
		});
	});

	return seq;
}
