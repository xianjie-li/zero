#!/usr/bin/env node

const cmd = require('../common/cmd');

cmd
  .version('0.0.1')
  .name('zero')
  .usage('<commond> [args] [--options]')
  .command('start [entry] [tpl]', '启动开发服务器, 可以通过传入entry和tpl来自行指定入口以及模板文件', { executableFile: '../script/start' })
  .command('build [entry] [tpl]', '构建线上包', { executableFile: '../script/build' })
  .parse(process.argv);


module.exports = cmd;
