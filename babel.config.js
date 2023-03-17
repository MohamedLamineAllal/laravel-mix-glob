const {
  setModuleResolverPluginForTsConfig,
} = require('babel-plugin-module-resolver-tsconfig');

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [setModuleResolverPluginForTsConfig({ extensions: ['.js', '.ts'] })],
};
