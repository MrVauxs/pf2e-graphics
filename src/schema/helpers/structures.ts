import { z } from 'zod';
import { easing, filePath, sequencerDBEntry } from './atoms';
import { nonEmpty, nonZero } from './refinements';

/**
 * Zod schema for a file that can be played.
 */
export const playableFile = sequencerDBEntry.or(filePath);

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
 * Zod schema for a 2D scaling.
 */
export const scaling2 = z
	.object({
		x: z.number().positive().optional().describe('The scale factor along the horizontal axis.'),
		y: z.number().positive().optional().describe('The scale factor along the vertical axis.'),
	})
	.strict();

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
