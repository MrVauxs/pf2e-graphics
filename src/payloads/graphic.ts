import type { AnimationPayload } from '../schema/payload';
import { type ExecutionContext, offsetToVector2, parseMinMaxObject, positionToArgument } from '.';
import { AnimCore } from '../storage/AnimCore';
import { type ArrayElement, ErrorMsg } from '../utils';

export function executeGraphic(
	_seq: Sequence,
	payload: Extract<AnimationPayload, { type: 'graphic' }>,
	data: ExecutionContext,
): Sequence {
	for (const position of payload.position) {
		const seq = _seq.effect().file(AnimCore.parseFiles(payload.graphic));
		/* @ts-expect-error TODO: Sequencer being weird? Think it occurs due to `seq.effect()` returning the wrong type above. */
		_seq = processGraphicPosition(seq, payload, data, position);
	}

	return _seq;
}

function processGraphicPosition(
	seq: EffectSection,
	payload: Parameters<typeof executeGraphic>[1],
	data: ExecutionContext,
	position: ArrayElement<Parameters<typeof executeGraphic>[1]['position']>,
): EffectSection {
	if (position.type === 'STATIC') {
		seq.atLocation(positionToArgument(position.target, data));
		// TODO:
	} else if (position.type === 'DYNAMIC') {
		seq.attachTo(positionToArgument(position.target, data));
		// TODO:
	} else if (position.type === 'SCREEN_SPACE') {
		seq.screenSpace();
		if (position.aboveUI) seq.screenSpaceAboveUI();
		if (position.anchor) seq.screenSpaceAnchor(offsetToVector2(position.anchor));
		if (position.offset) seq.screenSpacePosition(offsetToVector2(position.offset));
	} else {
		throw new ErrorMsg(`Failed to execute \`graphic\` payload (unknown \`position[].type\`).`);
	}

	return processGraphicOptions(seq, payload, data);
}

function processGraphicOptions(
	seq: EffectSection,
	payload: Parameters<typeof executeGraphic>[1],
	data: ExecutionContext,
): EffectSection {
	if (payload.name) seq.name(payload.name);
	if (payload.syncGroup) seq.syncGroup(payload.syncGroup);
	if (payload.locally) seq.locally(payload.locally);
	if (payload.duration) seq.duration(payload.duration);
	if (payload.probability) seq.playIf(() => Math.random() < payload.probability!);
	if (payload.delay) seq.delay(...parseMinMaxObject(payload.delay));

	// if (payload.persistent) seq.persist(payload.persistent);
	// if (payload.tieToDocuments) seq.tieToDocuments(payload.tieToDocuments);
	// users
	// remove
	// waitUntilFinished
	// repeats
	// targets
	// position
	// size
	// reflection
	// rotation
	// visibility
	// elevation

	if (payload.fadeIn) seq.fadeIn(payload.fadeIn.duration, payload.fadeIn);
	if (payload.fadeOut) seq.fadeOut(payload.fadeOut.duration, payload.fadeOut);
	if (payload.tint) seq.tint(payload.tint as `#${string}`); // Required due to Sequencer typings
	if (payload.filters) {
		payload.filters.forEach(filter =>
			seq.filter(
				filter.type,
				// @ts-expect-error and so what if options don't exist
				filter.options,
			),
		);
	}
	if (payload.drawings) {
		payload.drawings.forEach((drawing) => {
			if (drawing.type === 'text') {
				seq.text(drawing.entry, drawing.options);
			} else {
				const options: Parameters<typeof seq.shape>[1] = {
					...drawing,
					fillColor: drawing.fill?.color as `#${string}` | undefined, // Required due to Sequencer typings
					fillAlpha: drawing.fill?.alpha,
					lineSize: drawing.line?.size,
					lineColor: drawing.line?.color as `#${string}` | undefined, // Required due to Sequencer typings
				};
				seq.shape(drawing.type, options);
			}
		});
	}
	if (payload.varyProperties) {
		for (const variation of payload.varyProperties) {
			if (variation.type === 'animate') {
				seq.animateProperty(variation.target, variation.property, variation);
			} else if (variation.type === 'loop') {
				seq.loopProperty(variation.target, variation.property, variation);
			} else {
				throw new ErrorMsg(`Failed to execute \`graphic\` payload (unknown \`varyProperties[].type\`).`);
			}
		}
	}

	return seq;
}
