/* eslint-disable no-console */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { database } from '../src/assets/soundDb.ts';
import { flatten } from './helpers.ts';

const flattened = flatten(database);
const existingEntries = Object.values(flattened)
	.map((x: string) => x.replace('modules/pf2e-graphics/', ''))
	.map((x: string) => x.replaceAll('/', '\\'));

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
				if (!existingEntries.includes(fullPath))
					errors.push(fullPath);
			} else {
				console.warn(`An asset file with a not-allowed extension found!\n${fullPath}`);
			}
		}
	}
}

// Start the recursive check from the assets directory
checkOggFiles('./assets');

if (errors.length) {
	console.error(`The following assets have not been added to the soundDb.ts!\n${errors.join('\n')}`);
} else {
	console.log('All asset files are valid.');
}
