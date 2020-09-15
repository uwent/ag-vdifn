const { environment } = require('@rails/webpacker')

const webpack = require('webpack')

environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    qtip: 'qtip2',
    Popper: ['popper.js', 'default'],
  })
)
environment.loaders.prepend('coffee', require('./loaders/coffee'))
environment.loaders.append('erb', require('./loaders/erb'))

module.exports = environment
