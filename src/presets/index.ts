import type { TokenOrDoc } from 'src/extensions';
import type { AnimationObject } from 'src/storage/animCore.ts';
import { log } from 'src/utils.ts';
import soundPreset from './sound.ts';

export interface GameData {
	sources: TokenOrDoc[];
	targets?: (TokenOrDoc | string | Point)[];
};

export function addAnimationToSequence(seq: Sequence, animation: AnimationObject, data: GameData) {
	switch (animation.preset) {
		case 'sound':
			soundPreset(seq, animation, data);
			break;
		default:
			log(`An animation was called with a preset of ${animation.preset} which does not exist!`);
	}

	return seq;
}
