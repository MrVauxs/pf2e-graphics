import type { AnimationObject } from 'src/storage/animCore';
import { type GameData, genericEffectOptions } from '.';

export default function ranged(seq: Sequence, animation: AnimationObject, data: GameData) {
	const { options } = animation;
	let { sources, targets = [] } = data;

	if (options?.preset?.targets) targets = options.preset.targets;

	sources.forEach((source, sourceIndex) => {
		targets.forEach((target, targetIndex) => {
			// Only bounce one animation, we dont want two source tokens causing the same bounce twice.
			if (options?.preset?.bounce && targetIndex > 0 && sourceIndex !== 0) return;

			const attacker = options?.preset?.bounce && targetIndex > 0 ? targets[targetIndex - 1] : source;

			const effect = seq
				.effect()
				.stretchTo(target);

			if (options?.preset?.bounce && targetIndex > 0) {
				effect.file(options.preset.bounce.file);
			} else {
				effect.file(animation.file);
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
