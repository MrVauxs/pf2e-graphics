import type { AnimationObject } from 'src/storage/animCore';
import type { GameData } from '.';
import { isTrueish } from '../utils';

export default function sound(seq: Sequence, animation: AnimationObject, data: GameData) {
	const { options = { volume: 1 } } = animation;
	const { sources, targets } = data;

	options.volume *= window.pf2eGraphics.liveSettings.volume;

	const sound = seq.sound();

	sound.file(animation.file);

	sound.volume(options.volume);

	if (isTrueish(options?.delay))
		sound.delay(options.delay);
	if (isTrueish(options?.duration))
		sound.duration(options.duration);
	if (isTrueish(options?.waitUntilFinished))
		sound.waitUntilFinished(options.waitUntilFinished);

	if (isTrueish(options?.atLocation)) {
		const tokens = [];

		switch (options.preset?.location) {
			case 'both':
				tokens.push(targets);
				tokens.push(sources);
				break;
			case 'target':
				tokens.push(targets);
				break;
			case 'source':
			default:
				tokens.push(sources);
				break;
		}

		(tokens).forEach(x => sound.atLocation(x, options.atLocation));

		if (isTrueish(options?.radius))
			sound.radius(options.radius);
		if (isTrueish(options?.constrainedByWalls))
			sound.constrainedByWalls(options.constrainedByWalls);
		if (isTrueish(options?.distanceEasing))
			sound.distanceEasing(options.distanceEasing);
		if (isTrueish(options?.alwaysForGMs))
			sound.alwaysForGMs(options.alwaysForGMs);
		if (isTrueish(options?.baseEffect))
			sound.baseEffect(options.baseEffect);
		if (isTrueish(options?.muffledEffect))
			sound.muffledEffect(options.muffledEffect);
	}

	return seq;
}
