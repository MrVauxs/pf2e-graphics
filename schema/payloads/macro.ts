import { z } from 'zod';
import { UUID } from '../helpers/atoms';

/**
 * Zod schema for a `macro`-type payload.
 */
export const macroPayload = z
	.object({
		type: z.literal('macro'),
		document: UUID.describe('The UUID of the macro to be executed.'),
		everyoneExecutes: z
			.literal(true)
			.optional()
			.describe(
				'By default, only the triggering user executes the macro. If you\'d like every logged-in user to execute the macro, enable this option.',
			),
		options: z
			.object({})
			.optional()
			.describe(
				'An arbitrary object of options you can pass into the macro as an argument. The following properties are always available unless overwritten:\n- `sources`: an array of token objects that triggered the payload.\n- `targets`: an array of token objects targetted by the triggering `sources`.\n- `templates`: an array of template objects associated with the trigger.\n- `user`: the user ID (string) for the triggering user.\n- `item`: the item object containing the triggered roll option (if any).\n- `currentIndex`: in a set with multiple payloads, this is the number of the currently executing payload (starting from 0)',
			),
	})
	.strict();
