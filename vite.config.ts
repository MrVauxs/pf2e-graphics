/* eslint-env node */
import fs from 'node:fs';
import { type Connect, type PluginOption, defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import * as glob from 'glob';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import resolve from '@rollup/plugin-node-resolve'; // This resolves NPM modules from node_modules.
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import nesting from 'tailwindcss/nesting';
import minify from 'postcss-minify';
import p from 'picocolors';
import { fromZodIssue } from 'zod-validation-error';
import moduleJSON from './module.json' with { type: 'json' };
import { validateAnimationData } from './src/storage/animationsSchema';
import { Log } from './scripts/helpers';

const packagePath = `modules/${moduleJSON.id}`;
// const { esmodules, styles } = moduleJSON

const skippedFiles = [
	`${moduleJSON.id}.css`,
].map(f => `dist/${f}`).join('|');

export default defineConfig(({ command: _buildOrServe }) => ({
	root: 'src',
	base: `/${packagePath}/dist`,
	cacheDir: '../.vite-cache',
	publicDir: '../assets',

	clearScreen: true,

	esbuild: {
		target: ['es2022'],
	},

	css: {
		postcss: {
			inject: false,
			sourceMap: true,
			plugins: [nesting, tailwindcss, autoprefixer, minify],
		},
	},

	resolve: { conditions: ['import', 'browser'] },

	server: {
		open: '/join',
		port: 30001,
		proxy: {
			// Serves static files from main Foundry server.
			[`^(/${packagePath}/(assets|lang|packs|${skippedFiles}))`]: 'http://localhost:30000',

			// All other paths besides package ID path are served from main Foundry server.
			[`^(?!/${packagePath}/)`]: 'http://localhost:30000',

			// Enable socket.io from main Foundry server.
			'/socket.io': { target: 'ws://localhost:30000', ws: true },
		},
	},

	build: {
		copyPublicDir: false,
		outDir: '../dist',
		emptyOutDir: true,
		sourcemap: true,
		minify: 'terser' as const,
		terserOptions: {
			mangle: {
				toplevel: true,
				keep_classnames: true,
				keep_fnames: true,
			},
			module: true,
		},
		lib: {
			entry: 'index.js',
			formats: ['es'],
			fileName: moduleJSON.id,
		},
		rollupOptions: {
			output: {
				assetFileNames: assetInfo => (assetInfo.name === 'style.css') ? `${moduleJSON.id}.css` : (assetInfo.name as string),
			},
		},
	},

	optimizeDeps: {
		esbuildOptions: {
			target: 'es2022',
		},
	},

	plugins: [
		process.env.IGNORE_CHECKER
			? undefined
			: checker({
				typescript: true,
				eslint: process.env.IGNORE_ESLINT
					? undefined
					:	{
							useFlatConfig: true,
							lintCommand: 'eslint',
						},
			}),
		tsconfigPaths(),
		svelte({
			compilerOptions: {
				cssHash: ({ hash, css }) => `svelte-pf2e-g-${hash(css)}`,
			},
			preprocess: sveltePreprocess(),
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		{
			name: 'change-names',
			configureServer(server) {
				server.middlewares.use((req: Connect.IncomingMessage & { url?: string }, res, next) => {
					if (req.originalUrl === `/${packagePath}/dist/${moduleJSON.id}.js`) {
						req.url = `/${packagePath}/dist/index.js`;
					}
					next();
				});
			},
		},
		{
			name: 'create-dist-files',
			apply: 'serve',
			buildStart() {
				const files = [...moduleJSON.esmodules, ...moduleJSON.styles];
				for (const name of files) {
					fs.writeFileSync(`${name}`, '', { flag: 'a' });
				}
			},
		},
		mergeAnimationsPlugin(),
	],
}));

function mergeAnimationsPlugin(): PluginOption {
	const mergeAnimations = () => {
		let animations: Record<string, any> = {};
		const duplicateKeys: string[] = [];
		const validationIssues: string[] = [];

		// Merging objects and gathering of duplicate keys
		for (const file of glob.globSync('./animations/**/*.json')) {
			try {
				const content = fs.readFileSync(file, { encoding: 'utf-8' });
				const json = JSON.parse(content);
				for (const k of Object.keys(json)) {
					if (k in animations) duplicateKeys.push(k);
				}
				animations = { ...json, ...animations };
			} catch (e) {
				throw new Error(`Failed to parse ${file}: ${e}`);
			}
		}

		// Validation
		const result = validateAnimationData(animations);
		if (result.success) {
			Log.info(p.green('No validation errors!'));
		} else {
			const issues = result.error.issues;
			Log.details({
				level: 'error',
				title: p.red(`[Zod] Found ${p.bold(issues.length)} validation error${issues.length === 1 ? '' : 's'}.`),
				messages: issues.map((issue) => {
					const formatted = fromZodIssue(issue);

					validationIssues.push(`${formatted.details[0].path.join('.')} - ${formatted.details[0].message}`);

					return `${p.bgBlack(formatted.details[0].path.join('.'))}\n\t∟ ${formatted.details[0].message}`;
				}),
			});
		}

		return { animations, duplicateKeys, validationIssues };
	};

	return [
		{
			name: 'build-animations-dev',
			apply: 'serve',
			configureServer(server) {
				server.watcher.add('./animations');
				server.middlewares.use((req: Connect.IncomingMessage & { url?: string }, res, next) => {
					if (req.originalUrl === `/${packagePath}/dist/animations.json`) {
						const { animations, duplicateKeys, validationIssues } = mergeAnimations();
						res.end(JSON.stringify(animations));
						if (duplicateKeys.length) {
							server.ws.send({
								event: 'updateDuplicateKeysError',
								type: 'custom',
								data: JSON.stringify(duplicateKeys),
							});
						}
						if (validationIssues.length) {
							server.ws.send({
								event: 'updateValidationError',
								type: 'custom',
								data: JSON.stringify(validationIssues),
							});
						}
					} else {
						next();
					}
				});
			},
			handleHotUpdate({ file, server }) {
				if (file.startsWith('animations/') && file.endsWith('json')) {
					const { animations, duplicateKeys } = mergeAnimations();
					server.ws.send({
						event: 'updateAnims',
						type: 'custom',
						data: JSON.stringify(animations),
					});
					if (duplicateKeys.length) {
						server.ws.send({
							event: 'updateAnimsError',
							type: 'custom',
							data: JSON.stringify(duplicateKeys),
						});
					}
				}
			},
		},
		{
			name: 'build-animations',
			apply: 'build',
			generateBundle() {
				const { animations, duplicateKeys } = mergeAnimations();
				if (duplicateKeys.length) throw new Error(`Duplicate keys in animation files: ${duplicateKeys}`);
				this.emitFile({
					type: 'asset',
					fileName: 'animations.json',
					source: JSON.stringify(animations),
				});
			},
		},
	];
}
