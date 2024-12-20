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
	// TODO: Handling of `.copySprite()` and antialiasing
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

	if (payload.persistent) seq.persist(!!payload.persistent, { persistTokenPrototype: payload.persistent === 'tokenPrototype' });
	// if (payload.tieToDocuments) seq.tieToDocuments(payload.tieToDocuments);
	// if (payload.remove)
	// if (payload.waitUntilFinished)
	// if (payload.repeats)
	// if (payload.position)
	// if (payload.reflection)
	// if (payload.rotation)
	if (payload.visibility) {
		if (payload.visibility.opacity) seq.opacity(payload.visibility.opacity);
		if (payload.visibility.mask) seq.mask(payload.visibility.mask);
		if (payload.visibility.xray) seq.xray(payload.visibility.xray);
	}
	if (payload.size) {
		switch (payload.size.type) {
			case 'screenSpace':
				seq.screenSpace();
				// TODO: Implement
				break;
			case 'directed':
				// TODO: Implement
				throw new ErrorMsg(`Failed to execute \`graphic\` payload (not implemented \`size.type\` "directed").`);
				break;
			case 'absolute': {
				if (payload.size.width && payload.size.height) {
					const size = {
						width: payload.size.width,
						height: payload.size.height,
					};

					seq.size(size, { gridUnits: !!payload.size.gridUnits });
				}
				if (payload.size.scaling) {
					if (typeof payload.size.scaling === 'number') {
						seq.scale(payload.size.scaling);
					} else {
						seq.scale(...parseMinMaxObject(payload.size.scaling));
					}
				}
				break;
			}
			case 'relative': {
				seq.scaleToObject(payload.size.scaling, { uniform: !!payload.size.uniform, considerTokenScale: !!payload.size.considerTokenScale });
				break;
			}
			default:
				throw new ErrorMsg(`Failed to execute \`graphic\` payload (unknown \`size.type\`).`);
		}

		if (payload.size.spriteScale) {
			if (typeof payload.size.spriteScale === 'number') {
				seq.spriteScale(payload.size.spriteScale);
			} else {
				seq.spriteScale(...parseMinMaxObject(payload.size.spriteScale));
			}
		};

		if (payload.size.scaleIn) {
			seq.scaleIn(payload.size.scaleIn.initialScale, payload.size.scaleIn.duration, { ease: payload.size.scaleIn.ease, delay: payload.size.scaleIn.delay || 0 });
		}

		if (payload.size.scaleOut) {
			seq.scaleOut(payload.size.scaleOut.finalScale, payload.size.scaleOut.duration, { ease: payload.size.scaleOut.ease, delay: payload.size.scaleOut.delay || 0 });
		}
	}

	if (payload.elevation) {
		if (payload.elevation.zIndex) seq.zIndex(payload.elevation.zIndex);
		if (payload.elevation.height) seq.elevation(payload.elevation.height);
		if (payload.elevation.sortLayer) {
			switch (payload.elevation.sortLayer) {
				case 'BELOW_TOKENS':
					seq.sortLayer(600);
					break;
				case 'BELOW_TILES':
					seq.sortLayer(300);
					break;
				case 'ABOVE_LIGHTING':
					seq.sortLayer(1200);
					break;
				case 'ABOVE_INTERFACE':
					seq.aboveInterface(true);
					break;
				default:
					if (typeof payload.elevation.sortLayer === 'number') {
						seq.sortLayer(payload.elevation.sortLayer);
					} else {
						throw new ErrorMsg(`Failed to execute \`graphic\` payload (unknown \`elevation.sortLayer\`).`);
					}
			}
		}
	}

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
