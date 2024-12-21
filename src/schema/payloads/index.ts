import { z } from 'zod';
import { ID, UUID } from '../helpers/atoms';
import { nonZero, uniqueItems } from '../helpers/refinements';
import { easingOptions } from '../helpers/structures';

/**
 * An array of all presets that PF2e Graphics recognises.
 */
export const PRESETS = [
	'animation',
	'crosshair',
	'graphic',
	'macro',
	'sound',
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
 * Zod schema for the options which are common to all 'effect' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).
 */
export const effectOptions = z
	.object({
		name: z
			.string()
			.optional()
			.describe('A human-readable name to display in Sequencer\'s Animations Manager.'),
		syncGroup: ID.optional().describe(
			'Assigns the animation to a particular group. Animations in a given group all start at the same time, which can be useful if you\'ve got duplicated effects.',
		),
		// TODO: can this be done in the module?
		// locally: z
		// 	.literal(true)
		// 	.optional()
		// 	.describe('Causes the animation to executed locally only (i.e. only for the triggering user).'),
		users: z
			.array(z.string())
			.min(1)
			.optional()
			.describe(
				'An array of user IDs or usernames which can observe the effect.\nThis shouldn\'t be used very much outside custom animations.',
			),
		sources: z
			.array(UUID)
			.min(1)
			.optional()
			.describe(
				'A list of UUID strings representing one or more targets for the payload. These targets are always used, in addition to any targetted placeables when the payload is executed. The UUIDs should be for some sort of placeable—tokens, templates, etc.\nThis should not be used outside custom animations for specific scenes.',
			),
		targets: z
			.array(UUID)
			.min(1)
			.optional()
			.describe(
				'A list of UUID strings representing one or more targets for the payload. These targets are always used, in addition to any targetted placeables when the payload is executed. The UUIDs should be for some sort of placeable—tokens, templates, etc.\nThis should not be used outside custom animations for specific scenes.',
			),
		tieToDocuments: z
			.literal(true)
			.optional()
			.describe(
				'Links the payload to the document that created it. If the document is deleted, the payload is interrupted and deleted as well.',
			),
		fadeIn: easingOptions
			.extend({
				duration: z.number().positive().describe('The duration over which the fade occurs.'),
			})
			.strict()
			.optional(),
		fadeOut: easingOptions
			.extend({
				duration: z.number().positive().describe('The duration over which the fade occurs.'),
			})
			.strict()
			.optional(),
		delay: z
			.number()
			.or(
				z
					.object({
						min: z.number().positive(),
						max: z.number().positive(),
					})
					.strict()
					.refine(obj => obj.max > obj.min, '`max` must be greater than `min`.'),
			)
			.optional()
			.describe(
				'A duration, in milliseconds, for which to delay executing the effect. Instead of a single number, you can alternatively define an object; a random value is chosen between `min` and `max` on each execution.',
			),
		duration: z
			.number()
			.positive()
			.optional()
			.describe(
				'The maximum duration of the effect, in milliseconds. If the provided duration is longer than the effect\'s source duration, it will loop for the given duration.',
			),
		waitUntilFinished: z
			.number()
			.or(
				z
					.object({
						min: z.number(),
						max: z.number(),
					})
					.strict()
					.refine(
						obj => obj.min !== obj.max,
						'The range is zero. Define `waitUntilFinished` as a number instead of an object if this is intentional.',
					),
			)
			.optional()
			.describe(
				'After the `contents` of an effect are unrolled, each one is executed simultaneously by default. By marking an effect with `waitUntilFinished`, *subsequent* effects are not executed until this effect completes.\nThe value is a number, in milliseconds, that the following effect should wait after this effect\'s completion. Zero can be used to perform seamless, sequential playback; negative numbers can be used to cause the subsequent effect to begin earlier (without interrupting this effect).\nInstead of a single number, you can alternatively define an object; a random value is chosen between `min` and `max` on each execution.',
			),
		repeats: z
			.object({
				count: z.number().min(1).int().describe('How many times should the graphic be executed?'),
				delay: z
					.number()
					.refine(...nonZero)
					.or(
						z
							.object({
								min: z
									.number()
									.describe('The minimum delay between repetitions, in milliseconds.'),
								max: z
									.number()
									.describe('The maximum delay between repetitions, in milliseconds.'),
							})
							.strict()
							.refine(obj => obj.max > obj.min, '`max` must be greater than `min`.'),
					)
					.describe(
						'Sets a duration to delay between each repetition. The value can either be a number, in milliseconds, or an object with `min` and `max` durations, from which a random value is chosen.',
					),
				async: z // TODO superrefine this for repeats/waitUntilFinished
					.literal(true)
					.optional()
					.describe(
						'Causes the `delay` between executions to be measured from the end of one execution to the start of the next (default: from the start of each execution).\nAdditionally, this causes `waitUntilFinished` to instead apply to each repetition, rather than for the entire effect.',
					),
			})
			.strict()
			.optional()
			.describe('Executes the graphic multiple times.'),
		probability: z
			.number()
			.gt(0)
			.lt(1)
			.optional()
			.describe('Sets the probability that this effect is executed each time it\'s triggered.'),
	})
	.strict()
	.describe(
		'Options which are common to all \'effect\' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).',
	);

/**
 * Options which are common to all \'effect\' animation payloads (i.e. `sound`, `melee`, `ranged`, `onToken`, and `template`).
 */
export type EffectOptions = z.infer<typeof effectOptions>;
