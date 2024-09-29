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
 * Zod schema for an offset value, in pixels.
 */
const offsetValue = z
	.number()
	.refine(...nonZero)
	.describe('An offset value, in pixels.');

/**
 * Zod schema for an offset range, in pixels, from which to randomly select a value.
 */
const offsetRange = z
	.tuple([z.number(), z.number()])
	.refine(arr => arr[0] !== arr[1], 'Offset range cannot be zero.')
	.describe('An offset range, in pixels, from which to randomly select a value.');

/**
 * Zod schema for a 2D offset, accepting either single- or range-values for either axis.
 */
export const offset = z
	.object({
		x: offsetValue.or(offsetRange).optional(),
		y: offsetValue.or(offsetRange).optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe('A 2D offset, accepting either single- or range-values for either axis.');

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
	.object({
		cacheLocation: z.literal(true).optional(),
		offset: offset.optional(),
		randomOffset: z.number().optional(),
		gridUnits: z.literal(true).optional(),
		local: z.literal(true).optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe(
		'A configuration to place an animation/sound at a particular location on the canvas, with an optional offset.',
	);

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
