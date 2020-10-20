const preprocessors = require('svelte-preprocess')
module.exports = {
  test: /\.svelte(\.erb)?$/,
  use: [{
    loader: 'svelte-loader',
    options: {
      hotReload: false,
      emitCss: true,
      preprocess: preprocessors()
    }
  }],
}
