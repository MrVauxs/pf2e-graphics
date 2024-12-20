/* eslint-env node */
import fs from 'node:fs';
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
import { getJSONSchema } from './scripts/buildJSONSchema';
import { type FileValidationFailure, Log, pluralise } from './scripts/helpers';
import { testAndMergeAnimations } from './scripts/testAndMergeAnimations';

const packagePath = `modules/${moduleJSON.id}`;

const skippedFiles = [`${moduleJSON.id}.css`].map(f => `dist/${f}`).join('|');

function plugins(mode: string): PluginOption[] {
	const compilerOptions = mode === 'production'
		? { cssHash: ({ hash, css }) => `svelte-pf2e-g-${hash(css)}` }
		: {};

	return [
		checker({ typescript: true }),
		tsconfigPaths(),
		svelte({
			compilerOptions,
			preprocess: sveltePreprocess(),
		}),
		{
			name: 'create-dist-files',
			apply: 'serve',
			buildStart() {
				if (!fs.existsSync('dist')) {
					fs.mkdir('dist', (err) => {
						if (err) throw err;
					});
				}

				const files = [...moduleJSON.esmodules, ...moduleJSON.styles];
				for (const name of files) {
					fs.writeFileSync(name, '', { flag: 'a' });
				}
			},
		},
		getAnimationsPlugin(),
	];
}

export default defineConfig(({ mode }) => ({
	root: './src',
	base: `/${packagePath}/dist`,
	cacheDir: '../.vite-cache',
	publicDir: false,

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

			// Rewrite incoming `module-id.js` request from Foundry to the dev server `index.ts`.
			[`/${packagePath}/dist/${moduleJSON.id}.js`]: {
				target: `http://localhost:30001/${packagePath}/dist`,
				rewrite: () => '/index.ts',
			},

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
			entry: 'index.ts',
			formats: ['es'],
			fileName: moduleJSON.id,
		},
		rollupOptions: {
			output: {
				assetFileNames: assetInfo =>
					assetInfo.name === 'style.css'
						? `${moduleJSON.id}.css`
						: (assetInfo.name as string),
			},
		},
	},

	optimizeDeps: {
		esbuildOptions: {
			target: 'es2022',
		},
	},

	plugins: plugins(mode),
}));

function getAnimationsPlugin(): PluginOption {
	function reportIssues(errors: FileValidationFailure[], server?: ViteDevServer): void {
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

						if (!result.success) reportIssues(result.issues, server);

						return res.end(JSON.stringify(result.data ?? {}));
					} else {
						next();
					}
				});
			},
			handleHotUpdate({ file, server }) {
				if (file.startsWith('animations/') && file.endsWith('json')) {
					const result = testAndMergeAnimations('./animations');

					if (result.success) {
						Log.info(p.green('[Animations] All files passing.'));
					} else {
						reportIssues(result.issues);
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

				if (result.success) {
					Log.info(p.green('[Animations] All files passing.'));
				} else {
					reportIssues(result.issues);
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
