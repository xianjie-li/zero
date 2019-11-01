const { getRootRelativePath, getModeInfo, getEnvs } = require('../common/utils.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config/config')();
const getModules = require('./getModules');
const webpack = require('webpack');
const path = require('path');
const utils = require('@lxjx/utils');


module.exports = (mode, { fullPublicPath, isSPA }) => {
  const { isDevelopment } = getModeInfo(mode);

  /* TODO: 多页面配置 */
  /* TODO: typescript */

  const baseConfig = {
    context: path.resolve(__dirname, '../'),
    entry: {
      app: getRootRelativePath('./src/main'),
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
        template: getRootRelativePath('index.html'),
        minify: isSPA, // 单页面时压缩html页面
        hash: config.htmlHash || isDevelopment,
        chunks: ['runtime', 'vendor', 'common', 'app'],
        /* TODO: 配置输入到模板中的变量 */
        templateParameters: {
          public: fullPublicPath,
          title: 'zero-cli',
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
