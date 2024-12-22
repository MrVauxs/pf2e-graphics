import { ZodError, type ZodIssue, ZodIssueCode } from 'zod';
import { rollOption } from '../helpers/atoms';
import { animationSets } from '../payload';
import { tokenImagesObject } from '../tokenImages';

/**
 * Validates general animation data.
 *
 * @remarks This function is a fair bit more complicated than a basic Zod validation, because the latter results in near-meaningless errors due to the schema being a multiply-nested union. For instance, if an object validation fails, Zod doesn't know whether you made a mistake writing the object, or if you failed to write a string. `validateAnimationData` instead first validates that `data` is an object literal, and then validates each property sequentially, applying a narrower schema depending on JB2APremium. All issues found are then concatenated together with reconstructed paths.
 *
 * @param data The data to validate as parsed JSON (not a bare string).
 * @returns An object with a boolean `success` property indicating whether the validation succeeded or not. If validation failed, the Zod error is included in the `error` property.
 */
export function validateAnimationData(data: unknown): { success: true } | { success: false; error: ZodError } {
	if (typeof data !== 'object' || Array.isArray(data) || data === null) {
		return {
			success: false,
			error: new ZodError([
				{
					code: ZodIssueCode.invalid_type,
					expected: 'object',
					received: data === Array.isArray(data) ? 'array' : data === 'null' ? 'null' : typeof data,
					path: [],
					message: 'JSON must represent an object.',
				},
			]),
		};
	}

	const issues: ZodIssue[] = [];

	for (const key in data) {
		// Test _tokenImages as special case
		if (key === '_tokenImages') {
			const result = tokenImagesObject.safeParse(data);
			if (!result.success) issues.push(...result.error.issues);
		} else {
			// Test key
			if (!rollOption.safeParse(key).success) {
				issues.push({
					code: ZodIssueCode.invalid_string,
					path: [key],
					validation: 'regex',
					message: 'Must be a valid roll option.',
				});
			}

			// Test value
			const value = (data as { [key: string]: unknown })[key];
			if (typeof value === 'string') {
				const result = rollOption.safeParse(value);
				if (!result.success)
					issues.push(...result.error.issues.map(issue => ({ ...issue, path: [key, ...issue.path] })));
			} else {
				const result = animationSets.safeParse(value);
				if (!result.success) {
					issues.push(...result.error.issues.map(issue => ({ ...issue, path: [key, ...issue.path] })));
				}
			}
		}
	}

	if (issues.length) {
		return {
			success: false,
			error: new ZodError(issues),
		};
	}

	return {
		success: true,
	};
}
