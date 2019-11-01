const path = require('path');

/* 所有配置项在模板中都是可访问的 */
const defaultConfig = {
  publicPath: './', // 资源访问路径
  publicDirName: 'public', // 集中存放静态资源的目录名
  outputPath: './dist', // 文件打包到此目录，相对于根目录

  /* TODO: 多入口支持 */
  /* TODO: 简易的自定义配置 */
  /* TODO: 配置mock服务器 */
  entry: null,

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
  hash: true, // 文件hash
  htmlHash: false, // 打包时给html的引用资源打上hash(src="/app/app.js?6d635080fd6cd30bb150") dev模式下默认开启，build模式自动关闭，可以通过此选项手动开启
  gzip: true,
  analyzer: true, // 包分析
  sassOptions: {
    // prependData: '@import "@/style/_base/index.scss";',
    sassOptions: {
      // data: '@import "@/style/_base/index.scss";',
      precision: 3
    }
  },
  lessOptions: {},
  dropConsole: true, // 移除console
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  alias: {
    '@': path.resolve(__dirname, '../src')
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
 * port
 * host
 * */

module.exports = () => ({
  ...defaultConfig
});
