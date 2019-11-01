const { getRootRelativePath, getModeInfo } = require('../common/utils.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config/config')();
const webpack = require('webpack');
const notifier = require('node-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

module.exports = (mode, { port, fullPublicPath }) => {

  return {
    mode,
    /* dev时使用固定地址即可 */
    output: {
      filename: 'app/[name].js',
      publicPath: '/',
    },

    resolve: {
      alias: {
        // 用于开启hooks热加载
        'react-dom': require.resolve('@hot-loader/react-dom'),
      },
    },

    devtool: 'eval-source-map',

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      /* TODO: 错误不会同步到浏览器，必须手动刷新 */
      // new ErrorOverlayPlugin(),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`服务运行于: http://localhost:${ port }, 按住ctrl点击打开`],
        },
        // 桌面通知
        onErrors: (severity, errors) => {
          if (severity !== 'error') {
            return;
          }
          const error = errors[0];

          notifier.notify({
            title: '😭ZERO: 编译错误, 请查看控制台',
            message: `${ severity } : ${ error.name }`,
            subtitle: error.file || '',
            sound: 'Glass',
            // icon: ICON
          });
        },
      }),
    ],
  };
};
