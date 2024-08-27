import * as fs from 'node:fs';
import * as path from 'node:path';

type Flatten<T extends object> = {
	[K in keyof T]: T[K] extends object
		? T[K] extends Array<any>
			? T[K]
			: Flatten<T[K]> extends infer F
				? { [P in keyof F as `${Extract<K, string>}.${Extract<P, string>}`]: F[P] }
				: never
		: T[K];
}[keyof T];

export function flatten<T extends object>(obj: T, parentKey: string = ''): Flatten<T> {
	let result = {} as any;

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newKey = parentKey ? `${parentKey}.${key}` : key;
			const value = obj[key];

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				result = { ...result, ...flatten(value, newKey) };
			} else {
				result[newKey] = value;
			}
		}
	}

	return result;
}

/**
 * Gets a list of files by walking through the file-tree, starting from a particular path.
 *
 * @param targetPath - The initial path.
 * @returns An array of file paths.
 */
export function getFilesRecursively(targetPath: string): string[] {
	let fileList: string[] = [];
	try {
		fs.readdirSync(targetPath).forEach((file) => {
			const filePath = path.join(targetPath, file);
			if (fs.statSync(filePath).isDirectory()) {
				fileList = fileList.concat(getFilesRecursively(filePath));
			} else {
				fileList.push(filePath);
			}
		});
		return fileList;
	} catch (e) {
		if (fs.existsSync(targetPath)) return [targetPath];
		throw e;
	}
}
/**
 * Walks through the file-tree, starting from a particular path, applying a test to each file.
 *
 * @param targetPath - The initial path. If the path is a directory, all files and subdirectories will be tested. If the path is a file, only that file will be tested.
 * @param tests - An object mapping extensions (e.g. ".png", with the leading ".") to either a boolean or a test function. The behaviour for extensions without an explicit property is defined by the "default" property.
 * @param options
 * @param options.breakEarly - Stops testing upon the first error, returning all tested files up to and including it.
 * @param options.ignoreGit - Ignores Git files, such as ".gitignore", ".gitkeep", etc. Requires `tests[""]` to be undefined.
 * @returns An array of objects. The objects have a `file` property with the filepath, a `success` property with the success state, and optionally an `error` returned by the test function.
 */
export function testFilesRecursively(
	targetPath: string,
	tests: {
		[key: string]: boolean | ((filepath: string) => { success: boolean; message?: string });
	},
	options?: { breakEarly?: boolean; ignoreGit?: boolean },
): { file: string; success: boolean; message?: string }[] {
	tests.default = tests.default ?? false;

	options = options ?? {};
	if (options.ignoreGit && tests[''] === undefined) {
		tests[''] = (filepath) => {
			const GIT_FILES = ['.gitignore', '.gitattributes', '.mailmap', '.gitmodules', '.gitkeep', '.keep'];
			return {
				success: GIT_FILES.includes(path.basename(filepath)),
			};
		};
	}

	const results = [];
	for (const file of getFilesRecursively(targetPath)) {
		const extension = path.extname(file);
		const test = tests[extension] ?? tests.default;
		if (typeof test === 'boolean') {
			results.push({
				file,
				success: test,
				message: test ? undefined : `Extension ${extension} is not allowed.`,
			});
			if (options.breakEarly && !test) return results;
		} else {
			const result = test(file);
			results.push({
				file,
				...result,
			});
			if (options.breakEarly && !result.success) return results;
		}
	}
	return results;
}
