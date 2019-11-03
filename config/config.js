const path = require('path');
const fs = require('fs-extra');

const configPath = path.resolve(process.cwd(), './zero.config.js');

let userConfig = {};
if (fs.pathExistsSync(configPath)) {
  userConfig = require(configPath);
}

/* TODO: 3. 添加 -g命令 */

const defaultConfig = {
  publicPath: '/', // 资源访问路径, 当需要编译后的文件能本地直接访问时，可以设置为./
  publicDirName: 'public', // 公众资源文件夹，存放不想通过webpack编译的东西，打包后所有打包产物和该目录下的文件会被移动outputPath下的同名目录下
  outputPath: './dist', // 文件打包到此目录, 以当前工作目录为根目录

  /* TODO: 1. 添加预设模板 typescript ts pages(js、js) */
  /* TODO: 2. eslint */

  entry: './src/main', // 默认入口文件位置，只在没有设置pages的情况下生效
  template: './index.html', // 默认模板文件位置，只在没有设置pages的情况下生效

  /* TODO: 监听pages目录下文件的变更重启服务 */
  /**
   * 开启后，会以指定规则读取cwd()/src/pages下的文件作为入口，规则如下:
   * 1. 以第一级目录下的直接子目录名作为入口名
   * 2. 将作为入口名目录下的同名(jsx?|tsx?)文件作为入口文件，同名的(pug|html)文件作为模板文件
   * 3. pageInfo.(js|ts)中的导出会作为模板变量(pageInfo)传入模板文件中，可以使用对应的模板语法获取
   * 4. 直接子目录下的js以'_'开头进行命名可以避免改文件被误识别为入口文件，直接子目录内部的任何子目录不受以上规则影响
   * */
  pages: false, // 支持命令行

  /* TODO: 监听mock目录下文件的变更重启服务 */
  mock: false, // dev模式下使用, 开启mock服务, 支持命令行

  proxy: {},
  env: {
    // development: { /* 请勿使用PUBLIC作为key，因为它已经被占用 */ },
    // production: { /* 请勿使用PUBLIC作为key，因为它已经被占用 */ }
  },
  host: '0.0.0.0', // dev模式下使用, 支持命令行
  hash: true, // 打包时为文件生成hash
  htmlHash: false, // 打包时给html的引用资源打上hash(src="/app/app.js?6d635080fd6cd30bb150") 默认dev模式下默认开启，build模式自动关闭。可以通过此选项手动开启
  gzip: true, // 是否开启gzip，支持命令行
  analyzer: true, // 是否分析包大小，支持命令行
  dropConsole: true, // 是否在打包时移除console，支持命令行
  sass: { // 传递给sass-loader的options
    // prependData: '@import "@/style/_base/index.scss";',
    sassOptions: {
      // data: '@import "@/style/_base/index.scss";',
      precision: 3
    }
  },
  less: {}, // 传递给less-loader的options
  pug: {}, // 传递给pug-loader的options
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  alias: { // 同webpackOptions.alias
    '@': path.resolve(process.cwd(), '../src')
  },
  /* 工作目录根目录存在tsconfig.json时视为开启typescript支持 */
  typescriptChecker: true, // 底层使用babel对typescript进行编译，速度会比ts-loader更快，但是babel只负责转换ts，不会对类型错误进行提示，如果你使用idea或者vscode等支持ts类型检测的编辑器，确保项目根存在tsconfig.json文件即可，如果编辑器不支持类型检测或希望webpack对类型错误进行提示则开启此项，它将开启一个独立的线程来进行类型检测。
  configWebpack(webpackConfig, { isDevelopment, isProduction }) { // 可通过此方法简单的自定义webpack配置, 请确保将修改后的config正确返回
    // if (!this.pages && isProduction) {
    //   webpackConfig.output.filename = 'myApp.js';
    // }
    return webpackConfig;
  },
};

module.exports = () => ({
  ...defaultConfig,
  ...userConfig,
});
