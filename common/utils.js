const path = require('path');
const utils = require('@lxjx/utils');
const chalk = require('chalk');
const fs = require('fs-extra');

const config = require('../config/config')();


const fullPublicPath = config.publicPath + config.publicDirName;

/* 获取指定相对执行目录的绝对路径，参数为空时返回执行目录 */
exports.getRootRelativePath = (...args/* string? */) => {
  const cwd = process.cwd();
  return args.length ? path.resolve(cwd, ...args) : cwd;
};

/* 根据mode返回更语义化的识别信息 */
exports.getModeInfo = (mode/* production | development */) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  return {
    isDevelopment,
    isProduction,
  };
};

/* 根据mode创建一些常用的共享配置 */
exports.createShare = (mode/* production | development */) => {
  return {
    fullPublicPath,
    isSPA: utils.isEmpty(config.pages),
  };
};

/* 根据mode获取并格式化环境变量 */
exports.getEnvs = (mode/* production | development */) => {
  const nowEnv = config.env[mode];
  const defineEnv = {
    PUBLIC: JSON.stringify(fullPublicPath),
    NODE_ENV: mode,
  };
  if (!utils.isEmpty(nowEnv)) {
    for (const key of Object.keys(nowEnv)) {
      defineEnv[key] = JSON.stringify(nowEnv[key]);
    }
  }
  return defineEnv;
};

/* feedback */
const prefix = 'ZERO: ';
exports.log = {
  /* 支持Error对象和 字符串 */
  error(error/* Error | string */) {
    let msg = '';
    if (utils.isError(error) && error.message) {
      msg = error.message;
    }

    if (utils.isString(error)) {
      msg = error;
    }

    console.log(`${ chalk.red('❌ ' + prefix) }${ msg }`);
  },
  /* 支持字符串 */
  info(string = '') {
    console.log(`${ chalk.blue(prefix) }${ string }`);
  },
  /* 支持Error对象和 字符串 */
  warn(string = '') {
    console.log(`${ chalk.yellow('⚠ ' + prefix) }${ string }`);
  },
  success(string = '') {
    console.log(`${ chalk.green('✔ ' + prefix) }${ string }`);

  },
};

/* 把配置和命令行参数与选项合并，命令行的配置优先于配置文件 */
exports.mixConfigAndArgs = (config/* zeroConfig */, args/* { [k: any]: any } */) => {
  const _config = {...config};
  for (const [key, value] of Object.entries(args)) {
    if (!utils.isNullOrUndefined(value)) {
      _config[key] = value;
    }
  }
  return _config;
};

/* 简化命令行参数与配置文件中布尔值与开关值0、1的选取方式 */
exports.checkToggle = (toggleNumber, toggleBoolean) => {
  const num = +toggleNumber;
  if (utils.isNumber(num)) {
    if (num === 0) {
      return false;
    }
    if (num === 1) {
      return true;
    }
  }

  return toggleBoolean;
};

/* 检查参数是否通过并返回js和template和entry的绝对路径 */
exports.checkArgs = (args/* string[] */) => {
  if (!args.length) {
    return [];
  }

  if (args.length && args.length < 2) {
    exports.log.error('额外参数至少为两位');
    process.exit(1);
  }

  const entryPath = exports.getRootRelativePath(args[0]);
  const tplPath = exports.getRootRelativePath(args[1]);

  if (!fs.pathExistsSync(entryPath) || !fs.pathExistsSync(tplPath)) {
    exports.log.error('路径不存在');
    process.exit(1);
  }

  return [
    entryPath,
    tplPath,
  ];
};
