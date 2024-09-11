// To test and report on all files, use `npm run test:animations`.
// To validate one specific file with issues listed, use `npm run test:animations -- <path to file>` (e.g. `npm run test:animation -- animations/actions/aid.json`).

import * as fs from 'node:fs';
import p from 'picocolors';
import { testAndMergeAnimations } from 'scripts/testAndMergeAnimations.ts';
import { fromZodIssue } from 'zod-validation-error';
import { validateAnimationData } from '../../src/storage/animationsSchema.ts';
import { findLineNumber, Log, pluralise } from '../helpers.ts';

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
			title: p.red(`${p.bold(issues.length)} validation ${pluralise('error', issues.length)}:`),
			messages: issues.map((issue) => {
				const formatted = fromZodIssue(issue);
				return `${formatted.details[0].path.join('.')} :  ${formatted.details[0].message}`;
			}),
		});
	}
} else {
	const result = testAndMergeAnimations('./animations');

	if (result.success) {
		Log.info(p.green('All animation files are valid!'));
	} else {
		const issues = result.issues;
		const columnWidth = Math.min(Math.max(...issues.map(error => error.file.length + 5)), 58);

		Log.details({
			level: 'error',
			title: p.red(p.bold(p.underline(`Invalid animation ${pluralise('file', issues.length)}:`))),
			messages: issues.map(
				(result) => {
					const messageData = { file: result.file, line: 0, message: '' };
					const stringArray = [result.file];

					if (result.message) {
						stringArray.push(`${' '.repeat(Math.max(columnWidth - result.file.length, 3))}${p.inverse(result.message)}`);
					}

					if (result.issues) {
						const formattedIssues = result.issues.map((issue) => {
							const formatted = fromZodIssue(issue);

							return {
								line: findLineNumber(result.file, formatted.details[0].path.join('.')), // Grabs the lines
								message: `${p.yellow(formatted.details[0].path.join('.'))} - ${formatted.details[0].message}`,
							};
						});

						stringArray.push('\n\t');
						stringArray.push(formattedIssues.map(x => x.message).join('\n\t')); // Now just to log it properly
					}

					messageData.message = stringArray.join('');
					return messageData;
				},
			),
		});

		Log.newLine();
		Log.error(
			p.red(
				`${p.bold(issues.length)} animation ${pluralise('file', issues.length)} failed validation.`,
			),
		);
		Log.newLine();
		Log.info(
			p.dim(
				`For specific validation issues, try: ${p.bold(`npm run test:animations -- ${issues[Math.floor(Math.random() * issues.length)].file}`)}`,
			),
		);
	}
}
