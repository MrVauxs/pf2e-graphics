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
		throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
			payloadType: 'graphic',
			property: 'position[].type',
		});
	}

	if (payload.name) seq.name(payload.name);

	if (payload.syncGroup) seq.syncGroup(payload.syncGroup);

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
		if (payload.visibility.ignoreTokenVision) seq.xray(payload.visibility.ignoreTokenVision);
		if (payload.visibility.mask) {
			const masking = payload.visibility.mask.map((x) => {
				if (x === 'SOURCES') return data.sources;
				if (x === 'TARGETS') return data.targets;
				if (typeof x === 'string') return x;
				throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownEnumArrayElement', {
					payloadType: 'graphic',
					property: 'visibility.mask',
				});
			});
			seq.mask(masking);
		}
	}

	if (payload.size) {
		if (payload.size.type === 'directed') {
			// TODO: Implement
			throw ErrorMsg.send('pf2e-graphics.execute.common.error.unimplemented', {
				payloadType: 'graphic',
				unimplemented: '<code>size.type: "directed"</code>',
			});
		} else {
			// #region Common properties
			if (payload.size.spriteScale) seq.spriteScale(...parseMinMaxObject(payload.size.spriteScale));

			// TODO: check this actually works as expected
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
			// #endregion

			if (payload.size.type === 'absolute') {
				if (payload.size.width || payload.size.height) {
					seq.size(
						{
							// @ts-expect-error TODO: fix Sequencer types
							width: payload.size.width,
							// @ts-expect-error TODO: fix Sequencer types
							height: payload.size.height,
						},
						{ gridUnits: payload.size.gridUnits },
					);
				}
				if (payload.size.scaling) seq.scale(...parseMinMaxObject(payload.size.scaling));
			} else if (payload.size.type === 'relative') {
				if (position.type === 'screenSpace')
					throw ErrorMsg.send('pf2e-graphics.execute.graphic.error.mismatchedPositionSize');

				// Get placeable to scale relative to
				let placeable;
				if (payload.size.relativeTo) {
					// It might be defined explcitly
					placeable = positionToArgument(payload.size.relativeTo, data);
				} else if (
					// Else we use the position, if it has one
					position.location === 'SOURCES'
					|| position.location === 'TARGETS'
					|| position.location === 'TEMPLATES'
				) {
					placeable = positionToArgument(position.location, data);
				} else {
					// Otherwise we try to get *any* placeable defined in the animation set
					const firstPlaceable = getFirstPlaceable(payload.position);
					if (!firstPlaceable) {
						throw ErrorMsg.send(
							'pf2e-graphics.execute.graphic.error.cantFindPlaceableForRelativeScaling',
						);
					}
					placeable = positionToArgument(firstPlaceable, data);
				}
				if (placeable instanceof Token) {
					if (payload.size.useTokenSpace) {
						const tokenSize = placeable.getSize();
						if (payload.size.uniform) {
							const longestSide = tokenSize.height >= tokenSize.width ? 'height' : 'width';
							seq.size({
								// @ts-expect-error TODO: fix Sequencer types
								width: longestSide === 'width' ? tokenSize.width : undefined,
								// @ts-expect-error TODO: fix Sequencer types
								height: longestSide === 'height' ? tokenSize.height : undefined,
							});
						} else {
							seq.size(tokenSize);
						}
					} else {
						if (placeable.document.ring.enabled) {
							seq.scaleToObject(
								(payload.size.scaling ?? 1) / (placeable.document.ring.subject.scale ?? 1),
								{
									// TODO: Sequencer doesn't understand token scale for dynamic tokens?? 🤔
									// It seems to understand it pretty well - @MrVauxs
									// considerTokenScale: true,
									uniform: !!payload.size.uniform,
								},
							);
						} else {
							if (placeable.actor?.getFlag('pf2e-graphics', 'effectiveSize')) {
								// TODO:
							} else {
								seq.scaleToObject(
									(payload.size.scaling ?? 1) * (placeable.actor?.size === 'sm' ? 0.8 : 1),
									{
										considerTokenScale: false,
										uniform: !!payload.size.uniform,
									},
								);
							}
							// Delete ^ when v is implemented
							// 1. Check 'non-standard size' token configuration
							// 2. If false, read size trait and scale manually as per `useTokenSpace` condition above
							// 3. If true, read 'Effective token size' option and scale to that
						}
					}
				} else if (placeable instanceof MeasuredTemplate) {
					seq.scaleToObject(payload.size.scaling ?? 1, {
						uniform: !!payload.size.uniform,
					});
				} else {
					throw ErrorMsg.send(
						'pf2e-graphics.execute.graphic.error.cantIdentifyPlaceableForRelativeScaling',
					);
				}
			} else if (payload.size.type === 'screenSpace') {
				// TODO: Implement
				throw ErrorMsg.send('pf2e-graphics.execute.common.error.unimplemented', {
					payloadType: 'graphic',
					unimplemented: '<code>size.type: "screenSpace"</code>',
				});
			} else {
				throw ErrorMsg.send('pf2e-graphics.execute.common.error.unimplemented', {
					payloadType: 'graphic',
					unimplemented: '<code>size.type: "screenSpace"</code>',
				});
			}
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
					throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
						payloadType: 'graphic',
						property: 'elevation.sortLayer',
					});
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
				throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
					payloadType: 'graphic',
					property: 'varyProperties[].type',
				});
			}
		}
	}

	return seq;
}

/**
 * Gets the first placeable keyword-string (`'SOURCES'`, `'TARGETS'`, or `'TEMPLATES'`) from an array of positions.
 * @param array The input array to search.
 * @returns The first placeable keyword-string. If none are found, then `null` is returned.
 */
function getFirstPlaceable(
	array: (string | Vector2 | ArrayElement<Extract<Payload, { type: 'graphic' }>['position']>)[],
): 'SOURCES' | 'TARGETS' | 'TEMPLATES' | null {
	for (const item of array) {
		if (typeof item === 'string') {
			if (item === 'SOURCES' || item === 'TARGETS' || item === 'TEMPLATES') return item;
		} else if ('location' in item) {
			if (item.location === 'SOURCES' || item.location === 'TARGETS' || item.location === 'TEMPLATES')
				return item.location;
		}
	}
	return null;
}
