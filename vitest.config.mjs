import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    exclude: ['coverage', 'node_modules', 'dist', 'src/index.js'],
    coverage: {
      provider: 'istanbul',
      exclude: ['src/index.js', '**/*.mjs'],
    },
  },
});
