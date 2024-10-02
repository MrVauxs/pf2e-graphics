import { z } from 'zod';
import { angle, filePath, ID } from '../helpers/atoms';
import { nonEmpty, nonZero } from '../helpers/refinements';
import { offset } from '../helpers/structures';

/**
 * Zod schema for the options specific to a `crosshair`-preset animation.
 */
export const crosshairOptions = z // TODO
	.object({
		name: ID.describe(
			'Identifies the crosshair\'s selected position so that it can be used elsewhere (for instance, in the `atLocation` property of another animation).',
		),
		label: z
			.object({
				text: z.string().min(1).describe('The text to display.'),
				dx: z
					.number()
					.refine(...nonZero)
					.optional()
					.describe('The text\'s offset along the x-axis, in pixels.'),
				dy: z
					.number()
					.refine(...nonZero)
					.optional()
					.describe('The text\'s offset along the y-axis, in pixels.'),
			})
			.optional()
			.describe(
				'You can set some text to attach to the crosshair while it\'s being positioned. This is a purely visual effect.',
			),
		icon: z
			.object({
				texture: filePath.optional().describe('The filepath to the icon\'s image.'),
				borderVisible: z.literal(true).optional().describe('Draws a border around the icon.'),
			})
			.strict()
			.refine(...nonEmpty)
			.optional()
			.describe('Sets a custom icon the crosshair.'),
		template: z
			.object({
				type: z
					.enum(['CIRCLE', 'CONE', 'RECTANGLE', 'RAY'])
					.describe('The shape of the crosshair\'s template.'),
				size: z
					.object({
						default: z.number().positive().describe('The initial size of the template.'),
						min: z
							.number()
							.positive()
							.optional()
							.describe('The minimum size of the template, if a range is permitted.'),
						max: z
							.number()
							.positive()
							.optional()
							.describe('The maximum size of the template, if a range is permitted.'),
					})
					.strict()
					.refine(obj => obj.max === obj.min, '`max` and `min` must be defined together.')
					.refine(obj => (obj.max ?? Infinity) > (obj.min ?? 0), '`max` must be greater than `min`.')
					.describe(
						'Sets the length for `RAY` and `RECTANGLE` templates, or the radius for `CIRCLE` and `CONE` templates.',
					),
				angle: z
					.number()
					.positive()
					.lt(360)
					.optional()
					.describe('Sets the angular width of `CONE` templates (default: 90°).'),
				direction: angle
					.optional()
					.describe(
						'Sets the initial orientation of `CONE` and `RAY` templates (default: 0°, rightwards).',
					),
				persist: z
					.literal(true)
					.optional()
					.describe('Causes the placed template to persist (that is, be actually placed on the scene).'),
			})
			.strict()
			.refine(obj => !obj.angle || obj.type === 'CONE', '`angle` can only be used when `type` is `CONE`.')
			.refine(
				obj => !obj.direction || obj.type === 'CONE' || obj.type === 'RAY',
				'`direction` can only be used when `type` is `CONE` or `RAY`.',
			)
			.optional()
			.describe('Configures a template to attach to the crosshair (default: ephemeral, 1 × 1 square).'),
		snap: z
			.object({
				position: z
					.array(
						z.enum([
							'BOTTOM_LEFT_CORNER',
							'BOTTOM_LEFT_VERTEX',
							'BOTTOM_RIGHT_CORNER',
							'BOTTOM_RIGHT_VERTEX',
							'BOTTOM_SIDE_MIDPOINT',
							'CENTER',
							'CORNER',
							'EDGE_MIDPOINT',
							'LEFT_SIDE_MIDPOINT',
							'RIGHT_SIDE_MIDPOINT',
							'SIDE_MIDPOINT',
							'TOP_LEFT_CORNER',
							'TOP_LEFT_VERTEX',
							'TOP_RIGHT_CORNER',
							'TOP_RIGHT_VERTEX',
							'TOP_SIDE_MIDPOINT',
							'VERTEX',
						]),
					)
					.refine(
						arr => arr.length !== 1 || arr[0] !== 'CENTER',
						'`["CENTER"]` is the default value and doesn\'t require definition.',
					)
					.optional()
					.describe(
						'Forces the crosshair to snap to specific points on the grid (default: `["CENTER"]`). Leave the array empty (`[]`) to disable grid-snapping.\nFor Pathfinder 2e effects, you\'ll probably want one or more of `CENTER`, `SIDE_MIDPOINT`, and `VERTEX` (for instance, cones are typically `["SIDE_MIDPOINT", "VERTEX"]`).',
					),
				direction: z
					.number()
					.int()
					.gte(2)
					.lte(8)
					.optional()
					.describe(
						'For a non-circular template crosshair, this forces the template\'s orientation to snap to specific angles. The number determines how many angles are allowed (for example, `4` would force snapping to up, down, left, and right only).',
					),
			})
			.refine(...nonEmpty)
			.optional(),
		lockDrag: z
			.literal(true)
			.optional()
			.describe('Prevents the crosshair\'s final position from being dragged.'),
		lockManualRotation: z
			.literal(true)
			.optional()
			.describe('Prevents the crosshair from being manually rotated.'),
		gridHighlight: z.literal(true).optional().describe('Highlights the grid.'),
		location: z
			.object({
				limitMinRange: z
					.number()
					.positive()
					.optional()
					.describe(
						'The minimum distance to the placeable, in grid units (typically feet), that the crosshair can be placed.',
					),
				limitMaxRange: z
					.number()
					.positive()
					.optional()
					.describe(
						'The maximum distance to the placeable, in grid units (typically feet), that the crosshair can be placed.',
					),
				showRange: z
					.literal(true)
					.optional()
					.describe('Displays the range between the placeable and the crosshair during placement.'),
				lockToEdge: z
					.literal(true)
					.optional()
					.describe(
						'Locks the crosshair to the edge of the placeable (useful for cones without a range, such as *cone of cold*).',
					),
				lockToEdgeDirection: z
					.literal(true)
					.optional()
					.describe(
						'Locks the crosshair to the edge of the placeable, and also forces an attached `CONE` or `RAY` template to be oriented away from that placeable.',
					),
				offset: offset
					.optional()
					.describe(
						'Allows you to offset the crosshair\'s recorded position from its placed location (values in pixels).',
					),
				wallBehavior: z.enum(['ANYWHERE', 'LINE_OF_SIGHT', 'NO_COLLIDABLES']).optional(),
			})
			.strict()
			.refine(...nonEmpty)
			.refine(
				obj => (obj.limitMinRange ?? 0) <= (obj.limitMaxRange ?? Infinity),
				'`limitMinRange` must be smaller than `limitMaxRange`.',
			)
			.refine(
				obj => !obj.lockToEdge || !obj.lockToEdgeDirection,
				'`lockToEdge` is redundant given that `lockToEdgeDirection` is `true`.',
			)
			.refine(
				obj => !(obj.lockToEdge || obj.lockToEdgeDirection) || !(obj.limitMinRange || obj.limitMaxRange),
				'`limitMinRange` and `limitMaxRange` are incompatible with `lockToEdge` and `lockToEdgeDirection`.',
			)
			.refine(
				obj => !obj.showRange || obj.lockToEdge || obj.lockToEdgeDirection,
				'`showRange` is redundant if `lockToEdge` or `lockToEdgeDirection` is `true`.',
			)
			.optional()
			.describe(
				'Configures the permissible area in which the crosshair can be placed, with respect to an anchoring placeable (typically an actor\'s token).',
			),
	})
	.strict()
	// refinements are applied to `animationPayload` in `src/schema/animation.ts` due to a Zod limitation
	.describe('The options specific to a `crosshair`-preset animation.');
