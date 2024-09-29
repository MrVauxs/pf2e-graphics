import { z } from 'zod';
import { atLocation, attachTo, rotateTowards } from '../helpers/structures';

export const onTokenOptions = z
	.object({
		rotateTowards: z.literal(true).or(rotateTowards).optional(),
		atLocation: z.literal(true).or(atLocation).optional(),
		attachTo: attachTo.optional(),
		location: z.enum(['target', 'source', 'both']).optional(),
	})
	.strict();
