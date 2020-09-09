const { environment } = require('@rails/webpacker');
const svelte = require('./loaders/svelte')
const env = require('@rails/webpacker/package/env');
const webpack = require('webpack')

environment.loaders.prepend('svelte', svelte)
module.exports = environment
