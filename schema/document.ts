import { z } from 'zod';
import { rollOption, slug } from './helpers/atoms';
import { animationSetsObjectValue } from './payload';

const animationSetDocumentBase = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	rollOption,
	animationSets: animationSetsObjectValue,
});

/**
 * Zod schema for a module-scoped animation-set document.
 */
export const moduleAnimationSetDocument = animationSetDocumentBase.omit({ id: true }).extend({
	source: z.literal('module'),
	module: slug,
});

/**
 * A module-scoped animation-set document.
 */
export type ModuleAnimationSetDocument = z.infer<typeof moduleAnimationSetDocument>;

/**
 * Zod schema for a world-scoped animation-set document.
 */
export const worldAnimationSetDocument = animationSetDocumentBase.extend({
	source: z.literal('world'),
});

/**
 * A world-scoped animation-set document.
 */
export type WorldAnimationSetDocument = z.infer<typeof worldAnimationSetDocument>;

/**
 * Zod schema for a user-scoped animation-set document.
 */
export const userAnimationSetDocument = animationSetDocumentBase.extend({
	source: z.literal('user'),
	user: z.string().min(1),
	id: z.string().min(1),
});

/**
 * A user-scoped animation-set document.
 */
export type UserAnimationSetDocument = z.infer<typeof userAnimationSetDocument>;

/**
 * Zod schema for an animation-set document.
 */
export const animationSetDocument = z.discriminatedUnion('source', [
	moduleAnimationSetDocument,
	worldAnimationSetDocument,
	userAnimationSetDocument,
]);

/**
 * An animation-set document.
 */
export type AnimationSetDocument = z.infer<typeof animationSetDocument>;
