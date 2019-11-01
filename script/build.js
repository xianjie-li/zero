const cmd = require('../common/cmd');
const { createShare } = require('../common/utils.js');
const baseConfigFactory = require('../webpack/base-config-factory');
const buildConfigFactory = require('../webpack/build-config-factory');
const webpack = require('webpack');
const merge = require('webpack-merge');

const mode = 'production';
process.env.NODE_ENV = mode;

cmd
  .option('-a, --analyzer', '分析构建')
  .option('-g, --gzip', '开启gzip压缩')
  .parse(process.argv);

startBuild().then();

async function startBuild() {
  const share = {
    ...createShare(),
  };

  webpack(merge(baseConfigFactory(mode, share), buildConfigFactory(mode, share)),
    (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(1, err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(2, info.errors);
        return;
      }

      // if (stats.hasWarnings()) {
      //   console.warn(3, info.warnings);
      // }

      console.log(stats.toString({
        assets: true,
        chunks: false,
        errorDetails: false,
        modules: false,
        entrypoints: false,
        children: false,
        colors: true,
      }));
    });
}
