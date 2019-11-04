const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');

const cmd = require('../common/cmd');
const { log, getRootRelativePath } = require('../common/utils');
const templates = require('../template/template-infos');

cmd.parse(process.argv);

createTemplate();

function createTemplate() {
  const [tplName, projectName] = cmd.args;

  if (!tplName) {
    log.error('请指定模板类型!');
  }

  if (!projectName) {
    log.error('输入项目名称');
  }

  const nowTpl = templates.find(tpl => tpl.name === tplName);
  if (!nowTpl) {
    log.error(`模板${ chalk.blue(tplName) }不存在，请通过${ chalk.blue('zero list') }查看可用模板`);
  }

  const projectPath = getRootRelativePath(`./${projectName}`);

  if (fs.pathExistsSync(projectPath)) {
    log.error(`创建项目文件失败, ${chalk.red(projectPath)} 目录已存在`)
  }

  const spinner = ora('正在创建文件，请稍候...').start();

  nowTpl.extraFiles.forEach(path => {
    fs.copySync(path, projectPath);
  });

  spinner.succeed('创建成功!');
  log.info(`请在项目目录执行${chalk.blue('yarn')} 或 ${chalk.blue('npm install')} 安装依赖, 安装完成后, 根据README.md文件中的说明启动开发服务，或者查看文档:`);
  console.log('https://github.com/Iixianjie/zero');
}


