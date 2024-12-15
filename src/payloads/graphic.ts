import type { AnimationPayload } from '../schema/payload';
import {
	addCustomExecutionContext,
	type ExecutionContext,
	offsetToVector2,
	parseMinMaxObject,
	positionToArgument,
} from '.';
import { AnimCore } from '../storage/AnimCore';
import { type ArrayElement, ErrorMsg } from '../utils';

export function executeGraphic(
	payload: Extract<AnimationPayload, { type: 'graphic' }>,
	data: ExecutionContext,
): Sequence {
	const seq = new Sequence();

	data = addCustomExecutionContext(payload.sources, payload.targets, data);

	for (const position of payload.position) {
		seq.addSequence(processGraphic(payload, data, position));
	}

	return seq;
}

function processGraphic(
	payload: Parameters<typeof executeGraphic>[0],
	data: ExecutionContext,
	position: ArrayElement<Parameters<typeof executeGraphic>[0]['position']>,
): EffectSection {
	const seq = new Sequence().effect().file(AnimCore.parseFiles(payload.graphic));
	if (position.type === 'static') {
		seq.atLocation(positionToArgument(position.location, data));
		// TODO:
	} else if (position.type === 'dynamic') {
		seq.attachTo(positionToArgument(position.location, data));
		// TODO:
	} else if (position.type === 'screenSpace') {
		seq.screenSpace();
		if (position.aboveUI) seq.screenSpaceAboveUI();
		if (position.anchor) seq.screenSpaceAnchor(offsetToVector2(position.anchor));
		if (position.offset) seq.screenSpacePosition(offsetToVector2(position.offset));
	} else {
		throw new ErrorMsg(`Failed to execute \`graphic\` payload (unknown \`position[].type\`).`);
	}

	if (payload.name) seq.name(payload.name);
	if (payload.syncGroup) seq.syncGroup(payload.syncGroup);
	// if (payload.locally) seq.locally(payload.locally);
	if (payload.users) seq.forUsers(payload.users);
	if (payload.duration) seq.duration(payload.duration);
	if (payload.probability) seq.playIf(() => Math.random() < payload.probability!);
	if (payload.delay) seq.delay(...parseMinMaxObject(payload.delay));

	// if (payload.persistent) seq.persist(payload.persistent);
	// if (payload.tieToDocuments) seq.tieToDocuments(payload.tieToDocuments);
	// remove
	// waitUntilFinished
	// repeats
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
				// @ts-expect-error Nothing bad can happen if `filter.options` is `undefined` because it doesn't exist.
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
