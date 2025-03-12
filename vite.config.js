import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Rails from 'vite-plugin-rails';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const envKeys = {};

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// Force disable watching during build to prevent loops
const forceBuild = process.env.VITE_FORCE_BUILD === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Rails(), tsconfigPaths(), svelte()],
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
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
  server: {
    fs: {
      cachedChecks: false,
    },
    watch: {
      usePolling: false,
      interval: 1000,
      // Prevent watching when in build mode with VITE_FORCE_BUILD
      ignored: forceBuild ? ['**/*'] : [],
    },
  },
  define: envKeys,
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
});
