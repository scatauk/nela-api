import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    exclude: ['coverage', 'node_modules', 'dist'],
  },
});
