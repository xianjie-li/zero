
const { getRootRelativePath } = require('../common/utils.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config/config')();
const getModules = require('./getModules');
const webpack = require('webpack');
const path = require('path');

module.exports = (mode) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  const baseConfig = {
    context: path.resolve(__dirname, '../'),
    entry:  getRootRelativePath('index.js'),

    resolve: {
      extensions: config.extensions,
      alias: config.alias,
    },

    /* TODO: modules配置 */
    module: getModules(isDevelopment, MiniCssExtractPlugin),

    plugins: [
      /* TODO: 多页面配置 */
      /* TODO: happyPack优化打包速度 */
      /* TODO: 定义环境变量 */
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: getRootRelativePath('index.html'),
        hash: isDevelopment,
        chunks: ['main']
      })
    ]
  }

  if (isProduction) {
    baseConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: `${config.publicDirName}/css/[name]${
          config.hash ? '.[contenthash]' : ''
        }.css`,
      }),
    );
  }

  return baseConfig;
}