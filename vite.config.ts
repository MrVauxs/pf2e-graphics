/* eslint-env node */
import ModuleData from './module.json' with { type: 'json' };
import { defineConfig } from 'vite'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve';
import fs from "fs-extra";

export default defineConfig((configEnv) => {
    const plugins = [
        svelte({ preprocess: vitePreprocess() }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        })
    ];

    if (configEnv.command === 'serve') {
        const message = "This file is for a running vite dev server and is not copied to a build";
        fs.writeFileSync("./index.html", `<h1>${message}</h1>\n`);
        if (!fs.existsSync("./styles")) fs.mkdirSync("./styles");
        fs.writeFileSync(`./${ModuleData.id}.css`, `/** ${message} */\n`);
        fs.writeFileSync(`./${ModuleData.id}.js`, `/** ${message} */\n\nimport "./src/pf2e.ts";\n`);
    }

    return {
        root: 'src/',
        base: `/${ModuleData.id}/`,
        publicDir: false,
        cacheDir: '../.vite-cache',

        resolve: { conditions: ['import', 'browser'] },

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
            outDir: '.',
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

        plugins
    }
})
