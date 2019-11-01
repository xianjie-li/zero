const { getRootRelativePath } = require('../common/utils.js');
const portfinder = require('portfinder');
const webpack = require('webpack');
const config = require('../config/config')();

module.exports = async () => {
  const port = await portfinder.getPortPromise();

  return {
    contentBase: getRootRelativePath(`./${config.publicDirName}/`),
    publicPath: '/',
    watchContentBase: true,
    host: '0.0.0.0',
    port,
    hot: true,
    quiet: true,
    overlay: true,
    proxy: config.proxy,
    clientLogLevel: 'warning',
    before(app, server) {
      /* TODO: HTML改动监听 */
      /* TODO: 数据mock */
    },
  };
};
