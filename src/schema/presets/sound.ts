import { z } from 'zod';
import { predicate } from '../helpers/atoms';
import { nonZero, uniqueItems } from '../helpers/refinements';
import { atLocation, easingOptionsWithValue } from '../helpers/structures';

/**
 * Zod schema for a sound effect (i.e. an effect applied to a sound).
 */
const soundEffect = z
	.object({
		type: z.string().min(1),
		intensity: z.number().positive(),
	})
	.strict()
	.describe('A sound effect (i.e. an effect applied to a sound).');

/**
 * Zod schema for the `sound` preset options.
 */
export const soundOptions = z
	.object({
		waitUntilFinished: z.number().optional(),
		atLocation: atLocation.optional(),
		radius: z.number().positive().optional(),
		volume: z.number().positive().optional(),
		duration: z.number().positive().optional(),
		fadeIn: z.number().min(1).or(easingOptionsWithValue).optional(),
		fadeOut: z.number().min(1).or(easingOptionsWithValue).optional(),
		constrainedByWalls: z.literal(true).optional(),
		predicate: z
			.array(predicate)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
		default: z.literal(true).optional(),
		delay: z
			.number()
			.refine(...nonZero)
			.optional(),
		muffledEffect: soundEffect.optional(),
		baseEffect: soundEffect.optional(),
	})
	.strict()
	.describe('`sound` preset options.');

/**
 * `sound` preset options.
 */
export type SoundPresetOptions = z.infer<typeof soundOptions>;
