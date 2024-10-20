import { z } from 'zod';
import { easing } from './atoms';
import { nonEmpty, nonZero } from './refinements';

/**
 * Zod schema for a 2D vector.
 */
export const vector2 = z
	.object({
		x: z
			.number()
			.refine(...nonZero)
			.optional(),
		y: z
			.number()
			.refine(...nonZero)
			.optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe('A 2D vector.');

/**
 * Zod schema for an offset value, in pixels. Positive values shift downward or rightward as appropriate.
 */
export const offsetValue = z
	.number()
	.refine(...nonZero)
	.describe('An offset value, in pixels. Positive values shift downward or rightward as appropriate.');

// TODO: Is this needed? Can use `randomOffset: number` in `atLocation()`'s options
// /**
//  * Zod schema for an offset range, in pixels, from which to randomly select a value.
//  */
// const offsetRange = z
// 	.tuple([z.number(), z.number()])
// 	.refine(arr => arr[0] !== arr[1], 'Offset range cannot be zero.')
// 	.describe('An offset range, in pixels, from which to randomly select a value.');

/**
 * Zod schema for a 2D offset.
 */
export const offset = z
	.object({
		x: offsetValue.optional(),
		y: offsetValue.optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe('A 2D offset.');

/**
 * Zod schema for the base options of animation modifier's easing.
 */
export const easingOptions = z
	.object({
		ease: easing.optional(),
		delay: z
			.number()
			.refine(...nonZero)
			.optional()
			.describe('The delay before the effect starts or ends, as appropriate, in milliseconds.'),
	})
	.strict()
	.describe('The base options of animation modifier\'s easing.');

/**
 * Zod schema for an easing/delay object with a `value` property included (typically used for fade-in/-out effects).
 */
export const easingOptionsWithValue = easingOptions
	.extend({ value: z.number().refine(...nonZero) })
	.strict()
	.describe(
		'An easing/delay object with a `value` property included (typically used for fade-in/-out effects).',
	);

/**
 * Zod schema for a configuration to place an animation/sound at a particular location on the canvas, with an optional offset.
 */
export const atLocation = z
	.array(
		z.union([
			z
				.object({
					position: z
						.enum(['SOURCES', 'TARGETS'])
						.or(
							z
								.string()
								.min(1)
								.refine(str => str !== 'ABSOLUTE'),
						)
						.describe(
							'Where should the effect be placed?\n`SOURCES`: at the source(s) of the effect.\n`TARGETS`: at the target(s) of the effect.\nYou can also use any other string to reference a particular named location (e.g. another ongoing effect\'s `name`, or a crosshair\'s `name`).',
						),
					cacheLocation: z
						.literal(true)
						.optional()
						.describe(
							'Causes the location to be cached immediately, rather than retrieved during the Sequence\'s runtime.',
						),
					offset: offset.optional(),
					randomOffset: z
						.number()
						.optional()
						.describe(
							'Causes the effect to be offset by a random amount. The value is a multiplier applied to `offset`.',
						),
					gridUnits: z
						.literal(true)
						.optional()
						.describe('Causes the `offset` to be measured in the scene\'s grid units.'),
					local: z
						.literal(true)
						.optional()
						.describe(
							'Causes the `offset` to be local (that is, applied before the effect\'s rotation).',
						),
				})
				.strict()
				.superRefine((obj, ctx) => {
					if (!obj.offset) {
						const REQUIRES_OFFSET = ['randomOffset', 'gridUnits', 'local'] as const;
						for (const property of REQUIRES_OFFSET) {
							if (property in obj) {
								ctx.addIssue({
									code: z.ZodIssueCode.custom,
									message: `\`${property}\` requires \`offset\`.`,
								});
							}
						}
					}
				})
				.describe('Plays the effect at a dynamic position according to the game data.'),
			z
				.object({
					position: z.literal('ABSOLUTE'),
					x: z
						.number()
						.refine(...nonZero)
						.optional()
						.describe('The position rightwards, from the left-hand edge of the canvas.'),
					y: z
						.number()
						.refine(...nonZero)
						.optional()
						.describe('The position downwards, from the top edge of the canvas.'),
				})
				.strict()
				.refine(obj => obj.x || obj.y, 'One or both of `x` and `y` must be defined.')
				.describe('Plays the effect at an absolute position on the canvas.'),
		]),
	)
	.describe('A configuration to place the effect at one or more locations on the canvas.');

/**
 * Zod schema for a configuration to attach an animation to a particular placeable on the canvas.
 */
export const attachTo = z
	.object({
		align: z.string().optional(),
		edge: z.string().optional(),
		bindVisibility: z.literal(true).optional(),
		bindAlpha: z.literal(true).optional(),
		bindScale: z.literal(true).optional(),
		bindElevation: z.literal(true).optional(),
		followRotation: z.literal(true).optional(),
		offset: offset.optional(),
		randomOffset: z.number().optional(),
		gridUnits: z.literal(true).optional(),
		local: z.literal(true).optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe('A configuration to attach an animation to a particular placeable on the canvas.');

/**
 * Zod schema for a configuration to rotate an animation towards a particular placeable on the canvas, with an optional offset.
 */
export const rotateTowards = z
	.object({
		rotationOffset: z.number().optional(),
		cacheLocation: z.literal(true).optional(),
		attachTo: z.literal(true).optional(),
		offset: offset.optional(),
		randomOffset: z.number().optional(),
		gridUnits: z.literal(true).optional(),
		local: z.literal(true).optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe(
		'A configuration to rotate an animation towards a particular placeable on the canvas, with an optional offset.',
	);

/**
 * Zod schema for a configuration to stretch an animation towards a particular placeable on the canvas, with an optional offset.
 */
export const stretchTo = z
	.object({
		cacheLocation: z.literal(true).optional(),
		attachTo: z.literal(true).optional(),
		onlyX: z.literal(true).optional(),
		tiling: z.literal(true).optional(),
		offset: offset.optional(),
		randomOffset: z.number().optional(),
		gridUnits: z.literal(true).optional(),
		local: z.literal(true).optional(),
		requiresLineOfSight: z.literal(true).optional(),
		hideLineOfSight: z.literal(true).optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe(
		'A configuration to stretch an animation towards a particular placeable on the canvas, with an optional offset.',
	);
