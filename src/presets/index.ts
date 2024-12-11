import type { TokenOrDoc } from '../extensions';
import type { AnimationPayload } from '../schema/animation.ts';
// import type { EffectOptions, GraphicOptions } from '../schema/presets/index.ts';
import type { ExecutableAnimation } from '../storage/AnimCore.ts';
import { log } from '../utils.ts';
import { executeAnimation } from './animation.ts';
import { executeCrosshair } from './crosshair.ts';

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
	// if (payload.type === 'graphic') return executeGraphic(seq, payload, data);
	// if (payload.type === 'sound') return executeSound(seq, payload, data);
	if (payload.type === 'crosshair') return await executeCrosshair(seq, payload, prepareExecutionContext(data));
	if (payload.type === 'animation') return await executeAnimation(seq, payload, prepareExecutionContext(data));
	if (payload.type === 'macro') return seq.macro(payload.document, payload.options);

	return log(`Failed to execute payload with unrecognised type \`${(payload as any).type}\`!`);
}

export interface ExecutionContext {
	sources: TokenPF2e[];
	targets: TokenPF2e[];
	templates: MeasuredTemplateDocumentPF2e[];
	user?: string;
}

function prepareExecutionContext(data: GameData): ExecutionContext {
	return {
		sources: (data.sources ?? []) as TokenPF2e[],
		targets: (data.targets ?? []).filter(target => target instanceof TokenPF2e) as TokenPF2e[],
		templates: (data.targets ?? []).filter(target => target instanceof MeasuredTemplateDocumentPF2e),
		user: data.user,
	};
}

// TODO: be smart enough to select a particular element in the `data.<...>` array (e.g. for ranged bounce)
export function targetToArgument(
	target: string | Partial<Vector2>,
	data: ExecutionContext,
): string | Vector2 | TokenPF2e | MeasuredTemplateDocumentPF2e {
	if (typeof target === 'object') return offsetToVector2(target);
	if (target === 'SOURCES') return data.sources[0];
	if (target === 'TARGETS') return data.targets[0];
	if (target === 'TEMPLATES') return data.templates[0];
	return target;
}

// TODO: convert this to a prompt for the GM to accept when permissions fail
export function verifyPermissions(actor: ActorPF2e): boolean {
	return actor.primaryUpdater?.id === game.userId;
}

export function offsetToVector2(offset: Partial<Vector2> | undefined): Vector2 {
	return {
		x: offset?.x ?? 0,
		y: offset?.y ?? 0,
	};
}

// export function graphicOptions(seq: EffectSection, payload: EffectOptions & GraphicOptions, data: GameData) {
// 	if (isTrueish(payload.zIndex)) seq.zIndex(payload.zIndex);
// 	if (isTrueish(payload.syncGroup)) seq.syncGroup(payload.syncGroup);
// 	if (isTrueish(payload.randomRotation)) seq.randomRotation(payload.randomRotation);
// 	if (isTrueish(payload.spriteOffset))
// 		seq.spriteOffset(offsetToVector2(payload.spriteOffset.offset), payload.spriteOffset);
// 	if (isTrueish(payload.spriteRotation)) seq.spriteRotation(payload.spriteRotation);
// 	if (isTrueish(payload.waitUntilFinished)) seq.waitUntilFinished(payload.waitUntilFinished);
// 	if (isTrueish(payload.locally)) seq.locally(payload.locally);
// 	if (isTrueish(payload.missed)) seq.missed(payload.missed);
// 	if (isTrueish(payload.rotation)) seq.rotate(payload.rotation);
// 	if (isTrueish(payload.belowTokens)) seq.belowTokens(payload.belowTokens);
// 	if (isTrueish(payload.duration)) seq.duration(payload.duration);
// 	if (isTrueish(payload.randomizeMirrorX)) seq.randomizeMirrorX(payload.randomizeMirrorX);
// 	if (isTrueish(payload.randomizeMirrorY)) seq.randomizeMirrorY(payload.randomizeMirrorY);
// 	if (isTrueish(payload.mirrorX)) seq.mirrorX(payload.mirrorX);
// 	if (isTrueish(payload.mirrorY)) seq.mirrorY(payload.mirrorY);
// 	if (isTrueish(payload.template)) seq.template(payload.template);
// 	if (isTrueish(payload.scaleIn)) seq.scaleIn(payload.scaleIn.scale, payload.scaleIn.duration, payload.scaleIn);
// 	if (isTrueish(payload.scaleOut))
// 		seq.scaleOut(payload.scaleOut.scale, payload.scaleOut.duration, payload.scaleOut);
// 	if (isTrueish(payload.tint)) seq.tint(payload.tint as `#${string}`); // Required due to Sequencer typings
// 	if (isTrueish(payload.anchor)) seq.anchor(payload.anchor);
// 	if (isTrueish(payload.opacity)) seq.opacity(payload.opacity);
// 	if (isTrueish(payload.mask)) seq.mask();
// 	if (isTrueish(payload.repeats)) {
// 		if (typeof payload.repeats === 'object') {
// 			seq.repeats(payload.repeats.count, payload.repeats.delayMin, payload.repeats.delayMax);
// 		} else {
// 			seq.repeats(payload.repeats);
// 		}
// 	}
// 	if (isTrueish(payload.fadeIn)) {
// 		if (typeof payload.fadeIn === 'object') {
// 			seq.fadeIn(payload.fadeIn?.value, payload.fadeIn);
// 		} else {
// 			seq.fadeIn(payload.fadeIn);
// 		}
// 	}
// 	if (isTrueish(payload.fadeOut)) {
// 		if (typeof payload.fadeOut === 'object') {
// 			seq.fadeOut(payload.fadeOut?.value, payload.fadeOut);
// 		} else {
// 			seq.fadeOut(payload.fadeOut);
// 		}
// 	}
// 	if (isTrueish(payload.scale)) {
// 		if (typeof payload.scale === 'object') {
// 			seq.scale(payload.scale.min, payload.scale.max);
// 		} else {
// 			seq.scale(payload.scale);
// 		}
// 	}
// 	if (isTrueish(payload.scaleToObject)) {
// 		if (typeof payload.scaleToObject === 'object') {
// 			seq.scaleToObject(payload.scaleToObject.value, payload.scaleToObject);
// 		} else {
// 			seq.scaleToObject(payload.scaleToObject);
// 		}
// 	}
// 	if (isTrueish(payload.delay)) seq.delay(...parseMinMaxObject(payload.delay));
// 	if (isTrueish(payload.size)) {
// 		if (typeof payload.size === 'object') {
// 			// @ts-expect-error TODO: Fix in Sequencer types
// 			seq.size(payload.size.value, payload.size);
// 		} else {
// 			seq.size(payload.size);
// 		}
// 	}

