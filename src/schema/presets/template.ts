import { z } from 'zod';
import { attachTo, stretchTo } from '../helpers/structures';

export const templateOptions = z
	.object({
		attachTo: attachTo.optional(),
		stretchTo: stretchTo.optional(),
	})
	.strict();
