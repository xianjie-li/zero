const path = require('path');
const utils = require('@lxjx/utils');
const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    isSPA: !config.pages,
  };
};

/* 根据mode获取并格式化环境变量 */
exports.getEnvs = (mode/* production | development */) => {
  const nowEnv = config.env[mode];
  const defineEnv = {
    PUBLIC: JSON.stringify(fullPublicPath),
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
    process.exit(1);
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
  const _config = { ...config };
  for (const [key, value] of Object.entries(args)) {
    if (!utils.isNullOrUndefined(value)) {
      _config[key] = value;
    }
  }
  return _config;
};

/* 简化命令行参数与配置文件中布尔值与开关值0、1的选取方式 */
exports.checkToggle = (toggleNumber, toggleBoolean) => {
  if (toggleNumber === undefined) {
    return toggleBoolean;
  }

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
    if (!exports.createShare().isSPA) {
      return [];
    }
    const entry = glob.sync(exports.getRootRelativePath('./src/main.*(j|t)s?(x)'));
    const tpl = glob.sync(exports.getRootRelativePath(config.template));
    if (entry.length === 0 || tpl.length === 0) {
      exports.log.error(`请确保执行目录存在${ chalk.blue('./src/main.(t|j)sx?') }以及${ chalk.blue(config.template) }文件，你也可以通过${ chalk.blue('zero (start|build) [entry] [tpl]') }来自行指定入口和模板文件`);
      process.exit(1);
    }
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

/**
 * 以指定规则获取cwd/src/pages/下的文件作为入口以及模板，规则如下:
 * 1. 以第一级目录下的直接子目录名作为入口名
 * 2. 将作为入口名目录下的同名(jsx?|tsx?)文件作为入口文件，同名的(pug|html)文件作为模板文件
 * 3. pageInfo.(js|ts)中的导出会作为模板变量(pageInfo)传入模板文件中，可以使用对应的模板语法获取
 * 4. 直接子目录下的js以'_'开头进行命名可以避免改文件被误识别为入口文件，直接子目录内部的任何子目录不受以上规则影响
 * */
exports.getEntry = () => {
  const entrys = glob.sync(
    // 不匹配下划线开头的以及pageInfo
    path.resolve(exports.getRootRelativePath(), './src/pages/', '*/!(_|pageInfo)*.{j,t}s?(x)'),
  );
  if (utils.isArray(entrys) && entrys.length > 0) {
    const formatEntry = [];

    entrys.forEach((v) => {
      const baseName = path.basename(v).replace(/\.(js|ts)/, '');
      const dirName = path.dirname(v);

      // 查找入口js所属路径下的模板文件(pug|html)
      const tpl = glob.sync(`${ path.resolve(dirName) }*/*.{pug,html}`);
      // 该目录下的pageInfo.js文件作为额外信息注入模板
      let pageInfo = glob.sync(`${ path.resolve(dirName) }*/pageInfo.{j,t}s`);

      if (pageInfo.length) {
        pageInfo = require(pageInfo[0]);
      } else {
        pageInfo = {};
      }

      /* 存在模板文件时该才视为一个入口 */
      if (tpl[0]) {
        formatEntry.push({
          name: baseName,
          entry: v,
          template: tpl[0],
          pageInfo,
        });
      }
    });

    return formatEntry;
  }

  exports.log.error('没有在./src/pages/目录下找到任何匹配的入口文件');
};

/* 根据当前的入口类型生成不同的入口和模板配置 */
exports.createEntryAndTplPlugins = ({
  isSPA, entry, isDevelopment, userPkg, template
}, entryMetas) => {
  if (isSPA) {
    return [
      {
        app: exports.getRootRelativePath(entry),
      },
      [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: exports.getRootRelativePath(template),
          minify: isSPA, // 单页面时压缩html页面
          hash: config.htmlHash || isDevelopment,
          chunks: ['runtime', 'vendor', 'common', 'app'],
          templateParameters: {
            public: fullPublicPath,
            title: userPkg.name || 'zero-cli',
          }
        }),
      ]
    ];
  }

  const entryMap = {};
  const tplPlugins = [];
  entryMetas.forEach(page => {
    entryMap[page.name] = page.entry;
    tplPlugins.push(
      new HtmlWebpackPlugin({
        filename: page.name + '.html',
        template: page.template,
        minify: isSPA, // 单页面时压缩html页面
        cache: isDevelopment,
        hash: config.htmlHash || isDevelopment,
        chunks: ['runtime', 'vendor', 'common', page.name],
        templateParameters: {
          public: fullPublicPath,
          title: userPkg.name || 'zero-cli',
          pageInfo: page.pageInfo,
        }
      }),
    );
  });
  return [entryMap, tplPlugins];
};
