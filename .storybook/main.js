process.env.NODE_ENV = "development";
const railsWebpackEnv = require("../config/webpack/environment");

module.exports = {
  stories: [
    "../app/javascript/stories/*.stories.mdx",
    "../app/javascript/stories/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      ...railsWebpackEnv.config.resolve,
      modules: railsWebpackEnv.resolvedModules.map((i) => i.value),
    },
    module: {
      ...config.module,
      rules: railsWebpackEnv.loaders
        .filter((i) => i.key !== "nodeModules")
        .map((i) => i.value),
    },
    plugins: [
      ...config.plugins,
      ...railsWebpackEnv.plugins.map((i) => i.value),
    ],
  }),
}
