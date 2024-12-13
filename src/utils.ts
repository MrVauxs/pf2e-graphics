/* eslint-disable no-prototype-builtins */

import { nonEmpty } from './schema/helpers/refinements';

/* eslint-disable no-console */
// TODO: (Fall Cleaning) Move to $lib
export class ErrorMsg extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PF2e Graphics error';

		ui.notifications.error(`PF2e Graphics | ${i18n(message) ?? message}`);
	}

	static send(message: string) {
		return new this(message);
	}
}

/**
 * Converts type `T[]` to `T`.
 */
export type ArrayElement<T extends readonly any[]> = T extends readonly (infer U)[] ? U : never;

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export let dev = import.meta.env.DEV;
Hooks.once('ready', () => {
	if (!dev) dev = game.settings.get('pf2e-graphics', 'dev') as boolean;
	window.pf2eGraphics.storeSettings.getReadableStore('dev')?.subscribe(x => (dev = x));
});

export function devLog(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c %cDEV%c]`, 'color: yellow', '', 'color: #20C20E;', '', ...args);
}

export function log(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c]`, 'color: yellow', '', ...args);
}

export function i18n(string: string, format?: any) {
	if (!string.includes('pf2e-graphics')) {
		const test = `pf2e-graphics.${string}`;
		if (game.i18n.format(test, format) !== test) string = `pf2e-graphics.${string}`;
	}
	return game.i18n.format(string, format);
}

/**
 * Returns `true` if the `val` is: `true`, a number, or a non-empty string, object, or array. Returns `false` otherwise (i.e. `null`, `undefined`, and empty strings, objects, or arrays).
 */
export function isTrueish<T>(val: T): val is NonNullable<T> {
	return (
		nonNullable(val)
		&& Boolean(val)
		&& (typeof val === 'object' ? nonEmpty[0](val) : true)
		&& (Array.isArray(val) ? val.length !== 0 : true)
	);
}

export function findTokenByActor(actor?: ActorPF2e | null) {
	return canvas.tokens.getDocuments().find(x => x.actor?.id === actor?.id);
}

export function dedupeStrings(array: string[]) {
	return Array.from(new Set(array));
}

export function getPlayerOwners(actor: ActorPF2e): UserPF2e[] {
	const assigned = game.users.contents.find(user => user.character?.id === actor.id);
	if (assigned) return [assigned];

	// If everyone owns it, nobody does.
	if (actor.ownership.default === 3) {
		return game.users.contents;
	}

	// Check the ownership IDs, check if there is a player owner, yes, ignore GMs, no, count only GMs.
	const owners = Object.keys(actor.ownership)
		.filter(x => x !== 'default')
		.filter(x =>
			actor.hasPlayerOwner
				? !game.users.get(x)?.hasRole('GAMEMASTER')
				: game.users.get(x)?.hasRole('GAMEMASTER'),
		)
		.map(x => game.users.get(x))
		.filter(nonNullable);

	if (owners.length) {
		return owners;
	} else {
		// If "nobody" owns it, whoever is the primaryUpdater (read: GM) does.
		// This should handle weirdos like { ownership: { default: 0 } }
		if (actor.primaryUpdater) {
			log('Could not determine owner, defaulting to primaryUpdater.');
			return [actor.primaryUpdater];
		} else {
			log('Could not determine owner nor found the primaryUpdater, defaulting to all GMs.');
			return game.users.filter(x => x.isGM);
		}
	}
}

export function camelToSpaces(string: string): string {
	return string.replace(/([A-Z])/g, ' $1');
}

export function clearEmpties(o: Record<string, any>) {
	for (const k in o) {
		if (!o[k] || typeof o[k] !== 'object') {
			continue; // If null or not an object, skip to the next iteration
		}

		// The property is an object
		clearEmpties(o[k]); // <-- Make a recursive call on the nested object
		if (Object.keys(o[k]).length === 0) {
			delete o[k]; // The object had no properties, so delete that property
		}
	}
	return o;
}

type Primitive = string | number | boolean | null | undefined;
type Mergeable = Primitive | MergeableObject | MergeableArray;
type MergeableArray = Mergeable[];
interface MergeableObject {
	[key: string]: Mergeable;
}

export function mergeObjectsConcatArrays<T extends MergeableObject, U extends MergeableObject>(
	obj1: T,
	obj2: U,
): T & U {
	const result: any = {};

	for (const key in obj1) {
		if (obj1.hasOwnProperty(key)) {
			if (obj2.hasOwnProperty(key)) {
				const value1 = obj1[key];
				const value2 = obj2[key];

				if (Array.isArray(value1) && Array.isArray(value2)) {
					result[key] = value1.concat(value2);
				} else if (
					typeof value1 === 'object'
					&& typeof value2 === 'object'
					&& value1 !== null
					&& value2 !== null
				) {
					result[key] = mergeObjectsConcatArrays(value1 as MergeableObject, value2 as MergeableObject);
				} else {
					result[key] = value2;
				}
			} else {
				result[key] = obj1[key];
			}
		}
	}

	for (const key in obj2) {
		if (obj2.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
			result[key] = obj2[key];
		}
	}

	return result as T & U;
}

export function kofiButton(buttons: any[]) {
	buttons.unshift({
		icon: 'fas fa-mug-hot ko-fi',
		class: 'hover:underline',
		label: `pf2e-graphics.support.${Sequencer.Helpers.random_int_between(1, 4)}`,
		onclick: () => {
			window.open('https://ko-fi.com/mrvauxs', '_blank');
		},
	});
	return buttons;
}

/**
 * Moves an array index from one position to another.
 * Mutates the original array and returns the modified version.
 *
 * @param arr
 * @param {number} old_index
 * @param new_index
 * @returns array
 */
export function arrayMove<T>(arr: T[], old_index: number, new_index: number): T[] {
	if (new_index >= arr.length) {
		throw new Error('You are trying to push to an index beyond the array\'s size!');
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr; // for testing
}
