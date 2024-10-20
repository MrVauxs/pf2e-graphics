import { z } from 'zod';
import { easing, filePath, hexColour, JSONValue, slug, UUID } from './helpers/atoms';
import { nonEmpty, uniqueItems } from './helpers/refinements';

/**
 * Zod schema for the full token-image rule object.
 */
const tokenImageRule = z
	.object({
		key: JSONValue.optional(),
		label: JSONValue.optional(),
		slug: slug.optional(),
		predicate: JSONValue.optional(),
		priority: JSONValue.optional(),
		ignored: JSONValue.optional(),
		requiresInvestment: JSONValue.optional(),
		requiresEquipped: JSONValue.optional(),
		removeUponCreate: JSONValue.optional(),
		value: filePath.describe('An image or video path.'),
		scale: z.number().positive().optional().describe('An optional scale adjustment.'),
		tint: hexColour.optional().describe('An optional tint adjustment.'),
		alpha: z.number().gt(0).lt(1).optional().describe('An alpha adjustment.'),
		animation: z
			.object({
				duration: z.number().positive().optional(),
				transition: z.string().min(1).optional(),
				easing: easing.optional(),
				name: z.string().min(1).optional(),
			})
			.strict()
			.refine(...nonEmpty)
			.describe('Animation options for when the image is applied.'),
		ring: z
			.object({
				subject: z
					.object({
						texture: filePath,
						scale: z.number().optional(),
					})
					.strict()
					.refine(...nonEmpty),
				colors: z
					.object({
						background: z.string().optional(),
						ring: z.string().optional(),
					})
					.strict()
					.refine(...nonEmpty),
			})
			.strict()
			.refine(...nonEmpty),
	})
	.strict()
	.describe('The full token-image rule object.');

/**
 * The full token-image rule object.
 */
export type TokenImageRule = z.infer<typeof tokenImageRule>;

/**
 * Zod schema for a token's image data.
 */
const tokenImageData = z
	.object({
		name: z.string().min(1),
		uuid: UUID,
		requires: slug.describe('A Foundry module ID which provides the images.'),
		rules: z
			.array(
				z
					.tuple([slug, filePath, z.number().positive(), filePath, z.number().positive()])
					.or(tokenImageRule),
			)
			.min(1)
			.refine(...uniqueItems),
	})
	.strict()
	.describe('A token\'s image data.');

/**
 * A token's image data.
 */
export type TokenImageData = z.infer<typeof tokenImageData>;

/**
 * Zod schema for an object containing the `_tokenImages` property of the merged animation JSON.
 */
export const tokenImages = z.object({
	_tokenImages: z
		.array(tokenImageData)
		.min(1)
		.refine(...uniqueItems)
		.optional()
		.describe('An object containing the `_tokenImages` property of the merged animation JSON.'),
});

/**
 * The `_tokenImages` property of the merged animation JSON.
 */
export type TokenImages = z.infer<typeof tokenImages>;
