import { z } from 'zod';
import { filePath, sequencerDBEntry } from '../helpers/atoms';
import { nonEmpty } from '../helpers/refinements';

/**
 * Zod schema for the options specific to a `ranged`-preset animation.
 */
export const rangedOptions = z
	.object({
		bounce: z
			.object({
				file: sequencerDBEntry.or(filePath),
			})
			.strict()
			.refine(...nonEmpty)
			.optional(),
	});
