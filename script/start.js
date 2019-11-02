const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');

const cmd = require('../common/cmd');
const { createShare } = require('../common/utils.js');
const baseConfigFactory = require('../webpack/base-config-factory');
const devConfigFactory = require('../webpack/dev-config-factory');
const devserverConfigFactory = require('../webpack/devserver-config-factory');
const { checkArgs, getModeInfo } = require('../common/utils');
const config = require('../config/config')();

const mode = 'development';
process.env.NODE_ENV = mode;

cmd
  .option('--port <port>', '指定服务port')
  .option('--host <host>', '指定服务host')
  .parse(process.argv);

const [entry, tpl] = checkArgs(cmd.args);

startServer().then();

async function startServer() {
  const devserverConfig = await devserverConfigFactory(cmd.port, cmd.host);
  const share = {
    port: devserverConfig.port,
    entry,
    template: tpl,
    ...createShare(),
  };

  const webpackConfig = merge(baseConfigFactory(mode, share), devConfigFactory(mode, share));

  const compiler = webpack(config.configWebpack(webpackConfig, getModeInfo(mode)));

  const server = new WebpackDevServer(compiler, devserverConfig);

  // 帮助模板文件进行重载
  fixTemplateToReload(compiler, server);

  server.listen(devserverConfig.port, devserverConfig.host, (err) => {});
}

function fixTemplateToReload(compiler, server) {
  // https://github.com/webpack/webpack-dev-server/issues/1271
  const watchFiles = ['.html', '.pug'];
  compiler.hooks.done.tap('done', () => {
    const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);

    const tplChange = changedFiles.some(filePath => {
      return watchFiles.includes(path.parse(filePath).ext);
    });

    if (tplChange) {
      server.sockWrite(server.sockets, 'content-changed');
    }
  });
}
