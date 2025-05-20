import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import ViteRails from 'vite-plugin-rails';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import EnvironmentPlugin from 'vite-plugin-environment';

const envKeys = {};

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    EnvironmentPlugin(['GOOGLE_MAPS_KEY']), //updated
    tsconfigPaths(),
    svelte(),
    ViteRails({
      fullReload: {
        additionalPaths: ['app/views/**/*'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
    conditions: ['browser'],
  },
  build: {
    commonjsOptions: { exclude: ['chroma-js'] },
    cssMinify: false,
  },
  test: {
    globals: true,
    setupFiles: ['test/test_setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
  //   // exclude: ['**/.test-archive/**', '**/node_modules/**'],
    
  //   workspace: [
  //     {
  //       extends: true,
  //       test: {
  //         name: 'browser',

  //       }
  //     },
  //     {
  //       extends: true,
  //       test: {
  //         name: 'node',
  //         include: ['test/node/**/*.test.ts'],
  //         environment: 'node',
  //       }
  //     }

  //   ]
  },
  define: envKeys,
});
