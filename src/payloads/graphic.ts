import type { Payload } from '../../schema';
import {
	addCustomExecutionContext,
	type ExecutionContext,
	offsetToVector2,
	parseMinMaxObject,
	positionToArgument,
} from '.';
import { AnimCore } from '../storage/AnimCore';
import { type ArrayElement, ErrorMsg } from '../utils';

export function executeGraphic(payload: Extract<Payload, { type: 'graphic' }>, data: ExecutionContext): Sequence {
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

	if (payload.persistent)
		seq.persist(!!payload.persistent, { persistTokenPrototype: payload.persistent === 'tokenPrototype' });
	if (payload.tieToDocuments && data.item) seq.tieToDocuments(data.item);
	// if (payload.waitUntilFinished)
	// if (payload.repeats)
	// if (payload.reflection)
	// if (payload.rotation)
	if (payload.visibility) {
		if (payload.visibility.opacity) seq.opacity(payload.visibility.opacity);
		if (payload.visibility.xray) seq.xray(payload.visibility.xray);
		if (payload.visibility.mask) {
			const masking = payload.visibility.mask.map((x) => {
				if (x === 'SOURCES') return data.sources;
				if (x === 'TARGETS') return data.targets;
				if (typeof x === 'string') return x;
				throw new ErrorMsg('Failed to execute `graphic` payload (unknown `visibility.mask` element).');
			});
			seq.mask(masking);
		}
	}
	if (payload.size) {
		switch (payload.size.type) {
			case 'screenSpace':
				// TODO: Implement
				throw new ErrorMsg(
					`Failed to execute \`graphic\` payload (not implemented \`size.type\` "screenSpace").`,
				);
				break;
			case 'directed':
				// TODO: Implement
				throw new ErrorMsg(
					`Failed to execute \`graphic\` payload (not implemented \`size.type\` "directed").`,
				);
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
				if (position.type === 'screenSpace') {
					throw new ErrorMsg(
						'Failed to execute `graphic` payload (relative size with screenSpace position). Its either absolute screenSpace or relative on the scene, make up your mind!',
					);
				}

				const maybeToken = positionToArgument(position.location, data);
				const scale
					= payload.size.scaling
					// @ts-expect-error Idiotic TypeScript can't figure out that "sm" is a const Size
					* (maybeToken instanceof Token ? (maybeToken.actor?.size === 'sm' ? 0.8 : 1) : 1);

				seq.scaleToObject(scale, {
					uniform: !!payload.size.uniform,
					considerTokenScale: !!payload.size.considerTokenScale,
				});
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
		}

		if (payload.size.scaleIn) {
			seq.scaleIn(payload.size.scaleIn.initialScale, payload.size.scaleIn.duration, {
				ease: payload.size.scaleIn.ease,
				delay: payload.size.scaleIn.delay || 0,
			});
		}

		if (payload.size.scaleOut) {
			seq.scaleOut(payload.size.scaleOut.finalScale, payload.size.scaleOut.duration, {
				ease: payload.size.scaleOut.ease,
				delay: payload.size.scaleOut.delay || 0,
			});
		}
	}

	if (payload.elevation) {
		if (payload.elevation.zIndex) seq.zIndex(payload.elevation.zIndex);
		if (payload.elevation.altitude) seq.elevation(payload.elevation.altitude);
		if (payload.elevation.sortLayer) {
			if (payload.elevation.sortLayer === 'belowTiles') {
				// @ts-expect-error PrimaryCanvasGroup.SORT_LAYERS isn't in types, but also... TODO: Sequencer add `.sortLayer()`
				seq.sortLayer(PrimaryCanvasGroup.SORT_LAYERS.TILES - 100);
			} else if (payload.elevation.sortLayer === 'belowDrawings') {
				// @ts-expect-error PrimaryCanvasGroup.SORT_LAYERS isn't in types, but also... TODO: Sequencer add `.sortLayer()`
				seq.sortLayer(PrimaryCanvasGroup.SORT_LAYERS.DRAWINGS - 100);
			} else if (payload.elevation.sortLayer === 'belowTokens') {
				// @ts-expect-error PrimaryCanvasGroup.SORT_LAYERS isn't in types, but also... TODO: Sequencer add `.sortLayer()`
				seq.sortLayer(PrimaryCanvasGroup.SORT_LAYERS.TOKENS - 100);
			} else if (payload.elevation.sortLayer === 'aboveWeather') {
				// @ts-expect-error PrimaryCanvasGroup.SORT_LAYERS isn't in types, but also... TODO: Sequencer add `.sortLayer()`
				seq.sortLayer(PrimaryCanvasGroup.SORT_LAYERS.WEATHER + 100);
			} else if (payload.elevation.sortLayer === 'aboveLighting') {
				seq.aboveLighting();
			} else if (payload.elevation.sortLayer === 'aboveInterface') {
				seq.screenSpaceAboveUI();
			} else {
				if (typeof payload.elevation.sortLayer !== 'number') {
					throw new ErrorMsg(`Failed to execute \`graphic\` payload (unknown \`elevation.sortLayer\`).`);
				}
				// @ts-expect-error TODO: Sequencer add `.sortLayer()`
				seq.sortLayer(payload.elevation.sortLayer);
			}
		}
	}

	if (payload.fadeIn) seq.fadeIn(payload.fadeIn.duration, payload.fadeIn);
	if (payload.fadeOut) seq.fadeOut(payload.fadeOut.duration, payload.fadeOut);
	if (payload.tint) seq.tint(payload.tint);
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
					fillColor: drawing.fill?.color,
					fillAlpha: drawing.fill?.alpha,
					lineSize: drawing.line?.size,
					lineColor: drawing.line?.color,
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
