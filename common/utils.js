const path = require('path');
const config = require('../config/config')();
const utils = require('@lxjx/utils');

const fullPublicPath = config.publicPath + config.publicDirName;


exports.getRootRelativePath = (...args) => {
  const cwd = process.cwd();
  return args.length ? path.resolve(cwd, ...args) : cwd;
};

exports.getModeInfo = (mode) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  return {
    isDevelopment,
    isProduction,
  };
};

exports.createShare = (mode) => {
  return {
    fullPublicPath,
    isSPA: utils.isEmpty(config.entry),
  };
};

exports.getEnvs = (mode) => {
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
