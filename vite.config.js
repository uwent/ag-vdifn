import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import ViteRails from 'vite-plugin-rails';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const envKeys = {};

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
    tsconfigPaths: true,
  },
  build: {
    commonjsOptions: { exclude: ['chroma-js'] },
    cssMinify: false,
  },
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      // Explicitly include source files for coverage
      include: ['app/javascript/**/*.{js,ts,svelte}'],
      // Exclude test files and other non-source files
      exclude: [
        'app/javascript/test/**',
        '**/*.test.{js,ts}',
        '**/*.spec.{js,ts}',
        '**/node_modules/**',
        '**/*.config.{js,ts}',
      ],
    },
    include: ['**/*.test.ts'],
    environment: 'happy-dom',
    setupFiles: ['test/setup.ts'],
  },
  define: envKeys,
});