// 	// Property Animation
// 	if (isTrueish(payload.loopProperty))
// 		payload.loopProperty.forEach(opt => seq.loopProperty(opt.target, opt.property, opt.options));
// 	if (isTrueish(payload.animateProperty))
// 		payload.animateProperty.forEach(opt => seq.animateProperty(opt.target, opt.property, opt.options));

// 	// Adds or modifies effects
// 	if (isTrueish(payload.text)) payload.text.forEach(text => seq.text(text.entry, text.options ?? {}));
// 	if (isTrueish(payload.shapes)) {
// 		payload.shapes.forEach((shape) => {
// 			const offset = {
// 				...parseOffsetInSitu(shape),
// 				fillColor: shape.fillColor as `#${string}`, // Required due to Sequencer typings
// 				lineColor: shape.lineColor as `#${string}`, // Required due to Sequencer typings
// 			};
// 			seq.shape(shape.type, offset);
// 		});
// 	}
// 	if (isTrueish(payload.filters)) {
// 		payload.filters.forEach(filter =>
// 			seq.filter(
// 				filter.type,
// 				// @ts-expect-error and so what if options don't exist
// 				filter.options,
// 			),
// 		);
// 	}
// 	if (isTrueish(payload.screenSpace)) {
// 		seq.screenSpace();
// 		if (typeof payload.screenSpace === 'object') {
// 			if (payload.screenSpace.aboveUI) seq.screenSpaceAboveUI();
// 			if (payload.screenSpace.anchor) seq.screenSpaceAnchor(payload.screenSpace.anchor);
// 			if (payload.screenSpace.offset) seq.screenSpacePosition(offsetToVector2(payload.screenSpace.offset));
// 			if (payload.screenSpace.scale) seq.screenSpaceScale(payload.screenSpace.scale);
// 		}
// 	}

// 	// Meta Stuff
// 	if (isTrueish(payload.persist)) {
// 		if (typeof payload.persist === 'object') {
// 			// @ts-expect-error TODO: Fix in Sequencer types
// 			seq.persist(payload.persist?.value || false, payload.persist);
// 		} else {
// 			seq.persist(payload.persist || false);
// 		}
// 	}
// 	if (isTrueish(payload.tieToDocuments)) {
// 		if (!data.item) {
// 			log('tieToDocuments was called with no item present!');
// 		} else {
// 			seq.tieToDocuments([data.item]);
// 		}
// 	}
// 	if (isTrueish(payload.remove)) {
// 		[payload.remove].flat().forEach((origin) => {
// 			if (origin === 'all') {
// 				Sequencer.EffectManager.endEffects({ object: data.targets });
// 			}
// 			Sequencer.EffectManager.endEffects({ origin, object: data.targets });
// 		});
// 	}

// 	if (data.item) {
// 		seq.origin(data.item);
// 		seq.name(data.item.name);
// 	}
// 	if (isTrueish(payload.id)) seq.origin(payload.id);
// 	if (isTrueish(payload.name)) seq.name(payload.name);

// 	if (payload.probability) seq.playIf(() => Math.random() < payload.probability!);

// 	return seq;
// }

// function offsetToVector2(offset: Partial<Vector2>): Vector2 {
// 	return {
// 		x: offset.x ?? 0,
// 		y: offset.y ?? 0,
// 	};
// }

// export function parseOffsetInSitu<T extends { offset?: Partial<Vector2>; gridUnits?: boolean }>(
// 	obj: T,
// ): T & { offset: Vector2 & { gridUnits?: boolean } } {
// 	return {
// 		...obj,
// 		offset: {
// 			...obj.offset,
// 			x: obj?.offset?.x ?? 0,
// 			y: obj?.offset?.y ?? 0,
// 		},
// 	};
// }

// function parseMinMaxObject(value: number | { min: number; max: number }): [number] | [number, number] {
// 	if (typeof value === 'number') return [value];
// 	return [value.min, value.max];
// }
