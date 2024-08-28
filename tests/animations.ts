// To test and report on all files, use `npm run test:animations`.
// To check as quickly as possible whether any of the files are invalid, use `npm run test:animations -- fast`.
// To test one specific file with issues listed, use `npm run test:animations -- <path to file>` (e.g. `npm run test:animation -- animations/actions/aid.json`).

import * as fs from 'node:fs';
import * as core from '@actions/core';
import pico from 'picocolors';
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
		console.log(pico.green('No validation errors!'));
	} else {
		console.log(
			pico.red(
				`${pico.bold(result.error.issues.length)} validation error${result.error.issues.length === 1 ? '' : 's'}:`,
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
					message: `${pico.bold(result.error.issues.length)} schema issue${result.error.issues.length === 1 ? '' : 's'}.`,
				};
			},
			'default': false,
		},
		{ breakEarly: process.argv[2] === 'fast', ignoreGit: true },
	);

	const errors = results.filter(result => !result.success);
	if (!errors.length) {
		const message = pico.green('All animation files are valid!');
		if (process.env.GITHUB_ACTIONS) {
			core.info(message);
		} else {
			console.log(message);
		}
	} else {
		const columnWidth = Math.min(Math.max(...errors.map(error => error.file.length + 3)), 60);

		if (process.argv[2] === 'fast') {
			console.error(
				pico.red(
					`${pico.bold('Invalid animation file: ')}\n  • ${`${errors[0].file}${errors[0].message ? `${' '.repeat(Math.max(columnWidth - errors[0].file.length, 3))}${pico.dim(errors[0].message)}` : ''}`}`,
				),
			);
			console.warn(pico.yellow(pico.dim('Process terminated early; other invalid files may exist.')));
			process.exitCode = 1;
		} else {
			const message1 = pico.red(
				pico.bold(pico.underline(`Invalid animation file${errors.length === 1 ? '' : 's'}:`)),
			);
			if (process.env.GITHUB_ACTIONS) core.startGroup(message1);
			console.log(message1);
			errors.forEach((result) => {
				const message = `${result.file}${result.message ? `${' '.repeat(Math.max(columnWidth - result.file.length, 3))}${pico.dim(result.message)}` : ''}`;
				if (process.env.GITHUB_ACTIONS) return core.info(message);
				return console.log(message);
			});
			if (process.env.GITHUB_ACTIONS) core.endGroup();

			const message2 = pico.red(
				`${pico.bold(errors.length)} animation file${errors.length === 1 ? '' : 's'} of ${results.length} (${Math.round((1000 * errors.length) / results.length) / 10}\%) failed validation.`,
			);
			if (process.env.GITHUB_ACTIONS) {
				core.setFailed(message2);
			} else {
				console.error(message2);
				process.exitCode = 1;
			}
		}
	}
}
