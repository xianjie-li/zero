const webpack = require('webpack');
const notifier = require('node-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const { getRootRelativePath } = require('../common/utils');
const config = require('../config/config')();

module.exports = (mode, { port }) => {

  const devConfig = {
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
          messages: [`服务运行于: http://localhost:${ port }`],
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

  if (config.typescriptChecker) {
    devConfig.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        // 将async设为false，可以阻止Webpack的emit等待类型检查器/linter，并向Webpack的编译添加错误。
        tsconfig: getRootRelativePath('./tsconfig.json'),
        async: false,
        // eslint: true,
      }),
      // 将TypeScript类型检查错误以弹框提示
      // 如果fork-ts-checker-webpack-plugin的async为false时可以不用
      // 否则建议使用，以方便发现错误
      // new ForkTsCheckerNotifierWebpackPlugin({
      //   title: 'ZERO - TypeScript',
      //   excludeWarnings: true,
      //   skipSuccessful: true,
      // }),
    );
  }

  return devConfig;
};
