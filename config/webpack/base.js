const { webpackConfig } = require('@rails/webpacker')
const { merge } = require('webpack-merge')
const svelteConfig = require('./loaders/svelte')
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = merge(
  webpackConfig,
  svelteConfig,
  { plugins: [new ForkTsCheckerWebpackPlugin()] },
  { resolve: { extensions: ['.css'] } }
)
