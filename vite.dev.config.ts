import { defineConfig } from 'vite';

// Dev harness build (fake HA + demo card + the real entry) into dev-dist/; serve the repo root statically and open
// dev/harness.html?view=cards|panel&mode=light|dark.
export default defineConfig({
  define: { __HELDER_VERSION__: JSON.stringify('dev') },
  build: {
    outDir: 'dev-dist',
    emptyOutDir: true,
    target: 'es2022',
    lib: { entry: 'dev/harness.ts', formats: ['es'], fileName: () => 'harness.js' },
    minify: false,
  },
});
