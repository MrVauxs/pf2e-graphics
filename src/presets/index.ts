import type { TokenOrDoc } from 'src/extensions';
import type { AnimationObject } from 'src/storage/AnimCore.ts';
import { ErrorMsg, log } from 'src/utils.ts';
import { isTrueish } from '../utils';
import crosshairPreset from './crosshair.ts';
import meleePreset from './melee.ts';
import onTokenPreset from './onToken.ts';
import rangedPreset from './ranged.ts';
import soundPreset from './sound.ts';
import templatePreset from './template.ts';

export interface GameData {
	sources: TokenOrDoc[];
	targets?: (TokenOrDoc | string | Point | MeasuredTemplateDocumentPF2e)[];
	animations: AnimationObject[];
	queue: Sequence[];
	currentIndex: number;
	item?: ItemPF2e<any>;
};

export type SequencerTypes = Sequence | EffectSection | SoundSection | AnimationSection;

export function addAnimationToSequence(seq: SequencerTypes, _animation: AnimationObject, data: GameData) {
	const animation = foundry.utils.deepClone(_animation);
	switch (animation.preset) {
		case 'sound':
			soundPreset(seq, animation, data);
			break;
		case 'melee':
			meleePreset(seq, animation, data);
			break;
		case 'ranged':
			rangedPreset(seq, animation, data);
			break;
		case 'onToken':
			onTokenPreset(seq, animation, data);
			break;
		case 'template':
			templatePreset(seq, animation, data);
			break;
		case 'crosshair':
			crosshairPreset(seq, animation, data);
			break;
		case 'macro':
			if (animation.macro) {
				seq.macro(animation.macro, { animation, data });
			} else {
				ErrorMsg.send('A macro animation was called without a macro set!');
			};
			break;
		default:
			log(`An animation was called with a preset of ${animation.preset} which does not exist!`);
	}

	return seq;
}

