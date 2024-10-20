import { z } from 'zod';
import { attachTo, rotateTowards } from '../helpers/structures';

/**
 * Zod schema for the options specific to a `melee`-preset animation.
 */
export const meleeOptions = z
	.object({
		attachTo: attachTo.optional(),
		rotateTowards: rotateTowards.optional(),
	})
	.strict()
	.describe('The options specific to a `melee`-preset animation.');
