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
				'The actual file to be played! Use either a Sequencer database path (recommended), or a filepath relative to your Foundry `Data` directory (not a URL!).\nYou can provide multiple files and have PF2e Graphics select one at random each time the effect is executed using one of the following methods.\n- You can use handlebar notation—a comma-separated list inside braces—to indicate \'any one of this list\'. For instance, `path.{fire,ice}.1` chooses one of `path.fire.1` and `path.ice.1`.\n- **(Sequencer only)** To pick from all paths with a particular prefix, just don\'t include the variable portion of the path. For instance, if you have the database paths `path.fire.1` and `path.fire.2`, you can just write `path.fire`.\n- **(Filepath only)** You can use `*` as a wildcard (e.g. `assets/audio/*.ogg`).\n- Instead of a string, you can use an array of strings as the value.\n**Note:** although you can mix and match the above methods, all possibilities are generated *before* any are chosen. That means that, for example, `["path.{fire,ice}.1", "path.fire.1"]` would select from `path.fire.1`, `path.ice.1`, and `path.fire.1` again—a set of three options, so `path.fire.1` has a 67% (not 75%!) chance to occur.',
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
						min: z.number().min(0),
						max: z.number().min(0),
					})
					.strict()
					.refine(obj => obj.max > obj.min, '`max` must be greater than `min`.'),
			)
			.optional(),
		duration: z.number().describe('The duration of the animation, in milliseconds.').positive().optional(),
		waitUntilFinished: z
			.number()
			.refine(...nonZero)
			.optional(),
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
 * Zod schema for the shared options of `animateProperty` and `loopProperty`.
 */
const animateAndLoopPropertyBaseOptions = z
	.object({
		duration: z.number().positive(),
		from: z.number(),
		to: z.number(),
		delay: z.number().positive().optional(),
		ease: easing.optional(),
		gridUnits: z
			.literal(true)
			.optional()
			.describe('Indicates that the `to` and `from` values are measured in grid units.'),
	})
	.strict();

/**
 * Zod schema for the options of `animateProperty`.
 */
const animatePropertyOptions = animateAndLoopPropertyBaseOptions
	.extend({
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
	})
	.strict();

/**
 * Zod schema for the options of `animateProperty`.
 */
const loopPropertyOptions = animateAndLoopPropertyBaseOptions
	.partial({
		to: true,
		from: true,
	})
	.extend({
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
	.strict()
	.refine(
		obj => (obj.to && obj.from) || obj.values,
		'You must define either a range of values to loop over via `to` and `from`, or provide those values directly via `values`.',
	)
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
		alpha: z.number().positive().optional().describe('The transparency of the entire shape.'),
		fillColor: hexColour.optional().describe('The shape\'s fill colour.'),
		fillAlpha: z.number().positive().optional().describe('The transparency of the shape\'s fill colour.'),
		lineSize: z.number().positive().optional().describe('The width of the shape\'s outline, in pixels.'),
		lineColor: hexColour.optional().describe('The colour of the shape\'s outline.'),
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
// .describe('A shape object's common options.');

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
		randomRotation: z.literal(true).optional(),
		randomizeMirrorX: z.literal(true).optional(),
		randomizeMirrorY: z.literal(true).optional(),
		mirrorX: z.literal(true).optional(),
		mirrorY: z.literal(true).optional(),
		belowTokens: z.literal(true).optional(),
		zIndex: z.number().optional(),
		tint: hexColour.describe('A hexadecimal colour code to give the animation a certain tint.').optional(),
		rotate: angle.describe('An angle in degrees (°) to rotate the animation.').optional(),
		opacity: z.number().describe('An opacity scaler from 0 to 1 (exclusive).').positive().lt(1).optional(),
		mask: z.literal(true).optional(),
		size: z
			.number()
			.or(
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
		spriteRotation: angle.optional(),
		scaleToObject: z
			.number()
			.or(
				z
					.object({
						value: z.number().positive(),
						uniform: z.literal(true).optional(),
						considerTokenScale: z.literal(true).optional(),
					})
					.strict(),
			)
			.optional(),
		spriteOffset: z
			.object({
				offset,
				gridUnits: z.literal(true).optional(),
				local: z.literal(true).optional(),
			})
			.strict()
			.optional(),
		moveTowards: easingOptions
			.extend({
				target: vector2.or(z.string()), // Also allows VisibleFoundryTypes but those aren't encodable in JSON
			})
			.strict()
			.optional(),
		missed: z.literal(true).optional(),
		anchor: vector2.optional(),
		template: z
			.object({
				gridSize: z.number().positive(),
				startPoint: z.number(),
				endPoint: z.number(),
			})
			.strict()
			.optional(),
		wait: z
			.number()
			.or(
				z
					.object({
						min: z.number(),
						max: z.number(),
					})
					.strict()
					.refine(obj => obj.max > obj.min, '`max` must be greater than `min`.'),
			)
			.optional(),
		persist: z
			.literal(true)
			.or(
				z
					.object({
						value: z.literal(true).optional(),
						persistTokenPrototype: z.literal(true).optional(),
					})
					.strict()
					.refine(...nonEmpty),
			)
			.optional(),
		repeats: z
			.number()
			.min(1)
			.int()
			.or(
				z
					.object({
						count: z.number().min(1),
						delayMin: z.number().optional(),
						delayMax: z.number().positive().optional(),
					})
					.strict()
					.refine(
						obj => (obj.delayMax ? obj.delayMin || obj.delayMin === 0 : true),
						'`delayMin` is required if `delayMax` is defined.',
					)
					.refine(
						obj => (obj.delayMax ? obj.delayMax > obj.delayMin! : true),
						'`delayMax` must be greater than `delayMin`.',
					),
			)
			.optional(),
		loopProperty: z
			.array(
				z.discriminatedUnion('target', [
					z
						.object({
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
							options: loopPropertyOptions,
						})
						.strict(),
					z
						.object({
							target: z.literal('alphaFilter'),
							property: z.literal('alpha'),
							options: loopPropertyOptions,
						})
						.strict(),
					z
						.object({
							target: z.literal('spriteContainer'),
							property: z.enum([
								'position.x',
								'position.y',
								'rotation',
								'angle',
								'scale.x',
								'scale.y',
							]),
							options: loopPropertyOptions,
						})
						.strict(),
				]),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		animateProperty: z
			.array(
				z.discriminatedUnion('target', [
					z
						.object({
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
							options: animatePropertyOptions,
						})
						.strict(),
					z
						.object({
							target: z.literal('alphaFilter'),
							property: z.literal('alpha'),
							options: animatePropertyOptions,
						})
						.strict(),
					z
						.object({
							target: z.literal('spriteContainer'),
							property: z.enum([
								'position.x',
								'position.y',
								'rotation',
								'angle',
								'scale.x',
								'scale.y',
							]),
							options: animatePropertyOptions,
						})
						.strict(),
				]),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
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
							.object({}) // TODO https://pixijs.io/pixi-text-style
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
				'A set of visual filters to apply to the graphic.\nSee [PixiJS](https://pixijs.io/filters/docs/) for more information.',
			),
	})
	.strict()
	.describe('Options which are common to all graphic animations.');

/**
 * Options which are common to all graphic animations.
 */
export type GraphicOptions = z.infer<typeof graphicOptions>;
