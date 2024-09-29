import { z } from 'zod';
import { atLocation } from '../helpers/structures';

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
		atLocation: atLocation.optional(),
		radius: z.number().positive().optional(),
		volume: z.number().positive().optional(),
		constrainedByWalls: z.literal(true).optional(),
		muffledEffect: soundEffect.optional(),
		baseEffect: soundEffect.optional(),
	})
	.strict()
	.describe('`sound` preset options.');

/**
 * `sound` preset options.
 */
export type SoundPresetOptions = z.infer<typeof soundOptions>;
