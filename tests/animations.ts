// To test and report on all files, use `npm run test:animations`.
// To check as quickly as possible whether any of the files are invalid, use `npm run test:animations -- fast`.
// To validate one specific file with issues listed, use `npm run test:animations -- <path to file>` (e.g. `npm run test:animation -- animations/actions/aid.json`).

import * as fs from 'node:fs';
import p from 'picocolors';
import { fromZodIssue } from 'zod-validation-error';
import { type AnimationObject, validateAnimationData } from '../src/storage/animationsSchema';
import { Log, safeJSONParse, testFilesRecursively } from '../scripts/helpers.ts';

const targetPath = process.argv[2] && process.argv[2] !== 'fast' ? process.argv[2] : 'animations/';

if (targetPath.endsWith('.json')) {
	if (!fs.existsSync(targetPath)) throw new Error(`No such file exists at ${targetPath}`);
	const json = JSON.parse(fs.readFileSync(targetPath, { encoding: 'utf8' }));
	const result = validateAnimationData(json);
	if (result.success) {
		Log.info(p.green('No validation errors!'));
	} else {
		const issues = result.error.issues;
		Log.details({
			level: 'error',
			title: p.red(`${p.bold(issues.length)} validation error${issues.length === 1 ? '' : 's'}:`),
			messages: issues.map((issue) => {
				const formatted = fromZodIssue(issue);
				return `${formatted.details[0].path.join('.')} :  ${formatted.details[0].message}`;
			}),
		});
	}
} else {
	class ReferenceTracker {
		confirmed: Set<string>;
		pending: { [s: string]: string[] };
		constructor() {
			this.confirmed = new Set();
			this.pending = {};
		}

		private addPending(rollOption: string, file: string): void {
			if (this.pending[rollOption]) {
				this.pending[rollOption].push(file);
			} else {
				this.pending[rollOption] = [file];
			}
		}

		populate(file: string, key: string, value: string | AnimationObject[]): void {
			this.confirmed.add(key);
			if (typeof value === 'string') {
				this.addPending(value, file);
			} else {
				for (const obj of value) {
					if (obj.reference) this.addPending(obj.reference, file);
					for (const override of obj.overrides ?? []) {
						this.addPending(override, file);
					}
				}
			}
		}
	}
	const referenceTracker = new ReferenceTracker();

	const results = testFilesRecursively(
		targetPath,
		{
			'.json': (path) => {
				// Test filename
				if (path.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
					return { success: false, message: 'Invalid filename.' };

				const file = safeJSONParse(fs.readFileSync(path, { encoding: 'utf8' }));
				if (!file.success) return { success: false, message: 'Invalid JSON syntax.' };

				// Test schema
				const schemaResult = validateAnimationData(file.json);
				if (!schemaResult.success) {
					return {
						success: false,
						message: `${p.bold(schemaResult.error.issues.length)} schema issue${schemaResult.error.issues.length === 1 ? '' : 's'}.`,
					};
				}

				// Populate referenced rollOptions for validation afterwards
				// We know the type of `file.json` because otherwise the schema validation above would have returned early.
				Object.keys(file.json!).forEach(key =>
					referenceTracker.populate(
						path,
						key,
						(file.json as { [key: string]: string | AnimationObject[] })[key],
					),
				);

				return { success: true };
			},
			'default': false,
		},
		{ breakEarly: process.argv[2] === 'fast', ignoreGit: true },
	);

	const errors = results.filter(result => !result.success);

	Object.keys(referenceTracker.pending).forEach((rollOption) => {
		if (!referenceTracker.confirmed.has(rollOption)) {
			referenceTracker.pending[rollOption].forEach(file =>
				errors.push({
					file,
					success: false,
					message: `Could not find referenced roll option: ${rollOption}`,
				}),
			);
		}
	});

	if (!errors.length) {
		Log.info(p.green('All animation files are valid!'));
	} else {
		const columnWidth = Math.min(Math.max(...errors.map(error => error.file.length + 3)), 58);

		Log.details({
			level: 'info',
			title: p.red(p.bold(p.underline(`Invalid animation file${errors.length === 1 ? '' : 's'}:`))),
			messages: errors.map(
				result =>
					`${result.file}${result.message ? `${' '.repeat(Math.max(columnWidth - result.file.length, 3))}${p.dim(result.message)}` : ''}`,
			),
		});

		if (process.argv[2] === 'fast') {
			Log.newLine();
			Log.warning(p.dim('Process terminated early; other invalid files may exist.'));
		} else {
			Log.newLine();
			Log.error(
				p.red(
					`${p.bold(errors.length)} animation file${errors.length === 1 ? '' : 's'} of ${results.length} (${Math.round((1000 * errors.length) / results.length) / 10}\%) failed validation.`,
				),
			);
		}
	}
}
