import { z } from 'zod';
import { filePath, sequencerDBEntry } from '../helpers/atoms';
import { nonEmpty } from '../helpers/refinements';
import { atLocation, attachTo, stretchTo } from '../helpers/structures';

export const rangedOptions = z
	.object({
		attachTo: z.literal(true).or(attachTo).optional(),
		bounce: z
			.object({
				file: sequencerDBEntry.or(filePath),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
		templateAsOrigin: z.literal(true).optional(),
		atLocation: atLocation.optional(),
		stretchTo: stretchTo.optional(),
	})
	.strict();
