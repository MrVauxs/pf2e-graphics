/**
 * Zod refinement to ensure a numeric value isn't zero.
 */
export const nonZero: [(num: number) => boolean, string] = [
	num => num !== 0,
	'Number cannot be 0. If you want the value to be 0, simply leave the property undefined.',
];

/**
 * Zod refinement to ensure an object has at least one property.
 */
export const nonEmpty: [(obj: object) => boolean, string] = [
	(obj) => {
		// eslint-disable-next-line no-unreachable-loop
		for (const _key in obj) return true; // This is simply most performant ¯\_(ツ)_/¯
		return false;
	},
	'Object must not be empty.',
];

/**
 * Zod refinement to ensure an array has no duplicate elements (not perfect, but good enough).
 */
export const uniqueItems: [(arr: any[]) => boolean, string] = [
	arr => new Set(arr.map(e => JSON.stringify(e))).size === arr.length,
	'Items must be unique.',
];
