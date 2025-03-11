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
      '~': path.resolve(__dirname, 'app/javascript'),
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  build: {
    commonjsOptions: { exclude: ['chroma-js'] },
    manifest: true,
    rollupOptions: {
      input: {
        main: '~/entrypoints/application.ts',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['test/test_setup.ts'],
    // alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  // server: {
  //   fs: { cachedChecks: false },
  // },
  define: envKeys,
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      },
    },
  }
});
