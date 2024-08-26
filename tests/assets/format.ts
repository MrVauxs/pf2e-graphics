import * as core from '@actions/core';
import { database } from '../../src/assets/soundDb.ts';

const errors: string[] = [];

interface db {
	[key: string]: db | string;
}

function check(object: db, lastKey: string) {
	for (const [key, entry] of Object.entries(object)) {
		if (typeof entry === 'string') continue;

		const keys = Object.keys(entry);

		if (keys.filter(Number).length !== keys.length && keys.filter(Number).length !== 0) {
			errors.push(keys.map(x => `${lastKey}.\x1B[31m${x}\x1B[0m`).join('\n\t'));
		}

		check(entry, `${lastKey}.${key}`);
	}
}

check(database, 'pf2e-graphics');

if (errors.length) {
	core.setFailed('The following database paths have are improperly formatted!');
	core.startGroup(' \x1B[33;40m==== Mixed words and numbers ====\x1B[0m ');
	errors.forEach(m => core.info(m));
	core.endGroup();
	core.info(`\x1B[4;1mTotal \x1B[31m${errors.length}\x1B[39m errors.\x1B[0m`);
} else {
	core.info('✅ All database entries are valid!');
}
