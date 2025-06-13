import type { Connect, PluginOption, ViteDevServer } from 'vite';
import type { FileValidationFailure } from './scripts/helpers';
/* eslint-env node */
import fs from 'node:fs';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import autoprefixer from 'autoprefixer';
import p from 'picocolors';
import minify from 'postcss-minify';
import PrefixWrap from 'postcss-prefixwrap';
import Sonda from 'sonda/vite';
import { sveltePreprocess } from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import nesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import moduleJSON from './module.json' with { type: 'json' };
import { getJSONSchema } from './scripts/buildJSONSchema';
import { Log, pluralise } from './scripts/helpers';
import { testAndMergeAnimations } from './scripts/testAndMergeAnimations';

const foundryPort = 40000;
const devPort = 30001;
const packagePath = `modules/${moduleJSON.id}`;
const cssId = 'pf2e-g';

const skippedFiles = [`${moduleJSON.id}.css`].map(f => `dist/${f}`).join('|');

function plugins(mode: string): PluginOption[] {
	const compilerOptions
		= mode === 'production' ? { cssHash: ({ hash, css }) => `svelte-${cssId}-${hash(css)}` } : {};

	return [
		checker({ typescript: true, enableBuild: true }),
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
		Sonda({
			sources: true,
			enabled: !!process.env.SONDA,
		}),
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
			plugins: [
				nesting,
				tailwindcss,
				autoprefixer,
				PrefixWrap(`.${cssId}`, { ignoredSelectors: [`.${cssId}`] }),
				minify,
			],
		},
	},

	resolve: { conditions: ['import', 'browser'] },

	server: {
		open: '/join',
		strictPort: true,
		port: devPort,
		proxy: {
			// Serves static files from main Foundry server.
			[`^(/${packagePath}/(assets|lang|packs|${skippedFiles}))`]: `http://localhost:${foundryPort}`,

			// All other paths besides package ID path are served from main Foundry server.
			[`^(?!/${packagePath}/)`]: `http://localhost:${foundryPort}`,

			// Rewrite incoming `module-id.js` request from Foundry to the dev server `index.ts`.
			[`/${packagePath}/dist/${moduleJSON.id}.js`]: {
				target: `http://localhost:${devPort}/${packagePath}/dist`,
				rewrite: () => '/index.ts',
			},

			// Enable socket.io from main Foundry server.
			'/socket.io': { target: `ws://localhost:${foundryPort}`, ws: true },
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
					assetInfo.name === 'style.css' ? `${moduleJSON.id}.css` : (assetInfo.name as string),
			},
		},
	},

	optimizeDeps: {
		include: ['zod'],
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

						return res.end(JSON.stringify(Object.fromEntries(result.data ?? new Map())));
					} else {
						next();
					}
				});
			},
			handleHotUpdate({ file, server }) {
				if (file.startsWith('animations/') && file.endsWith('json')) {
					const result = testAndMergeAnimations('./animations');

					if (result.success) {
						Log.info(p.green('\n[Animations] All files passing.'));
					} else {
						reportIssues(result.issues);
					}

					if (result.data) {
						server.ws.send({
							event: 'updateAnims',
							type: 'custom',
							data: JSON.stringify(Object.fromEntries(result.data)),
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
					Log.info(p.green('\n[Animations] All files passing.'));
				} else {
					reportIssues(result.issues);
				}

				this.emitFile({
					type: 'asset',
					fileName: 'animations.json',
					source: JSON.stringify(Object.fromEntries(result.data ?? new Map())),
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
