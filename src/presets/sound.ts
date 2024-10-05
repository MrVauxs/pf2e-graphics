import type { AnimationPayload } from 'src/schema/animation';
import type { GameData, SequencerTypes } from '.';
import { isTrueish } from '../utils';

export default function sound(
	_seq: SequencerTypes,
	payload: Extract<AnimationPayload, { type: 'sound' }>,
	data: GameData,
) {
	const { sources, targets } = data;

	const seq = _seq.sound();

	seq.file(window.AnimCore.parseFiles(payload.files));

	// The JSON data is scaled such that 100 is the default.
	seq.volume(((payload.volume ?? 100) / 100) * window.pf2eGraphics.liveSettings.volume);

	if (isTrueish(payload?.delay)) {
		typeof payload.delay === 'number'
			? seq.delay(payload.delay)
			: seq.delay(payload.delay.min, payload.delay.max);
	}
	if (isTrueish(payload?.duration)) seq.duration(payload.duration);
	if (isTrueish(payload?.waitUntilFinished)) seq.waitUntilFinished(payload.waitUntilFinished);
	if (isTrueish(payload?.fadeOut)) {
		if (typeof payload.fadeOut === 'object') {
			seq.fadeOutAudio(payload.fadeOut?.value, payload.fadeOut);
		} else {
			seq.fadeOutAudio(payload.fadeOut);
		}
	}
	if (isTrueish(payload?.fadeIn)) {
		if (typeof payload.fadeIn === 'object') {
			seq.fadeInAudio(payload.fadeIn?.value, payload.fadeIn);
		} else {
			seq.fadeInAudio(payload.fadeIn);
		}
	}

	if (isTrueish(payload?.atLocation)) {
		const tokens = [];

		switch (payload.preset?.location) {
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

		tokens.forEach(x =>
			seq.atLocation(x, payload.atLocation ?? {}),
		);

		if (isTrueish(payload?.radius)) seq.radius(payload.radius);
		if (isTrueish(payload?.constrainedByWalls)) seq.constrainedByWalls(payload.constrainedByWalls);
		if (isTrueish(payload?.noDistanceEasing)) seq.distanceEasing(!payload.noDistanceEasing);
		if (isTrueish(payload?.alwaysForGMs)) seq.alwaysForGMs(payload.alwaysForGMs);
		if (isTrueish(payload?.baseEffect)) seq.baseEffect(payload.baseEffect);
		if (isTrueish(payload?.muffledEffect)) seq.muffledEffect(payload.muffledEffect);
	}

	if (isTrueish(payload?.name)) {
		seq.name(payload.name);
	} else if (data.item) {
		seq.name(data.item.name);
	}

	return seq;
}
