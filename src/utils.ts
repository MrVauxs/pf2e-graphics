/* eslint-disable no-prototype-builtins */

import type { ActorPF2e, UserPF2e } from 'foundry-pf2e';

/* eslint-disable no-console */

/**
 * A convenience `Error` class that emits formatted error messages both to console and Foundry's UI.
 *
 * TODO: (Fall Cleaning) Move to $lib
 */
export class ErrorMsg extends Error {
	constructor(message: string) {
		super(HTMLToMarkdown(message));
	}

	/**
	 * Creates a workflow-breaking `Error`, formats its data, and emits it to both the console and Foundry's UI.
	 * @param message The error message to be thrown. Accepts both localisation and literal strings.
	 * @param format Handlebars formatting object. For instance, `message: "Hello {name}!"` and `format: { name: "Monsieur Vauxs" }` returns a string of `"Hello Monsieur Vauxs!"`.
	 * @returns An `Error` object.
	 */
	static send(message: string, format?: Record<string, string>) {
		const i18nedMessage = `<b>PF2e Graphics</b> | ${i18n(message, format)}`;
		ui.notifications.error(i18nedMessage);
		return new this(i18nedMessage);
	}
}

/**
 * Converts a limited form of inline HTML formatting to markdown (e.g. `<b>` → `**`). Primarily used for outputting readable messages to the console while having them still look pretty for Foundry `ui.notifications` calls.
 * @param str The input HTML-formatted string.
 * @returns A string reformatted as markdown.
 */
export function HTMLToMarkdown(str: string): string {
	return str
		.replace(/<\/?(?:code|kbd|samp|var)>/gi, '`')
		.replace(/<\/?(?:i|em)>/gi, '_')
		.replace(/<\/?(?:b|strong)>/gi, '**')
		.replace(/<\/?(?:u|ins)>/gi, '__')
		.replace(/<\/?(?:s(?:trike)?|del)/gi, '~~');
}

/**
 * Converts type `T[]` to `T`.
 */
export type ArrayElement<T extends readonly any[]> = T extends readonly (infer U)[] ? U : never;

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export const dev = import.meta.env.DEV;

/** Fires `console.log()` with some extra formatting sugar if and only if `dev` mode is enabled. */
export function devLog(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c %cDEV%c]`, 'color: yellow', '', 'color: #20C20E;', '', ...args);
}

/** Fires `console.log()` with some formatting sugar if and only if `dev` mode is enabled. */
export function log(...args: any) {
	if (dev) console.log(`[%cPF2e Graphics%c]`, 'color: yellow', '', ...args);
}

/** Fires `ui.notifications.notify()` but with the module name prepended. */
export function notify(message: string) {
	ui.notifications.notify(`PF2e Graphics | ${i18n(message)}`);
}

/** Fires `ui.notifications.warn()` but with the module name prepended. */
export function warn(message: string) {
	ui.notifications.warn(`PF2e Graphics | ${i18n(message)}`);
}

export function i18n(code: string, format?: any) {
	if (code.startsWith('pf2e-graphics')) return game.i18n.format(code, format);

	if (game.i18n.format(code, format) !== code) return game.i18n.format(code, format);

	const test = `pf2e-graphics.${code}`;
	if (game.i18n.format(test, format) !== test) {
		console.warn(`[%cPF2e Graphics%c]`, 'color: yellow', '', 'Missing prefix on:', code);
		return game.i18n.format(test, format);
	}

	console.error(`[%cPF2e Graphics%c]`, 'color: yellow', '', 'Failed to run i18n on:', code);
	return code;
}

/**
 * Returns `true` if the the input object `obj` has at least one property.
 * @privateRemarks Duplicated from `schema/helpers/refinements.ts`.
 */
export function nonEmpty(obj: object): boolean {
	// eslint-disable-next-line no-unreachable-loop
	for (const _key in obj) return true; // This is simply most performant ¯\_(ツ)_/¯
	return false;
}

/**
 * Returns `true` if the `val` is: `true`, a number, or a non-empty string, object, or array. Returns `false` otherwise (i.e. `null`, `undefined`, and empty strings, objects, or arrays).
 */
export function isTrueish<T>(val: T): val is NonNullable<T> {
	return (
		nonNullable(val)
		&& Boolean(val)
		&& (typeof val === 'object' ? nonEmpty(val) : true)
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
		label: `pf2e-graphics.support.${Sequencer.Helpers.random_int_between(1, 6)}`,
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

export function deslugify(string: string) {
	return string
		.replaceAll(/-/g, ' ')
		.replaceAll(/:(\w)/g, ': $1')
		.split(' ')
		.map(x => x.charAt(0).toUpperCase() + x.slice(1))
		.join(' ');
}
