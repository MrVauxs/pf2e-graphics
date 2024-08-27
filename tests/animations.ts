// To test and report on all files, use `npm run test:animations`.
// To check as quickly as possible whether any of the files are invalid, use `npm run test:animations -- fast`.
// To test one specific file with issues listed, use `npm run test:animations -- <path to file>` (e.g. `npm run test:animation -- animations/actions/aid.json`).

import * as fs from 'node:fs';
import * as core from '@actions/core';
import chalk from 'chalk';
import { fromZodIssue } from 'zod-validation-error';
import { validateAnimationJSON } from '../src/storage/animationsSchema';
import { testFilesRecursively } from './helpers.ts';

const targetPath = process.argv[2] && process.argv[2] !== 'fast' ? process.argv[2] : 'animations/';

/* eslint-disable no-console */
if (targetPath.endsWith('.json')) {
	if (!fs.existsSync(targetPath)) throw new Error(`No such file exists at ${targetPath}`);
	const json = JSON.parse(fs.readFileSync(targetPath, { encoding: 'utf8' }));
	const result = validateAnimationJSON(json);
	if (result.success) {
		console.log(chalk.green('No validation errors!'));
	} else {
		console.log(
			chalk.red(
				`${chalk.bold(result.error.issues.length)} validation error${result.error.issues.length === 1 ? '' : 's'}:`,
			),
		);
		result.error.issues.forEach((issue) => {
			const formattedIssue = fromZodIssue(issue);
			console.log(`  • ${formattedIssue.details[0].path.join('.')} :  ${formattedIssue.details[0].message}`);
		});
		process.exitCode = 1;
	}
} else {
	const results = testFilesRecursively(
		targetPath,
		{
			'.json': (path) => {
				if (path.match(/^[a-z0-9]+(-[a-z0-9]+)*$/))
					return { success: false, message: 'Invalid filename.' };
				const json = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
				const result = validateAnimationJSON(json);
				if (result.success) return { success: true };
				return {
					success: false,
					message: `${chalk.bold(result.error.issues.length)} schema issue${result.error.issues.length === 1 ? '' : 's'}.`,
				};
			},
			'default': false,
		},
		{ breakEarly: process.argv[2] === 'fast', ignoreGit: true },
	);

	const errors = results.filter(result => !result.success);
	if (!errors.length) {
		core.info(chalk.green('All animation files are valid!'));
	} else {
		const columnWidth = Math.min(Math.max(...errors.map(error => error.file.length + 3)), 60);

		if (process.argv[2] === 'fast') {
			console.error(
				chalk.red(
					`${chalk.bold('Invalid animation file: ')}\n  • ${`${errors[0].file}${errors[0].message ? `${' '.repeat(Math.max(columnWidth - errors[0].file.length, 3))}${chalk.dim(errors[0].message)}` : ''}`}`,
				),
			);
			console.warn(chalk.yellow.dim('Process terminated early; other invalid files may exist.'));
			process.exitCode = 1;
		} else {
			core.startGroup(chalk.red.bold.underline(`Invalid animation file${errors.length === 1 ? '' : 's'}:`));
			errors.forEach(result =>
				core.info(
					`${result.file}${result.message ? `${' '.repeat(Math.max(columnWidth - result.file.length, 3))}${chalk.dim(result.message)}` : ''}`,
				),
			);
			core.endGroup();
			core.setFailed(
				chalk.red(
					`${chalk.bold(errors.length)} animation file${errors.length === 1 ? '' : 's'} of ${results.length} (${Math.round((1000 * errors.length) / results.length) / 10}\%) failed validation.`,
				),
			);
		}
	}
}
