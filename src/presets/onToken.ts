import type { AnimationObject } from 'src/storage/animCore';
import { type GameData, genericEffectOptions, parseOffsets, type SequencerTypes } from '.';

export default function onToken(seq: SequencerTypes, animation: AnimationObject, data: GameData) {
	const { options } = animation;
	const { sources, targets = [] } = data;

	const affectedTokens: typeof targets = [];

	if (options?.preset?.targets) {
		affectedTokens.push(...options.preset.targets);
	}

	// Dont add token targets if they are explicitly set through .name()'s
	switch (options?.preset?.location) {
		case 'target': {
			if (!options?.preset?.targets)
				affectedTokens.push(...targets);
			break;
		}
		case 'both': {
			if (!options?.preset?.targets)
				affectedTokens.push(...targets);
			affectedTokens.push(...sources);
			break;
		}
		case 'source':
		default: {
			affectedTokens.push(...sources);
			break;
		}
	}

	for (const token of affectedTokens) {
		if (!token) return;

		const effect = seq
			.effect()
			.file(window.AnimCore.parseFiles(animation.file))
			.center();

		if (options?.preset?.atLocation) {
			effect.atLocation(token);
		} else {
			effect.attachTo(token);
		}

		if (options?.preset?.rotateTowards) {
			effect.rotateTowards(
				options?.preset?.location === 'target'
					? Sequencer.Helpers.random_array_element(sources)
					: Sequencer.Helpers.random_array_element(targets),
				parseOffsets(options?.preset?.rotateTowards),
			);
		}

		genericEffectOptions(effect, animation, data);
	}

	return seq;
}
