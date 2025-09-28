import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    exclude: ['coverage', '**/node_modules/**', 'dist', 'src/index.js', 'frontend/node_modules/**'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*'],
      exclude: ['src/index.js'],
    },
  },
});
