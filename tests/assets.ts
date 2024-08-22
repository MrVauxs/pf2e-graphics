import * as fs from 'node:fs';
import * as path from 'node:path';
import * as core from '@actions/core';
import { database } from '../src/assets/soundDb.ts';
import { flatten } from './helpers.ts';

const flattened = flatten(database);
const existingEntries = Object.values(flattened)
	.map((x: string) => x.replace('modules/pf2e-graphics/', ''))
	.map((x: string) => core.toPosixPath(x));

const errors: string[] = [];

function checkOggFiles(directory: string): void {
	// Read the directory contents
	const files = fs.readdirSync(directory);

	// Loop through each file in the directory
	for (const file of files) {
		const fullPath = path.join(directory, file);

		// Check if the path is a directory, if so, recursively call this function
		if (fs.statSync(fullPath).isDirectory()) {
			checkOggFiles(fullPath);
		} else {
			const extension = path.extname(file).toLowerCase();
			// If it's a file, check if it has a .ogg extension
			if (extension === '.md' || extension === '.txt') continue;
			if (extension === '.ogg') {
				if (!existingEntries.includes(core.toPosixPath(fullPath)))
					errors.push(core.toPosixPath(fullPath));
			} else {
				core.warning(`An asset file with a not-allowed extension found!\n${fullPath}`);
			}
		}
	}
}

// Start the recursive check from the assets directory
checkOggFiles('./assets');

if (errors.length) {
	core.setFailed(' The following assets have not been added to the soundDb.ts!');
	// eslint-disable-next-line no-template-curly-in-string
	errors.map(e => e.replaceAll('assets/library', '${p}')).forEach(m => core.error(`\t\`${m}\``));
} else {
	core.info('All asset files are valid!');
}
