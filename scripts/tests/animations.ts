// To test and report on all files, use `npm run test:animations`.
// To validate some specific files or directories, use `npm run test:animations -- <...paths> (e.g. `npm run test:animations -- animations/actions/aid.json animations/conditions`).

import * as fs from 'node:fs';
import { parse } from 'json-source-map';
import p from 'picocolors';
import { testAndMergeAnimations } from 'scripts/testAndMergeAnimations.ts';
import { fromZodIssue, type ZodIssue } from 'zod-validation-error';
import { type DetailsMessage, Log, pluralise } from '../helpers.ts';

const testPaths = process.argv.length > 2 ? [...new Set(process.argv.slice(2))] : ['animations/'];

const badFiles = testPaths
	.map(path => testAndMergeAnimations(path))
	.filter(result => !result.success)
	.map(result => result.issues)
	.flat();

if (!badFiles.length) {
	Log.info(p.green('All animation files are valid!'));
} else {
	const zodIssueToDetailsMessage = (file: string, issue: ZodIssue): DetailsMessage => {
		const formatted = fromZodIssue(issue).details[0];
		const message = Log.padToColumn(formatted.path.join('.'), p.dim(formatted.message));

		if (!process.env.GITHUB_ACTIONS) return message;

		const JSONMap = parse(fs.readFileSync(file, { encoding: 'utf8' }));
		const key = JSONMap.pointers[`/${issue.path.join('/')}`];
		console.log({
			title: formatted.message,
			file,
			startLine: key.value.line + 1,
			endLine: key.valueEnd.line + 1,
			startColumn: key.value.pos + 1,
			endColumn: key.valueEnd.pos + 1,
		});
		return {
			message,
			annotation: {
				title: formatted.message,
				file,
				startLine: key.value.line + 1,
				endLine: key.valueEnd.line + 1,
				startColumn: key.value.pos + 1,
				endColumn: key.valueEnd.pos + 1,
			},
		};
	};

	Log.details({
		level: 'error',
		title: p.red(p.bold(p.underline(`Invalid animation ${pluralise('file', badFiles.length)}:`))),
		messages: badFiles.map((badFile) => {
			if (badFile.issues) {
				return {
					level: 'details',
					title: p.red(Log.padToColumn(badFile.file, p.dim(badFile.message ?? ''))),
					messages: badFile.issues.map(issue => zodIssueToDetailsMessage(badFile.file, issue)),
				};
			}

			const message = badFile.message ?? 'Unknown error';
			return {
				message: p.red(Log.padToColumn(badFile.file, p.dim(message))),
				annotation: {
					file: badFile.file,
					title: message,
				},
			};
		}),
	});

	Log.newLine();
	Log.error(
		p.red(`${p.bold(badFiles.length)} animation ${pluralise('file', badFiles.length)} failed validation.`),
	);
}
