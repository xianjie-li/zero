const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const cmd = require('../common/cmd');
const { log, getRootRelativePath } = require('../common/utils');
const templates = require('../template/template-infos');
const pkg = require('../package.json');

cmd.parse(process.argv);

createTemplate().then();

async function createTemplate() {
  const [tplName, projectName] = cmd.args;

  if (!tplName) {
    log.error('template type require!');
  }

  if (!projectName) {
    log.error('project name require!');
  }

  const nowTpl = templates.find(tpl => tpl.name === tplName);
  if (!nowTpl) {
    log.error(`template ${ chalk.blue(tplName) } not exists，execute ${ chalk.blue('zero list') } see available template`);
  }

  const projectPath = getRootRelativePath(`./${projectName}`);

  if (fs.pathExistsSync(projectPath)) {
    log.error(`create project fail, ${chalk.red(projectPath)} dir exists`)
  }

  const spinner = ora('creating，waiting...').start();

  for (const filePath of nowTpl.extraFiles) {
    fs.copySync(filePath, projectPath);
  }

  const userPkgPath = path.resolve(projectPath, './package.json');
  const userPkg = require(userPkgPath);

  userPkg['devDependencies']['@lxjx/zero'] = `^${pkg.version}`;
  userPkg['devDependencies']['react-hot-loader'] = `${pkg.dependencies['react-hot-loader']}`;
  userPkg['dependencies']['react'] = `${pkg.devDependencies['react']}`;
  userPkg['dependencies']['react-dom'] = `${pkg.devDependencies['react-dom']}`;
  userPkg['name'] = projectName;

  if (tplName === 'ts-spa' || tplName === 'ts-mpa') {
    userPkg['scripts']['prebuild'] = "npm run lint && npm run typecheck";
    userPkg['scripts']['typecheck'] = "tsc --noEmit";
  }

  fs.outputJsonSync(userPkgPath, userPkg, {
    spaces: 2,
  });

  spinner.succeed('create success!');

  log.info(`execute ${chalk.blue(`cd ./${projectName}`)} in to project dir，any use ${chalk.blue('yarn')} or ${chalk.blue('npm install')} install dependencies, after the installation complete, see README.md to use，documentation for more:`);
  console.log('https://github.com/Iixianjie/zero');
}


