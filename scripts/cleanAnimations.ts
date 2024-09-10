import fs from 'node:fs';
import path from 'node:path';
import p from 'picocolors';
import { getFilesRecursively, Log } from './helpers.ts';

const files = getFilesRecursively('animations').filter(filename => path.extname(filename) === '.json');

function cleanFiles(files: string[]): { cleaned: number; failed: string[] } {
	let cleaned = 0;
	const failed: Set<string> = new Set();

	files.forEach(async (filePath) => {
		try {
			const file = fs.readFileSync(filePath, { encoding: 'utf8' });
			const cleanFile = `${JSON.stringify(JSON.parse(file), undefined, '\t')}\n`;
			if (cleanFile !== file) {
				cleaned++;
				fs.writeFileSync(filePath, cleanFile, { encoding: 'utf8' });
			}
		} catch {
			failed.add(filePath);
		}
	});

	return {
		cleaned,
		failed: Array.from(failed),
	};
}

const summary = cleanFiles(files);

if (summary.cleaned) Log.info(p.green(`Cleaned ${p.bold(summary.cleaned)} file${summary.cleaned === 1 ? '' : 's'}.`));
if (summary.failed.length) {
	Log.details({
		level: 'warning',
		title: p.yellow(`Failed to clean ${p.bold(summary.failed.length)} file${summary.failed.length === 1 ? '' : 's'}.`),
		messages: summary.failed,
	});
}
if (!summary.cleaned && !summary.failed.length) Log.info(p.blue('No files needed cleaning.'));
