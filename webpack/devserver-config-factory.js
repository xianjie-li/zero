const portfinder = require('portfinder');

const { getRootRelativePath } = require('../common/utils.js');
const config = require('../config/config')();

module.exports = async (cmdPort, cmdHost) => {
  const port = await portfinder.getPortPromise();

  return {
    contentBase: getRootRelativePath(`./${config.publicDirName}/`),
    publicPath: '/',
    watchContentBase: true,
    host: cmdHost || config.host,
    port: cmdPort || config.port || port,
    hot: true,
    quiet: true,
    overlay: true,
    proxy: config.proxy,
    clientLogLevel: 'warning',
    // before(app, server, compiler) {
    // },
  };
};
