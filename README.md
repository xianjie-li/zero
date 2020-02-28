<!-- TOC -->

- [Features](#features)
- [快速上手](#快速上手)
    - [`安装`](#安装)
    - [`创建入口文件`](#创建入口文件)
    - [`启动开发服务`](#启动开发服务)
    - [`配置热重载`](#配置热重载)
    - [`为组件添加样式`](#为组件添加样式)
    - [`添加文件资源`](#添加文件资源)
    - [添加静态资源](#添加静态资源)
    - [`构建`](#构建)
- [使用cli生成项目](#使用cli生成项目)
- [typescript](#typescript)
- [zero.config.js](#zeroconfigjs)
- [开发多页面程序](#开发多页面程序)
- [eslint](#eslint)
    - [typescript](#typescript-1)

<!-- /TOC -->

<p align="center">
<img src="https://iixianjie.github.io/file-repository/logo/logo.png" alt="ZERO" />
</p>



# Features

* 配置和业务文件隔离 ，无须触碰任何一行配置文件即可获得完善的开发体验

* 基于babel plugin的typescript配置，编译更快

* 支持通过配置文件`zero.config.js`对一些非常常用的特性进行自定义配置

* 多页面应用开发

* 不限于react，也可以编写常规js或ts项目

<br />

<br />

# 快速上手

## 安装cli工具

全局安装`zero cli`, 也可以本地安装并使用npx命令。

`npm install @lxjx/zero -g`



> ⚠ 注意: 由于内置了sass支持，可能会出现node-sass安装报错，可以搜索相关解决方案进行解决。

<br />

<br />

## 创建项目

安装完成后，切换到你要创建项目的目录，执行`list`命令查看项目类型列表:

```shell
zero list

# -> 输出如下
λ zero list
ZERO: template list:
- js-spa            javascript单页应用
- ts-spa            typescript单页应用
- js-mpa            javascript多页应用
- ts-mpa            typescript多页应用
```



然后根据你想要创建的项目类型：

```shell
zero create ts-spa my-zero-app
```

创建完成后，进入项目目录执行`npm install`安装依赖并允许开发服务即可进行开发

<br />

<br />

## 开发服务

完成依赖安装后，通过以下命令启动开发服务

```shell
yarn start

# 对应package.json中的start命令
"scripts": {
	"start": "zero start",
}
```

<br />

<br />

## 构建生产包

```shell
yarn build

# 对应package.json中的build命令
"scripts": {
	"start": "zero start",
}
```

编译完成后，生成文件在根目录dist夹下



# 快速原型开发

如果全局安装zero，可以通过直接指定入口文件和模板文件来启动服务或编译生产文件，非常适合写一些demo或原型。

<br />

### `创建入口文件`

在工作目录新建以下文件:

> 模板文件支持html和pug, 这里你也可以使用index.pug

**index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>

```

**main.js** 

> 支持js、jsx，如果开启了typescript支持，它还可以是ts、tsx。如果不使用react，你也可以用它打包普通js文件。

```js
document.getElementById('root').innerHTML = 'hello world';
```

<br />

<br />

###  `启动开发服务`

在这里，start后的两个参数分别用于指定入口文件和模板文件。

> 默认的入口文件是 cwd()/src/main , 模板文件是cwd()/index.html，如果按此规则放置文件，则可以省略命令为  `npx zero start`  
>
> 💡 cwd() 为你的工作目录

```shell
npx zero start ./main.js ./index.html
```

<br />

<br />

# 添加静态资源

这里的静态资源指的是不想通过webpack进行打包的项目文件，默认约定它们存放于`cwd()/public/`目录中，让我们来测试它。

```shell
mkdir public
```

添加一些静态资源到public目录下, 现在我们的目录如下

```shell
├─ node_modules
├─ index.jsx
├─ index.module.scss
├─ index.html
├─ logo.jpg
├─ package.json
└─ public
	├─ lodash.4.5.0.js
```

**模板文件中使用**

您可以在模板文件中这样访问它, (请确保一定要使用PUBLIC变量，因为PUBLIC目录根据开发模式以及配置的不同是会时刻改变的)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
+  <script src="<%= PUBLIC %>/lodash.4.5.0.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>

```

如果模板使用的是pug则使用如下

```jade
doctype html
html(lang="zh-CN")
  head
  	meta(charset="UTF-8")
    title Document
    script(src="#{PUBLIC}/lodash.4.5.0.js")

  body
    #root
```

**js文件中使用**

```js
img.setAttribute('src', `${PUBLIC}/xxx.jpg`) // 直接通过环境变量‘PUBLIC’
```

<br />

<br />

# cli命令

安装zero后，可以通过`zero -h`查看帮助信息, 要查看对应命令的帮助信息，使用`zero <commond> -h`，如`zero start -h`。

<br />

<br />

# typescript

使用`zero craete ts-spa projectName` 进行typescript项目创建

💡 项目根目录存在tsconfig.json文件即视为开启typescript

<br />

<br />

# zero.config.js

通过项目根目录的zero.config.js, 可以对一些常用的配置项进行配置,  以下为默认配置

```js

const defaultConfig = {
  publicPath: '/', // 资源访问路径, 当需要编译后的文件能本地直接访问时，可以设置为./
  publicDirName: 'public', // 公共资源文件夹，存放不想通过webpack编译的东西，打包后所有打包产物和该目录下的文件会被移动outputPath下的同名目录下
  outputPath: './dist', // 文件打包到此目录, 以当前工作目录为根目录

  entry: './src/main', // 默认入口文件位置，只在没有设置pages的情况下生效
  template: './index.html', // 默认模板文件位置，只在没有设置pages的情况下生效

  /**
   * 开启多页面支持
   * 开启后，会以指定规则读取cwd()/src/pages下的文件作为入口，规则如下:
   * 1. 以第一级目录下的直接子目录名作为入口名
   * 2. 将作为入口名目录下的同名(jsx?|tsx?)文件作为入口文件，同名的(pug|html)文件作为模板文件
   * 3. pageInfo.(js|ts)中的导出会作为模板变量(pageInfo)传入模板文件中，可以使用对应的模板语法获取
   * 4. 直接子目录下的js以'_'开头进行命名可以避免改文件被误识别为入口文件，直接子目录内部的任何子目录不受以上规则影响
   * */
  pages: false, // 支持命令行

  /** 存在pageIncludes 且 length > 0时，只有该配置内指定的入口会生效，如['user', 'about']。当页面过多时可以在开发时进行配置以提升编译速度 */
  // pageIncludes: [],

  mock: false, // dev模式下使用, 开启mock服务, 支持命令行

  proxy: {}, // 配置dev-server代理
    
  // 配置一些环境变量
  env: {
    // development: { /* 请勿使用PUBLIC作为key，因为它已经被占用 */ },
    // production: { /* 请勿使用PUBLIC作为key，因为它已经被占用 */ }
  },
  host: '0.0.0.0', // dev模式下使用, 支持命令行
  hash: true, // 打包时为文件生成hash
  htmlHash: false, // 打包时给html的引用资源打上hash(src="/app/app.js?6d635080fd6cd30bb150") 默认dev模式下默认开启，build模式自动关闭。可以通过此选项强制开启
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
  less: {
    javascriptEnabled: true,
  }, // 传递给less-loader的options
  pug: {}, // 传递给pug-loader的options
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  alias: { // 同webpackOptions.alias
    '@': path.resolve(process.cwd(), './src')
  },
  /* 工作目录根目录存在tsconfig.json时视为开启typescript支持 */

  // 可通过此方法简单的自定义webpack配置, 请确保将修改后的config正确返回
  configWebpack(webpackConfig, { isDevelopment, isProduction }) {
    // if (!this.pages && isProduction) {
    //   webpackConfig.output.filename = 'myApp.js';
    // }
    return webpackConfig;
  },
  /**
   *  添加额外的babel预设和插件
   *
   *  # 默认配置
   *  presets:
   *  @babel/preset-env
   *  @babel/preset-react
   *
   *  # plugins
   *  @babel/plugin-transform-runtime
   *  @babel/plugin-proposal-optional-chaining
   *  @babel/plugin-proposal-class-properties
   *  @babel/plugin-proposal-decorators
   *  @babel/plugin-syntax-dynamic-import
   *  react-hot-loader/babel
   *  styled-jsx/babel -> styled-jsx-plugin-sass
   *
   *  # 当开启了ts时, 额外包含
   *  @babel/preset-typescript
   *  */
  babel: {
    presets: [],
    plugins: [],
  },
  /* 额外的babel-loader include列表 */
  extraBabelIncludes: [],
};
```

<br />

<br />

# 开发多页面程序
通过以下配置，可以开启多页面支持

```shell
pages: true,
```

开启后，会以指定规则读取cwd()/src/pages下的文件作为入口，规则如下:

1. 以第一级目录下的直接子目录名作为入口名

2. 将作为入口名目录下的同名(jsx?|tsx?)文件作为入口文件，同名的(pug|html)文件作为模板文件

3. pageInfo.(js|ts)中的导出会作为模板变量(pageInfo)传入模板文件中，可以使用对应的模板语法获取

4. 直接子目录下的js以'_'开头进行命名可以避免改文件被误识别为入口文件，直接子目录内部的任何子目录不受以上规则影响



pages目录结构如下：

```css
└─ pages
	└─ index
		├─ index.js
		├─ index.html
		├─ pageInfo.js // 可选，导出的数据会作为模板变量传入index.html中
	└─ about
		├─ about.js
		├─ about.pug // 可以两种模板语法混合使用
		
	
```



>  你可以直接使用命令行`zero create ts-mpa`创建多页应用骨架
>
>  当页面很多时，可以通过pageIncludes配置来避免对当前开发环节外的页面进行编译，从而提高编译速度

<br />

<br />

# eslint 

首先，不推荐使用webpack来检测代码风格，只要确保目录下包含eslint配置文件，然后正确的安装了对应依赖，即可通过vscode或idea获得eslint检测，编辑器对错误的提示比控制台更加直观且不会造成编辑器和webpack同时检测代码风格引起的性能浪费。

如果你使用cli来生成项目的话，确保你的编辑器开启了eslint即可，其他的一切都是开箱式的。



### typescript

通过eslint和typescript插件可以获得非常好的代码风格支持。如果你通过cli创建的ts项目，那这也是默认支持的。

* 不要使用tslint，它的规则相对较少并且仓库正在跟eslint进行合并。

























