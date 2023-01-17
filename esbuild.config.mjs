#!/usr/bin/env node

import * as esbuild from 'esbuild'

import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const args = process.argv.slice(2)
const watch = args.includes('--watch')
const deploy = args.includes('--deploy')
const envKeys = {}

for (const k in process.env) {
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k])
}

let sveltePlugin = esbuildSvelte({
  preprocess: sveltePreprocess({
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  }),
})

let buildOptions = {
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  minify: deploy,
  target: 'esnext',
  outdir: 'app/assets/builds',
  logLevel: 'info',
  plugins: [sveltePlugin],
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file'
  },
  define: envKeys
}

if (watch) {
  const context = await esbuild.context({
    ...buildOptions,
    sourcemap: 'inline',
  })
  await context.watch()
} else {
  await esbuild.build(buildOptions)
}
