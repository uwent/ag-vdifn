const { webpackConfig, merge } = require('@rails/webpacker');
const svelteConfig = require('./loaders/svelte');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");

// const env = require('@rails/webpacker/package/env');
// const webpack = require('webpack')

// environment.loaders.prepend('svelte', svelte)
module.exports = merge(
  webpackConfig,
  svelteConfig,
  {
    plugins: [new ForkTsCheckerWebpackPlugin()],
  },
  {
    resolve: {
      extensions: ['.css']
    }
  }
);
