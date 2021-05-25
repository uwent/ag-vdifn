const preprocessors = require('svelte-preprocess')

module.exports = {
  module: {
    rules: [
      {
        test: /\.svelte(\.erb)?$/,
        use: {
          loader: 'svelte-loader',
          options: {
            hotReload: false,
            emitCss: true,
            preprocess: preprocessors()
          }
        }
      },
      {
        // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
}
