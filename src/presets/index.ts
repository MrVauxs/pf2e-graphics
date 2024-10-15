import type { TokenOrDoc } from '../extensions';
import type { AnimationPayload } from '../schema/animation.ts';
import type { EffectOptions, GraphicOptions } from '../schema/presets/index.ts';
import type { ExecutableAnimation } from '../storage/AnimCore.ts';
import { isTrueish, log } from '../utils.ts';
import crosshairPreset from './crosshair.ts';
import meleePreset from './melee.ts';
import soundPreset from './sound.ts';

export interface GameData {
	sources: TokenOrDoc[];
	targets?: (TokenOrDoc | string | Point | MeasuredTemplateDocumentPF2e)[];
	animations: ExecutableAnimation[];
	queue: Sequence[];
	currentIndex: number;
	item?: ItemPF2e<any>;
	user?: string;
}

export type SequencerTypes = Sequence | EffectSection | SoundSection | AnimationSection;

export async function addAnimationToSequence(seq: SequencerTypes, payload: AnimationPayload, data: GameData) {
	if (payload.type === 'sound') return soundPreset(seq, payload, data);
	if (payload.type === 'melee') return meleePreset(seq, payload, data);
	// if (payload.type === 'ranged') return rangedPreset(seq, payload, data);
	// if (payload.type === 'onToken') return onTokenPreset(seq, payload, data);
	// if (payload.type === 'template') return templatePreset(seq, payload, data);
	if (payload.type === 'crosshair') return await crosshairPreset(seq, payload, data);
	// if (payload.type === 'animation') return await animationPreset(seq, payload, data);
	if (payload.type === 'macro') return seq.macro(payload.document, payload.options);

	return log(`Failed to execute effect with preset type \`${payload.type}\`: type does not exist`);
}

