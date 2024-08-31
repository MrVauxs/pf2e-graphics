import fs from 'node:fs/promises';
import { type Options, zodToJsonSchema } from 'zod-to-json-schema';
import p from 'picocolors';
import { animations, tokenImages } from '../src/storage/animationsSchema';
import { Log } from './helpers';

const OUTPUT_DIRECTORY = './dist';

const options: Partial<Options> = {
	markdownDescription: true,
	removeAdditionalStrategy: 'strict',
	applyRegexFlags: true,
};

const animationSchema = zodToJsonSchema(animations, options);
fs.writeFile(`${OUTPUT_DIRECTORY}/animations-schema.json`, JSON.stringify(animationSchema), {
	encoding: 'utf8',
})
	.then(() => Log.info(p.green('Generated animations JSON schema.')))
	.catch(() => Log.error(p.red('Failed to generate token-images JSON schema.')));

const tokenImagesSchema = zodToJsonSchema(tokenImages, options);
fs.writeFile(`${OUTPUT_DIRECTORY}/token-images-schema.json`, JSON.stringify(tokenImagesSchema), {
	encoding: 'utf8',
})
	.then(() => Log.info(p.green('Generated token-images JSON schema.')))
	.catch(() => Log.error(p.red('Failed to generate token-images JSON schema.')));
