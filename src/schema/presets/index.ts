import { z } from 'zod';
import { angle, easing, filePath, hexColour, ID, sequencerDBEntry, UUID } from '../helpers/atoms';
import { nonEmpty, nonZero, uniqueItems } from '../helpers/refinements';
import { easingOptions, easingOptionsWithValue, offset, offsetValue, vector2 } from '../helpers/structures';

export { animationOptions } from './animation';
export { crosshairOptions } from './crosshair';
export { meleeOptions } from './melee';
export { onTokenOptions } from './onToken';
export { rangedOptions } from './ranged';
export { soundOptions } from './sound';
export { templateOptions } from './template';

/**
 * An array of all presets that PF2e Graphics recognises.
 */
export const PRESETS = [
	'onToken',
	'ranged',
	'melee',
	'template',
	'sound',
	'macro',
	'crosshair',
	'animation',
] as const;

/**
 * Zod schema for a preset that PF2e Graphics recognises.
 */
export const presets = z.enum(PRESETS).describe('A preset that PF2e Graphics recognises.');

/**
 * A preset that PF2e Graphics recognises.
 */
export type Preset = z.infer<typeof presets>;

/**
 * Zod schema for a file that can be played.
 */
const playableFile = sequencerDBEntry.or(filePath); // .describe('A file that can be played.');

/**
 * Zod schema for the options which are common to all 'effect' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).
 */
export const effectOptions = z
	.object({
		name: z
			.string()
			.optional()
			.describe('A human-readable name to display in Sequencer\'s Animations Manager.'),
		file: playableFile
			.or(
				z
					.array(playableFile)
					.min(2)
					.refine(...uniqueItems),
			)
			.describe(
				'The actual file to be played! Use either a Sequencer database path (recommended), or a filepath relative to your Foundry `Data` directory (not a URL!).\nYou can provide multiple files and have PF2e Graphics select one at random each time the effect is executed using one of the following methods.\n- You can use handlebar notation—a comma-separated list inside braces—to indicate \'any one of this list\'. For instance, `path.{fire,ice}.1` chooses one of `path.fire.1` and `path.ice.1`.\n- **(Sequencer only)** To pick from all paths with a particular prefix, just don\'t include the variable portion of the path. For instance, if you have the database paths `path.fire.1` and `path.fire.2`, you can just write `path.fire`.\n- **(Filepath only)** You can use `*` as a wildcard (e.g. `assets/audio/*.ogg`).\n- Instead of a single string, you can use an array of strings as the value.\n**Note:** although you can mix and match the above methods, all possibilities are generated *before* any are chosen. For example, `["path.{fire,ice}.1", "path.fire.1"]` selects from `path.fire.1`, `path.ice.1`, and `path.fire.1` again—a set of three options, so `path.fire.1` has a 67% (not 75%!) chance to occur.',
			),
		syncGroup: ID.optional().describe(
			'Assigns the animation to a particular group. Animations in a given group all start at the same time, which can be useful if you\'ve got duplicated effects.',
		),
		locally: z
			.literal(true)
			.optional()
			.describe('Causes the animation to executed locally only (i.e. only for the triggering user).'),
		tieToDocuments: z
			.literal(true)
			.optional()
			.describe(
				'Links the animation to the document that created it. If the document is deleted, the animation is interrupted and deleted as well.',
			),
		remove: z
			.array(ID)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe(
				'An array of strings, where each element is another animation\'s `id`. When this animation starts, any animation with a matching `id` is interrupted and removed.',
			),
		fadeIn: z.number().min(1).or(easingOptionsWithValue).optional(),
		fadeOut: z.number().min(1).or(easingOptionsWithValue).optional(),
		delay: z
			.number()
			.or(
				z
					.object({
						min: z.number().positive(),
						max: z.number().positive(),
					})
					.strict()
					.refine(obj => obj.max > obj.min, '`max` must be greater than `min`.'),
			)
			.optional()
			.describe(
				'A duration, in milliseconds, for which to delay executing the effect. Instead of a single number, you can alternatively define an object; a random value is chosen between `min` and `max` on each execution.',
			),
		duration: z
			.number()
			.positive()
			.optional()
			.describe(
				'The maximum duration of the effect, in milliseconds. If the provided duration is longer than the effect\'s source duration, it will loop for the given duration.',
			),
		waitUntilFinished: z
			.number()
			.or(
				z
					.object({
						min: z.number(),
						max: z.number(),
					})
					.strict()
					.refine(
						obj => obj.min !== obj.max,
						'The range is zero. Define `waitUntilFinished` as a number instead of an object if this is intentional.',
					),
			)
			.optional()
			.describe(
				'After the `contents` of an effect are unrolled, each one is executed simultaneously by default. By marking an effect with `waitUntilFinished`, *subsequent* effects are not executed until this effect completes.\nThe value is a number, in milliseconds, that the following effect should wait after this effect\'s completion. Zero can be used to perform seamless, sequential playback; negative numbers can be used to cause the subsequent effect to begin earlier (without interrupting this effect).\nInstead of a single number, you can alternatively define an object; a random value is chosen between `min` and `max` on each execution.',
			),
		async: z // TODO superrefine this for repeats/waituntilfinished
			.literal(true)
			.optional()
			.describe(
				'If `repeats` is defined, this causes `waitUntilFinished` to instead apply to each repetition, rather than for the entire effect.',
			),
		repeats: z
			.object({
				count: z.number().min(1).int(),
				delay: z
					.number()
					.refine(...nonZero)
					.or(
						z
							.object({
								min: z
									.number()
									.describe('The minimum delay between repetitions, in milliseconds.'),
								max: z
									.number()
									.describe('The maximum delay between repetitions, in milliseconds.'),
							})
							.strict()
							.refine(obj => obj.max > obj.min, '`max` must be greater than `min`.'),
					)
					.optional()
					.describe(
						'Set a duration to delay between each repetition. The value can either be a number, in milliseconds, or an object with `min` and `max` durations, from which a random value is chosen.',
					),
			})
			.strict()
			.optional(),
		probability: z
			.number()
			.gt(0)
			.lt(1)
			.optional()
			.describe('Sets the probability that this effect is executed each time it\'s triggered.'),
	})
	.strict()
	.describe(
		'Options which are common to all \'effect\' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).',
	);

