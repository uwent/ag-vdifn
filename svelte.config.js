import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  "enable-ts-plugin": true,
  postcss: {
    'postcss-preset-env': true,
  },
}
