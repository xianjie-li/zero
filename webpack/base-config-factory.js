const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');

const { getRootRelativePath, getModeInfo, getEnvs, mixConfigAndArgs, getEntry, createEntryAndTplPlugins } = require('../common/utils');
const config = require('../config/config')();
const getModules = require('./getModules');

let userPkg = {};
const pkgPath = getRootRelativePath('./package.json');
if (fs.pathExistsSync(pkgPath)) {
  userPkg = require(pkgPath);
}


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
