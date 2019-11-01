#!/usr/bin/env node

const cmd = require('../common/cmd');

cmd
  .version('0.0.1')
  .usage('<commond> [options]')
  .command('start', 'start devServer', { executableFile: '../script/start' })
  .command('build', 'build', { executableFile: '../script/build' })
  .parse(process.argv);


module.exports = cmd;
