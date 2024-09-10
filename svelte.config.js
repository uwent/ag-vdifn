import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  preprocess: vitePreprocess(),
  'enable-ts-plugin': true,
  postcss: {
    plugins: [tailwindcss, autoprefixer],
    'postcss-preset-env': true,
  },
};
