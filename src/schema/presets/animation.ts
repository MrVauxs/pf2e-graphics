import { z } from 'zod';
import { effectOptions } from '.';
import { angle, hexColour, ID } from '../helpers/atoms';
import { nonEmpty } from '../helpers/refinements';
import { easingOptions, vector2 } from '../helpers/structures';

/**
 * Zod schema for the shared properties in a `position` object.
 */
const positionBaseObject = z.object({
	target: vector2
		.or(z.enum(['SOURCES', 'TARGETS', 'TEMPLATES']))
		.or(ID)
		.describe(
			'Where the token should be placed. You can provide either an object with `x` and `y` coordinates, a string representing a stored name (e.g. of a crosshair), or the literal value `"SOURCES"`, `"TARGETS"`, or `"TEMPLATES"` to select that respective placeable (if one exists).',
		),
	offset: vector2.optional().describe('Offsets the token\'s position from the `target`.'),
	placeCorner: z
		.literal(true)
		.optional()
		.describe(
			'By default, the token is moved so that its centre coincides with the `target` (plus snapping—see `noSnap`). You can use this to instead place the token\'s top-left corner on the `target`.',
		),
	noCollision: z
		.literal(true)
		.optional()
		.describe(
			'If the `target` is a placeable, this causes the token to be placed in the nearest non-intersecting space. Useful to avoid telefragging!',
		),
	noSnap: z
		.literal(true)
		.optional()
		.describe(
			'By default, the token\'s final position is snapped to the nearest grid space. You can use this to disable that.',
		),
});

/**
 * Zod schema for the value of `rotation.spin`.
 */
const spinOptions = easingOptions
	.extend({
		initialAngle: angle
			.optional()
			.describe(
				'The angle the token should face at the start of the animation (default: as the token was).',
			),
		duration: z.number().positive().describe('How long the transition should take, in milliseconds.'),
	})
	.describe('Causes the token to spin towards the `finalAngle`.');

/**
 * Zod schema for the options specific to a `animation`-preset animation.
 */
export const animationOptions = effectOptions
	.pick({
		repeats: true,
		waitUntilFinished: true,
		probability: true,
		delay: true,
		fadeIn: true,
		fadeOut: true,
	})
	.extend({
		subjects: z // TODO: superrefine `target` against `position.target` and `rotation.target` (no moving tokens nowhere or rotating them towards themselves!)
			.array(z.enum(['SOURCES', 'TARGETS']))
			.describe(
				'Which tokens does the animation act upon? You can choose either the effect\'s `"SOURCES"` or `"TARGETS"` (if they exist).',
			),
		position: z
			.discriminatedUnion('type', [
				positionBaseObject
					.extend({
						type: z.literal('MOVE'),
						duration: z
							.number()
							.positive()
							.optional()
							.describe('How long the movement should take, in milliseconds.'),
						speed: z
							.number()
							.positive()
							.refine(num => num !== 23, '23 is the default value and doesn\'t need to be set.')
							.optional()
							.describe(
								'How fast the token should move (default: 23, default Foundry token-movement speed).',
							),
					})
					.merge(easingOptions)
					.strict(),
				positionBaseObject
					.extend({
						type: z.literal('TELEPORT'),
					})
					.strict(),
			])
			.refine(...nonEmpty)
			.refine(
				obj =>
					!obj.noCollision
					|| obj.target === 'SOURCES'
					|| obj.target === 'TARGETS'
					|| obj.target === 'TEMPLATES',
				'You can only use `noCollision` when the `target` is a placeable with a size (e.g. `"SOURCES"`, `"TARGETS"`, or `"TEMPLATES"`).',
			)
			.refine(
				obj => !obj.noCollision || !obj.noSnap,
				'`noSnap` is redundant when `noCollision` is enabled.',
			)
			.refine(
				obj => obj.type !== 'MOVE' || !obj.duration || !obj.speed,
				'`duration` cannot be used at the same time as `speed`.',
			)
			.optional()
			.describe(
				'Controls the token\'s position. You can cause the token to either `"MOVE"` or `"TELEPORT"` to its new position.',
			),
		rotation: z
			.discriminatedUnion('type', [
				z
					.object({
						type: z.enum(['ABSOLUTE', 'ADDITIVE']),
						angle: angle.describe(
							'The angle the token should face at the end of the animation, in degrees (°) clockwise from the vertical.',
						),
						spin: spinOptions.optional(),
					})
					.strict(),
				z
					.object({
						type: z.literal('DIRECTED'),
						target: vector2
							.or(z.enum(['SOURCES', 'TARGETS', 'TEMPLATES']))
							.or(ID)
							.describe(
								'The thing to rotate towards. You can provide either an object with `x` and `y` coordinates, a string representing a stored name (e.g. of a crosshair), or the literal value `"SOURCES"`, `"TARGETS"` or `"TEMPLATES"` to select that respective placeable (if one exists).',
							),
						rotationOffset: angle
							.optional()
							.describe(
								'A fixed rotation to apply after the token is oriented towards the target, in degrees (°).',
							),
						// TODO: fix bug in Sequencer preventing `.rotateTowards()` with `.rotate()`
						spin: spinOptions.omit({ initialAngle: true }).optional(),
					})
					.strict(),
			])
			.optional()
			.describe(
				'Controls the token\'s rotation. You can either define a rotation with respect to the canvas (`"type": "ABSOLUTE"`), a rotation added onto the token\'s current orientation (`"type": "ADDITIVE"`), or a rotation relative to a point or another placeable (`"type": "RELATIVE"`).',
			),
		visibility: z
			.object({
				opacity: z.number().gte(0).lte(1).optional().describe('An opacity scaler from 0 to 1.'),
				state: z
					.enum(['SHOW', 'HIDE'])
					.optional()
					.describe(
						'Controls Foundry\'s own visibility state: `"HIDE"` sets the token to be only visible to the GM, regardless of `opacity`; `"SHOW"` reverses this.',
					),
			})
			.strict()
			.optional()
			.describe('By default, the token\'s visibility is left unmodified, and serves as the final value for `fadeIn` and the initial value for `fadeOut`.'),
		tint: hexColour.describe('A hexadecimal colour-code to give the token a certain tint.').optional(),
	});
