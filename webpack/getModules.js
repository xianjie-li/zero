const config = require('../config/config')();
const { getRootRelativePath } = require('../common/utils.js');
const { getPostCssConfigPath } = require('../common/utils');
const autoprefixer = require('autoprefixer');

module.exports = (isDevelopment, MiniCssExtractPlugin) => {
  /* file配置 */
  const fileConfig = dirName => ({
    loader: 'file-loader',
    options: {
      name: isDevelopment
        ? '[name].[ext]'
        : `[name]${config.hash ? '.[hash:7]' : ''}.[ext]`,
      outputPath: dirName // 输出目录不同区分
    }
  });
  /* style配置 */
  const styleConfig = (HasCssModule = false, preprocessor) => {
    const rule = [
      {
        loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
        options: {
          // publicPath: '../../',
        }
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDevelopment,
          modules: HasCssModule
            ? {
                localIdentName: '[local]-[hash:base64:5]'
              }
            : false
        }
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
              remove: true
            })
          ]
        }
      }
    ];

    /* 预编译器配置 */
    if (preprocessor) {
      let _config = {};
      if (preprocessor === 'sass-loader') {
        _config = config.sassOptions;
      }

      if (preprocessor === 'less-loader') {
        _config = config.lessOptions;
      }

      rule.push({
        loader: preprocessor,
        options: {
          ..._config,
          sourceMap: isDevelopment
        }
      });
    }

    return rule;
  };

  return {
    rules: [
      /* ---------js&ts--------- */
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules|bower_components)/,
        include: getRootRelativePath('./'),
        use: {
          loader: 'babel-loader',
          options: getBableOptions(isDevelopment)
        }
      },
      /* ---------style--------- */
      /* sass + css */
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module.(sa|sc|c)ss$/,
        use: styleConfig(false, 'sass-loader')
      },
      /* sass + css  css module配置 */
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: styleConfig(true, 'sass-loader')
      },
      /* less + less module配置 */
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: styleConfig(false, 'less-loader')
      },
      {
        test: /\.module\.less$/,
        use: styleConfig(true, 'less-loader')
      },
      /* ---------文件--------- */
      /* 图 */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: fileConfig(`${config.publicDirName}/img/`)
      },
      /* 影 */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: fileConfig(`${config.publicDirName}/video/`)
      },
      /* 字 */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: fileConfig(`${config.publicDirName}/font/`)
      }
    ]
  };
};

function getBableOptions(isDevelopment) {
  return {
    cacheDirectory: isDevelopment,
    cacheCompression: isDevelopment,
    presets: [
      [require.resolve('@babel/preset-env'), { useBuiltIns: false }],
    ],
    plugins: [
      // [
      //   // @vue/babel-preset-app里已经包含了，不过为了兼容react配置，礼貌性的引入一下
      //   '@babel/plugin-transform-runtime',
      //   {
      //     corejs: false,
      //     helpers: true,
      //     regenerator: true,
      //     useESModules: false
      //   }
      // ],
      // '@babel/plugin-proposal-optional-chaining',
      // ['@babel/plugin-proposal-class-properties', { loose: false }],
      // '@babel/plugin-syntax-dynamic-import'
    ],
  };
}
