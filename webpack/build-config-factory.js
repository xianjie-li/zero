const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const fs = require('fs-extra');

const { getRootRelativePath, mixConfigAndArgs, checkToggle } = require('../common/utils.js');
const config = require('../config/config')();

module.exports = (mode, share) => {
  const { isSPA, gzip, analyzer, dropConsole } = mixConfigAndArgs(config, share);

  const buildConfig = {
    mode,

    output: {
      path: getRootRelativePath(config.outputPath),
      filename: `${ config.publicDirName }/js/[name]${ config.hash ? '.[chunkhash]' : '' }.js`,
      chunkFilename: `${ config.publicDirName }/js/[name]${ config.hash ? '.[chunkhash]' : '' }.js`,
      publicPath: config.publicPath,
    },

    devtool: false,

    // stats: {
    //   assets: true,
    //   chunks: false,
    //   errorDetails: false,
    //   modules: false,
    //   entrypoints: false,
    //   children: false,
    // },

    optimization: {
      minimizer: [
        new TerserJSPlugin({
          terserOptions: {
            compress: {
              drop_console: checkToggle(dropConsole, config.dropConsole),
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        automaticNameDelimiter: '-',
        cacheGroups: Object.assign({}, {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            minChunks: 1,
            name: 'vendor',
            reuseExistingChunk: true,
            priority: 0,
          },
          // 单页面时不需要分割共享模块
        }, isSPA ? {} : {
          common: {
            minChunks: 2,
            name: 'common',
            reuseExistingChunk: true,
            priority: -5,
          },
        }),
      },
    },

    plugins: [
      new ProgressBarPlugin(),
      new CleanWebpackPlugin(),
    ],
  };

  /* 单页面时对html页面进行美化 */
  if (!isSPA) {
    buildConfig.plugins.push(
      new HtmlBeautifyPlugin({
        config: {
          end_with_newline: true,
          indent_size: 2,
          indent_with_tabs: true,
          indent_inner_html: true,
          preserve_newlines: true,
        },
        replace: [' type="text/javascript"'],
      }))
    ;
  }

  if (checkToggle(gzip)) {
    buildConfig.plugins.push(
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    );
  }

  if (checkToggle(analyzer)) {
    buildConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // disabled、server、static
        openAnalyzer: false,
      }),
    );
  }

  /* 移动静态资源 */
  const publicDir = getRootRelativePath('./', config.publicDirName);
  if (fs.pathExistsSync(publicDir)) {
    buildConfig.plugins.push(
      new CopyPlugin([
        {
          from: publicDir,
          to: getRootRelativePath(`${ config.outputPath }/${ config.publicDirName }`),
        },
      ])
    )
  }

  return buildConfig;
};
