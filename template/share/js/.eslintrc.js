/**
 * github: https://github.com/Iixianjie/eslint-conf
 * dpendencies:
 *    eslint babel-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-import
 *
 * */

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    React: false,
    wx: false,
    WeixinJSBridge: false,
    PUBLIC: false,
  },
  /* 支持最新的es语法 */
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // 缩进为2
    indent: ['error', 2],
    // 只能够使用单引号
    quotes: ['error', 'single'],
    // 使用分号
    semi: ['error', 'always'],
    // 不限制换行符
    'linebreak-style': ['off'],
    // 不限制依赖类型
    'import/no-extraneous-dependencies': 'off',
    // 允许使用console
    'no-console': 'off',

    'no-restricted-syntax': 'off',

    'consistent-return': 'off',

    'global-require': 'off',

    'import/no-dynamic-require': 'off',

    'no-unused-expressions': 'off',

    'import/prefer-default-export': 'off',

    'arrow-body-style': 'off',
    // 不限制引入顺序
    'import/order': 'off',
    'import/no-unresolved': 'off',
    // 允许修改参数
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-mixed-operators': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    "react/jsx-one-expression-per-line": "off",
    'no-return-assign': 'off',
    'react/no-find-dom-node': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'no-plusplus': 'off',
    'prefer-arrow-callback': 'off',
    'react/no-danger': 'off',
    'import/first': 'off',
    'prefer-template': 'off',
    /* 修复babel-eslint的range错误 */
    'template-curly-spacing': 'off',

    'no-new': 'off',
    'arrow-parens': 'off',
    'max-len': 'off',
    'camelcase': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/label-has-associated-control': 'off',


    /* ========== React ========== */

    'react/prop-types': 'off',
    // 不强制对prop解构
    'react/destructuring-assignment': 'off',

    'react/require-default-props': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-props-no-spreading': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

  }
};
