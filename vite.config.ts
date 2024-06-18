/* eslint-env node */
import { type Connect, defineConfig } from 'vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import resolve from '@rollup/plugin-node-resolve' // This resolves NPM modules from node_modules.
import moduleJSON from './module.json' with { type: 'json' }
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import nesting from "tailwindcss/nesting";
// @ts-ignore
import minify from "postcss-minify"; // not typed, but the entire thing is tiny

const packagePath = `modules/${moduleJSON.id}`
// const { esmodules, styles } = moduleJSON

export default defineConfig((/** { command } */) => ({
	root: 'src',
	base: `/${packagePath}/dist`,
	cacheDir: '../.vite-cache',
	publicDir: '../static',

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
			[`^(/${packagePath}/(assets|lang|packs|dist/${moduleJSON.id}.css))`]: 'http://localhost:30000',

			// All other paths besides package ID path are served from main Foundry server.
			[`^(?!/${packagePath}/)`]: 'http://localhost:30000',

			// Enable socket.io from main Foundry server.
			'/socket.io': { target: 'ws://localhost:30000', ws: true },
		},
	},

	build: {
		outDir: '../dist',
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
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') {
						return `${moduleJSON.id}.css`
					}
					return (assetInfo.name as string)
				},
			},
		},
	},

	optimizeDeps: {
		esbuildOptions: {
			target: 'es2022',
		},
	},

	plugins: [
		checker({ typescript: true }),
		tsconfigPaths(),
		svelte({
			compilerOptions: {
				cssHash: ({ hash, css }) => `svelte-pf2e-g-${hash(css)}`,
			},
			preprocess: vitePreprocess()
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
						req.url = `/${packagePath}/dist/index.js`
					}
					next()
				})
			},
		},
	],
}
),
)
