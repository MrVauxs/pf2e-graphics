import { z } from 'zod';
import { attachTo, stretchTo } from '../helpers/structures';

/**
 * Zod schema for the options specific to a `template`-preset animation.
 */
export const templateOptions = z
	.object({
		attachTo: attachTo.optional(),
		stretchTo: stretchTo.optional(),
	})
	.strict()
	.describe('The options specific to a `template`-preset animation.');
