#!/usr/bin/env node

const cmd = require('../common/cmd');

cmd
  .version('0.0.1')
  .usage('<commond> [options]')
  .command('start', 'start devServer', { executableFile: '../script/start' })
  .parse(process.argv)


module.exports = cmd;