import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

// Library build: one ES module with everything (Lit included). scripts/postbuild.ts adds the stable loader
// (helder.js), fonts and the theme.
export default defineConfig({
  define: { __HELDER_VERSION__: JSON.stringify(pkg.version) },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'helder-bundle.js',
    },
    minify: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
});
