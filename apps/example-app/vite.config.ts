import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * @description Absolute path of `src/assets/scss/_globals.scss`.
 * Injected into every scss file, replacing the old `style-resources-loader`.
 */
const scssGlobals = fileURLToPath(new URL('./src/assets/scss/_globals.scss', import.meta.url));

export default defineConfig(({ command }) => {
    const isDev = command === 'serve';

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        // Replace the old `DefinePlugin` which exposes `isDev` / `isProd` globals.
        define: {
            isDev: JSON.stringify(isDev),
            isProd: JSON.stringify(!isDev),
        },
        css: {
            // Keep the same css-modules behavior as the old `css-loader` config.
            modules: {
                localsConvention: 'camelCase',
                generateScopedName: '[local]__[hash:base64]',
            },
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "${scssGlobals}" as *;`,
                },
            },
        },
        server: {
            // Same port as the old webpack-dev-server.
            port: 9222,
            open: false,
        },
        build: {
            outDir: 'dist',
            assetsDir: 'static',
            // Same as the old `esbuild-loader` target and the 10kb inline limit.
            assetsInlineLimit: 10240,
            target: 'es2020',
            minify: 'esbuild',
            esbuild: {
                // Same as the old terser config: drop console & debugger in prod.
                drop: ['console', 'debugger'],
            },
            rollupOptions: {
                output: {
                    // Same as the old `splitChunks` cacheGroups for vendors.
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return 'chunk-vendors';
                        }
                    },
                },
            },
        },
    };
});
