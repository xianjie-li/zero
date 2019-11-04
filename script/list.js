const chalk = require('chalk');
const templates = require('../template/template-infos');
const { log } = require('../common/utils');

log.info('模板列表:');
templates.forEach(tpl => {
  console.log(`- ${chalk.cyan(tpl.name)}            ${tpl.desc}`);
});
