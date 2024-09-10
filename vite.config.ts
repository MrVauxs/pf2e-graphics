/* eslint-env node */
import fs from 'node:fs';
import resolve from '@rollup/plugin-node-resolve'; // This resolves NPM modules from node_modules.
import { svelte } from '@sveltejs/vite-plugin-svelte';
import autoprefixer from 'autoprefixer';
import p from 'picocolors';
import minify from 'postcss-minify';
import { sveltePreprocess } from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import nesting from 'tailwindcss/nesting';
import { type Connect, defineConfig, type PluginOption, type ViteDevServer } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import moduleJSON from './module.json' with { type: 'json' };
import { type fileValidationResult, Log, pluralise } from './scripts/helpers';
import { testAndMergeAnimations } from './scripts/testAndMergeAnimations';
import { getJSONSchema } from './src/storage/animationsSchema';

const packagePath = `modules/${moduleJSON.id}`;
// const { esmodules, styles } = moduleJSON

const skippedFiles = [`${moduleJSON.id}.css`].map(f => `dist/${f}`).join('|');

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
		minify: 'terser',
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
				assetFileNames: assetInfo =>
					assetInfo.name === 'style.css' ? `${moduleJSON.id}.css` : (assetInfo.name as string),
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
					: {
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
					fs.writeFileSync(name, '', { flag: 'a' });
				}
			},
		},
		getAnimationsPlugin(),
	],
}));

function getAnimationsPlugin(): PluginOption {
	function reportErrors(errors: fileValidationResult[], server?: ViteDevServer): void {
		const columnWidth = Math.min(Math.max(...errors.map(error => error.file.length + 5)), 58);
		Log.newLine();
		Log.details({
			level: 'error',
			title: p.red(
				`[Animations] ${p.bold(errors.length)} animation ${pluralise('file', errors.length)} failed validation.`,
			),
			messages: errors.map(
				error =>
					`${error.file}${error.message ? `${' '.repeat(Math.max(columnWidth - error.file.length, 3))}${p.dim(error.message)}` : ''}`,
			),
		});
		if (server) {
			server.ws.send({
				event: 'updateValidationError',
				type: 'custom',
				data: JSON.stringify(errors),
			});
		}
	}
	return [
		{
			name: 'build-animations-dev',
			apply: 'serve',
			configureServer(server) {
				server.watcher.add(['./animations']);
				server.middlewares.use((req: Connect.IncomingMessage & { url?: string }, res, next) => {
					if (req.originalUrl === `/${packagePath}/dist/animations.json`) {
						const result = testAndMergeAnimations('./animations');

						if (!result.success) reportErrors(result.errors, server);

						return res.end(JSON.stringify(result.data ?? {}));
					} else {
						next();
					}
				});
			},
			handleHotUpdate({ file, server }) {
				if (file.startsWith('animations/') && file.endsWith('json')) {
					const result = testAndMergeAnimations('./animations');

					if (!result.success) {
						reportErrors(result.errors);
					} else {
						Log.info(p.green('[Animations] All files passing.'));
					}

					if (result.data) {
						server.ws.send({
							event: 'updateAnims',
							type: 'custom',
							data: JSON.stringify(result.data),
						});
					}
				}
			},
		},
		{
			name: 'build-animations',
			apply: 'build',
			generateBundle() {
				const result = testAndMergeAnimations('./animations');

				if (!result.success) {
					reportErrors(result.errors);
				} else {
					Log.info(p.green('[Animations] All files passing.'));
				}

				this.emitFile({
					type: 'asset',
					fileName: 'animations.json',
					source: JSON.stringify(result.data ?? {}),
				});
			},
		},
		{
			name: 'build-json-schemas',
			apply: 'build',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: 'animations-schema.json',
					source: JSON.stringify(getJSONSchema('animations')),
				});
				this.emitFile({
					type: 'asset',
					fileName: 'token-images-schema.json',
					source: JSON.stringify(getJSONSchema('tokenImages')),
				});
			},
		},
	];
}
