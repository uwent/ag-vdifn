import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  preprocess: vitePreprocess(),
  postcss: {
    plugins: [tailwindcss, autoprefixer],
    'postcss-preset-env': true,
  },
  'enable-ts-plugin': true,
};
