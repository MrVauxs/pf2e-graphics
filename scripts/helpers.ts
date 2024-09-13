import * as fs from 'node:fs';
import * as path from 'node:path';
import * as core from '@actions/core';
import type { ZodIssue } from 'zod-validation-error';

type LoggingLevels = 'info' | 'warning' | 'error';
type DetailsMessage =
	| string
	| {
		level: 'details';
		title: string;
		messages: DetailsMessage[];
	};

/**
 * Helper class to write unified logs to both local terminals and GitHub Actions.
 */
export class Log {
	/**
	 * Log a general message.
	 * @param message
	 */
	static info = (message: string = '') => {
		if (process.env.GITHUB_ACTIONS) return core.info(message);
		return console.log(message);
	};

	/**
	 * Log a warning.
	 * @param message
	 */
	static warning = (message: string = '') => {
		if (process.env.GITHUB_ACTIONS) return core.warning(message);
		return console.warn(message);
	};

	/**
	 * Log an error and set the exit code to 1.
	 * @param message
	 */
	static error = (message: string = '') => {
		process.exitCode = 1;
		if (process.env.GITHUB_ACTIONS) return core.error(message);
		return console.error(message);
	};

	/**
	 * Log a block of information. In GitHub Actions' logs, this block is automatically collapsed into the `title`.
	 * @param data
	 * @param data.level The message type to log at (default = "info").
	 * @param data.title A short header for the section (default = "Details").
	 * @param data.messages The list of messages.
	 */
	static details = (data: { level?: LoggingLevels; title?: string; messages: DetailsMessage[] }) => {
		data.level = data.level ?? 'info';
		data.title = data.title ?? 'Details';

		if (process.env.GITHUB_ACTIONS) {
			core.startGroup(data.title);
			for (const message of data.messages) {
				this.detailsMessage(message, data.level);
			}
			core.endGroup();
		} else {
			console.group(data.title);
			for (const message of data.messages) {
				this.detailsMessage(message, data.level);
			}
			console.groupEnd();
		}
	};

	protected static detailsMessage = (message: DetailsMessage, level: LoggingLevels = 'info'): void => {
		if (typeof message === 'string') return Log[level](message);
		return this.details({
			level,
			title: message.title ?? 'Details',
			messages: message.messages,
		});
	};

	/**
	 * Prints new lines to the log.
	 * @param count The number of new lines to print (default = 1).
	 */
	static newLine = (count: number = 1): void => {
		Log.info('\n'.repeat(count - 1));
	};
}

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
 * A data-valiation wrapper around `JSON.parse()` for when data is ingested from external sources.
 * @param input The input string.
 * @returns An object with a `success` property indicating the success state. If `input` was parsed successfully, it is included in the `json` property.
 */
export function safeJSONParse(input: string): { success: true; data: JSONValue } | { success: false } {
	try {
		return {
			success: true,
			data: JSON.parse(input),
		};
	} catch {
		return { success: false };
	}
}

/**
 * Gets a list of files by walking through the file-tree, starting from a particular path.
 * @param targetPath The initial path.
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

export interface fileValidationResult {
	file: string;
	success: boolean;
	message?: string;
	issues?: ZodIssue[];
}

/**
 * Walks through the file-tree, starting from a particular path, applying a test to each file.
 * @param targetPath The initial path. If the path is a directory, all files and subdirectories will be tested. If the path is a file, only that file will be tested.
 * @param tests An object mapping extensions (e.g. ".png", with the leading ".") to either a boolean or a test function. The behaviour for extensions without an explicit property is defined by the "default" property.
 * @param options
 * @param options.ignoreGit Ignores Git files, such as ".gitignore", ".gitkeep", etc. Requires `tests[""]` to be undefined.
 * @returns An array of objects. The objects have a `file` property with the filepath, a `success` property with the success state, and optionally a `message` returned by the test function.
 */
export function testFilesRecursively(
	targetPath: string,
	tests: {
		[key: string]: boolean | ((filepath: string) => Omit<fileValidationResult, 'file'>);
	},
	options?: { ignoreGit?: boolean },
): fileValidationResult[] {
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

	const results: fileValidationResult[] = [];
	for (const file of getFilesRecursively(targetPath)) {
		const extension = path.extname(file);
		const test = tests[extension] ?? tests.default;
		if (typeof test === 'boolean') {
			results.push({
				file,
				success: test,
				message: test ? undefined : `Extension ${extension} is not allowed.`,
			});
		} else {
			results.push({
				file,
				...test(file),
			});
		}
	}
	return results;
}

/**
 * Reasonably accurately pluralises words.
 *
 * @param word The word to possibly pluralise.
 * @param count Triggers pluralisation when not equal to 1.
 * @returns The word pluralised or not accordingly.
 */
export function pluralise(word: string, count: number): string {
	if (count === 1) return word;
	if (word.endsWith('s')) return `${word}es`;
	// if (word.endsWith('y')) return `${word.slice(0, -1)}ies`;
	return `${word}s`;
}
