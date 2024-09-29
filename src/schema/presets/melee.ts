import { z } from 'zod';
import { attachTo, rotateTowards } from '../helpers/structures';

export const meleeOptions = z
	.object({
		attachTo: attachTo.optional(),
		rotateTowards: rotateTowards.optional(),
	})
	.strict();
