const path = require('path');
const fs = require('fs-extra');

exports.getRootRelativePath = (...arg) => {
  const cwd = process.cwd();
  return arg.length ? path.resolve(cwd, ...arg) : cwd;
};

exports.getPostCssConfigPath = () => {
  const fileName = 'postcss.config.js';
  const userPath = path.resolve(process.cwd(), './', fileName);
  const localPath = path.resolve(__dirname, '../rc');

  /* TODO: 验证是否成功 */
  if(fs.pathExistsSync(userPath)) {
    return exports.getRootRelativePath();
  }

  console.log(localPath);
  return localPath;
};