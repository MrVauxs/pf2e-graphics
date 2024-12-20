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
export const vector2WithGridUnits = vector2Base
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
	.strict();

/**
 * Zod schema for the shared properties of a `position` object (except for `screenSpace`).
 */
export const positionBaseObject = z.object({
	offset: vector2.optional().describe('Offsets the graphic\'s anchor.'),
	spriteOffset: vector2WithGridUnits
		.optional()
		.describe(
			'Offsets the graphic within its container/bounding box.\nOnly use this if you know what you\'re doing; it can make the graphic hard to select in the Effect Manager, and often you\'ll only need `offset` anyway.',
		),
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
		.describe('Causes the `offset` to be local (that is, applied before the effect\'s rotation).'),
	missed: z // TODO: superrefine to require `anchor`, `atLocation`, `stretchTo`, or `rotateTowards`.
		.literal(true)
		.optional()
		.describe(
			'Causes the graphic to be localised near the target/anchor, but not actually centred directly on it.',
		),
});
