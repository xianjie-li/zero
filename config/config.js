const path = require('path');
const fs = require('fs-extra');

const configPath = path.resolve(process.cwd(), './zero.config.js');

let userConfig = {};
if (fs.pathExistsSync(configPath)) {
  userConfig = require(configPath);
}
/* 所有配置项在模板中都是可访问的 */
const defaultConfig = {
  publicPath: './', // 资源访问路径
  publicDirName: 'public', // 集中存放静态资源的目录名
  outputPath: './dist', // 文件打包到此目录，相对于根目录

  /* TODO: 添加预设模板 */
  /* TODO: 可通过命令监听组件文件组 */
  /* TODO: 配置mock服务器, 支持命令行开关 */
  entry: './src/main', // 默认入口文件位置，只在SPA模式下生效
  template: './index.html', // 默认模板文件位置，只在SPA模式下生效

  pages: null,
  mock: false,

  proxy: {},
  env: {
    // development: {
    //   BASE_URL: '/api/dev'
    //   /* 请勿使用PUBLIC作为key，因为它已经被占用 */
    // },
    // production: {
    //   BASE_URL: '/api/prod'
    // }
  },
  host: '0.0.0.0', // 支持命令行
  hash: true, // 文件hash
  htmlHash: false, // 打包时给html的引用资源打上hash(src="/app/app.js?6d635080fd6cd30bb150") dev模式下默认开启，build模式自动关闭，可以通过此选项手动开启
  gzip: true, // 支持命令行, 是否开启gzip
  analyzer: true, // 支持命令行, 是否分析包大小
  dropConsole: true, // 支持命令行, 是否在打包时移除console
  sass: {
    // prependData: '@import "@/style/_base/index.scss";',
    sassOptions: {
      // data: '@import "@/style/_base/index.scss";',
      precision: 3
    }
  },
  less: {},
  pug: {}, // pug配置
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  alias: {
    '@': path.resolve(__dirname, '../src')
  },
  typescriptChecker: true, // 底层使用babel对typescript进行编译，速度会比ts-loader更快，但是babel只负责转换ts，不会对类型错误进行提示，如果你使用idea或者vscode等支持ts类型检测的编辑器，确保项目根存在tsconfig.json文件即可， 如果编辑器不支持类型检测或希望webpack对类型错误进行提示则开启此项，它将开启一个独立的线程来进行类型检测。
  configWebpack(webpackConfig, { isDevelopment, isProduction }) {
    // if (isDevelopment) {
    //   webpackConfig.output.filename = 'test.js';
    // }
    return webpackConfig;
  },
};

/* cli */
/**
 * # build <js filepath> <html filepath>
 * gzip
 * hash
 * analyzer
 * dropConsole
 *
 * # dev <js filepath> <html filepath>
 * */

module.exports = () => ({
  ...defaultConfig,
  ...userConfig,
});
