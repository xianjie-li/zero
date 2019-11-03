const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const utils = require('@lxjx/utils');

const { getRootRelativePath, getModeInfo, getEnvs, mixConfigAndArgs, getEntry, createEntryAndTplPlugins } = require('../common/utils');
const config = require('../config/config')();
const getModules = require('./getModules');
const userPkg = require(getRootRelativePath('./package.json')) || {};

module.exports = (mode, share) => {
  const { fullPublicPath, isSPA, entry, template } = mixConfigAndArgs(config, share);
  const { isDevelopment } = getModeInfo(mode);

  const entryMetas = config.pages ? getEntry() : [];

  const [entryConfig, tplPlugins] = createEntryAndTplPlugins({
    isSPA,
    entry,
    template,
    isDevelopment,
    userPkg,
    fullPublicPath,
  }, entryMetas);

  const baseConfig = {
    context: path.resolve(__dirname, '../'),
    entry: entryConfig,

    resolve: {
      extensions: config.extensions,
      alias: config.alias,
    },

    module: getModules(isDevelopment, MiniCssExtractPlugin),

    plugins: [
      /* TODO: happyPack优化打包速度 */
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new webpack.DefinePlugin(getEnvs(mode)),
      ...tplPlugins,
    ],
  };

  if (!isDevelopment) {
    baseConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: `${ config.publicDirName }/css/[name]${
          config.hash ? '.[contenthash]' : ''
        }.css`,
      }),
    );
  }

  return baseConfig;
};
