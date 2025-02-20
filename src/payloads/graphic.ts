import type { TokenPF2e } from 'foundry-pf2e';
import type { ExecutionContext } from '.';
import type { Payload } from '../../schema';
import type { EffectiveSize } from '../extensions';
import { addCustomExecutionContext, offsetToVector2, parseMinMaxObject, positionToArgument } from '.';
import { AnimCore } from '../storage/AnimCore';
import { ErrorMsg, getDefaultSize } from '../utils';

export function executeGraphic(
	payload: Extract<Payload, { type: 'graphic' }>,
	context: ExecutionContext,
): Sequence {
	const seq = new Sequence();

	context = addCustomExecutionContext(payload.sources, payload.targets, context);

	seq.addSequence(processGraphic(payload, context));

	return seq;
}

function processGraphic(payload: Parameters<typeof executeGraphic>[0], context: ExecutionContext): EffectSection {
	// TODO: antialiasing
	const seq = new Sequence().effect();

	// TODO: rearrange processing above to create a new Sequence for each `position`ed source/target/template
	const graphic = AnimCore.parseFiles(payload.graphic);
	if (graphic === 'SOURCES') {
		seq.copySprite(context.sources[0]);
	} else if (graphic === 'TARGETS') {
		seq.copySprite(context.targets[0]);
	} else {
		seq.file(graphic);
	}

	if (context.label) seq.name(context.label);

	if (payload.position.type === 'screenSpace') {
		seq.screenSpace();
		if (payload.position.aboveUI) seq.screenSpaceAboveUI();
		if (payload.position.anchor) seq.screenSpaceAnchor(offsetToVector2(payload.position.anchor, 0.5));
		if (payload.position.offset) seq.screenSpacePosition(offsetToVector2(payload.position.offset));
	} else {
		// #region Common (`positionBaseObject`) properties
		if (
			payload.position.missed
			|| (payload.position.missed !== false
				&& context.trigger === 'attack-roll'
				&& (context.triggerContext.outcome === 'failure'
					|| context.triggerContext.outcome === 'criticalFailure'))
		) {
			seq.missed();
		}
		if (payload.position.spriteOffset) {
			seq.spriteOffset(offsetToVector2(payload.position.spriteOffset), {
				gridUnits: payload.position.spriteOffset.gridUnits ?? false,
			});
		}
		if (payload.position.anchor) seq.anchor(offsetToVector2(payload.position.anchor, 0.5));
		if (payload.position.spriteAnchor) seq.spriteAnchor(offsetToVector2(payload.position.spriteAnchor, 0.5));
		const options: Parameters<typeof seq.attachTo>[1] = {
			randomOffset: payload.position.randomOffset ?? 0,
			offset: offsetToVector2(payload.position.offset),
			local: payload.position.local ?? false,
			gridUnits: payload.position.gridUnits ?? false,
		};
		// #endregion
		if (payload.position.type === 'static') {
			seq.atLocation(positionToArgument(payload.position.location, context), options);
			if (payload.position.moveTowards) {
				seq.moveTowards(
					positionToArgument(payload.position.moveTowards.target, context),
					// @ts-expect-error TODO: Sequencer type should only have `ease`, no `target`
					{ ease: position.moveTowards.ease ?? 'linear' },
				);
				if (payload.position.moveTowards.speed) seq.moveSpeed(payload.position.moveTowards.speed);
			}
		} else if (payload.position.type === 'dynamic') {
			if (payload.position.align) options.align = payload.position.align;
			if (payload.position.edge) options.edge = payload.position.edge;
			options.bindVisibility = !payload.position.unbindVisibility;
			options.bindAlpha = !payload.position.unbindAlpha;
			// @ts-expect-error TODO: sequencer types (documentation sometimes uses `followRotation`?)
			options.bindRotation = !payload.position.ignoreRotation;
			options.bindScale = !payload.position.unbindScale;
			options.bindElevation = !payload.position.unbindElevation;
			seq.attachTo(positionToArgument(payload.position.location, context), options);
		} else {
			throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
				payloadType: 'graphic',
				property: 'position[].type',
			});
		}
	}

	if (payload.syncGroup) seq.syncGroup(payload.syncGroup);

	if (payload.users) seq.forUsers(payload.users);

	if (payload.duration) seq.duration(payload.duration);

	if (payload.probability) seq.playIf(() => Math.random() < payload.probability!);

	if (payload.delay) seq.delay(...parseMinMaxObject(payload.delay));

	if (payload.persistent)
		seq.persist(!!payload.persistent, { persistTokenPrototype: payload.persistent === 'tokenPrototype' });

	if (payload.tieToDocuments && context.item) seq.tieToDocuments(context.item);

	if (payload.waitUntilFinished) seq.waitUntilFinished(...parseMinMaxObject(payload.waitUntilFinished));

	if (payload.repeats) {
		seq.repeats(payload.repeats.count, ...parseMinMaxObject(payload.repeats.delay ?? 0));
		if (payload.repeats.async) seq.async();
	}

	if (payload.reflection) {
		if (payload.reflection.x === 'always') {
			seq.mirrorX();
		} else if (payload.reflection.x === 'random') {
			seq.randomizeMirrorX();
		}
		if (payload.reflection.y === 'always') {
			seq.mirrorY();
		} else if (payload.reflection.y === 'random') {
			seq.randomizeMirrorY();
		}
	}

	if (payload.rotation && payload.rotation.type !== 'directed') {
		// #region Common (`rotationBaseObject`) properties
		if (payload.rotation.spinIn) {
			seq.rotateIn(
				payload.rotation.spinIn.initialAngle,
				payload.rotation.spinIn.duration,
				payload.rotation.spinIn,
			);
		}
		if (payload.rotation.spinOut) {
			seq.rotateOut(
				payload.rotation.spinOut.finalAngle,
				payload.rotation.spinOut.duration,
				payload.rotation.spinOut,
			);
		}
		if (payload.rotation.spriteAngle) {
			if (typeof payload.rotation.spriteAngle === 'number') {
				seq.spriteRotation(payload.rotation.spriteAngle);
			} else if (payload.rotation.spriteAngle === 'random') {
				// @ts-expect-error TODO: add Sequencer type
				seq.randomSpriteRotation();
			} else if (payload.rotation.spriteAngle === 'none') {
				seq.zeroSpriteRotation();
			} else {
				throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
					payloadType: 'graphic',
					property: 'rotation.spriteAngle',
				});
			}
		}
		// #endregion
		if (payload.rotation.type === 'absolute') {
			if (payload.rotation.angle) {
				if (payload.rotation.angle === 'random') {
					seq.randomRotation();
				} else {
					seq.rotate(payload.rotation.angle);
				}
			}
		} else if (payload.rotation.type === 'relative') {
			seq.rotateTowards(positionToArgument(payload.rotation.location, context), {
				...payload.rotation,
				attachTo: payload.rotation.attach ?? false,
				offset: offsetToVector2(payload.rotation.offset), // TODO: Wtf? This removes atLocation's offset.
			});
			// TODO: fix bug in Sequencer preventing `.rotateTowards()` with `.rotate()`
			// if (payload.rotation.rotationOffset) seq.rotate(payload.rotation.rotationOffset);
		} else {
			throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
				payloadType: 'graphic',
				property: 'rotation.type',
			});
		}
	}

	if (payload.visibility) {
		if (payload.visibility.opacity) seq.opacity(payload.visibility.opacity);
		if (payload.visibility.ignoreTokenVision) seq.xray(payload.visibility.ignoreTokenVision);
		if (payload.visibility.mask) {
			const masking = payload.visibility.mask.map((x) => {
				if (x === 'SOURCES') return context.sources;
				if (x === 'TARGETS') return context.targets;
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
			const options: Parameters<typeof seq.stretchTo>[1] = {
				attachTo: payload.size.attach ?? false,
				onlyX: payload.size.stretch ?? false,
				tiling: payload.size.tile ?? false,
				// TODO: @Spappz Add randomOffset and the remaining options here.
			};

			if (payload.size.requiresLineOfSight) {
				options.requiresLineOfSight = true;
				if (payload.size.requiresLineOfSight === 'hide') {
					options.hideLineOfSight = true;
				} else if (payload.size.requiresLineOfSight !== 'terminate') {
					throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
						payloadType: 'graphic',
						property: 'size.requiresLineOfSight',
					});
				}
			}

			if (payload.rotation) {
				if (payload.rotation.type !== 'directed') {
					throw ErrorMsg.send('pf2e-graphics.execute.common.error.incompatibleValue', {
						payloadType: 'graphic',
						property1: 'size.type',
						property2: 'rotation.type',
					});
				}
				options.offset = offsetToVector2(payload.rotation.offset);
				options.randomOffset = payload.rotation.randomOffset ?? 0;
				options.local = payload.rotation.local;
				options.gridUnits = payload.rotation.gridUnits;
			}

			seq.stretchTo(positionToArgument(payload.size.endpoint, context), options);
		} else {
			// #region Common (`sizeBaseObject`) properties
			if (payload.size.spriteScale) seq.spriteScale(...parseMinMaxObject(payload.size.spriteScale));
			// TODO: check this actually works as expected
			if (payload.size.scaleIn) {
				seq.scaleIn(payload.size.scaleIn.initialScale, payload.size.scaleIn.duration, {
					ease: payload.size.scaleIn.ease ?? 'linear',
					delay: payload.size.scaleIn.delay || 0,
				});
			}
			if (payload.size.scaleOut) {
				seq.scaleOut(payload.size.scaleOut.finalScale, payload.size.scaleOut.duration, {
					ease: payload.size.scaleOut.ease ?? 'linear',
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
				if (payload.position.type === 'screenSpace')
					throw ErrorMsg.send('pf2e-graphics.execute.graphic.error.mismatchedPositionSize');

				// Get placeable to scale relative to
				let placeable;
				if (payload.size.relativeTo) {
					// It might be defined explicitly
					placeable = positionToArgument(payload.size.relativeTo, context);
				} else if (
					// Else we use the position, if it has one
					payload.position.location === 'SOURCES'
					|| payload.position.location === 'TARGETS'
					|| payload.position.location === 'TEMPLATES'
				) {
					placeable = positionToArgument(payload.position.location, context);
				} else {
					throw ErrorMsg.send(
						'pf2e-graphics.execute.graphic.error.cantIdentifyPlaceableForRelativeScaling',
					);
				}
				if (
					placeable instanceof CONFIG.Token.objectClass
					|| placeable instanceof CONFIG.Token.documentClass
				) {
					if (placeable instanceof CONFIG.Token.documentClass) {
						placeable = placeable.object as TokenPF2e;
					}
					if (payload.size.useTokenSpace) {
						const tokenSize = placeable.getSize();
						if (payload.size.uniform) {
							if (tokenSize.height >= tokenSize.width) {
								// @ts-expect-error TODO: fix Sequencer types
								seq.size({
									height: tokenSize.height,
								});
							} else {
								// @ts-expect-error TODO: fix Sequencer types
								seq.size({
									width: tokenSize.height,
								});
							}
						} else {
							seq.size(tokenSize);
						}
					} else {
						const effectiveSize = placeable.actor?.getFlag(
							'pf2e-graphics',
							'effectiveSize',
						) as EffectiveSize;
						if (effectiveSize?.enabled) {
							// Manual scaling activated!
							seq.size(canvas.grid.size * effectiveSize.size);
							if (payload.size.scaling) seq.scale(payload.size.scaling);
							// TODO: uniform
						} else if (placeable.document.ring.enabled) {
							// Dynamic-ring tokens are regular enough for us to always know the size
							seq.scaleToObject(
								(payload.size.scaling ?? 1) / (placeable.document.ring.subject.scale ?? 1),
								{
									considerTokenScale: true,
									uniform: !!payload.size.uniform,
								},
							);
						} else {
							// Just assume default size
							const tokenSize = placeable.getSize();
							if (payload.size.uniform) {
								if (tokenSize.height >= tokenSize.width) {
									// @ts-expect-error TODO: fix Sequencer types
									seq.size({
										height: canvas.grid.size * getDefaultSize(placeable.actor?.size),
									});
								} else {
									// @ts-expect-error TODO: fix Sequencer types
									seq.size({
										width: canvas.grid.size * getDefaultSize(placeable.actor?.size),
									});
								}
							} else {
								seq.size(tokenSize);
							}
							if (payload.size.scaling) seq.scale(payload.size.scaling);
						}
					}
				} else if (
					placeable instanceof MeasuredTemplate
					|| placeable instanceof MeasuredTemplateDocument
				) {
					seq.scaleToObject(payload.size.scaling ?? 1, {
						uniform: !!payload.size.uniform,
					});
				} else {
					throw ErrorMsg.send(
						'pf2e-graphics.execute.graphic.error.cantIdentifyPlaceableForRelativeScaling',
					);
				}
			} else if (payload.size.type === 'screenSpace') {
				seq.screenSpaceScale(payload.size);
			} else {
				throw ErrorMsg.send('pf2e-graphics.execute.common.error.unknownDiscriminatedUnionValue', {
					payloadType: 'graphic',
					property: 'size.type',
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
			const object = variation.object === 'shapes' ? `${variation.object}.${variation.name}` : variation.object;
			if (variation.type === 'animate') {
				seq.animateProperty(object, variation.property, variation);
			} else if (variation.type === 'loop') {
				seq.loopProperty(object, variation.property, variation);
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
