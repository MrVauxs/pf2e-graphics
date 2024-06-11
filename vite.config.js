/* eslint-env node */
import ModuleData from './module.json' with { type: 'json' };
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path';

export default defineConfig({
    root: 'src/',
    base: `modules/${ModuleData.id}/`,
    publicDir: false,
    cacheDir: '../.vite-cache',

    resolve: {
        conditions: ['import', 'browser'],
        alias: {
            '~': path.resolve(__dirname, 'src'),
        }
    },

    esbuild: {
        target: ['es2022']
    },

    server: {
        port: 30001,
        open: '/game',
        proxy: {
            // Serves static files from main Foundry server.
            [`^(/${ModuleData.id}/(assets|lang|packs|style.css))`]: 'http://localhost:30000',

            // All other paths besides package ID path are served from main Foundry server.
            [`^(?!/${ModuleData.id}/)`]: 'http://localhost:30000',

            // Enable socket.io from main Foundry server.
            '/socket.io': { target: 'ws://localhost:30000', ws: true }
        },
        watch: { usePolling: true }
    },

    build: {
        outDir: '../scripts',
        emptyOutDir: false,
        sourcemap: true,
        minify: 'terser',
        target: ['es2022'],
        terserOptions: {
            compress: {
                passes: 3
            },
            mangle: {
                toplevel: true,
                keep_classnames: true,
                keep_fnames: true
            },
            module: true,
            ecma: 2020
        },
        lib: {
            entry: 'index.ts',
            formats: ['es'],
            fileName: `${ModuleData.id}`
        }
    },

    // Necessary when using the dev server for top-level await usage inside of TRL.
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2022'
        }
    },

    plugins: [svelte()],
})
