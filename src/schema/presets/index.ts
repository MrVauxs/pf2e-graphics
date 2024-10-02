import { z } from 'zod';
import { angle, easing, filePath, hexColour, ID, sequencerDBEntry } from '../helpers/atoms';
import { nonEmpty, nonZero, uniqueItems } from '../helpers/refinements';
import { easingOptions, easingOptionsWithValue, offset, vector2 } from '../helpers/structures';

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
 * Zod schema for the options which are common to all 'effect' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).
 */
export const effectOptions = z
	.object({
		name: z
			.string()
			.optional()
			.describe('A human-readable name to display in Sequencer\'s Animations Manager.'),
		// reference: rollOption.optional().describe('You can `reference` the animation(s) attached to uuuuuuuh idk how to select only one')
		files: z
			.array(sequencerDBEntry.or(filePath))
			.min(1)
			.refine(...uniqueItems)
			.describe('The actual files to be played!'),
		syncGroup: ID.describe(
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
 * Zod schema for the options which are common to all graphic animations.
 */
export const graphicOptions = z
	.object({
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
		targets: z.array(z.string()).min(1).optional(),
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
				z
					.object({
						target: z.string(),
						property: z.string(),
						options: z
							.object({
								duration: z.number(),
								from: z.number().optional(),
								to: z.number().optional(),
								values: z
									.array(z.number())
									.min(1)
									.refine(...uniqueItems)
									.optional(),
								loops: z.number().int().positive().optional(),
								pingPong: z.literal(true).optional(),
								delay: z.number().positive().optional(),
								ease: easing.optional(),
								fromEnd: z.literal(true).optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict(),
					})
					.strict(),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		animateProperty: z
			.array(
				z
					.object({
						target: z.string(),
						property: z.string(),
						options: z
							.object({
								duration: z.number(),
								from: z.number(),
								to: z.number(),
								delay: z.number().optional(),
								ease: easing.optional(),
								fromEnd: z.literal(true).optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict(),
					})
					.strict(),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		shape: z
			.array(
				z
					.object({
						type: z.enum(['polygon', 'rectangle', 'circle', 'ellipse', 'roundedRect']),
						radius: z.number().positive().optional(),
						width: z.number().positive().optional(),
						height: z.number().positive().optional(),
						points: z
							.array(z.tuple([z.number(), z.number()]).or(vector2))
							.min(1)
							.refine(...uniqueItems)
							.optional(),
						gridUnits: z.literal(true).optional(),
						name: z.string().optional(),
						fillColor: hexColour.or(z.number()).optional(),
						fillAlpha: z.number().positive().optional(),
						alpha: z.number().positive().optional(),
						lineSize: z.number().positive().optional(),
						lineColor: hexColour.or(z.number()).optional(),
						offset: z
							.object({
								x: z.number().optional(),
								y: z.number().optional(),
								gridUnits: z.literal(true).optional(),
							})
							.strict()
							.optional(),
						isMask: z.literal(true).optional(),
					})
					.strict()
					.refine(...nonEmpty),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		filter: z
			.discriminatedUnion('type', [
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
								contrast: z.number().describe('The value of the contrast (0 to 1).').optional(),
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
								strength: z.number().positive().describe('The strength of the filter.').optional(),
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
								quality: z.number().int().positive().describe('Quality of the filter.').optional(),
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
			])
			.optional(),
	})
	.strict()
	.describe('Options which are common to all graphic animations.');

export { crosshairOptions } from './crosshair';
export { meleeOptions } from './melee';
export { onTokenOptions } from './onToken';
export { rangedOptions } from './ranged';
export { soundOptions } from './sound';
export { templateOptions } from './template';
