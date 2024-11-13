import { z } from 'zod';
import { easing } from './atoms';
import { nonEmpty, nonZero } from './refinements';

/**
 * Zod schema for an unrefined 2D vector.
 */
const vector2Base = z
	.object({
		x: z
			.number()
			.refine(...nonZero)
			.optional()
			.describe('Distance rightwards, in pixels.'),
		y: z
			.number()
			.refine(...nonZero)
			.optional()
			.describe('Distance downwards, in pixels.'),
	})
	.strict();

/**
 * Zod schema for a 2D vector.
 */
export const vector2 = vector2Base.refine(...nonEmpty);

/**
 * Zod schema for a 2D vector with a `gridUnits` flag.
 */
export const vector2WithOffset = vector2Base
	.extend({
		gridUnits: z
			.literal(true)
			.optional()
			.describe('Causes `x` and `y` to be measured in the scene\'s grid units.'),
	})
	.refine(obj => obj.x || obj.y, 'At least one of `x` and `y` must be defined.');

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
	.extend({
		value: z
			.number()
			.refine(...nonZero)
			.describe('The duration over which the fade occurs.'),
	})
	.strict()
	.describe(
		'An easing/delay object with a `value` property included (typically used for fade-in/-out effects).',
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
		offset: vector2.optional(),
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
