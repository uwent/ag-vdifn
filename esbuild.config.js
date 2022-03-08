#!/usr/bin/env node

// var watch = process.argv.includes("--watch");

// require('esbuild').build({
//   entryPoints: ["app/javascript/application.js"],
//   bundle: true,
//   outfile: "app/assets/builds/application.js",
//   plugins: [require('esbuild-svelte')()],
//   logLevel: "info",
//   watch: watch
// }).catch(() => process.exit(1));

const esbuild = require("esbuild")
const sveltePlugin = require("esbuild-svelte")
const sveltePreprocess = require("svelte-preprocess")
// const svgrPlugin = require("esbuild-plugin-svgr")

const args = process.argv.slice(2)
const watch = args.includes('--watch')
const deploy = args.includes('--deploy')
const envKeys = {}

for (const k in process.env) {
  console.log(k)
  envKeys[`process.env.${k}`] = JSON.stringify(process.env[k])
}

let opts = {
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  target: 'esnext',
  outdir: 'app/assets/builds',
  // outfile: "app/assets/builds/application.js",
  logLevel: 'info',
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [
            require("tailwindcss"), 
            require("autoprefixer"),
          ],
        },
      }),
    }),
    // svgrPlugin(),
  ],
  loader: {
    ".png": "file",
    ".jpg": "file",
    ".svg": "file"
  },
  define: envKeys
}

if (watch) {
  opts = {
    ...opts,
    watch,
    sourcemap: 'inline'
  }
}

if (deploy) {
  opts = {
    ...opts,
    minify: true
  }
}

const promise = esbuild.build(opts)

if (watch) {
  promise.then(_result => {
    process.stdin.on('close', () => {
      process.exit(0)
    })

    process.stdin.resume()
  })
}
