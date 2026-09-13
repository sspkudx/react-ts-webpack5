import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/** 包根目录（vite.config 以 ESM 执行，无 __dirname） */
const pkgRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(pkgRoot, 'src/index.ts'),
            formats: ['es'],
            fileName() {
                return 'index.js';
            },
        },
        sourcemap: true,
        emptyOutDir: true,
        minify: false,
    },
});