export function genericEffectOptions(seq: EffectSection, { options }: AnimationObject, data: GameData) {
	if (isTrueish(options?.zIndex)) seq.zIndex(options.zIndex);
	if (isTrueish(options?.syncGroup)) seq.syncGroup(options.syncGroup);
	if (isTrueish(options?.randomRotation)) seq.randomRotation(options.randomRotation);
	if (isTrueish(options?.spriteOffset)) {
		const parsed = parseOffsets(options.spriteOffset.offset);
		seq.spriteOffset(parsed.offset, options.spriteOffset);
	}
	if (isTrueish(options?.spriteRotation)) seq.spriteRotation(options.spriteRotation);
	if (isTrueish(options?.waitUntilFinished)) seq.waitUntilFinished(options?.waitUntilFinished);
	if (isTrueish(options?.locally)) seq.locally(options.locally);
	if (isTrueish(options?.missed)) seq.missed(options.missed);
	if (isTrueish(options?.rotate)) seq.rotate(options.rotate ?? 0);
	if (isTrueish(options?.belowTokens)) seq.belowTokens(options.belowTokens ?? false);
	if (isTrueish(options?.duration)) seq.duration(options.duration);
	if (isTrueish(options?.randomizeMirrorX)) seq.randomizeMirrorX(options.randomizeMirrorX);
	if (isTrueish(options?.randomizeMirrorY)) seq.randomizeMirrorY(options.randomizeMirrorY);
	if (isTrueish(options?.mirrorX)) seq.mirrorX(options.mirrorX);
	if (isTrueish(options?.mirrorY)) seq.mirrorY(options.mirrorY);
	if (isTrueish(options?.template)) seq.template(options.template);
	if (isTrueish(options?.tint)) seq.tint(options.tint);
	// @ts-expect-error TODO: Fix in Sequencer types
	if (isTrueish(options?.anchor)) seq.anchor(options.anchor);
	if (isTrueish(options?.opacity)) seq.opacity(options.opacity);
	if (isTrueish(options?.mask)) seq.mask();

	if (isTrueish(options?.repeats)) {
		if (typeof options.repeats === 'object') {
			seq.repeats(options.repeats.count, options.repeats.delayMin, options.repeats.delayMax);
		} else {
			seq.repeats(options.repeats);
		}
	}
	if (isTrueish(options?.fadeIn)) {
		if (typeof options.fadeIn === 'object') {
			seq.fadeIn(options.fadeIn?.value, options.fadeIn);
		} else {
			seq.fadeIn(options.fadeIn);
		}
	}
	if (isTrueish(options?.scale)) {
		if (typeof options.scale === 'object') {
			seq.scale(options.scale.min, options.scale.max);
		} else {
			seq.scale(options.scale);
		}
	}
	if (isTrueish(options?.scaleToObject)) {
		if (typeof options.scaleToObject === 'object') {
			seq.scaleToObject(options.scaleToObject.value, options.scaleToObject);
		} else {
			seq.scaleToObject(options.scaleToObject);
		}
	}
	if (isTrueish(options?.fadeOut)) {
		if (typeof options.fadeOut === 'object') {
			seq.fadeOut(options.fadeOut?.value, options.fadeOut);
		} else {
			seq.fadeOut(options.fadeOut);
		}
	}
	if (isTrueish(options?.wait)) {
		if (typeof options.wait === 'object') {
			seq.wait(options.wait.min, options.wait?.max);
		} else {
			seq.wait(options.wait);
		}
	}
	if (isTrueish(options?.delay)) {
		if (typeof options.delay === 'object') {
			seq.delay(options.delay.min, options.delay?.max);
		} else {
			seq.delay(options.delay);
		}
	}
	if (isTrueish(options?.size)) {
		if (typeof options.size === 'object') {
			// @ts-expect-error TODO: Fix in Sequencer types
			seq.size(options.size.value, options.size);
		} else {
			seq.size(options.size);
		}
	}

	// Property Animation
	if (isTrueish(options?.loopProperty)) options?.loopProperty.forEach(opt => seq.loopProperty(opt.target, opt.property, opt.options));
	if (isTrueish(options?.animateProperty)) options?.animateProperty.forEach(opt => seq.animateProperty(opt.target, opt.property, opt.options));

	// Adds or modifies effects

	if (isTrueish(options?.shape)) {
		[options.shape]
			.flat()
			.forEach(shape => seq.shape(shape.type, parseOffsets(shape)));
	}

	if (isTrueish(options?.filter)) {
		[options.filter]
			.flat()
			.forEach(filter => seq.filter(
				filter.type,
				// @ts-expect-error and so what if options dont exist
				filter.options,
			));
	}

	// Meta Stuff
	if (isTrueish(options?.persist)) {
		if (typeof options.persist === 'object') {
			// @ts-expect-error TODO: Fix in Sequencer types
			seq.persist(options.persist?.value || false, options.persist);
		} else {
			seq.persist(options.persist || false);
		}
	}
	if (isTrueish(options?.tieToDocuments)) {
		if (!data.item) {
			log('tieToDocuments was called with no item present!');
		} else {
			seq.tieToDocuments([data.item]);
		}
	}
	if (isTrueish(options?.remove)) {
		[options.remove].flat().forEach((origin) => {
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
	if (isTrueish(options?.id))
		seq.origin(options.id);
	if (isTrueish(options?.name))
		seq.name(options.name);

	return seq;
}

function checkIfOffset(obj: any): obj is {
	offset: {
		x: number | [number, number] | undefined;
		y: number | [number, number] | undefined;
	};
} {
	return 'offset' in obj;
}

export function parseOffsets<T>(obj: T): { offset: Vector2 } {
	if (!obj || !(typeof obj === 'object')) return { offset: { x: 0, y: 0 } };

	if (checkIfOffset(obj)) {
		if (Array.isArray(obj.offset.x)) {
			obj.offset.x = Sequencer.Helpers.random_float_between(obj.offset.x[0], obj.offset.x[1]);
		}
		if (Array.isArray(obj.offset.y)) {
			obj.offset.y = Sequencer.Helpers.random_float_between(obj.offset.y[0], obj.offset.y[1]);
		}
	}

	return obj as unknown as { offset: Vector2 };
}
