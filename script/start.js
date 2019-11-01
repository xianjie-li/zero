const cmd = require('../common/cmd');
const { createShare } = require('../common/utils.js');
const baseConfigFactory = require('../webpack/base-config-factory');
const devConfigFactory = require('../webpack/dev-config-factory');
const devserverConfigFactory = require('../webpack/devserver-config-factory');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const config = require('../config/config')();

const mode = 'development';
process.env.NODE_ENV = mode;

cmd
  .option('-p, --port', '指定port')
  .option('-h, --host', '指定host')
  .parse(process.argv);

startServer().then();

async function startServer() {
  const devserverConfig = await devserverConfigFactory();
  const share = {
    port: devserverConfig.port,
    ...createShare(),
  };

  const compiler = webpack(merge(baseConfigFactory(mode, share), devConfigFactory(mode, share)));

  compiler.hooks.done.tap('done', state => {
    // console.log(1, state.hasErrors());
    // console.log(2, state.hasWarnings());
  });

  const server = new WebpackDevServer(compiler, devserverConfig);

  server.listen(devserverConfig.port, devserverConfig.host, (err) => {

  });
}
