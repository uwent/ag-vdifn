import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Rails from 'vite-plugin-rails';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const envKeys = {};

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Rails(), tsconfigPaths(), svelte()],
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
    conditions: process.env.VITEST ? ['browser'] : undefined,
  },
  build: {
    commonjsOptions: { exclude: ['chroma-js'] },
    manifest: true,
    watch: null, // Explicitly disable watch mode
    rollupOptions: {
      input: {
        main: '~/entrypoints/application.ts',
      },
    },
    cssCodeSplit: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['test/test_setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    exclude: ['**/.test-archive/**', '**/node_modules/**'],
  },
  define: envKeys,
});
