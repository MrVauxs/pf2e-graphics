import { defineConfig } from 'vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import moduleJSON from './module.json' with { type: 'json' };
import resolve from '@rollup/plugin-node-resolve'; // This resolves NPM modules from node_modules.

const packagePath = `modules/${moduleJSON.id}`;

export default defineConfig(({ command }) => {
  return {
    root: 'src',
    base: `/${packagePath}/`,
    publicDir: false,
    cacheDir: '../.vite-cache',

    esbuild: {
      target: ['es2022']
    },

    server: {
      port: 30001,
      open: '/game',
      proxy: {
        // All other paths besides package ID path are served from main Foundry server.
        [`^(?!/${packagePath}/)`]: 'http://localhost:30000',

        // Enable socket.io from main Foundry server.
        '/socket.io': { target: 'ws://localhost:30000', ws: true }
      }
    },

    build: {
      outDir: __dirname,
      emptyOutDir: false,
      sourcemap: true,
      brotliSize: true,
      minify: 'terser',
      target: ['es2020'],
      terserOptions: {
        compress: {
          passes: 3
        },
        mangle: {
          toplevel: true,
          keep_classnames: true,
          keep_fnames: true
        },
        ecma: 2020,
        module: true
      },
      lib: {
        entry: './index.ts',
        formats: ['es'],
        fileName: 'index'
      },
    },
    // Necessary when using the dev server for top-level await usage inside of TRL.
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022'
      }
    },

    plugins: [
      svelte({ preprocess: vitePreprocess(), }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      })
    ],
  }
})