/**
 * Options which are common to all \'effect\' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).
 */
export type EffectOptions = z.infer<typeof effectOptions>;

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
		offset: z
			.object({
				x: offsetValue.optional(),
				y: offsetValue.optional(),
				gridUnits: z
					.literal(true)
					.optional()
					.describe('Indicates that the offset\'s `x` and `y` values are measured in grid units.'),
			})
			.strict()
			.optional()
			.describe('A 2D offset, accepting either single- or range-values for either axis.'),
		isMask: z
			.literal(true)
			.optional()
			.describe('Sets the shape as a mask, hiding it and any graphic intersecting it.'),
	})
	.strict();

/**
 * Zod schema for the options which are common to all graphic animations.
 */
export const graphicOptions = z
	.object({
		targets: z
			.array(UUID)
			.min(1)
			.optional()
			.describe(
				'A list of UUID strings representing one or more targets for the effect. These targets are always used, in addition to any targetted placeables when the effect is executed. The UUIDs should be for some sort of placeable—tokens, templates, etc.\nThis shouldn\'t be used very much outside custom animations for specific scenes.',
			),
		mirror: z
			.object({
				x: z
					.enum(['always', 'random'])
					.optional()
					.describe(
						'`true`: reflects the graphic across the x-axis.\n`"random"`: randomly chooses whether to reflect the graphic across the x-axis on each execution.',
					),
				y: z
					.enum(['always', 'random'])
					.optional()
					.describe(
						'`true`: reflects the graphic across the y-axis.\n`"random"`: randomly chooses whether to reflect the graphic across the y-axis on each execution.',
					),
			})
			.strict()
			.refine(...nonEmpty)
			.optional()
			.describe('Reflects the graphic along some axis.'),
		elevation: z
			.object({
				zIndex: z
					.number()
					.optional()
					.describe(
						'A entity\'s \'z-index\' is a number that describes how \'high up\' that entity should be rendered—entities with a higher z-index are rendered over the top of those with lower z-indices.\nZ-index differs from `sortLayer` in that it *only* determines the ordering of entities in the same sort layer. Therefore, unless you\'ve manually overriden a graphic\'s `sortLayer`, you should use `zIndex` to control the layering of the graphic among other graphics.',
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
		rotate: angle
			.or(z.literal('random'))
			.optional()
			.describe(
				'An angle in degrees (°) to rotate the animation. Alternatively, use the value `"random"` to set a random rotation on each execution.',
			),
		// TODO everything below
		tint: hexColour.describe('A hexadecimal colour code to give the animation a certain tint.').optional(),
		opacity: z.number().positive().lt(1).optional().describe('An opacity scaler from 0 to 1 (exclusive).'),
		mask: z.literal(true).optional(),
		size: z // PLANS
			.number() // Merge `size`, `scale`, and `scaleToObject` into one property
			.or(
				// Stop this madness!! 😤
				z
					.object({
						value: z.number().positive(),
						gridUnits: z.literal(true).optional(),
					})
					.strict(),
			)
			.optional(),
		scale: z
			.number()
			.or(
				z
					.object({
						min: z.number().or(z.object({ x: z.number(), y: z.number() })),
						max: z.number().optional(),
					})
					.strict(),
			)
			.optional(),
		scaleIn: z.object({
			// duration:
		}),
		scaleToObject: z
			.object({
				scale: z.number().positive(),
				options: z
					.object({
						uniform: z.literal(true).optional(),
						considerTokenScale: z.literal(true).optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
		spriteOffset: z
			.object({
				offset,
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		spriteRotation: angle.optional(),
		moveTowards: easingOptions
			.extend({
				target: vector2.or(z.string()), // Also allows VisibleFoundryTypes but those aren't encodable in JSON
			})
			.strict()
			.optional(),
		anchor: vector2.optional().describe(''),
		// TODO everything above
		persist: z // TODO: superrefine `TOKEN_PROTOTYPE` to require a token target
			.enum(['CANVAS', 'TOKEN_PROTOTYPE'])
			.optional()
			.describe(
				'Causes the graphic to become permanent. A persistent graphic can only be removed manually via the Sequence Manager.\n`"CANVAS"`: persists the graphic on the canvas.\n`"TOKEN_PROTOTYPE"`: if the graphic is linked to a token, the graphic becomes persistent on that token\'s prototype data.',
			),
		missed: z // TODO: superrefine to require `anchor`, `atLocation`, `stretchTo`, or `rotateTowards`.
			.literal(true)
			.optional()
			.describe(
				'Causes the graphic to be localised near the target/anchor, but not actually centred directly on it.',
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
		screenSpace: z
			.literal(true)
			.or(
				z
					.object({
						aboveUI: z
							.literal(true)
							.optional()
							.describe('Renders the graphic above Foundry\'s UI elements.'),
						offset: offset.optional().describe('Offsets the graphic from its `anchor`.'),
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
						scale: z
							.object({
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
							.strict()
							.refine(...nonEmpty)
							.superRefine((obj, ctx) => {
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
											message:
												'`ratioX` conflicts with `x` and `fitX`. Choose one or the other.',
										});
									}
									if (!obj.y && !obj.fitY) {
										return ctx.addIssue({
											code: z.ZodIssueCode.custom,
											message:
												'No point locking `ratioX` if neither `y` nor `fitY` are used!',
										});
									}
								}
								if (obj.ratioY) {
									if (obj.y || obj.fitY) {
										return ctx.addIssue({
											code: z.ZodIssueCode.custom,
											message:
												'`ratioY` conflicts with `y` and `fitY`. Choose one or the other.',
										});
									}
									if (!obj.x && !obj.fitX) {
										return ctx.addIssue({
											code: z.ZodIssueCode.custom,
											message:
												'No point locking `ratioY` if neither `x` nor `fitX` are used!',
										});
									}
								}
							})
							.optional()
							.describe('Allows you to adjust the graphic\'s scale.'),
					})
					.strict()
					.refine(...nonEmpty),
			)
			.optional()
			.describe(
				'Causes the graphic to be displayed in \'screen space\' rather than within Foundry\'s \'canvas space\'. This means that the graphic is rendered with respect to the screen or viewport, rather than a particular point on the scene.\nUse `true` to use the defaults (centre of the screen, to scale). Alternatively, provide an object for more granular control.',
			),
		text: z
			.array(
				z
					.object({
						entry: z.string().min(1),
						options: z
							.object({}) // TODO: https://pixijs.io/pixi-text-style
							.refine(...nonEmpty)
							.optional(),
					})
					.strict(),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
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
					])
					.refine(...nonEmpty)
					.refine(
						obj => obj.isMask || !obj.name,
						'`name` and `isMask` can\'t be used simultaneously due to a Sequencer limitation.',
					)
					.describe('An object representing a shape. There are multiple `type`s.'),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe('A set of shapes to draw on top of the graphic.'),
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
				'An array of visual filters to apply to the graphic.\nSee [PixiJS](https://pixijs.io/filters/docs/) for more information.',
			),
	})
	.strict()
	.describe('Options which are common to all graphic animations.');

/**
 * Options which are common to all graphic animations.
 */
export type GraphicOptions = z.infer<typeof graphicOptions>;
