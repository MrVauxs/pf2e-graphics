// JSON schemas are emitted automatically via Vite.
// Use `npm run build:schema` to emit the JSON schema manually.

import type { Options as zodToJsonSchemaOptions } from 'zod-to-json-schema';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import p from 'picocolors';
import { zodToJsonSchema } from 'zod-to-json-schema';
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

/**
 * Writes both JSON schemas to {@link OUTPUT_DIRECTORY}.
 */
async function emitJSONSchemas(): Promise<void> {
	await fs.stat(OUTPUT_DIRECTORY).catch(async () => {
		Log.warning(`${OUTPUT_DIRECTORY} does not exist. Creating it...`);
		await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });
	});

	const outputs = [
		{ name: 'animations', label: 'animations', file: 'animations-schema.json' },
		{ name: 'tokenImages', label: 'token-images', file: 'token-images-schema.json' },
	] as const;

	for (const { name, label, file } of outputs) {
		await fs
			.writeFile(`${OUTPUT_DIRECTORY}/${file}`, JSON.stringify(getJSONSchema(name)), { encoding: 'utf8' })
			.then(() => Log.info(p.green(`Generated ${label} JSON schema.`)))
			.catch(() => Log.error(p.red(`Failed to generate ${label} JSON schema.`)));
	}
}

// Only emit when this script is run directly (`pnpm run build:schema`). Importing it — as `vite.config.ts`
// does for `getJSONSchema` — must not write files or kick off floating promises, which previously raced
// against Vite's config loading and made `svelte-check` fail intermittently.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
	await emitJSONSchemas();
}
