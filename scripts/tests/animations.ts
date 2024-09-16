// To test and report on all files, use `npm run test:animations`.
// To validate some specific files or directories, use `npm run test:animations -- <...paths> (e.g. `npm run test:animations -- animations/actions/aid.json animations/conditions`).

import p from 'picocolors';
import { testAndMergeAnimations } from 'scripts/testAndMergeAnimations.ts';
import { fromZodIssue } from 'zod-validation-error';
import { Log, pluralise } from '../helpers.ts';

const testPaths = process.argv.slice(2).length ? [...new Set(process.argv.slice(2))] : ['animations/'];

const badFiles = testPaths
	.map(path => testAndMergeAnimations(path))
	.filter(result => !result.success)
	.map(result => result.issues)
	.flat();

if (!badFiles.length) {
	Log.info(p.green('All animation files are valid!'));
} else {
	function padToColumn(leftString: string, rightString: string): string {
		const MIN_COLUMN_WIDTH = 55;
		const MIN_COLUMN_SEPARATION = 3;

		const columnSeparation = Math.max(MIN_COLUMN_WIDTH - leftString.length, MIN_COLUMN_SEPARATION);

		return `${leftString}${' '.repeat(columnSeparation)}${rightString}`;
	}

	Log.details({
		level: 'error',
		title: p.red(p.bold(p.underline(`Invalid animation ${pluralise('file', badFiles.length)}:`))),
		messages: badFiles.map((badFile) => {
			if (badFile.issues) {
				return {
					level: 'details',
					title: p.red(padToColumn(badFile.file, p.dim(badFile.message ?? ''))),
					messages: badFile.issues.map((issue) => {
						const formatted = fromZodIssue(issue).details[0];
						const annotation = {
							title: p.bgCyanBright(formatted.message),
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
}
