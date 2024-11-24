import { z } from 'zod';
import { pluralise } from '../../../scripts/helpers';
import { angle, easing, hexColour, ID, UUID } from '../helpers/atoms';
import { nonEmpty, nonZero, uniqueItems } from '../helpers/refinements';
import {
	easingOptions,
	playableFile,
	positionBaseObject,
	scaling2,
	vector2,
	vector2WithOffset,
} from '../helpers/structures';

/**
 * Zod schema for the shared properties of a `rotation` object.
 */
const rotationBaseObject = z.object({
	spinIn: easingOptions
		.partial()
		.extend({
			initialAngle: angle.or(z.literal(0)).describe('The angle from which to start the rotation, in degrees (°).'),
			duration: z
				.number()
				.positive()
				.describe('The duration of the rotation before it reaches its final value, in milliseconds.'),
		})
		.strict()
		.optional()
		.describe('Causes the graphic to spin from an initial angle to its defined angle when it is executed.'),
	spinOut: easingOptions
		.partial()
		.extend({
			finalAngle: angle.or(z.literal(0)).describe('The angle at which to end the rotation, in degrees (°).'),
			duration: z
				.number()
				.positive()
				.describe('How long the rotation takes to reach its final value, in milliseconds.'),
		})
		.strict()
		.optional()
		.describe(
			'Causes the graphic to spin from its defined angle to a final one when it is about to finish executing.',
		),
	spriteAngle: angle
		.or(z.enum(['RANDOM', 'NONE']))
		.optional()
		.describe(
			'An angle in degrees (°) to rotate the graphic within its container/bounding box. Alternatively, use the value `"RANDOM"` to set a random sprite rotation on each execution. The value `"NONE"`, lastly, prevents the graphic from rotating, even if its container does (see `varyProperties`).\nOnly use this if you know what you\'re doing; it can make the graphic hard to select in the Sequence Manager, and often you\'ll only need a regular rotation anyway.',
		),
});

/**
 * Zod schema for the shared properties of a `size` object.
 */
const sizeBaseObject = z.object({
	spriteScale: scaling2
		.optional()
		.describe(
			'Scales the graphic within its container/bounding box.\nOnly use this if you know what you\'re doing; it can make the graphic hard to select in the Sequence Manager, and often you\'ll only need regular scaling anyway.',
		),
	scaleIn: easingOptions
		.extend({
			initialScale: z
				.number()
				.nonnegative()
				.describe('The graphic\'s scale factor when it starts executing.'),
			duration: z.number().positive().describe('How long the scale-in should take, in milliseconds.'),
		})
		.optional()
		.describe('Configures the graphic to alter its scale just after starting.'),
	scaleOut: easingOptions
		.extend({
			finalScale: z
				.number()
				.nonnegative()
				.describe('The graphic\'s scale factor when it finishes executing.'),
			duration: z.number().positive().describe('How long the scale-out should take, in milliseconds.'),
		})
		.optional()
		.describe('Configures the graphic to alter its scale just before finishing.'),
});

/**
 * Zod schema for the shared properties of a `varyProperties` object, which unifies the Sequencer `animateProperty` and `loopProperty` methods.
 */
const varyPropertiesBaseObject = z.object({
	property: z.string(), // Required due to Zod limitation (can't multiply nest `discriminatedUnion`s)
	target: z.string(), // Required due to Zod limitation (can't multiply nest `discriminatedUnion`s)
	duration: z.number().positive(),
	from: z.number(),
	to: z.number(),
	delay: z.number().positive().optional(),
	ease: easing.optional(),
	gridUnits: z
		.literal(true)
		.optional()
		.describe('Indicates that the `to` and `from` values are measured in grid units.'),
});

/**
 * Zod schema for a `varyProperties` object, which unifies the Sequencer `animateProperty` and `loopProperty` methods.
 */
