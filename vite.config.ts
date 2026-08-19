import type { Connect, PluginOption, ViteDevServer } from 'vite';
import type { FileValidationFailure } from './scripts/helpers';
/* eslint-env node */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import p from 'picocolors';
import minify from 'postcss-minify';
import PrefixWrap from 'postcss-prefixwrap';
import Sonda from 'sonda/vite';
import { sveltePreprocess } from 'svelte-preprocess';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import moduleJSON from './module.json' with { type: 'json' };
import { getJSONSchema } from './scripts/buildJSONSchema';
import { Log, pluralise } from './scripts/helpers';
import { testAndMergeAnimations } from './scripts/testAndMergeAnimations';

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
			// TRL ships its internal components (`FVTTSidebarTab`, `FVTTSidebarWrapper`, the
			// application shells, …) as raw Svelte 4 `.svelte` source, so *our* build compiles
			// them — but TRL's own JavaScript still instantiates them with `new Component({...})`.
			// Under Svelte 5 that calls the component function with `$$props` undefined and blows
			// up in `prop()` ("Cannot use 'in' operator to search for 'Symbol($state)' in
			// undefined"), which is why the sidebar tab never registered. `componentApi: 4` adds
			// the `new.target` branch those call sites need. Scoped to TRL only so our own
			// components stay on the plain Svelte 5 component API.
			dynamicCompileOptions({ filename }) {
				if (filename.replace(/\\/g, '/').includes('/@typhonjs-fvtt/')) {
					return { compatibility: { componentApi: 4 } };
				}
			},
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
				// Tailwind 4 handles nesting natively, so the old `tailwindcss/nesting` pass is gone —
				// `app.postcss` keeps its `&` rules and browsers resolve them. `autoprefixer` stays:
				// Tailwind's own output no longer needs it, but this chain also processes the Svelte
				// components' `<style>` blocks and the hand-written CSS in `app.postcss`.
				tailwindcss,
				autoprefixer,
				// This is what scopes the module's CSS to its own subtree, and it is the only thing
				// doing so — see the note in `app.postcss` about why Tailwind's `important` option is
				// not also set. Anything that is already `.pf2e-g`-scoped must be skipped, or it gets
				// wrapped a second time into `.pf2e-g .pf2e-g .foo`, which needs two nested scopes and
				// so matches nothing; that silently killed every utility class in the module once
				// already. The guard has to be a RegExp rather than the bare `.${cssId}` string,
				// because postcss-prefixwrap 1.57.0 narrowed string entries to an exact `===` match.
				// The lookahead keeps unrelated selectors such as `.pf2e-graphics-*` prefixed as normal.
				PrefixWrap(`.${cssId}`, { ignoredSelectors: [new RegExp(String.raw`^\.${cssId}(?![\w-])`)] }),
				minify,
			],
		},
	},

	resolve: {
		conditions: ['import', 'browser'],
		alias: [
			{
				// `@typhonjs-fvtt/runtime/svelte/util` still imports the Svelte 4 private `svelte/internal`
				// module, which throws on import under Svelte 5 and takes the whole module down with it.
				// See `src/shims/svelte-internal.ts`; drop both once TRL stops importing it.
				//
				// Anchored so it matches *only* the bare specifier: Svelte 5's own legacy-mode output
				// imports real submodules like `svelte/internal/disclose-version` and
				// `svelte/internal/client`, which must resolve normally.
				find: /^svelte\/internal$/,
				replacement: fileURLToPath(new URL('./src/shims/svelte-internal.ts', import.meta.url)),
			},
		],
	},

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
