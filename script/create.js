const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const cmd = require('../common/cmd');
const { log, getRootRelativePath } = require('../common/utils');
const templates = require('../template/template-infos');
const { promisify } = require('@lxjx/utils');
const asyncCopy = promisify(fs.copy);
const pkg = require('../package.json');

cmd.parse(process.argv);

createTemplate();

async function createTemplate() {
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

  for (const filePath of nowTpl.extraFiles) {
    fs.copySync(filePath, projectPath);
  }

  const userPkgPath = path.resolve(projectPath, './package.json');
  const userPkg = require(userPkgPath);
  
  userPkg['devDependencies']['@lxjx/zero'] = `^${pkg.version}`;
  userPkg['devDependencies']['react-hot-loader'] = `${pkg.dependencies['react-hot-loader']}`;
  userPkg['name'] = projectName;

  fs.outputJsonSync(userPkgPath, userPkg, {
    spaces: 2,
  });

  spinner.succeed('创建成功!');

  log.info(`请执行 ${chalk.blue(`cd ./${projectName}`)} 切换到项目目录，并使用 ${chalk.blue('yarn')} 或 ${chalk.blue('npm install')} 安装依赖, 安装完成后, 根据README.md文件中的说明启动开发服务，或者查看文档:`);
  console.log('https://github.com/Iixianjie/zero');
}


