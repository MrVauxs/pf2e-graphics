import { z } from 'zod';
import { angle, filePath, hexColour, ID, sequencerDBEntry } from '../helpers/atoms';
import { nonZero, uniqueItems } from '../helpers/refinements';
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
 * Zod schema for the options which are common to all (non-`macro`) animation payloads.
 */
export const commonOptions = z
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
	.describe('Options which are common to all (non-`macro`) animation payloads.');

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
	})
	.strict()
	.describe('Options which are common to all graphic animations.');

export { meleeOptions } from './melee';
export { onTokenOptions } from './onToken';
export { rangedOptions } from './ranged';
export { soundOptions } from './sound';
export { templateOptions } from './template';
