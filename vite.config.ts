/* eslint-env node */
import { defineConfig } from 'vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import resolve from '@rollup/plugin-node-resolve' // This resolves NPM modules from node_modules.
import moduleJSON from './module.json' with { type: 'json' }

const packagePath = `modules/${moduleJSON.id}`

export default defineConfig((/** { command } */) => ({
	root: 'src',
	base: `/${packagePath}/dist`,
	publicDir: false,
	cacheDir: '../.vite-cache',

	esbuild: {
		target: ['es2020'],
	},

	resolve: { conditions: ['import', 'browser'] },

	server: {
		open: true,
		port: 30001,
		proxy: {
			// Serves static files from main Foundry server.
			[`^(/${packagePath}/(assets|lang|packs|dist/style.css))`]: 'http://localhost:30000',

			// All other paths besides package ID path are served from main Foundry server.
			[`^(?!/${packagePath}/)`]: 'http://localhost:30000',

			// Enable socket.io from main Foundry server.
			'/socket.io': { target: 'ws://localhost:30000', ws: true },
		},
	},

	build: {
		outDir: '../dist',
		emptyOutDir: false,
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
		manifest: true,
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css')
						return `${moduleJSON.id}.css`
					return (assetInfo.name as string)
				},
			},
		},
	},

	optimizeDeps: {
		esbuildOptions: {
			target: 'es2020',
		},
	},

	plugins: [
		checker({ typescript: true }),
		tsconfigPaths(),
		svelte({ preprocess: vitePreprocess() }),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
	],
}
),
)
