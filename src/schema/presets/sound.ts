import { z } from 'zod';
import { atLocation } from '../helpers/structures';

/**
 * Zod schema for a sound effect (i.e. an effect applied to a sound).
 */
const soundEffect = z
	.object({
		type: z.enum(['lowpass', 'highpass', 'reverb']),
		intensity: z.number().positive(),
	})
	.strict()
	.describe('A sound effect (i.e. an effect applied to a sound).');

/**
 * Zod schema for the options specific to a `sound`-preset animation.
 */
export const soundOptions = z
	.object({
		volume: z
			.number()
			.positive()
			.refine(num => num !== 100, '100 is the default and doesn\'t need to be configured.')
			.optional()
			.describe('The sound\'s volume (default: 100).'),
		atLocation: atLocation.optional(),
		radius: z
			.number()
			.positive()
			.optional()
			.describe('The radius in which the sound plays, in grid units (typically feet).'),
		constrainedByWalls: z
			.literal(true)
			.optional()
			.describe('Causes the sound to be completely blocked by walls.'),
		noDistanceEasing: z
			.literal(true)
			.optional()
			.describe('Prevents volume fall-off as the observer moves away from the sound\'s origin.'),
		alwaysForGMs: z
			.literal(true)
			.optional()
			.describe(
				'Causes the sound to be played for the GM as if they were at the origin (i.e. ignoring walls and token distance).',
			),
		baseEffect: soundEffect
			.optional()
			.describe('An effect to be applied to the sound when it is heard normally, without blocking walls.'),
		muffledEffect: soundEffect
			.optional()
			.describe('An effect to be applied when the sound is heard through a wall.'),
	})
	.strict()
	// refinements are applied to `animationPayload` in `src/schema/animation.ts` due to a Zod limitation
	.describe('The options specific to a `sound`-preset animation.');

/**
 * The options specific to a `sound`-preset animation.
 */
export type SoundPresetOptions = z.infer<typeof soundOptions>;
