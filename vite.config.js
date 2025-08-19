import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import ViteRails from 'vite-plugin-rails';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const envKeys = {};

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    svelte(),
    tailwindcss(),
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
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['test/**/*.test.ts'],
    environment: 'happy-dom',
    setupFiles: ['test/setup.ts'],
  },
  define: envKeys,
});
