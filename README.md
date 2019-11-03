- [ ] logo
- [ ] 特性说明
- [ ] 快速上手
- [ ] 使用cli生成项目
- [ ] typescript
- [ ] cli
- [ ] zero.config.js
- [ ] 开发多页面程序



# 快速上手

本节从零开始介绍zero的用法，会逐步的对其功能进行介绍，如果是进行实际的项目开发，则可以直接跳转查看使用cli生成项目 /* TODO: 添加链接 */

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

zero对一些常用的选项提供了配置文件，具体可以查看 自定义配置 /* TODO: 添加跳转 */

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

















