import { z } from 'zod';
import { easing, filePath, JSONValue, slug, UUID } from './helpers/atoms';
import { nonEmpty, uniqueItems } from './helpers/refinements';

/**
 * Zod schema for a token's image data.
 */
const tokenImageData = z
	.object({
		name: z.string().min(1),
		uuid: UUID,
		requires: z.string().min(1).optional(),
		rules: z
			.array(
				z
					.tuple([
						slug,
						filePath,
						z.number().positive(),
						filePath.optional(),
						z.number().positive().optional(),
					])
					.or(
						z
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
								value: filePath,
								scale: z.number().optional(),
								tint: z.string().optional(),
								alpha: z.number().optional(),
								animation: z
									.object({
										duration: z.number().positive().optional(),
										transition: z.string().min(1).optional(),
										easing: easing.optional(),
										name: z.string().min(1).optional(),
									})
									.strict()
									.refine(...nonEmpty),
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
											.refine(...nonEmpty)
											.optional(),
									})
									.strict()
									.refine(...nonEmpty)
									.optional(),
							})
							.strict(),
					),
			)
			.min(1)
			.refine(...uniqueItems)
			.optional(),
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
		.describe('An object containing the `_tokenImages` property of the merged animation JSON.'),
});

/**
 * The `_tokenImages` property of the merged animation JSON.
 */
export type TokenImages = z.infer<typeof tokenImages>;
