// JSON schemas are emitted automatically via Vite.
// Use `npm run build:schema` to emit the JSON schema manually.

import fs from 'node:fs/promises';
import p from 'picocolors';
import { zodToJsonSchema, type Options as zodToJsonSchemaOptions } from 'zod-to-json-schema';
import { animationSetsObject, tokenImagesObject } from '../schema';
import { Log } from './helpers';

/**
 * Converts a Zod schema into a JSON schema.
 *
 * @param schemaName The type of the Zod schema being emitted (either `animations` or `tokenImages`).
 * @returns The JSON-schema representation for that Zod schema.
 */
export function getJSONSchema(schemaName: 'animations' | 'tokenImages') {
	const options: Partial<zodToJsonSchemaOptions> = {
		markdownDescription: true,
		removeAdditionalStrategy: 'strict',
		applyRegexFlags: true,
		// errorMessages: true, // Would like this enabled, but it seems to cause problems in VSCode
	};

	if (schemaName === 'animations') return zodToJsonSchema(animationSetsObject, options);
	if (schemaName === 'tokenImages') return zodToJsonSchema(tokenImagesObject, options);
	throw new Error('Unknown schema name');
}

/**
 * The directory to which the JSON schema should be written when building manually using `npm run build:schema`.
 */
const OUTPUT_DIRECTORY = './dist';

fs.stat(OUTPUT_DIRECTORY)
	.catch(() => {
		Log.warning(`${OUTPUT_DIRECTORY} does not exist. Creating it...`);
		fs.mkdir(OUTPUT_DIRECTORY);
	})
	.finally(() => {
		fs.writeFile(`${OUTPUT_DIRECTORY}/animations-schema.json`, JSON.stringify(getJSONSchema('animations')), {
			encoding: 'utf8',
		})
			.then(() => Log.info(p.green('Generated animations JSON schema.')))
			.catch(() => Log.error(p.red('Failed to generate animations JSON schema.')));

		fs.writeFile(
			`${OUTPUT_DIRECTORY}/token-images-schema.json`,
			JSON.stringify(getJSONSchema('tokenImages')),
			{
				encoding: 'utf8',
			},
		)
			.then(() => Log.info(p.green('Generated token-images JSON schema.')))
			.catch(() => Log.error(p.red('Failed to generate token-images JSON schema.')));
	});
