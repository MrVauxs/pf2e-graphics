import type { GameData, SequencerTypes } from '.';
import type { AnimationPayload } from '../schema/animation';
import { isTrueish } from '../utils';

export default function sound(
	_seq: SequencerTypes,
	payload: Extract<AnimationPayload, { type: 'sound' }>,
	data: GameData,
) {
	const { sources, targets = [] } = data;

	const seq = _seq.sound();

	seq.file(window.AnimCore.parseFiles(payload.file));

	// The JSON data is scaled such that 100 is the default.
	seq.volume(((payload.volume ?? 100) / 100) * window.pf2eGraphics.liveSettings.volume);

	if (isTrueish(payload?.delay)) {
		typeof payload.delay === 'number'
			? seq.delay(payload.delay)
			: seq.delay(payload.delay.min, payload.delay.max);
	}

	if (isTrueish(payload?.duration)) seq.duration(payload.duration);

	if (isTrueish(payload?.waitUntilFinished)) seq.waitUntilFinished(payload.waitUntilFinished);

	if (isTrueish(payload?.fadeIn)) {
		if (typeof payload.fadeIn === 'object') {
			seq.fadeInAudio(payload.fadeIn?.value, payload.fadeIn);
		} else {
			seq.fadeInAudio(payload.fadeIn);
		}
	}

	if (isTrueish(payload?.fadeOut)) {
		if (typeof payload.fadeOut === 'object') {
			seq.fadeOutAudio(payload.fadeOut?.value, payload.fadeOut);
		} else {
			seq.fadeOutAudio(payload.fadeOut);
		}
	}

	if (isTrueish(payload?.atLocation)) {
		payload.atLocation.forEach((atLocation) => {
			if (atLocation.position === 'ABSOLUTE') return seq.atLocation(atLocation);

			// Need to do this or TS is sad :(
			const location = atLocation as Extract<NonNullable<typeof atLocation>, { local?: true }>;

			const options: Parameters<(typeof seq)['atLocation']>[1] = {
				cacheLocation: location.cacheLocation,
				offset: { x: location.offset?.x ?? 0, y: location.offset?.y ?? 0 },
				randomOffset: location.randomOffset,
				gridUnits: location.gridUnits,
				local: location.local,
			};

			if (atLocation.position === 'SOURCES')
				return sources.forEach(source => seq.atLocation(source, options));
			if (atLocation.position === 'TARGETS')
				return targets.forEach(target => seq.atLocation(target, options));
			return seq.atLocation(atLocation.position, options);
		});

		if (isTrueish(payload?.radius)) seq.radius(payload.radius);
		if (isTrueish(payload?.constrainedByWalls)) seq.constrainedByWalls(payload.constrainedByWalls);
		if (isTrueish(payload?.noDistanceEasing)) seq.distanceEasing(!payload.noDistanceEasing);
		if (isTrueish(payload?.alwaysForGMs)) seq.alwaysForGMs(payload.alwaysForGMs);
		if (isTrueish(payload?.baseEffect)) seq.baseEffect(payload.baseEffect);
		if (isTrueish(payload?.muffledEffect)) seq.muffledEffect(payload.muffledEffect);
	}

	if (isTrueish(payload.audioChannel)) seq.audioChannel(payload.audioChannel);

	if (isTrueish(payload?.name)) {
		seq.name(payload.name);
	} else if (data.item) {
		seq.name(data.item.name);
	}

	return seq;
}
