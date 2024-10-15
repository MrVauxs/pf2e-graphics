import type { GameData, SequencerTypes } from '.';
import type { ExecutableAnimation } from '../storage/AnimCore';
import { isTrueish } from '../utils';

export default async function animation(seq: SequencerTypes, animation: ExecutableAnimation, data: GameData) {
	const { sources } = data;
	// const { options = {} } = animation;
	const options: any = animation;

	for (const source of sources) {
		if ((source.actor as ActorPF2e)?.primaryUpdater?.id === game.userId) {
			const ani = seq.animation(source);

			if (isTrueish(options?.preset?.type)) {
				switch (options?.preset?.type) {
					case 'teleport':
						ani.teleportTo(options?.preset?.target);
						break;
					case 'move':
					default:
						ani.moveTowards(options?.preset?.target);
						break;
				}
			}

			if (isTrueish(options?.duration)) ani.duration(options.duration);
			if (isTrueish(options?.closestSquare)) ani.closestSquare(options.closestSquare);
			if (isTrueish(options?.snapToGrid)) ani.snapToGrid(options.snapToGrid);

			if (isTrueish(options?.repeats)) {
				if (typeof options.repeats === 'object') {
					ani.repeats(options.repeats.count, options.repeats.delayMin, options.repeats.delayMax);
				} else {
					ani.repeats(options.repeats);
				}
			}
			if (isTrueish(options?.delay)) {
				if (typeof options.delay === 'object') {
					ani.delay(options.delay.min, options.delay?.max);
				} else {
					ani.delay(options.delay);
				}
			}
			if (isTrueish(options?.fadeIn)) {
				if (typeof options.fadeIn === 'object') {
					ani.fadeIn(options.fadeIn?.value, options.fadeIn);
				} else {
					ani.fadeIn(options.fadeIn);
				}
			}
			if (isTrueish(options?.fadeOut)) {
				if (typeof options.fadeOut === 'object') {
					ani.fadeOut(options.fadeOut?.value, options.fadeOut);
				} else {
					ani.fadeOut(options.fadeOut);
				}
			}
		} else {
			// Do I need to do anything here? I thought of adding some sort of socket in similar vein to crosshairs but... This doesn't seem to be needed?
			// Edit: What about waitUntilFinished?
		}
	}

	return seq;
}
