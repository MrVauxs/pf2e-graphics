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

	seq.volume((payload.volume ?? 0.8) * window.pf2eGraphics.liveSettings.volume);

	if (isTrueish(payload.delay)) {
		typeof payload.delay === 'number'
			? seq.delay(payload.delay)
			: seq.delay(payload.delay.min, payload.delay.max);
	}

	if (isTrueish(payload.waitUntilFinished)) {
		if (typeof payload.waitUntilFinished === 'object') {
			seq.waitUntilFinished(payload.waitUntilFinished.min, payload.waitUntilFinished.max);
		} else {
			seq.waitUntilFinished(payload.waitUntilFinished);
		}
	}

	if (payload.async) seq.async();

	if (isTrueish(payload.repeats)) {
		if (typeof payload.repeats.delay === 'object') {
			seq.repeats(payload.repeats.count, payload.repeats.delay.min, payload.repeats.delay.max);
		} else {
			seq.repeats(payload.repeats.count, payload.repeats.delay);
		}
	}

	if (isTrueish(payload.fadeIn)) {
		if (typeof payload.fadeIn === 'object') {
			seq.fadeInAudio(payload.fadeIn?.value, payload.fadeIn);
		} else {
			seq.fadeInAudio(payload.fadeIn);
		}
	}

	if (isTrueish(payload.fadeOut)) {
		if (typeof payload.fadeOut === 'object') {
			seq.fadeOutAudio(payload.fadeOut?.value, payload.fadeOut);
		} else {
			seq.fadeOutAudio(payload.fadeOut);
		}
	}

	if (isTrueish(payload.duration)) seq.duration(payload.duration);

	if (isTrueish(payload.atLocation)) {
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

		if (isTrueish(payload.radius)) seq.radius(payload.radius);
		if (isTrueish(payload.constrainedByWalls)) seq.constrainedByWalls(payload.constrainedByWalls);
		if (isTrueish(payload.noDistanceEasing)) seq.distanceEasing(!payload.noDistanceEasing);
		if (isTrueish(payload.alwaysForGMs)) seq.alwaysForGMs(payload.alwaysForGMs);
		if (isTrueish(payload.baseEffect)) seq.baseEffect(payload.baseEffect);
		if (isTrueish(payload.muffledEffect)) seq.muffledEffect(payload.muffledEffect);
	}

	if (isTrueish(payload.audioChannel)) seq.audioChannel(payload.audioChannel);

	if (isTrueish(payload.name)) {
		seq.name(payload.name);
	} else if (data.item) {
		seq.name(data.item.name);
	}

	if (payload.probability) seq.playIf(() => Math.random() < payload.probability!);

	return seq;
}
