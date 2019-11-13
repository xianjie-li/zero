[TOC]

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

配置和业务文件隔离 ，无须触碰任何一行配置文件即可获得完善的开发体验

✨开箱式的typescript支持，并且基于babel plugin进行ts编译，比ts-loader效率更高

✨隔离配置的同时，也支持通过zero.config.js对一些非常常用的特性进行自定义配置

✨多页面应用开发

✨全面的css支持,包括css module、sass、less、styled-jsx

✨不限于react，也可以编写常规js或ts项目

<br />

<br />

# 快速上手

本节从零开始介绍zero的用法，会逐步的对其功能进行介绍，如果是进行实际的项目开发，则可以直接跳转查看[使用cli生成项目](#使用cli生成项目) 

### `安装`

推荐将脚手架安装到本地，使工作目录独立于外部环境，当然，全局安装也是可以的，如果使用全局安装，则可以省略下文中的所有`npx`命令

```shell
 # 创建目录
mkdir my-zero-app

 # 初始化项目, yarn init -y
npm init -y

# 安装依赖, yarn add @lxjx/zero --dev
npm install @lxjx/zero --save-dev

# 检测是否安装成功
npx zero -h
```

> 这里使用npx仅仅是方便演示，它与将命令写在package.js scripts字段中是一致的。要了解更多，可以查看文档<https://github.com/npm/npx>

<br />

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

**index.jsx** 

> 支持js、jsx，如果开启了typescript支持，它还可以是ts、tsx。如果不使用react，你也可以用它打包普通js文件。

zero依赖中包含react和react-dom，可以不用安装,  但如果你的编辑器提示未在package.json中找到对应包的警告时，你也可以选择自行安装它们。

```jsx
import React from 'react';
import ReactDom from 'react-dom';

function App() {
  return (
    <div>Hello Zero!</div>
  )
}

ReactDom.render(
  <App />,
  document.getElementById('root'),
);

```

<br />

<br />

###  `启动开发服务`

在这里，start后的两个参数分别用于指定入口文件和模板文件。可以通过使用命令`npx zero -h` 查看帮助信息， `npx zero start -h ` 查看指定命令的帮助信息, 

> 默认的入口文件是 cwd()/src/main , 模板文件是cwd()/index.html，如果按此规则放置文件，则可以省略命令为  `npx zero start`  
>
> cwd() 为你的工作目录

```shell
npx zero start ./index.jsx ./index.html
```

然后，通过浏览器打开控制台输出的地址，你可以看到，index.jsx组件正运行于浏览器中。修改index.jsx组件后，浏览器自动进行了刷新。但是，自动刷新对于开发者来说体验并不是很好。下面，我们来开启热重载的支持。

<br />

<br />

### `配置热重载`

zero的底层已经帮你配置好了HMR相关的东西，只需要修改index.jsx文件内容如下，然后修改其内容，如果修改后浏览器没有刷新但是内容正确替换，则说明HMR配置成功了。

```jsx
+ import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDom from 'react-dom';

function App() {
  return (
    <div>Hello Zero</div>
  )
}

+ const HotApp = hot(App);

ReactDom.render(
+ <HotApp />,
  document.getElementById('root'),
);

```

<br />

<br />

### `为组件添加样式`

CLI默认支持css、以及预编译器sass、less。以.module.(css|scss|sass|less)结尾的文件会作为css module文件使用。

在工作目录添加index.module.scss文件, 如果你更喜欢使用普通css语法，则去掉 ".module"

```scss
.app {
  color: red;
}
```

然后修改index.jsx组件,  如果一切正常的话，你会看到浏览器中的Hello Zero变为了红色，再修改index.module.scss文件中的样式，浏览器会立即作出响应并且热加载正常运行。

```jsx
import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDom from 'react-dom';

+ import sty from './index.module.scss';

function App() {
  return (
+    <div className={sty.app}>Hello Zero</div>
  )
}

const HotApp = hot(App);

ReactDom.render(
  <HotApp />,
  document.getElementById('root'),
);

```

<br />

<br />

### `添加文件资源`

zero对文件也做了相应的配置，你可以直接使用图片、视频或其他资源作为依赖。

在工作目录添加logo.jpg文件，并如下更改代码：

**index.module.scss**

```scss
.app {
  color: red;
  font-size: 42px;
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 2px;
}
```

**index.jsx**

```jsx
import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDom from 'react-dom';

+ import Imglogo from './logo.jpg';

import sty from './index.module.scss';

function App() {
  return (
+    <div className={sty.app}>
+      <img className={sty.logo} src={Imglogo} alt="logo" />
+      <div>Hello Zero</div>
+    </div>
  )
}

const HotApp = hot(App);

ReactDom.render(
  <HotApp />,
  document.getElementById('root'),
);

```

<br />

<br />

### 添加静态资源

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

如果使用的是pug则使用如下

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

### `构建`

当完成项目开发后，需要打包文件并部署到服务器, 下面我们来看看怎么操作。

```shell
npx zero build ./index.jsx ./index.html
```

<br />

完成打包后查看工作目录，发现生成了dist目录，所有打包产物默认都会输出到dist文件夹下，现在你有两种方式来测试打包后的文件:

** 方式1: 开启一个本地服务**

如果本地有nginx的话，可以将dist目录下的文件放到站点目录下查看效果，没有的话也很简单，使用`serve`包:

```shell
npm install serve -g
```

安装完成后，命令行进入到dist目录下，运行

```shell
serve
```

OK， 我们的代码现在运行于一个测试服务器上。当你准备好把它们部署到真正的服务器上的时候，操作几乎也是相同的。

<br />

** 方式2: 更改配置，让打包文件能在本地运行**

zero对一些常用的选项提供了配置文件，具体可以查看 [zero.config.js](#zero.config.js) 

我们来简单演示它

在工作目录根创建 `zero.config.js`, 并进行如下配置

```js
module.exports = {
  publicPath: './', // 默认是/
};
```

然后重新进行打包

```shell
npx zero build ./index.jsx ./index.html
```

完成后，直接在浏览器运行`dist/index.html`

<br />

<br />

# 使用cli生成项目

首选，确保你已经全局或本地安装了`zero`, 如果没有，请查看 [安装](#安装)

安装完成后，命令行切换到你要创建项目的目录，执行list命令查看项目类型列表:

```shell
zero list

# -> 输出如下
λ zero list
ZERO: 模板列表:
- js-spa            javascript单页应用
- ts-spa            typescript单页应用
- js-mpa            javascript多页应用
- ts-mpa            typescript多页应用
```

然后根据你想要创建的项目类型：

```shell
zero create ts-spa my-tsapp
```

创建完成后，根据命令行的提示安装依赖并执行对应的开发命令即可。

<br />

<br />

# cli命令

安装zero后，可以通过`zero -h`查看帮助信息, 要查看对应命令的帮助信息，使用`zero <commond> -h`，如`zero start -h`。

<br />

<br />

# typescript

推荐使用`zero craete ts-spa projectName` 进行typescript项目的创建，包含了一套非常通用的配置，如果你想从零开始的话，也是非常简单的, 请查看 [快速上手](#快速上手)。 

项目根目录存在tsconfig.json文件即视为开启typescript，另一个值得注意的点是zero.config.js中的typescriptChecker配置项,  开启后会通过webpack新开一个线程进行类型检测并将错误反馈到控制台，如果你的编辑器支持ts类型检测，可以选择关闭它减少电脑的资源占用。

```js
{
    typescriptChecker: true, // 默认开启
}
```

<br />

<br />

# zero.config.js

通过项目根目录的zero.config.js, 可以对一些常用的配置项进行配置

```js
const defaultConfig = {
  // 资源访问路径, 当需要编译后的文件能本地直接访问时，可以设置为./
  publicPath: '/', 
    
  // 公众资源文件夹，存放不想通过webpack编译的东西，打包后所有打包产物和该目录下的文件会被移动outputPath下的同名目录下
  publicDirName: 'public', 
    
  // 文件打包到此目录, 相对于当前工作目录
  outputPath: './dist', 

  // 默认入口文件位置，只在没有设置pages的情况下生效，可通过命令行指定
  entry: './src/main', 
    
  // 默认模板文件位置，只在没有设置pages的情况下生效，可通过命令行指定
  template: './index.html', 

  /**
   * 开启后，将支持多页面程序，会以指定规则读取cwd()/src/pages下的文件作为入口，规则如下:
   * 1. 以第一级目录下的直接子目录名作为入口名
   * 2. 将作为入口名目录下的同名(jsx?|tsx?)文件作为入口文件，同名的(pug|html)文件作为模板文件
   * 3. pageInfo.(js|ts)中的导出会作为模板变量(pageInfo)传入模板文件中，可以使用对应的模板语法获取
   * 4. 直接子目录下的js以'_'开头进行命名可以避免改文件被误识别为入口文件，直接子目录内部的任何子目录不受以上规则影响
   * */
  pages: false, // 支持命令行开关（1、0）
    
  /** 存在pageIncludes 且 length > 0时，只有该配置内指定的入口会生效，如['user', 'about']。当页面过多时可以在开发时进行配置以提升编译速度 */
  pageExcludes: [],

  // dev模式下使用, 开启mock服务, 支持命令行开关（1、0）
  mock: false,

  // 配置服务代理
  proxy: {},
    
  // 配置环境变量，在生产和开发环境中可直接全局访问到它们如全局的"PUBLIC"
  env: {
    // development: { /* 请勿使用PUBLIC作为key，因为它已经被占用 */ },
    // production: { /* 请勿使用PUBLIC作为key，因为它已经被占用 */ }
  },
    
  // dev模式下使用, 支持命令行
  host: '0.0.0.0',
    
  // 打包时为文件生成hash
  hash: true, 
    
  // 打包时给html的引用资源打上hash(src="/app/app.js?6d635080fd6cd30bb150") 默认dev模式下默认开启，build模式自动关闭。可以通过此选项手动开启
  htmlHash: false, 
    
  // 是否开启gzip, 支持命令行开关（1、0）
  gzip: true, 
    
  // 是否分析包大小, 支持命令行开关（1、0）
  analyzer: true, 
    
  // 是否在打包时移除console, 支持命令行开关（1、0）
  dropConsole: true, 
    
  // 传递给sass-loader的options
  sass: { 
    // prependData: '@import "@/style/_base/index.scss";', // 可以这样来配置所有文件共享的变量、混合等
    sassOptions: {
      // data: '@import "@/style/_base/index.scss";',
      precision: 3
    }
  },
    
  // 传递给less-loader的options
  less: {}, 
    
  // 传递给pug-loader的options
  pug: {}, 
    
  // 默认的webpack扩展名
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
    
  // 目录别名
  alias: { // 同webpackOptions.alias
    '@': path.resolve(process.cwd(), './src')
  },
  
  /* 工作目录根目录存在tsconfig.json时视为开启typescript支持 */
  // 底层使用babel对typescript进行编译，速度会比ts-loader更快，但是babel只负责转换ts，不会对类型错误进行提示，如果你使用idea或者vscode等支持ts类型检测的编辑器，确保项目根存在tsconfig.json文件即可，如果编辑器不支持类型检测或希望webpack对类型错误进行提示则开启此项，它将开启一个独立的线程来进行类型检测。
  typescriptChecker: true, 
    
  // 通过暴露的webpack配置，你可以对配置做一些简单的扩展, 请确保将修改后的config正确返回
  configWebpack(webpackConfig, { isDevelopment, isProduction }) {
    if (!this.pages && isProduction) {
      webpackConfig.output.filename = 'myApp.js';
    }
    return webpackConfig;
  },
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



>  你也可以直接使用命令行`zero create ts-mpa`创建多页应用骨架

<br />

<br />

# eslint 

首先，不推荐使用webpack来检测代码风格，只要确保目录下包含eslint配置文件，然后正确的安装了对应依赖，即可通过vscode或idea获得eslint检测，编辑器对错误的提示比控制台更加直观且不会造成编辑器和webpack同时检测代码风格引起的性能浪费。

如果你使用cli来生成项目的话，确保你的编辑器开启了eslint即可，其他的一切都是开箱式的。



### typescript

通过eslint和typescript插件可以获得非常好的代码风格支持。如果你通过cli创建的ts项目，那这也是默认支持的。

* 不要使用tslint，它的规则相对较少并且仓库正在跟eslint进行合并。

