const varyPropertiesObject = z
	.union([
		varyPropertiesBaseObject.extend({
			type: z.literal('animate'),
			absolute: z
				.literal(true)
				.optional()
				.describe(
					'Normally, `from` and `to` values are interpreted relatively, as multipliers on the initial value. This option instead makes them absolute: animating the width `to: 200` will make the final width 200 pixels, not 200 times the initial value.',
				),
			fromEnd: z
				.literal(true)
				.optional()
				.describe(
					'Indicates that this animation\'s `duration` should be anchored to the graphic\'s end, and counted backwards.',
				),
		}),
		varyPropertiesBaseObject
			.partial({
				to: true,
				from: true,
			})
			.extend({
				type: z.literal('loop'),
				loops: z
					.number()
					.int()
					.positive()
					.optional()
					.describe('The number of loops to execute (default: infinite).'),
				values: z
					.array(z.number())
					.refine(
						arr => new Set(arr.map(e => JSON.stringify(e))).size > 1,
						'Provide at least 2 unique values.',
					)
					.optional(),
				pingPong: z.literal(true).optional(),
			})
			.refine(
				obj => Boolean(obj.to && obj.from) !== 'values' in obj,
				'You must define either a range of values to loop over via `to` and `from`, or provide those values directly via `values`.',
			),
	])
	.refine(obj => (obj.to ?? Number.NaN) !== (obj.from ?? Number.NaN), '`to` and `from` can\'t be identical.');

/**
 * Zod schema for shape object's common options.
 */
const shapeOptions = z
	.object({
		gridUnits: z
			.literal(true)
			.optional()
			.describe('Indicates that the shape\'s dimensions are measured in grid units.'),
		name: ID.optional().describe(
			'A name to identify the shape, so that it can be referenced in other properties.',
		),
		alpha: z
			.number()
			.gt(0)
			.lt(1)
			.optional()
			.describe('The transparency of the entire shape (default: 1, fully opaque).'),
		fill: z
			.object({
				color: hexColour.describe('The shape\'s fill colour.'),
				alpha: z
					.number()
					.gt(0)
					.lt(1)
					.optional()
					.describe('The transparency of the shape\'s fill colour (default: 1, fully opaque).'),
			})
			.strict()
			.optional()
			.describe('Fills the shape with a particular colour.'),
		line: z
			.object({
				size: z.number().positive().describe('The stroke-width of the shape\'s outline, in pixels.'),
				color: hexColour.describe('The colour of the shape\'s outline.'),
			})
			.strict()
			.optional()
			.describe('Defines an outline for the shape.'),
		offset: vector2WithOffset
			.optional()
			.describe('A 2D offset, accepting either single- or range-values for either axis.'),
		isMask: z
			.literal(true)
			.optional()
			.describe('Sets the shape as a mask, hiding it and any graphic intersecting it.'),
	})
	.strict();

/**
 * Zod schema for the options which are specific to `graphic`-type animations.
 */
