/** @type {import("esbuild").BuildOptions} */
export const config = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    format: 'esm',
    target: 'node21',
    banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
};
