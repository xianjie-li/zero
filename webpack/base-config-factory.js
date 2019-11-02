const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const utils = require('@lxjx/utils');

const { getRootRelativePath, getModeInfo, getEnvs, mixConfigAndArgs } = require('../common/utils');
const config = require('../config/config')();
const getModules = require('./getModules');
const userPkg = require(getRootRelativePath('./package.json')) || {};

module.exports = (mode, share) => {
  const { fullPublicPath, isSPA, entry, template } = mixConfigAndArgs(config, share);
  const { isDevelopment } = getModeInfo(mode);
  console.log(entry, template);

  /* TODO: 多页面配置 */

  const baseConfig = {
    context: path.resolve(__dirname, '../'),
    entry: {
      app: getRootRelativePath(entry),
    },

    resolve: {
      extensions: config.extensions,
      alias: config.alias,
    },

    module: getModules(isDevelopment, MiniCssExtractPlugin),

    plugins: [
      /* TODO: happyPack优化打包速度 */
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new webpack.DefinePlugin(getEnvs(mode)),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: getRootRelativePath(template),
        minify: isSPA, // 单页面时压缩html页面
        hash: config.htmlHash || isDevelopment,
        chunks: ['runtime', 'vendor', 'common', 'app'],
        /* TODO: 配置输入到模板中的变量 */
        templateParameters: {
          public: fullPublicPath,
          title: userPkg.name || 'zero-cli',
        }
      }),
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
