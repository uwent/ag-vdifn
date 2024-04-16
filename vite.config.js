import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Rails from 'vite-plugin-rails';
import tsconfigPaths from 'vite-tsconfig-paths';
import sveltePreprocess from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

const envKeys = {};

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const sveltePlugin = svelte({
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  }),
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Rails(), tsconfigPaths(), sveltePlugin],
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
    alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  server: {
    fs: {
      cachedChecks: false,
    },
  },
  define: envKeys,
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
