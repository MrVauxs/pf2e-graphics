import { z } from 'zod';

/**
 * An array of all triggers that PF2e Graphics recognises.
 */
export const triggerList = [
	'attack-roll',
	'damage-roll',
	'place-template',
	'action',
	'toggle',
	'effect',
	'self-effect',
	'start-turn',
	'end-turn',
	'damage-taken',
	'saving-throw',
	'check',
	'skill-check',
	'flat-check',
	'initiative',
	'perception-check',
	'counteract-check',
	'modifiers-matter',
] as const;

/**
 * Zod schema for a trigger that PF2e Graphics recognises.
 */
export const trigger = z.enum(triggerList).describe('A trigger that PF2e Graphics recognises.');

/**
 * A trigger that PF2e Graphics recognises.
 */
export type Trigger = z.infer<typeof trigger>;
