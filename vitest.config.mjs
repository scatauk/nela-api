import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    exclude: ['coverage', 'node_modules', 'dist', 'src/index.js'],
    coverage: {
      exclude: ['src/index.js', '**/*.mjs'],
    },
  },
});
