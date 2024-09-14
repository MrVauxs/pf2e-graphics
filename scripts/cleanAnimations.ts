import fs from 'node:fs';
import path from 'node:path';
import p from 'picocolors';
import { getFilesRecursively, Log, safeJSONParse } from './helpers.ts';

const files = getFilesRecursively('animations').filter(filename => path.extname(filename) === '.json');

function cleanFiles(files: string[]): { cleaned: number; failed: Set<string> } {
	let cleaned = 0;
	const failed: Set<string> = new Set();

	files.forEach(async (filePath) => {
		const file = safeJSONParse(fs.readFileSync(filePath, { encoding: 'utf8' }));
		if (file.success) {
			const cleanFile = `${JSON.stringify(file.data, undefined, '\t')}\n`;
			if (cleanFile !== file.data) {
				cleaned++;
				fs.writeFileSync(filePath, cleanFile, { encoding: 'utf8' });
			}
		} else {
			failed.add(filePath);
		}
	});

	return {
		cleaned,
		failed,
	};
}

const summary = cleanFiles(files);

if (summary.cleaned)
	Log.info(p.green(`Cleaned ${p.bold(summary.cleaned)} file${summary.cleaned === 1 ? '' : 's'}.`));
if (summary.failed.size) {
	Log.details({
		level: 'warning',
		title: p.yellow(
			`Failed to clean ${p.bold(summary.failed.size)} file${summary.failed.size === 1 ? '' : 's'}.`,
		),
		messages: Array.from(summary.failed),
	});
}
if (!summary.cleaned && !summary.failed.size) Log.info(p.blue('No files needed cleaning.'));
