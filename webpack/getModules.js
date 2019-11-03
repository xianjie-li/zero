const autoprefixer = require('autoprefixer');

const config = require('../config/config')();
const { getRootRelativePath } = require('../common/utils.js');

module.exports = (isDevelopment, MiniCssExtractPlugin) => {
  /* file配置 */
  const fileConfig = dirName => ({
    loader: 'file-loader',
    options: {
      name: isDevelopment
        ? '[name].[ext]'
        : `[name]${ config.hash ? '.[hash:7]' : '' }.[ext]`,
      outputPath: dirName, // 输出目录不同区分
    },
  });
  /* style配置 */
  const styleConfig = (HasCssModule = false, preprocessor) => {
    const rule = [
      isDevelopment
        ? 'style-loader'
        : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // 默认与取output下的同名属性，当自定义了目录关系时可以手动指定它
            publicPath: '../../',
          },
        },
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDevelopment,
          modules: HasCssModule
            ? {
              localIdentName: '[local]-[hash:base64:5]',
            }
            : false,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: isDevelopment,
          plugins: [
            autoprefixer({
              // 是否美化属性值 默认：true
              cascade: true,
              // 是否去掉不必要的前缀 默认：true
              remove: true,
            }),
          ],
        },
      },
    ];

    /* 预编译器配置 */
    if (preprocessor) {
      let _config = {};
      if (preprocessor === 'sass-loader') {
        _config = config.sass;
      }

      if (preprocessor === 'less-loader') {
        _config = config.less;
      }

      rule.push({
        loader: preprocessor,
        options: {
          ..._config,
          sourceMap: isDevelopment,
        },
      });
    }

    return rule;
  };

  return {
    rules: [
      /* ---------js&ts--------- */
      {
        test: /\.([tj])sx?$/,
        exclude: /(node_modules|bower_components)/,
        include: getRootRelativePath('./'),
        use: {
          loader: 'babel-loader',
          options: getBabelOptions(isDevelopment),
        },
      },
      {
        test: /\.(pug|jade)$/,
        use: {
          loader: 'pug-loader',
          options: config.pug,
        },
      },
      /* ---------style--------- */
      /* sass + css */
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module.(sa|sc|c)ss$/,
        use: styleConfig(false, 'sass-loader'),
      },
      /* sass + css  css module配置 */
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: styleConfig(true, 'sass-loader'),
      },
      /* less + less module配置 */
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: styleConfig(false, 'less-loader'),
      },
      {
        test: /\.module\.less$/,
        use: styleConfig(true, 'less-loader'),
      },
      /* ---------文件--------- */
      /* 图 */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: fileConfig(`${ config.publicDirName }/images/`),
      },
      /* 影 */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: fileConfig(`${ config.publicDirName }/video/`),
      },
      /* 字 */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: fileConfig(`${ config.publicDirName }/font/`),
      },
    ],
  };
};

function getBabelOptions(isDevelopment) {
  const options = {
    cacheDirectory: isDevelopment,
    cacheCompression: isDevelopment,
    presets: [
      [require.resolve('@babel/preset-env'), { useBuiltIns: false }],
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      [
        // https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
        },
      ],
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: false }],
      require.resolve('@babel/plugin-syntax-dynamic-import'),
    ],
  };

  /* 开启typescript */
  if (fs.pathExistsSync(getRootRelativePath('./tsconfig.json'))) {
    options.presets.push(
      require.resolve('@babel/preset-typescript'),
    );
    options.plugins.push(
      [require.resolve('@babel/plugin-transform-typescript'), { allowNamespaces: true, importHelpers: true, declaration: true }],
    )
  }

  if (isDevelopment) {
    options.plugins.push(require.resolve('react-hot-loader/babel'));
  }

  return options;
}
