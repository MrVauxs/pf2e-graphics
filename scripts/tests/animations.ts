// To test and report on all files, use `npm run test:animations`.
// To validate one specific file/directory, use `npm run test:animations -- <path>` (e.g. `npm run test:animation -- animations/actions/aid.json`).

import * as fs from 'node:fs';
import p from 'picocolors';
import { testAndMergeAnimations } from 'scripts/testAndMergeAnimations.ts';
import { fromZodIssue } from 'zod-validation-error';
import { validateAnimationData } from '../../src/storage/animationsSchema.ts';
import { Log, pluralise } from '../helpers.ts';

const targetPath = process.argv[2] ?? 'animations/';

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
			title: p.red(`${p.bold(issues.length)} validation ${pluralise('error', issues.length)}:`),
			messages: issues.map((issue) => {
				const formatted = fromZodIssue(issue);
				return `${formatted.details[0].path.join('.')} :  ${formatted.details[0].message}`;
			}),
		});
	}
} else {
	const result = testAndMergeAnimations(targetPath);

	if (result.success) {
		Log.info(p.green('All animation files are valid!'));
	} else {
		const badFiles = result.issues;

		const padToColumn = (leftString: string, rightString: string): string => {
			const MIN_COLUMN_WIDTH = 55;
			const MIN_COLUMN_SEPARATION = 3;

			const columnSeparation = Math.max(MIN_COLUMN_WIDTH - leftString.length, MIN_COLUMN_SEPARATION);

			return `${leftString}${' '.repeat(columnSeparation)}${rightString}`;
		};

		Log.details({
			level: 'info',
			title: p.red(p.bold(p.underline(`Invalid animation ${pluralise('file', badFiles.length)}:`))),
			messages: badFiles.map((badFile) => {
				if (badFile.issues) {
					return {
						level: 'details',
						title: p.red(padToColumn(badFile.file, p.dim(badFile.message ?? ''))),
						messages: badFile.issues.map((issue) => {
							const formatted = fromZodIssue(issue).details[0];
							const annotation = {
								file: badFile.file,
							};
							return {
								message: padToColumn(formatted.path.join('.'), p.dim(formatted.message)),
								annotation,
							};
						}),
					};
				}

				return {
					message: p.red(padToColumn(badFile.file, p.dim(badFile.message ?? 'Unknown error'))),
					annotation: {
						file: badFile.file,
					},
				};
			}),
		});

		Log.newLine();
		Log.error(
			p.red(`${p.bold(badFiles.length)} animation ${pluralise('file', badFiles.length)} failed validation.`),
		);
		// Log.newLine();
		// Log.info(
		// 	p.dim(
		// 		`For specific validation issues, try: ${p.bold(`npm run test:animations -- ${badFiles[Math.floor(Math.random() * badFiles.length)].file}`)}`,
		// 	),
		// );
	}
}
