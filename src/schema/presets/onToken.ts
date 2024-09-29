import { z } from 'zod';
import { atLocation, attachTo, rotateTowards } from '../helpers/structures';

/**
 * Zod schema for the options specific to an `onToken`-preset animation.
 */
export const onTokenOptions = z
	.object({
		rotateTowards: z.literal(true).or(rotateTowards).optional(),
		atLocation: z.literal(true).or(atLocation).optional(),
		attachTo: attachTo.optional(),
		location: z.enum(['target', 'source', 'both']).optional(),
	})
	.strict()
	.describe('The options specific to an `onToken`-preset animation.');
;
