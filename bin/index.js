#!/usr/bin/env node

const cmd = require('../common/cmd');
const pkg = require('../package.json');
const chalk = require('chalk');

cmd
  // .version(pkg.version)
  .version(pkg.version, '-v, --version', 'output the current version')
  .name('zero')
  .usage('<commond> [args] [--options]')
  .command('start [entry] [tpl]', `start dev server`, { executableFile: '../script/start' })
  .command('build [entry] [tpl]', 'compile the code with production mode', { executableFile: '../script/build' })
  .command('create <template-type> <project-name>', 'generate project template', { executableFile: '../script/create' })
  .command('list', 'show template list', { executableFile: '../script/list' })
  .parse(process.argv);


module.exports = cmd;
