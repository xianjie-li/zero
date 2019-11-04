#!/usr/bin/env node

const cmd = require('../common/cmd');
const pkg = require('../package.json');

cmd
  .version(pkg.version)
  .name('zero')
  .usage('<commond> [args] [--options]')
  .command('start [entry] [tpl]', '启动开发服务器, 可以通过传入entry和tpl来自行指定入口以及模板文件', { executableFile: '../script/start' })
  .command('build [entry] [tpl]', '构建线上包', { executableFile: '../script/build' })
  .command('create <template-type> <project-name>', '根据指定模板生成项目文件', { executableFile: '../script/create' })
  .command('list', '查看模板列表', { executableFile: '../script/list' })
  .parse(process.argv);


module.exports = cmd;
