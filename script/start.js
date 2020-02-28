const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const chokidar = require('chokidar');
const glob = require('glob');
const utils = require('@lxjx/utils');
const bodyParser = require('body-parser');

const cmd = require('../common/cmd');
const { createShare } = require('../common/utils.js');
const baseConfigFactory = require('../webpack/base-config-factory');
const devConfigFactory = require('../webpack/dev-config-factory');
const devserverConfigFactory = require('../webpack/devserver-config-factory');
const { checkArgs, getModeInfo, getRootRelativePath, checkToggle } = require('../common/utils');
const config = require('../config/config')();

const mode = 'development';
process.env.NODE_ENV = mode;

cmd
  .option('--port <port>', 'specify port')
  .option('--host <host>', 'specify host')
  .option('--mock <toggle>', 'start mock server')
  .parse(process.argv);

const [entry, tpl] = checkArgs(cmd.args);

startServer().then();

async function startServer() {
  const devserverConfig = await devserverConfigFactory(cmd.port, cmd.host);
  const share = {
    port: devserverConfig.port,
    entry,
    template: tpl,
    ...createShare(mode),
  };

  const webpackConfig = merge(baseConfigFactory(mode, share), devConfigFactory(mode, share));

  const compiler = webpack(config.configWebpack(webpackConfig, getModeInfo(mode)));

  const server = new WebpackDevServer(compiler, devserverConfig);

  // 帮助模板文件进行重载
  fixTemplateToReload(compiler, server);

  // mock配置
  mockHandle(server);

  // 监听配置文件的改动 /* TODO: 只是简单的重启服务文件改动是不会生效的，必须重启进程 */
  // watchConfig(server, devserverConfig.port, devserverConfig.host);

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

function mockHandle(server) {
  if (!checkToggle(cmd.mock, config.mock)) return;

  const apiFiles = glob.sync(getRootRelativePath('./mock/*.js'));
  if(apiFiles.length <= 0) return;

  server.app.use(bodyParser.json());
  server.app.use(bodyParser.urlencoded({ extended: true }));

  apiFiles.forEach(mockPath => {
    const mockFactory = require(mockPath);
    if (utils.isFunction(mockFactory)) {
      mockFactory(server.app);
    }
  });
}

function watchConfig(server, port, host) {
  const configFile = glob.sync(getRootRelativePath('./zero.config.js'))[0];

  if (!configFile) return;

  const watcher = chokidar.watch(configFile);

  watcher.on('change', (path) => {
      console.log('配置文件发生变更，正在重启服务...');
      watcher.close().then();
      server.close(() => {
        startServer().then();
      });
    })
}