export const graphicOptions = z
	.object({
		graphic: z
			.array(playableFile.or(z.enum(['SOURCES', 'TARGETS'])))
			.min(1)
			.refine(...uniqueItems)
			.describe(
				'The graphic to be played! Use either a Sequencer database path (recommended), or a filepath relative to your Foundry `Data` directory (not a URL!). You can alternatively use the strings `"SOURCES"` or `"TARGETS"` to instead copy the source or target tokens respectively.\nIf you provide more than one graphic, PF2e Graphics will select one at random each time the effect is executed. You can also use the following Sequencer shorthands:\n- Handlebar notation (a comma-separated list inside braces) indicates \'any one of this list\'. For instance, `path.{fire,ice}.1` chooses one of `path.fire.1` and `path.ice.1`.\n- **(Sequencer only)** To pick from all paths with a particular prefix, just don\'t include the variable portion of the path. For instance, if you have the database paths `path.fire.1` and `path.fire.2`, you can just write `path.fire`.\n- **(Filepath only)** You can use `*` as a wildcard (e.g. `assets/audio/*.ogg`).\n**Note:** although you can mix and match the above methods, all possibilities are generated *before* any are chosen. For example, `["path.{fire,ice}.1", "path.fire.1"]` selects from `path.fire.1`, `path.ice.1`, and `path.fire.1` again—a set of three options, so `path.fire.1` has a 67% (not 75%!) chance to occur.',
			),
		targets: z
			.array(UUID)
			.min(1)
			.optional()
			.describe(
				'A list of UUID strings representing one or more targets for the effect. These targets are always used, in addition to any targetted placeables when the effect is executed. The UUIDs should be for some sort of placeable—tokens, templates, etc.\nThis shouldn\'t be used very much outside custom animations for specific scenes.',
			),
		position: z
			.array(
				z
					.discriminatedUnion('type', [
						z
							.object({
								type: z.literal('STATIC'),
								target: vector2
									.or(z.enum(['SOURCES', 'TARGETS', 'TEMPLATES']))
									.or(ID)
									.describe(
										'Where the graphic should be placed. Accepts one of the following:\n- A pair of pixel-coordinates on the canvas, in the form of `{ x: number, y: number }`.\n- A reference of either the effect\'s `"SOURCES"`, `"TARGETS"`, or `"TEMPLATES"` (if it exits).\n- Another ongoing effect\'s or crosshair\'s `name`.',
									),
								moveTowards: z
									.object({
										target: vector2
											.or(z.enum(['SOURCES', 'TARGETS', 'TEMPLATES']))
											.or(ID)
											.describe(
												'Where the graphic should go after it has been placed and begun execution. Accepts one of the following:\n- A pair of pixel-coordinates on the canvas, in the form of `{ x: number, y: number }`.\n- A reference of either the effect\'s `"SOURCES"`, `"TARGETS"`, or `"TEMPLATES"` (if it exist).\n- Another ongoing effect\'s or crosshair\'s `name`.',
											),
										ease: easing.optional(),
										speed: z
											.number()
											.positive()
											.optional()
											.describe(
												'Sets the speed at which the graphic moves towards the target (default: fixed time).',
											),
									})
									.strict()
									.optional(),
							})
							.merge(positionBaseObject)
							.strict(),
						z
							.object({
								type: z.literal('DYNAMIC'),
								target: z
									.enum(['SOURCES', 'TARGETS', 'TEMPLATES'])
									.describe('What the graphic should be attached to.'),
								align: z
									.enum([
										'top-left',
										'top',
										'top-right',
										'left',
										'right',
										'bottom-left',
										'bottom',
										'bottom-right',
									])
									.optional()
									.describe(
										'Snaps the effect to a particular point on the `target` (default: centre).',
									),
								edge: z.enum(['inner', 'outer']).optional(),
								unbindVisibility: z
									.literal(true)
									.optional()
									.describe(
										'Causes the graphic to not follow the attached placeable\'s visibility, and instead remain constant.',
									),
								unbindAlpha: z
									.literal(true)
									.optional()
									.describe(
										'Causes the graphic to not follow the attached placeable\'s alpha, and instead remain constant.',
									),
								ignoreRotation: z
									.literal(true)
									.optional()
									.describe(
										'Causes the graphic to not follow the attached placeable\'s rotation, and instead remain constant.',
									),
								unbindScale: z
									.literal(true)
									.optional()
									.describe(
										'Causes the graphic to not follow the attached placeable\'s scale, and instead remain constant.',
									),
								unbindElevation: z
									.literal(true)
									.optional()
									.describe(
										'Causes the graphic to not follow the attached placeable\'s elevation, and instead remain constant.',
									),
							})
							.merge(positionBaseObject)
							.strict(),
						z
							.object({
								type: z.literal('SCREEN_SPACE'),
								aboveUI: z
									.literal(true)
									.optional()
									.describe('Renders the graphic above Foundry\'s UI elements.'),
								anchor: z
									.object({
										x: z
											.number()
											.describe(
												'The proportion horizontally along the screen to anchor the graphic. `0` indicates the leftmost edge; `1` indicates the rightmost.',
											),
										y: z
											.number()
											.describe(
												'The proportion horizontally along the screen to anchor the graphic. `0` indicates the leftmost edge; `1` indicates the rightmost.',
											),
									})
									.strict()
									.refine(
										obj => obj.x !== 0.5 || obj.y !== 0.5,
										'The default `anchor` is the centre of the screen (`{ x: 0.5, y: 0.5 }`) and doesn\'t need to be configured.',
									)
									.optional()
									.describe('Locks the graphic to some point on the screen (default: centre).'),
								offset: vector2.optional().describe('Offsets the graphic from its `anchor`.'),
							})
							.strict(),
					])
					.superRefine((obj, ctx) => {
						if (obj.type === 'SCREEN_SPACE') return;
						if (!obj.offset) {
							if (obj.type === 'DYNAMIC' && obj.edge) {
								ctx.addIssue({
									code: z.ZodIssueCode.custom,
									message: '`edge` requires `offset`.',
								});
							}
							const keysNeedingOffset = (['randomOffset', 'local', 'gridUnits'] as const).filter(
								key => key in obj,
							);
							if (keysNeedingOffset.length) {
								return ctx.addIssue({
									code: z.ZodIssueCode.unrecognized_keys,
									keys: keysNeedingOffset,
									message: `\`offset\` is required for the following ${pluralise('key', keysNeedingOffset.length)}: \`${keysNeedingOffset.join('`, `')}\``,
								});
							}
						}
					})
					.describe(
						'Configures where and how the graphic should be placed.\n`"type": "STATIC"`: sets a constant position for the graphic.\n`"type": "DYNAMIC"`: \'attaches\' the graphic onto a placeable (e.g. token, template), so that the graphic moves with the placeable.\n`"type": "SCREEN_SPACE": Causes the graphic to be displayed in \'screen space\' rather than within Foundry\'s \'canvas space\'. This means that the graphic is rendered with respect to the screen or viewport, rather than a particular point on the scene.',
					),
			)
			.min(1)
			.describe('An array of positions at which to execute the graphic.'),
		size: z
			.discriminatedUnion('type', [
				z
					.object({
						type: z.literal('ABSOLUTE'),
						width: z.number().positive().optional().describe('The graphic\'s width, in pixels.'),
						height: z.number().positive().optional().describe('The graphic\'s height, in pixels.'),
						gridUnits: z
							.literal(true)
							.optional()
							.describe('Causes `width` and `height` to be measured in the scene\'s grid units.'),
						scaling: z
							.number()
							.positive()
							.refine(...nonZero)
							.or(
								z
									.object({
										min: z
											.number()
											.positive()
											.refine(...nonZero),
										max: z
											.number()
											.positive()
											.refine(...nonZero),
									})
									.strict()
									.refine(obj => obj.min < obj.max, '`min` must be less than `max`.'),
							)
							.optional()
							.describe(
								'A uniform scaling factor to apply to the graphic. Instead of a single number, you can provide object with `min` and `max` properties; PF2e Graphics will randomly choose a scale factor within those bounds on each execution.',
							),
					})
					.merge(sizeBaseObject)
					.strict(),
				z
					.object({
						// TODO: superrefine this with `position.type === 'DYNAMIC'`
						type: z.literal('RELATIVE'),
						scaling: z
							.number()
							.positive()
							.refine(...nonZero)
							.describe('A scaling applied onto the target placeable\'s size.'),
						uniform: z
							.literal(true)
							.optional()
							.describe(
								'By default, the graphic is scaled in the x- and y-axes independently, potentially causing a squished presentation for non-square placeables. By setting this to `true`, the graphic\'s largest dimension is scaled to match the placeable, and the graphic\'s other dimension is scaled to retain the same aspect-ratio.',
							),
						considerTokenScale: z
							.literal(true)
							.optional()
							.describe('Causes the scaling to also take the token\'s scale into account.'),
					})
					.merge(sizeBaseObject)
					.strict(),
				z
					.object({
						// TODO: superrefine this for either no `rotation`, or `rotation.type === 'DIRECTED'`.
						type: z.literal('DIRECTED'),
						target: vector2
							.or(z.enum(['SOURCES', 'TARGETS', 'TEMPLATES']))
							.or(ID)
							.describe(
								'The thing to stretch towards. You can provide either an object with `x` and `y` coordinates, a string representing a stored name (e.g. of a crosshair), or the literal value `"SOURCES"`, `"TARGETS"`, or `"TEMPLATES"` to select that respective placeable (if one exists).',
							),
						attach: z
							.literal(true)
							.optional()
							.describe('Attaches the scaling to dynamically update as the `target` moves.'),
						stretch: z
							.literal(true)
							.optional()
							.describe(
								'By default, the entire graphic is scaled uniformly to span the gap between the `position` and `target`. If you only want scaling in one dimension—a stretch—set this to `true`. This is particularly useful for ray- or beam-like graphics.',
							),
						tile: z
							.literal(true)
							.optional()
							.describe(
								'This causes the graphic to not scale at all, but rather tile to span the gap between the `position` and `target`. This is particularly useful for graphics with a realistic texture (for instance, a rope should get longer, not expand or stretch).',
							),
						requiresLineOfSight: z
							.enum(['HIDE', 'TERMINATE'])
							.optional()
							.describe(
								'By default, the graphic will continue its execution regardless of what happens on the canvas. This can be undesirable if the `attach`ed `target` moves behind a wall mid-execution. You can set this property to `"HIDE"` to cause the graphic to become invisible while there is no line-of-sight between its `position` and its `target`, or to `"TERMINATE"` to cancel the graphic as soon as line-of-sight is broken.',
							),
					})
					.strict(),
				z
					.object({
						type: z.literal('SCREEN_SPACE'), // TODO: superrefine this only if position type === SCREEN_SPACE
						x: z
							.number()
							.positive()
							.refine(
								num => num !== 1,
								'The default `x` scale is `1` and doesn\'t need to be configured.',
							)
							.optional()
							.describe('Scales the graphic in the `x` direction.'),
						y: z
							.number()
							.positive()
							.refine(
								num => num !== 1,
								'The default `y` scale is `1` and doesn\'t need to be configured.',
							)
							.optional()
							.describe('Scales the graphic in the `y` direction.'),
						fitX: z
							.literal(true)
							.optional()
							.describe('Fits the graphic\'s `x` dimension to the width of the screen.'),
						fitY: z
							.literal(true)
							.optional()
							.describe('Fits the graphic\'s `y` dimension to the height of the screen.'),
						ratioX: z
							.literal(true)
							.optional()
							.describe(
								'Forces the graphic\'s `x` dimension to be scaled proportionally to the `y` dimension, if the latter is scaled.',
							),
						ratioY: z
							.literal(true)
							.optional()
							.describe(
								'Forces the graphic\'s `y` dimension to be scaled proportionally to the `x` dimension, if the latter is scaled.',
							),
					})
					.merge(sizeBaseObject)
					.strict(),
			])
			.superRefine((obj, ctx) => {
				if (obj.type === 'DIRECTED') {
					if (obj.stretch && obj.tile) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: '`stretch` and `tile` are incompatible.',
						});
					}
				} else if (obj.type === 'SCREEN_SPACE') {
					if (obj.x && obj.fitX) {
						return ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: '`x` conflicts with `fitX`. Choose one or the other.',
						});
					}
					if (obj.y && obj.fitY) {
						return ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: '`y` conflicts with `fitY`. Choose one or the other.',
						});
					}
					if (obj.ratioX) {
						if (obj.x || obj.fitX) {
							return ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: '`ratioX` conflicts with `x` and `fitX`. Choose one or the other.',
							});
						}
						if (!obj.y && !obj.fitY) {
							return ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'No point locking `ratioX` if neither `y` nor `fitY` are used!',
							});
						}
					}
					if (obj.ratioY) {
						if (obj.y || obj.fitY) {
							return ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: '`ratioY` conflicts with `y` and `fitY`. Choose one or the other.',
							});
						}
						if (!obj.x && !obj.fitX) {
							return ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'No point locking `ratioY` if neither `x` nor `fitX` are used!',
							});
						}
					}
				}
			})
			.optional()
			.describe(
				'Controls how large the graphic should be.\n`"type": "ABSOLUTE"`: scales the graphic to a fixed size.\n`"type": "RELATIVE"`: scales the graphic relative to a particular placeable (in particular, the one determining its `position`).\n`"type": "DIRECTED"`: scales or stretches the graphic so that it spans from its `position` to the `target`. This also rotates the graphic appropriately—use `rotation` to modify it.\n`"type": "SCREEN_SPACE"`: controls the graphic\'s size when it\'s been configured to play in screen space (see `position` for more information).',
			),
		reflection: z
			.object({
				x: z
					.enum(['ALWAYS', 'RANDOM'])
					.optional()
					.describe(
						'`"ALWAYS"`: reflects the graphic across the x-axis.\n`"RANDOM"`: randomly chooses whether to reflect the graphic across the x-axis on each execution.',
					),
				y: z
					.enum(['ALWAYS', 'RANDOM'])
					.optional()
					.describe(
						'`"ALWAYS"`: reflects the graphic across the y-axis.\n`"RANDOM"`: randomly chooses whether to reflect the graphic across the y-axis on each execution.',
					),
			})
			.strict()
			.refine(...nonEmpty)
			.optional()
			.describe('Reflects the graphic along some axis.'),
		rotation: z
			.discriminatedUnion('type', [
				z
					.object({
						type: z.literal('ABSOLUTE'),
						angle: angle
							.or(z.literal('RANDOM'))
							.optional()
							.describe(
								'An angle in degrees (°) to rotate the graphic. Alternatively, use the value `"RANDOM"` to set a random rotation on each execution.',
							),
					})
					.merge(rotationBaseObject)
					.strict(),
				z
					.object({
						type: z.literal('RELATIVE'),
						target: vector2
							.or(z.enum(['SOURCES', 'TARGETS', 'TEMPLATES']))
							.or(ID)
							.describe(
								'The thing to rotate towards. You can provide either an object with `x` and `y` coordinates, a string representing a stored name (e.g. of a crosshair), or the literal value `"SOURCES"`, `"TARGETS"`, or `"TEMPLATES"` to select that respective placeable (if one exists).',
							),
						attach: z
							.literal(true)
							.optional()
							.describe('Attaches the rotation to dynamically update as the `target` moves.'),
						offset: vector2.optional().describe('Offsets the `target` by a fixed amount.'),
						randomOffset: z
							.number()
							.positive()
							.optional()
							.describe(
								'Causes the `target` to be offset by a random amount. The value is a multiplier applied to the target\'s placeable size, or 1 grid space if it doesn\'t have a size.',
							),
						local: z.literal(true).optional(),
						gridUnits: z
							.literal(true)
							.optional()
							.describe('Causes the `offset` to be measured in the scene\'s grid units.'),
						rotationOffset: angle
							.optional()
							.describe(
								'A fixed rotation to apply after the graphic is oriented towards the target, in degrees (°).',
							),
					})
					.merge(rotationBaseObject)
					.strict(),
				z
					.object({
						type: z.literal('DIRECTED'),
						offset: vector2.optional().describe('Offsets the `target` by a fixed amount.'),
						randomOffset: z
							.number()
							.positive()
							.optional()
							.describe(
								'Causes the `target` to be offset by a random amount. The value is a multiplier applied to the target\'s placeable size, or 1 grid space if it doesn\'t have a size.',
							),
						local: z.literal(true).optional(),
						gridUnits: z
							.literal(true)
							.optional()
							.describe('Causes the `offset` to be measured in the scene\'s grid units.'),
					})
					.strict(),
			])
			.superRefine((obj, ctx) => {
				if (Object.keys(obj).length <= 1) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Object must have `type` and at least one other property.',
					});
				}
				if (obj.type === 'RELATIVE' && obj.offset) {
					const keysNeedingOffset = ['randomOffset', 'local', 'gridUnits'].filter(key => key in obj);
					if (keysNeedingOffset.length) {
						return ctx.addIssue({
							code: z.ZodIssueCode.unrecognized_keys,
							keys: keysNeedingOffset,
							message: `\`offset\` is required for the following ${pluralise('key', keysNeedingOffset.length)}: \`${keysNeedingOffset.join('`, `')}\``,
						});
					}
				}
			})
			.optional()
			.describe(
				'Controls the rotation of the graphic. You can either define an independent rotation (`"type": "ABSOLUTE"`), or rotate relative to another point or object (`"type": "RELATIVE"`). If you\'ve set `"type": "DIRECTED"` in `size`, you can fine-tune the rotation here.',
			),
		visibility: z
			.object({
				opacity: z.number().gt(0).lt(1).optional().describe('An opacity scaler from 0 to 1 (exclusive).'),
				mask: z
					.array(z.enum(['SOURCES', 'TARGETS']))
					.min(1)
					.refine(...uniqueItems)
					.optional()
					.describe('Causes the graphic to act as a mask for the effect\'s `"SOURCES"` and/or `"TARGETS"`.'),
				xray: z
					.literal(true)
					.optional()
					.describe(
						'Causes the graphic to be visible even if it would normally be hidden due to token vision.',
					),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
		elevation: z
			.object({
				zIndex: z
					.number()
					.optional()
					.describe(
						'A entity\'s \'z-index\' is a number that describes how \'high up\' that entity should be rendered—entities with a higher z-index are rendered over the top of those with lower z-indices.\nZ-index differs from `sortLayer` in that it *only* determines the ordering of entities in the same sort layer. Therefore, unless you\'ve manually overridden a graphic\'s `sortLayer`, you should use `zIndex` to control the layering of the graphic among other graphics.',
					),
				sortLayer: z
					.enum(['BELOW_TILES', 'BELOW_TOKENS', 'ABOVE_LIGHTING', 'ABOVE_INTERFACE'])
					.or(z.number())
					.optional()
					.describe(
						'An entity\'s \'sort layer\' is effectively just a number that describes that entity\'s \'type\', within the context of layered rendering. For instance, tokens, tiles, and weather all have different sort-layer values. For entities with the same elevation, the one with the higher sort-layer value is placed on top; this creates a kind of \'layering\' system for each type of entity (e.g. one layer for the scene, one for tiles, one for tokens, one for weather, etc.).\nThe default canvas ordering is scene, tiles, drawings, tokens, weather; above that still is lighting, then UI. The default sort-layer value for Sequencer effects is 800, which is above tokens but below weather effects. You can use one of the listed string values to modify this.\nYou can also choose to set a numeric value manually for more fine-tuned control. Note Foundry\'s [documentation](https://foundryvtt.com/api/classes/client.PrimaryCanvasGroup.html#SORT_LAYERS) for a guideline.',
					),
			})
			.strict()
			.optional()
			.describe('Sets the elevation at which to execute the graphic.'),
		persistent: z // TODO: superrefine `TOKEN_PROTOTYPE` to require a token target
			.enum(['CANVAS', 'TOKEN_PROTOTYPE'])
			.optional()
			.describe(
				'Causes the graphic to become permanent. Unless the graphic uses either `name` (so another effect can `remove` it) or `tieToDocuments`, a persistent graphic can only be removed manually via the Sequence Manager.\n`"CANVAS"`: persists the graphic on the canvas.\n`"TOKEN_PROTOTYPE"`: if the graphic is linked to a token, the graphic becomes persistent on that token\'s prototype data.',
			),
		varyProperties: z
			.array(
				z
					.discriminatedUnion('target', [
						z.object({
							target: z.literal('sprite'),
							property: z.enum([
								'alpha',
								'position.x',
								'position.y',
								'rotation',
								'angle',
								'scale.x',
								'scale.y',
								'width',
								'height',
							]),
						}),
						z.object({
							target: z.literal('alphaFilter'),
							property: z.literal('alpha'),
						}),
						z.object({
							target: z.literal('spriteContainer'),
							property: z.enum([
								'position.x',
								'position.y',
								'rotation',
								'angle',
								'scale.x',
								'scale.y',
							]),
						}),
					])
					.and(varyPropertiesObject)
					// Required due to Zod limitation (can't set `strict()` on above objects due to intersection)
					.superRefine((obj, ctx) => {
						const unrecognisedKeys = [];
						for (const key in obj) {
							const recognised
								= key in varyPropertiesBaseObject.shape
								|| ['type', 'absolute', 'fromEnd', 'loops', 'values', 'pingPong'].includes(key);
							if (recognised) unrecognisedKeys.push(key);
						}
						if (unrecognisedKeys.length) {
							ctx.addIssue({
								code: z.ZodIssueCode.unrecognized_keys,
								keys: unrecognisedKeys,
							});
						}
					})
					.describe(
						'A property-variation configuration object.\nFirst, set the `target` and `property` of said target to vary, then choose the `type` of variation you want (either `"animate"` or `"loop"`).\nSee [Sequencer\'s documentation](https://fantasycomputer.works/FoundryVTT-Sequencer/#/api/effect?id=animate-property) for more information.',
					),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe(
				'An array of objects, where each object represents a configuration to vary a specific property during the course of the graphic\'s execution.\nThis is a combined interface for Sequencer\'s [`animateProperty()`](https://fantasycomputer.works/FoundryVTT-Sequencer/#/api/effect?id=animate-property) and [`loopProperty()`](https://fantasycomputer.works/FoundryVTT-Sequencer/#/api/effect?id=loop-property) methods.',
			),
		shapes: z
			.array(
				z
					.discriminatedUnion('type', [
						z
							.object({
								type: z.literal('circle'),
								radius: z.number().positive().describe('The circle\'s radius, in pixels.'),
							})
							.merge(shapeOptions)
							.strict(),
						z
							.object({
								type: z.enum(['ellipse', 'rectangle']),
								width: z.number().positive().describe('The shape\'s width, in pixels.'),
								height: z.number().positive().describe('The shape\'s in pixels.'),
							})
							.merge(shapeOptions)
							.strict(),
						z
							.object({
								type: z.literal('roundedRect'),
								width: z.number().positive().describe('The shape\'s width, in pixels.'),
								height: z.number().positive().describe('The shape\'s in pixels.'),
								radius: z
									.number()
									.positive()
									.describe('The corners\' radius of curvature, in pixels.'),
							})
							.merge(shapeOptions)
							.strict(),
						z
							.object({
								type: z.literal('polygon'),
								points: z
									.array(z.object({ x: z.number(), y: z.number() }))
									.min(3)
									.refine(...uniqueItems)
									.describe(
										'The polygon\'s vertices. The final shape is made by joining each point up in order.',
									),
							})
							.merge(shapeOptions)
							.strict(),
						z
							.object({
								type: z.literal('TEXT'),
								entry: z.string().min(1),
								options: z
									.object({}) // TODO: https://pixijs.io/pixi-text-style
									.refine(...nonEmpty)
									.optional(),
							})
							.strict(),
					])
					.refine(...nonEmpty)
					.refine(
						obj => obj.type === 'TEXT' || obj.isMask || !obj.name,
						'`name` and `isMask` can\'t be used simultaneously due to a Sequencer limitation.',
					)
					.describe('An object representing a shape. There are multiple `type`s.'),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe('A set of shapes or text-boxes to draw on top of the graphic.'),
		tint: hexColour.describe('A hexadecimal colour-code to give the animation a certain tint.').optional(),
		filters: z
			.array(
				z.discriminatedUnion('type', [
					z
						.object({
							type: z.literal('ColorMatrix'),
							options: z
								.object({
									hue: angle
										.refine(...nonZero)
										.describe('The hue, in degrees.')
										.optional(),
									brightness: z
										.number()
										.describe('The value of the brightness (0 to 1, where 0 is black).')
										.optional(),
									contrast: z
										.number()
										.describe('The value of the contrast (0 to 1).')
										.optional(),
									saturate: z
										.number()
										.describe(
											'The value of the saturation amount. Negative numbers cause it to become desaturated (−1 to 1)',
										)
										.optional(),
								})
								.strict()
								.refine(...nonEmpty),
						})
						.strict(),
					z
						.object({
							type: z.literal('Glow'),
							options: z
								.object({
									distance: z
										.number()
										.positive()
										.describe('The distance of the glow, in pixels.')
										.optional(),
									outerStrength: z
										.number()
										.positive()
										.describe('The strength of the glow outward from the edge of the sprite.')
										.optional(),
									innerStrength: z
										.number()
										.positive()
										.describe('The strength of the glow inward from the edge of the sprite.')
										.optional(),
									color: hexColour.describe('The color of the glow').optional(),
									quality: z
										.number()
										.gte(0)
										.lte(1)
										.describe(
											'Describes the quality of the glow (0 to 1). A higher number is less performant.',
										)
										.optional(),
									knockout: z
										.literal(true)
										.describe(
											'Toggle to hide the contents and only show the glow (effectively hides the sprite).',
										)
										.optional(),
								})
								.strict()
								.refine(...nonEmpty),
						})
						.strict(),
					z
						.object({
							type: z.literal('Blur'),
							options: z
								.object({
									strength: z
										.number()
										.positive()
										.describe('The strength of the filter.')
										.optional(),
									blur: z
										.number()
										.positive()
										.describe(
											'Sets the strength of the blur in both the horizontal and vertical axes simultaneously.',
										)
										.optional(),
									blurX: z
										.number()
										.positive()
										.describe('The strength of the blur on the horizontal axis.')
										.optional(),
									blurY: z
										.number()
										.positive()
										.describe('The strength of the blur on the vertical axis.')
										.optional(),
									quality: z
										.number()
										.int()
										.positive()
										.describe('Quality of the filter.')
										.optional(),
									resolution: z
										.number()
										.positive()
										.describe('Sets the resolution of the blur filter.')
										.optional(),
									kernelSize: z
										.number()
										.positive()
										.int()
										.describe('Effectively how many passes the blur goes through.')
										.optional(),
								})
								.strict()
								.refine(...nonEmpty)
								.refine(options => !options.blur || (!options.blurX && !options.blurY), {
									path: ['blur'],
									message: '`blur` cannot be used at the same time as `blurX` or `blurY`.',
								}),
						})
						.strict(),
					z
						.object({
							type: z.literal('Noise'),
							options: z
								.object({
									noise: z.number().gt(0).lte(1).describe('The noise intensity.').optional(),
									seed: z
										.number()
										.describe(
											'A random seed for the noise generation (default is `Math.random()`).',
										)
										.optional(),
								})
								.strict()
								.refine(...nonEmpty)
								.optional(),
						})
						.strict(),
					z
						.object({
							type: z.literal('Clip'),
						})
						.strict(),
				]),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe(
				'An array of visual filters to apply to the graphic.\nSee [PixiJS](https://pixijs.io/filters/docs/) for more information. Filters can be very powerful, but noticeably increase computational load; try to find an alternate animation (or \'bake it in\' directly!) where possible.',
			),
	})
	.strict();

/**
 * Options which are specific to `graphic`-type animations.
 */
export type GraphicOptions = z.infer<typeof graphicOptions>;
