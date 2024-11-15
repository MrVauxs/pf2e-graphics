import { z } from 'zod';
import { uniqueItems } from '../helpers/refinements';
import { playableFile, vector2 } from '../helpers/structures';
import { positionBaseObject } from './index';

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
		sound: z
			.array(playableFile)
			.min(1)
			.refine(...uniqueItems)
			.describe(
				'The sound to be played! Use either a Sequencer database path (recommended), or a filepath relative to your Foundry `Data` directory (not a URL!).\nIf you provide more than one sound, PF2e Graphics will select one at random each time the effect is executed. You can also use the following Sequencer shorthands:\n- Handlebar notation (a comma-separated list inside braces) indicates \'any one of this list\'. For instance, `path.{fire,ice}.1` chooses one of `path.fire.1` and `path.ice.1`.\n- **(Sequencer only)** To pick from all paths with a particular prefix, just don\'t include the variable portion of the path. For instance, if you have the database paths `path.fire.1` and `path.fire.2`, you can just write `path.fire`.\n- **(Filepath only)** You can use `*` as a wildcard (e.g. `assets/audio/*.ogg`).\n**Note:** although you can mix and match the above methods, all possibilities are generated *before* any are chosen. For example, `["path.{fire,ice}.1", "path.fire.1"]` selects from `path.fire.1`, `path.ice.1`, and `path.fire.1` again—a set of three options, so `path.fire.1` has a 67% (not 75%!) chance to occur.',
			),
		volume: z
			.number()
			.gt(0)
			.lte(1)
			.refine(num => num !== 0.8, '0.8 is the default and doesn\'t need to be configured.')
			.optional()
			.describe('The sound\'s volume (default: 0.8).'),
		position: positionBaseObject
			.pick({
				offset: true,
				randomOffset: true,
				gridUnits: true,
			})
			.extend({
				target: vector2
					.or(z.enum(['SOURCES', 'TARGETS']))
					.describe(
						'Where the sound should be placed. Accepts one of the following:\n- A pair of pixel-coordinates on the canvas, in the form of `{ x: number, y: number }`.\n- A reference of either the effect\'s `"SOURCES"` or `"TARGETS"`.',
					),
			}),
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
		audioChannel: z
			.enum(['music', 'environment'])
			.optional()
			.describe('Sets the sound\'s output channel (default: `interface`).'),
	})
	.strict()
	// refinements are applied to `animationPayload` in `src/schema/animation.ts` due to a Zod limitation
	.describe('The options specific to a `sound`-preset animation.');

/**
 * The options specific to a `sound`-preset animation.
 */
export type SoundPresetOptions = z.infer<typeof soundOptions>;