export function graphicOptions(seq: EffectSection, payload: EffectOptions & GraphicOptions, data: GameData) {
	if (isTrueish(payload.zIndex)) seq.zIndex(payload.zIndex);
	if (isTrueish(payload.syncGroup)) seq.syncGroup(payload.syncGroup);
	if (isTrueish(payload.randomRotation)) seq.randomRotation(payload.randomRotation);
	if (isTrueish(payload.spriteOffset)) {
		seq.spriteOffset(parseOffset(payload.spriteOffset).offset, payload.spriteOffset);
	}
	if (isTrueish(payload.spriteRotation)) seq.spriteRotation(payload.spriteRotation);
	if (isTrueish(payload.waitUntilFinished)) seq.waitUntilFinished(payload.waitUntilFinished);
	if (isTrueish(payload.locally)) seq.locally(payload.locally);
	if (isTrueish(payload.missed)) seq.missed(payload.missed);
	if (isTrueish(payload.rotate)) seq.rotate(payload.rotate ?? 0);
	if (isTrueish(payload.belowTokens)) seq.belowTokens(payload.belowTokens ?? false);
	if (isTrueish(payload.duration)) seq.duration(payload.duration);
	if (isTrueish(payload.randomizeMirrorX)) seq.randomizeMirrorX(payload.randomizeMirrorX);
	if (isTrueish(payload.randomizeMirrorY)) seq.randomizeMirrorY(payload.randomizeMirrorY);
	if (isTrueish(payload.mirrorX)) seq.mirrorX(payload.mirrorX);
	if (isTrueish(payload.mirrorY)) seq.mirrorY(payload.mirrorY);
	if (isTrueish(payload.template)) seq.template(payload.template);
	if (isTrueish(payload.scaleIn)) seq.scaleIn(payload.scaleIn.scale, payload.scaleIn.duration, payload.scaleIn);
	if (isTrueish(payload.scaleOut))
		seq.scaleOut(payload.scaleOut.scale, payload.scaleOut.duration, payload.scaleOut);
	if (isTrueish(payload.tint)) seq.tint(payload.tint);
	// @ts-expect-error TODO: Fix in Sequencer types
	if (isTrueish(payload.anchor)) seq.anchor(payload.anchor);
	if (isTrueish(payload.opacity)) seq.opacity(payload.opacity);
	if (isTrueish(payload.mask)) seq.mask();

	if (isTrueish(payload.repeats)) {
		if (typeof payload.repeats === 'object') {
			seq.repeats(payload.repeats.count, payload.repeats.delayMin, payload.repeats.delayMax);
		} else {
			seq.repeats(payload.repeats);
		}
	}
	if (isTrueish(payload.fadeIn)) {
		if (typeof payload.fadeIn === 'object') {
			seq.fadeIn(payload.fadeIn?.value, payload.fadeIn);
		} else {
			seq.fadeIn(payload.fadeIn);
		}
	}
	if (isTrueish(payload.fadeOut)) {
		if (typeof payload.fadeOut === 'object') {
			seq.fadeOut(payload.fadeOut?.value, payload.fadeOut);
		} else {
			seq.fadeOut(payload.fadeOut);
		}
	}
	if (isTrueish(payload.scale)) {
		if (typeof payload.scale === 'object') {
			seq.scale(payload.scale.min, payload.scale.max);
		} else {
			seq.scale(payload.scale);
		}
	}
	if (isTrueish(payload.scaleToObject)) {
		if (typeof payload.scaleToObject === 'object') {
			seq.scaleToObject(payload.scaleToObject.value, payload.scaleToObject);
		} else {
			seq.scaleToObject(payload.scaleToObject);
		}
	}
	if (isTrueish(payload.wait)) {
		if (typeof payload.wait === 'object') {
			seq.wait(payload.wait.min, payload.wait?.max);
		} else {
			seq.wait(payload.wait);
		}
	}
	if (isTrueish(payload.delay)) {
		if (typeof payload.delay === 'object') {
			seq.delay(payload.delay.min, payload.delay?.max);
		} else {
			seq.delay(payload.delay);
		}
	}
	if (isTrueish(payload.size)) {
		if (typeof payload.size === 'object') {
			// @ts-expect-error TODO: Fix in Sequencer types
			seq.size(payload.size.value, payload.size);
		} else {
			seq.size(payload.size);
		}
	}

	// Property Animation
	if (isTrueish(payload.loopProperty))
		payload.loopProperty.forEach(opt => seq.loopProperty(opt.target, opt.property, opt.options));
	if (isTrueish(payload.animateProperty))
		payload.animateProperty.forEach(opt => seq.animateProperty(opt.target, opt.property, opt.options));

	// Adds or modifies effects

	if (isTrueish(payload.shapes)) {
		payload.shapes.forEach((shape) => {
			const offset = {
				...parseOffset(shape),
				fillColor: shape.fillColor as `#${string}`, // Required due to Sequencer typings
				lineColor: shape.lineColor as `#${string}`, // Required due to Sequencer typings
			};
			seq.shape(shape.type, offset);
		});
	}

	if (isTrueish(payload.filter)) {
		[payload.filter].flat().forEach(filter =>
			seq.filter(
				filter.type,
				// @ts-expect-error and so what if options dont exist
				filter.options,
			),
		);
	}

	// Meta Stuff
	if (isTrueish(payload.persist)) {
		if (typeof payload.persist === 'object') {
			// @ts-expect-error TODO: Fix in Sequencer types
			seq.persist(payload.persist?.value || false, payload.persist);
		} else {
			seq.persist(payload.persist || false);
		}
	}
	if (isTrueish(payload.tieToDocuments)) {
		if (!data.item) {
			log('tieToDocuments was called with no item present!');
		} else {
			seq.tieToDocuments([data.item]);
		}
	}
	if (isTrueish(payload.remove)) {
		[payload.remove].flat().forEach((origin) => {
			if (origin === 'all') {
				Sequencer.EffectManager.endEffects({ object: data.targets });
			}
			Sequencer.EffectManager.endEffects({ origin, object: data.targets });
		});
	}

	if (data.item) {
		seq.origin(data.item);
		seq.name(data.item.name);
	}
	if (isTrueish(payload.id)) seq.origin(payload.id);
	if (isTrueish(payload.name)) seq.name(payload.name);

	return seq;
}

export function parseOffset<T extends { offset?: Partial<Vector2>; gridUnits?: boolean }>(
	obj: T,
): T & { offset?: Vector2 & { gridUnits?: boolean } } {
	return {
		...obj,
		offset: {
			...obj.offset,
			x: obj?.offset?.x ?? 0,
			y: obj?.offset?.y ?? 0,
		},
	};
}
