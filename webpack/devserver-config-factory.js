
const { getRootRelativePath } = require('../common/utils.js');
const portfinder = require('portfinder');
const webpack = require('webpack');


module.exports = async (entry) => {
  const port = await portfinder.getPortPromise();
  
  return {
    contentBase: getRootRelativePath('public/'),
    watchContentBase: true,
    publicPath: '/',
    host: '0.0.0.0',
    port,
    hot: true,
    quiet: true,
    overlay: true,
    /* TODO: 添加proxy配置 */
    // proxy,
    clientLogLevel: 'warning',
    /* TODO: 添加errorOverlayMiddleware */
    before(app, server) {
      /* TODO: HTML改动监听 */
      /* TODO: 数据mock */
    }
  }
}