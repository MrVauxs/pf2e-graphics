import fs from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import p from 'picocolors';
import { Log } from '../tests/helpers';
import { animations } from '../src/storage/animationsSchema';

const OUTPUT_DIRECTORY = './dist';

const outputDirectory = fs.statSync(OUTPUT_DIRECTORY, { throwIfNoEntry: false });
if (!outputDirectory) fs.mkdirSync(OUTPUT_DIRECTORY);

const JSONSchema = zodToJsonSchema(animations, {
	markdownDescription: true,
	removeAdditionalStrategy: 'strict',
});

fs.writeFileSync(`${OUTPUT_DIRECTORY}/animations-schema.json`, JSON.stringify(JSONSchema), { encoding: 'utf8' });

Log.info(p.green('Generated animations JSON schema.'));
