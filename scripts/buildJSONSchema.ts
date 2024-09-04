// JSON schemas are emitted automatically via Vite.
// Use `npm run build:schema` to emit the JSON schema manually.

import fs from 'node:fs/promises';
import p from 'picocolors';
import { getJSONSchema } from 'src/storage/animationsSchema';
import { Log } from './helpers';

const OUTPUT_DIRECTORY = './dist';

fs.stat(OUTPUT_DIRECTORY).catch(() => {
	Log.warning(`${OUTPUT_DIRECTORY} does not exist. Creating it...`);
	fs.mkdir(OUTPUT_DIRECTORY);
}).finally(() => {
	fs.writeFile(`${OUTPUT_DIRECTORY}/animations-schema.json`, JSON.stringify(getJSONSchema('animations')), {
		encoding: 'utf8',
	}).then(() => Log.info(p.green('Generated animations JSON schema.'))).catch(() => Log.error(p.red('Failed to generate animations JSON schema.')));

	fs.writeFile(
		`${OUTPUT_DIRECTORY}/token-images-schema.json`,
		JSON.stringify(getJSONSchema('tokenImages')),
		{
			encoding: 'utf8',
		},
	).then(() => Log.info(p.green('Generated token-images JSON schema.'))).catch(() => Log.error(p.red('Failed to generate token-images JSON schema.')));
});
