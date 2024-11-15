import { z } from 'zod';
import { pluralise } from '../../scripts/helpers';
import { ID, predicate, rollOption, UUID } from './helpers/atoms';
import { nonEmpty, uniqueItems } from './helpers/refinements';
import { animationOptions, crosshairOptions, effectOptions, graphicOptions, soundOptions } from './presets';
import { trigger } from './triggers';

/**
 * Zod schema for the animation payload that actually gets executed.
 */
const animationPayload = z
	.discriminatedUnion('type', [
		z
			.object({
				type: z.literal('macro'),
				document: UUID.describe('The UUID of the macro to be executed.'),
				options: z
					.object({})
					.optional()
					.describe('An arbitrary object of options you can pass into the macro as an argument.'),
			})
			.strict(),
		z
			.object({ type: z.literal('crosshair') })
			.merge(crosshairOptions)
			.strict(),
		z
			.object({ type: z.literal('sound') })
			.merge(effectOptions)
			.merge(soundOptions)
			.strict(),
		z
			.object({ type: z.literal('graphic') })
			.merge(effectOptions)
			.merge(graphicOptions)
			.strict(),
		z
			.object({ type: z.literal('animation') })
			.merge(animationOptions)
			.strict(),
	])
	.superRefine((obj, ctx) => {
		if (obj.type === 'sound') {
			if (!obj.position) {
				const keysNeedingPosition = (
					[
						'radius',
						'constrainedByWalls',
						'noDistanceEasing',
						'alwaysForGMs',
						'baseEffect',
						'muffledEffect',
					] as const
				).filter(key => key in obj);
				if (keysNeedingPosition.length) {
					return ctx.addIssue({
						code: z.ZodIssueCode.unrecognized_keys,
						keys: keysNeedingPosition,
						message: `\`offset\` is required for the following ${pluralise('key', keysNeedingPosition.length)}: \`${keysNeedingPosition.join('`, `')}\``,
					});
				}
			}
		} else if (obj.type === 'crosshair') {
			if (obj.snap?.direction) {
				if (obj.lockManualRotation) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							'Locking a template\'s direction (`lockManualRotation`) makes direction-snapping (`snap.direction`) redundant.',
					});
				}
				if (obj.location?.lockToEdgeDirection) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							'`lockToEdgeDirection` forces a template\'s direction, making `snap.direction` redundant.',
					});
				}
			}
			if (obj.location?.lockToEdgeDirection) {
				if (obj.lockManualRotation) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							'`lockManualRotation` is redundant when the template\'s orientation is locked away from the placeable (`location.lockToEdgeDirection`).',
					});
				}
				if (obj.template && 'direction' in obj.template) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							'There\'s no point setting an initial orientation (`template.direction`) when the template\'s orientation is dependent on its position (`location.lockToEdgeDirection`).',
					});
				}
			}
			if (obj.snap?.position && obj.location?.lockToEdge) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'Locking a crosshair to a placeable\'s edge (`locktoEdge`) makes position-snapping (`snap.position`) redundant.',
				});
			}
		}
	})
	.describe('The animation payload that actually gets executed.');

/**
 * The animation payload that actually gets executed.
 *
 * Consider using as `Extract<AnimationPayload, { type: '...' }>` to select specific members.
 */
export type AnimationPayload = z.infer<typeof animationPayload>;

/**
 * Zod schema for the 'flat' form of an animation object, after all `contents` have been unrolled and merged appropriately.
 */
const flatAnimation = z
	.object({
		id: ID,
		generic: z
			.discriminatedUnion('type', [
				z.object({ type: z.literal('slot') }).strict(),
				z
					.object({
						type: z.literal('add-on'),
						order: z
							.enum(['last'])
							.optional()
							.describe(
								'Determines where the generic animation is placed in the animation stack when it applies (default: `first`).',
							),
					})
					.strict(),
			])
			.optional()
			.describe(
				'An animation can be marked as \'generic\'. This means that it doesn\'t just describe one unique event, but rather a general occurrence that might occur in many contexts (such as Casting a Spell, or scoring a critical hit on a Strike).\nThere are two parts to generic animations.\n- First, on the receiving end, we have `type: "slot"` generics. This indicates that this animation is a vacant spot for that general occurrence; it does nothing on its own, but indicates a spot (!) for an `add-on` to fill.\n- Speaking of `add-on` generics, these are the \'templates\' that are actually applied. An `add-on` either fills a `slot` with a matching `id`, or it\'s simply prepended/appended the an animation set whenever it applies if `id` is undefined. You can control the position the `add-on` is placed using `order`.',
			),
		reference: rollOption
			.optional()
			.describe(
				'Copies another roll option\'s animation(s) wholesale into this animation\'s `contents` array. Note that this will likely overrule most properties you define.\nInfinite loops are unadvised.',
			),
		triggers: z
			.array(trigger)
			.min(1)
			.refine(...uniqueItems)
			.describe(
				'An array of strings, where each element is a trigger on which to consider playing the animation.',
			),
		overrides: z
			.array(rollOption)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe(
				'An array of strings, where each element is a roll option which PF2e Graphics should ignore when this animation plays. Partial roll options are permitted to override entire groups (e.g. the `item:base:rapier` animation overriding `item:group` to prevent a generic sword animation from being played).',
			),
		default: z
			.literal(true)
			.optional()
			.describe(
				'In the case when two animations can be played simultaneously, but only one should, the one with `default: true` is preferred. This can notably occur in when the `predicates` of two animations in `contents` are both true.',
			),
		predicates: z
			.array(predicate)
			.min(1)
			.refine(...uniqueItems)
			.optional()
			.describe(
				'An array of predicates as per the pf2e system. The animation will only be executed if the predicates apply.\nFor more information, see: https://github.com/foundryvtt/pf2e/wiki/Quickstart-guide-for-rule-elements#predicates',
			),
		execute: animationPayload.describe('The actual animation to be executed!'),
	})
	.strict()
	.describe(
		'The \'flat\' form of an animation object, after all `contents` have been unrolled and merged appropriately.',
	);

/**
 * The complete animation object, as is encoded in JSON.
 */
export type Animation = Partial<z.infer<typeof flatAnimation>> & {
	contents?: Animation[];
};

/**
 * Zod schema for the complete animation object, as is encoded in JSON.
 */
const animation: z.ZodType<Animation> = flatAnimation
	.partial()
	.extend({
		contents: z
			.lazy(() =>
				z
					.array(animation)
					.min(1)
					.refine(...uniqueItems),
			)
			.optional(),
	})
	.strict()
	.refine(...nonEmpty)
	.describe('The complete animation object, as is encoded in JSON.');

/**
 * Zod schema of a set of animations, as applied to a single roll option.
 */
export const animations = z
	.array(animation)
	.min(1)
	// .superRefine((arr, ctx) => superValidate(arr, ctx))
	.refine(...uniqueItems);

/**
 * Zod schema for the animations data object, which maps roll options to animation objects (or other roll options).
 */
export const animationsData = z
	.record(rollOption, rollOption.or(animations))
	.describe('The animations data object, which maps roll options to animation objects (or other roll options).');

/**
 * The animations data object, which maps roll options to animation objects (or other roll options).
 */
export type AnimationsData = z.infer<typeof animationsData>;
