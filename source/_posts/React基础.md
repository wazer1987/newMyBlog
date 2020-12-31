---
title: React基础
date: 2019-03-22
updated: 2019-06-03
tags: React
categories: React
keywords: React基础
description: React基础
top_img:
comments: false
cover:
toc:
toc_number:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside:
---
# React基础

## 简介

```JS
1.React 起源于 Facebook 的内部项目 因为该公司对市场上 JavaScript MVC框架 都不满意 就决定自己写了一套
2.两个概念 library(库) Framework(框架)
```

## 模块化与组件化

```JS
1.模块化 是从代码的角度 来进行分析的(一些可复用的代码 抽离出单个的文件)
2.组件的 是从UI角度 来进行的分析的 (把一些 可复用的UI元素抽离成组件)
```

## Vue 与 React 的组件

```JS
1.VUE 创建组件 是用 创建.vue文件 来创建 主要有template script style 
2.React  创建组件 一切都是以js来表现的(比如模板 样式 和动作)
```

## 环境的搭建

```JS
1.基于webpack4.x搭建  需要安装npm install webpack -D npm webpack-cli -D
2.我这里安装了5.x的版本 打包文件的时候 需要执行npx webpack命令 在你没有指定webpack配置文件的时候 它会自动去找src 下的 index.js 
3.新建文件夹 npm -init 初始化项目 然后 新建src 入口文件 src 下新建 main.js (打包的入口文件) 和 index.html 模板文件 
4.配置webpack-dev-server 在package.json 文件里配置脚本启动命令
```

```JS
//具体版本如下 别的版本可能会有问题
{
  "name": "react",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.1.1",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.11.0"
  }
}
```

```JS
//配置好webpack-dev-server 之后 他会在本地开启一个静态服务访问呢  就是你输入浏览器之后就相当于 你打开你的项目文件夹 里面的文件都会如下显示 默认是访问的是根路径
```

![](1.png)

## webpack-dev-server

```JS
1.上面我们已经配置了webpack-dev-server的命令 并在package.json里配置 dev 脚本
2.用webpack-dev-server 执行的打包 会在内存中 也就是我们的项目根目录里 自动生成一个main.js 这个js是看不见的可以理解是在内存中 在项目根目录里 有这个main.js
3.所以我们在index.html里面直接引入即可
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>首页</h1>
    /斜杠 就相当于项目根目录了 这里 用webpack-dev-server打包 就当于我们src下的index.js 打包到了项目根目录中main.js
    <script src="/main.js"></script>
</body>
</html>
```

```JS
//配置脚本
{
  "name": "react",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
        --open 自动打开浏览器 --port 设置端口号 --host 指定ip
    "dev": "webpack-dev-server --open --port 3000 --hot --host 127.0.0.1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.1.1",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.11.0"
  }
}

```

## html-webpack-plugin插件

```JS
1.刚刚我们配置的时候把js 文件直接打包进内存中 在根目录下
2.我们默认访问index.html的时候 还需要点进src下 才会读出来你的index.html
3.所以html-webpack-plugin 插件 就是把我们的html文件也打包进根目录的内存中 这样 你已启动项目 浏览器就直接能读出index.html
4.也可以用来配置模板文件 只当不同的html 或者ejs文件
5.这个插件会自动帮我们引入打包后的js文件 所以我们在index.html模板中就不用在写了script标签了
```

```JS
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    template:path.join(__dirname,'./src/index.html'), //那个文件为模板
    filename:'index.html' //放在内存中文件的名称
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin //注册插件
    ]
        
}
```

## 配置省略后缀名

```JS
1.我们在引入组件的时候 经常会带入.jsx  .vue .json .js后缀名
2.可以通过webpack 配置 去省略
```

```JS
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    title:'React学习',
    inject:true,
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin
    ],
    resolve:{
        //后缀名称可以不写
        extensions:['.js','.jsx','.json']
    },
    //第三方模块的配置规则
    module:{
        rules:[
            //以js解为 或者 jsx 结尾的 使用 babel-loader去转换 排除 node_modules下的js文件
            {test:/\.js|jsx/,use:'babel-loader',exclude:/node_modules/}
        ]
    }
        
}
```

## 配置根目录标识符

```JS
1.可以配置一个符号 来代表 根目录的路径
```

```JS
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    title:'React学习',
    inject:true,
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin
    ],
    resolve:{
        //后缀名称可以不写
        extensions:['.js','.jsx','.json'],
        alias: {
            '@':path.resolve(__dirname,'./src')
        }
    },
    //第三方模块的配置规则
    module:{
        rules:[
            //以js解为 或者 jsx 结尾的 使用 babel-loader去转换 排除 node_modules下的js文件
            {test:/\.js|jsx/,use:'babel-loader',exclude:/node_modules/}
        ]
    }
        
}
```

## 安装react react-dom

```JS
1.在项目中 使用react 需要安装两个包 一个react 一个是react-dom
2.react 专门用于创建组件和虚拟DOM 组件的生命周期都在其中
react-dom 专门进行DOM操作的 最主要的应用场景 就是ReactDom.render() 把虚拟DOM渲染到页面上
3. 安装 npm install react react-dom -s
```

### 创建和渲染

```JS
//引入 必须要这么写
import React from 'react' //创建组件 生命周期 虚拟DOM
import ReactDOM from 'react-dom' //把创建的虚拟DOM 渲染到页面上
//创建虚拟DOM元素 
//参数1 创建元素的类型 字符串 表示元素名称
//参数2 是一个对象或者null 表示当前这个DOM 元素的属性
//参数3 子节点（包括 其他 虚拟DOM 获取 文本子几点）
//参数n 其他子节点
//创建 <h1 id="myh1" title="this is a h1">这是一个大大的H1</h1>
const myh1 = React.createElement('h1',{
    id:'myh1',
    title:'this is a h1'
},'这是一个大大的h1')
//使用ReactDOM.render() 把虚拟DOM渲染到页面上
//参数1 需要渲染的虚拟DOM
//参数2 要把虚拟DOM 渲染到哪个容器上
ReactDOM.render(myh1,document.querySelector('#app'))
```

```JS
//最终html页面上的显示
<h1 id="myh1" title="this is a h1">这是一个大大的h1</h1>
```

### 元素嵌套

```JS
const myh1 = React.createElement('h1',{
    id:'myh1',
    title:'this is a h1'
},'这是一个大大的h1')
//把需要嵌套的虚拟DOM在放在 React.createElment最后的面的参数即可
const mydiv = React.createElement('div',null,'我是div的子节点',myh1)
```

## 使用JSX语法

```JS
1.我们以上都是在js里写 虚拟DOM 现在想使用标签的形式来写虚拟DOM
2.所以这里就使用到了jsx  可以使用babel 来转换 需要安装对应的loader 
3.babel-core babel-loader babel-plugin-transform-runtime -D
babel-preset-env babel-preset-stage-0 -D
```

```jsx
//JSX语法 
const mydiv = <div id="mydiv" title="this is div">这是一个div</div>
//这里通过babel 再次转换 就变成了 我们react这种创建虚拟DOM的形式
React.createElement('div',{id:'mydiv',title="this is div"},'这是一个div')
```

## 配置babel

```JS
1.首先我们需要安装 babel的插件 babel-core babel-loader babel-plugin-transform-runtime -D
babel-preset-env babel-preset-stage-0 -D
2.安装能够识别转换JSX语法的 babel-preset-react 这个包负责把jsx转换 先识别然后通过我们上面安装的那些插件包再去转换
3.配置.babelrc 文件 主要去识别JSX语法
```

```JS
//首先我们在webpack.config.js下 配置转换jsx 或者jsx语法的laoder 使用babel-loader
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    title:'React学习',
    inject:true,
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin
    ],
    //第三方模块的配置规则
    module:{
        rules:[
            //以js解为 或者 jsx 结尾的 使用 babel-loader去转换 排除 node_modules下的js文件
            {test:/\.js|jsx/,use:'babel-loader',exclude:/node_modules/}
        ]
    }
        
}
```

```JS
//然后 我们要配置.babelrc 的配置文件 这个文件 主要告诉webpack 当我们用babel-loader 去转换jsx语法的时候 按照哪个babel的规则去转换
{
    "preset":["env","stage-0","react"],
    "plugins": ["transform-runtime"]
}
//这里需要注意以下 如果  你是先安装的react   这里装完babel 之后 最好 在把react重新装一下
```

```JS
//这样就可以些jsx语法了
const mydiv = <div id="mydiv" title="this is div">这是一个div</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

## JSX语法

```JS
1.JSX语法中 只要涉及到变量的形式 渲染到jsx中语法中 都要用{ } 大括号包裹起来
```

### JSX基本语法

```JSX
//这里一定要用花括号包裹起来 
const str = 111
const bl = true
const tl = '我是P标签的title'
const h1 = <h1>这是一个jsx元素</h1>
const mydiv = <div id="mydiv" title="this is div">
    {10 + str}
    <hr />
    {/* 三元表达式 */}
    {bl? '我的布尔值是真':'我的布尔值是假'}
    <hr></hr>
    {/* 属性绑定值 */}
    <p title={tl}>这是一个p标签</p>
    <hr></hr>
    {/* 渲染JSX元素 */}
    {h1}
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

### 渲染数组

```JS
//当数组里的每个元素 都是jsx元素的时候 直接就可以使用下面这种形式在页面上渲染 它会自己循环去渲染 但是要指定key
const arr = [
    <h1 key={0}>我是h1</h1>,
    <h2 key={1}>我是h2</h2>
]

const mydiv = <div id="mydiv" title="this is div">
    <hr></hr>
    {/* 渲染数组 */}
    {arr}
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

```JS
//当数组里的每个元素是字符串的时候 要先循环素组 然后 循环每一项 用标签包裹起来 变成 jsx元素的数组
const arrstr = ['神乐','新八','啊银']
const mydiv = <div id="mydiv" title="this is div">
    {/* 渲染字符串数组 先把数组循环遍历成jsx数组 */}
    {arrstr.map( item => <p key={item}>{item}</p>)}
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

### 注意事项

```JSX
1.关于注释 /*  这是注释的内容  */
2.如果要给jsx元素 绑定类的话 需要用className去绑定 label的 for 要用 htmlFor <label htmlFor>
3. 所有的节点 都有且只有一个根元素
```

## React中的条件渲染

```jsx
1.我们常常会根据 某一个数据的状态 去渲染固定的元素
2.这里的逻辑 我们可以写在render里  
3.也可以写在 我们render 函数里 return 里
```

```jsx
//条件渲染 比如 我们有登录信息之后 请显示请登录 如果没有 请 显示显示登录按钮
import React from 'react'
class Demo extends React.Component{
    constructor(){
        super()
        this.state = {
            isLog:false
        }
    }
    render(){
        const showView = this.state.isLog?<div>lilei</div>:<div>请登录</div>
        return (
            条件渲染:{showView} <button>请登录</button>
    	    {/*还可以直接 在return里面去写一些判断的表达式 */}
		    {
                this.state.isLog?
                <div>我是为真的时候渲染</div>
                :
                <div>我是为假的时候渲染</div>
            }
        )
    }
} 
```

## 受控和非受控组件(表单)

```jsx
1.受控组件和非受控组件 主要是针对于表单元素 来说的
2.所谓受控组件 就是 表单 input绑定的是我们的自己的状态值
3.而非受控组件 就是表单 input 是通过ref之后 实时获取的
```

```jsx
//受控组件
import React, { Component } from 'react'

export default class Test extends Component {
  state = {
    value:'你好'
  }
  hendler = (e) => {
    this.setState({
      value:e.target.value
    })
  }
  render() {
    return (
      <div>
        {this.state.value}
        {/*这个值 是绑定的我们自己的状态 而且当改变的时候需要我们自己去设置我们自己的状态*/}
        <input type="text" value={this.state.value} onChange={this.hendler}/>        
      </div>
    )
  }
}
```

```jsx
//非受控组件  就是 值 不用我们自己去设置状态 当文本框输入完成 我们在去取他的值
import React, { Component } from 'react'

export default class Test extends Component {
  constructor(){
    super()
    //1. 通过   React.createRef() 指定一个值
    this.username = React.createRef()
  }
   hendler = () => {
    //当我们输入完毕之后 点击按钮 通过 this.username.current.value就能获取到   
    console.log(this.username.current.value)
  }
  render() {
    return (
      <div>
        {/*2.然后绑定在ref上*/}   
        <input type="text" ref={this.username} />    
        <button onClick={this.hendler}>按钮</button>    
      </div>
    )
  }
}
```

## 状态提升

```jsx
1.比如我们两个input框 分别在不同的子组件里 但是 我们在同一个父组件引入了他 且命名为Child1组件 和Child2组件
2.当我们Child1组件中 改变 input的值的时候 Child2组件中的input值也需要改变
3.这里我们会在父组件定义一个值 然后分别传给 我们的 Child1 和 Child2 
4.当我们 Child1组件改变的时候  就通过传给Child1的回调函数 把我们改变之后的传过去 然后在赋值给我们的父组件本身的值
5.然后 Child2在 getDerivedStateFromProps 生命周期中 重新改变状态
```

![](8.gif)

```jsx
//父组件
import React, { Component } from 'react'
import Child1 from './Child1'
import Child2 from './Child2'
export default class Test extends Component {
  constructor(){
    super()
   1.定义 值传给 两个子组件   
   this.state = {
     menoy:1
   }
  } 
  2.当child1组件 输入框改变的时候 把改变后的值传送回来 在赋值给我们的父组件  
  update = (res) => {
    console.log(res)
    this.setState({
      menoy:res
    })
  }
  render() {
    return (
      <div>
       <p>父组件</p>
       <div>
         人民币 <Child1 menoy={this.state.menoy} update={this.update}/>
       </div>
       <div>
         美元 <Child2 menoy={this.state.menoy} />
       </div>
      </div>
    )
  }
}

```

```jsx
//Child1组件
import React, { Component } from 'react'

export default class Child1 extends Component {
    constructor(){
        super()
        this.state = {
            input1:1
        }
    }
    //初始的时候 就把值设置称我们父组件传过来的
    componentDidMount(){
        this.setState({
            input1:this.props.menoy
        })
    }
    //改变的时候 把input的框设置称我们改变的值 然后在调用父组件传过来的函数 把值传送回去
    handler = (e) => {
        this.setState({
            input1:e.target.value
        },() => {
            this.props.update(this.state.input1)
        })
    }
    render() {
        return (
            <div>
                <input type="text" value={this.state.input1} onChange={this.handler}/>
            </div>
        )
    }
}

```

```jsx
import React, { Component } from 'react'
//Child2组件
export default class Child2 extends Component {
    constructor(){
        super()
        this.state = {
            input2:1
        }
    }
    //最开始的时候 把 值换算称 我们美元的值
    componentDidMount(){
        this.setState({
            input2:this.props.menoy * 7
        })
    }
    //因为 你Child1 组件 每次输入的文本都会改变 所以我们要在这个生命周期中监测一下 父组件实时传过来的值
    static getDerivedStateFromProps(prv,curr){
        if(prv.menoy !== curr.input2){
            return {
                ...curr,
                input2:prv.menoy * 7
            }
        }
        return null
    }
    handler = (e) => {
        this.setState({
            input2:this.props.menoy * 7
        })
    }
    render() {
        return (
            <div>
                <input type="text" value={this.state.input2} onChange={this.handler}/>
            </div>
        )
    }
}

```



## React创建组件

```JS
1.React 一共有两种创建组件的方式
2.一种是函数时组件(没有自己的状态) 一种是类组件(有自己的状态)
```

### 函数式组件

```JS
1.一个构造函数 就是一个函数式的组件
2.构造函数里 必须要 return 一个虚拟DOM
3.如果return 一个 null 就是什么都不渲染
```

```JSX
function Hellow(){
    return <h1>我是Hellow组件</h1>
}
const mydiv = <div>
    我是div
    <Hellow></Hellow>
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

### 函数式组件的传值与接收

```JS
1.接收的时候是在函数式组件里的props形参中接收的
2.传值的时候还是要自己指定key 然后 值式你要传入的值
3.子组件跟vue一样 不允许 改变 传过来的值
```

```JS
//这里是要传入的值
const dog = {
    name:'大黄',
    age:19,
}
//函数式组件 用props 去接收
function Hellow(props){
    console.log(props)
    return <h1>我是Hellow组件 {props.name} </h1>
}
const mydiv = <div>
    我是div
    <Hellow name={dog.name} age={dog.age}></Hellow>
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

```JSX
//展开写法
const dog = {
    name:'大黄',
    age:19,
}
function Hellow(props){
    console.log(props)
return <h1>我是Hellow组件 {props.name}</h1>
}
const mydiv = <div>
    我是div
     /* 把值展开 即可*/
    <Hellow {...dog}></Hellow>
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```



![](2.png)

```JSX
//抽离出来的jsx组件
//单独 新建一个component文件夹 下面新建一个hellow.jsx文件 
//这里一定要再次引入react 因为你下面些的jsx语法 是要转换成React.createElment()
import React from 'react' 
export default function Hellow(props){
    console.log(props)
    return <div>我是抽离出来的Hellow组件</div>
}
//在index.js种引入
const dog = {
    name:'大黄',
    age:19,
}
import Hellow from './component/hellow.jsx'
const mydiv = <div>
    我是div
    <Hellow {...dog}></Hellow>
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

### 函数是组件默认值的设置

```JSX
1.这里我们需要使用静态成员的方式去设置
2.函数名.defaultProps ={}
```

```JSX
function UserLog(props){
return <div>欢迎登录 {props.name}</div>
}
//这里需要用静态成员的属性去设置默认值
UserLog.defaultProps ={
    name:'我是默认值'
}
function UserNoLog(){
    return <div>请登录</div>
}
```



## Class组件(类组件)

```JS
1.Class组件 要继承 React.Component
2.用Class关键字 创建出来的组件 是有自己的状态的 有state 
3.在class组件里 需要有一个render函数 return JSX元素
4.React中的父子传入数据 属于单项数据流 就是子组件不能更改父组件传入的数据 所有数据只能在父组件中改 然后在在重新传入到子组件中
```

```JS
//使用class 
import React,{Component} from 'react' 
export default class Hellow extends Component{
    constructor(){
        super()
    }
    render(){
        return <div>我是class关键字搞出来的组件</div>
    }
}
```

### class组件传参

```JS
//使用class创建的组件 传进来的参数 不需要接收 直接使用this.props.就可以接收
const dog = {
    name:'大黄',
    age:19,
}
import Hellow from '@/component/hellow'
const mydiv = <div>
    我是div
	//class 创建出来的组件 传参
    <Hellow {...dog}></Hellow>
    </div>
ReactDOM.render(mydiv,document.querySelector('#app'))
//接收 直接用 this.props.来接收
import React,{Component} from 'react' 
export default class Hellow extends Component{
    render(){
    return <div>我是class关键字搞出来的组件 {this.props.name}</div>
    }
}
```

### class组件中的this.state

```JS
1.类组件都是有自己的状态 
2.自己的状态就state 是个对象 需要定义在自己的构造器里 每个类 都要继承React.component 
```

```JSX
class Ctm extends React.Component {
    constructor(){
        super()
        this.state = {
            ctmList : [
                {id:1,user:'盖伦',content:'人在塔在'},
                {id:2,user:'拉克丝',content:'命运与你同在'},
                {id:3,user:'哪吒',content:'抽你筋,扒你的皮'},
                {id:4,user:'花木兰',content:'离家太远会忘记故乡'}
            ]
        }
    }
    render(){
        return <div>
            <h1>我是评论列表</h1>
            {this.state.ctmList.map( item => <CmItem {...item} key={item.id}/>)}
        </div>
    }
}

ReactDOM.render(<Ctm/>,document.querySelector('#app'))
```

### 使用this.setState修改state数据

```JS
1.React 中不像Vue中 你数据变了视图自己会变 如果要给state中的数据重新赋值 就要用setState
2.setState函数中 传入一个对象 设置你要修改的state中的值
3.setState这个方法 是异步的 所以有了第二个参数 是个回调可以写你同步的代码
4.this.setState 会引起视图的重绘 在可控的情况下 是异步的 在非可控的情况下 是同步的
```

```JS
class MyEvent extends React.Component{
    constructor(){
        super()
        this.state ={
            msg:'我是state中的数据'
        }
    }
    render(){
    return <button onClick={() => {this.say('我是传入的参数')}}>{this.state.msg}</button>
    }
    say(str){
        //传入一个对象 传入你要修改的state中的值
       this.setState({
           msg:'我被改变了'
       })
    }
}
const mydiv = <div>
    <MyEvent/>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

```JS
//setState方法是异步的 要想写入同步的代码 就要在这个回调里面去写
class MyEvent extends React.Component{
    constructor(){
        super()
        this.state ={
            msg:'我是state中的数据'
        }
    }
    render(){
    return <button onClick={() => {this.say('我是传入的参数')}}>{this.state.msg}</button>
    }
    say(str){
       this.setState({
           msg:'我被改变了'
       },() => {
           console.log(this.state.msg)
       })
    }
}
const mydiv = <div>
    <MyEvent/>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

### 子组件向父组件传递数据

```JSX
1.React 中没有向Vue中那样 可以使用$emit去触发事件函数 在回调里 拿到数据的值
2.React 中 子向父 传值 是通过 父组件 向 子组件中传递一个函数完成
3.注意 这里 要传递的函数 一定是一个箭头函数
```

```JSX
class ChildView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cmsg:'我是子组件的数据'
        }
    }
    render(){
        console.log(this.props)
        //2.在点击的时候 我们通过props直接调用这个函数即可 也是采用箭头函数的形式
        return (
            <button onClick={() => {this.props.setpmsg(this.state.cmsg)}}>我是子组件中的按钮 我要向父组件发送数据</button>
        )
    }
}
//1.首先在父组件里 向子组件里传递一个函数 注意 这个要传递的函数一定是箭头函数的写法 否则 this会有问题
class ParentView extends React.Component{
    constructor(){
        super()
        this.state ={
            pmsg:'我是父组件的数据'
        }
        //如果我们下面的方法 不用箭头函数的化 就必须要用这个bind 去改变this的指向
        this.updata = this.updata.bind(this)
    }
    render(){
        return (
            <div>
                <div>我是父组件</div>
                <div>{this.state.pmsg}</div>
                <ChildView setpmsg={this.updata}></ChildView>
            </div>
        )
    }
    updata=(data) => {
        this.setState({
            pmsg:data
        })
    }
}
ReactDOM.render(<ParentView/>,document.querySelector('#app'))
```

## 组件的生命周期

```JS
1. 挂载卸载过程
1.1.constructor() 初始构造器 
1.2.componentWillMount() 将要把虚拟DOM挂载到页面上
1.3.componentDidMount()  已经挂载到了
1.4.componentWillUnmount () 卸载DOM
2. 更新过程
2.1. componentWillReceiveProps (nextProps)
2.2.shouldComponentUpdate(nextProps,nextState)
2.3.componentWillUpdate (nextProps,nextState)
2.4.componentDidUpdate(prevProps,prevState)
2.5.render()

3. React新增的生命周期(个人补充)
3.1. getDerivedStateFromProps(nextProps, prevState)
3.2. getSnapshotBeforeUpdate(prevProps, prevState)
```

### 挂载卸载过程

```JSX
1.1.constructor()
constructor()中完成了React数据的初始化，它接受两个参数：props和context，当想在函数内部使用这两个参数时，需使用super()传入这两个参数。
注意：只要使用了constructor()就必须写super(),否则会导致this指向错误。

1.2.componentWillMount()
componentWillMount()一般用的比较少，它更多的是在服务端渲染时使用。它代表的过程是组件已经经历了constructor()初始化数据后，但是还未渲染DOM时。

1.3.componentDidMount()
组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染

1.4.componentWillUnmount ()
在此处完成组件的卸载和数据的销毁。

clear你在组建中所有的setTimeout,setInterval
移除所有组建中的监听 removeEventListener
有时候我们会碰到这个warning:
Can only update a mounted or mounting component. This usually      means you called setState() on an unmounted component. This is a   no-op. Please check the code for the undefined component.
原因：因为你在组件中的ajax请求返回setState,而你组件销毁的时候，请求还未完成，因此会报warning
解决方法：


componentDidMount() {
    this.isMount === true
    axios.post().then((res) => {
    this.isMount && this.setState({   // 增加条件ismount为true时
      aaa:res
    })
})
}
componentWillUnmount() {
    this.isMount === false
}
```

### 更新过程

```JSX
2.1. componentWillReceiveProps (nextProps)
在接受父组件改变后的props需要重新渲染组件时用到的比较多
接受一个参数nextProps
通过对比nextProps和this.props，将nextProps的state为当前组件的state，从而重新渲染组件
  componentWillReceiveProps (nextProps) {
    nextProps.openNotice !== this.props.openNotice&&this.setState({
        openNotice:nextProps.openNotice
    }，() => {
      console.log(this.state.openNotice:nextProps)
      //将state更新为nextProps,在setState的第二个参数（回调）可以打印出新的state
  })
}
2.2.shouldComponentUpdate(nextProps,nextState)
主要用于性能优化(部分更新)
唯一用于控制组件重新渲染的生命周期，由于在react中，setState以后，state发生变化，组件会进入重新渲染的流程，在这里return false可以阻止组件的更新
因为react父组件的重新渲染会导致其所有子组件的重新渲染，这个时候其实我们是不需要所有子组件都跟着重新渲染的，因此需要在子组件的该生命周期中做判断

2.3.componentWillUpdate (nextProps,nextState)
shouldComponentUpdate返回true以后，组件进入重新渲染的流程，进入componentWillUpdate,这里同样可以拿到nextProps和nextState。

2.4.componentDidUpdate(prevProps,prevState)
组件更新完毕后，react只会在第一次初始化成功会进入componentDidmount,之后每次重新渲染后都会进入这个生命周期，这里可以拿到prevProps和prevState，即更新前的props和state。

2.5.render()
render函数会插入jsx生成的dom结构，react会生成一份虚拟dom树，在每一次组件更新时，在此react会通过其diff算法比较更新前后的新旧DOM树，比较以后，找到最小的有差异的DOM节点，并重新渲染。

```

### 新增的生命周期

```JSX
3.1. getDerivedStateFromProps(nextProps, prevState)
代替componentWillReceiveProps()。
老版本中的componentWillReceiveProps()方法判断前后两个 props 是否相同，如果不同再将新的 props 更新到相应的 state 上去。这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测，另一方面也会增加组件的重绘次数。
举个例子:

// before
componentWillReceiveProps(nextProps) {
  if (nextProps.isLogin !== this.props.isLogin) {
    this.setState({ 
      isLogin: nextProps.isLogin,   
    });
  }
  if (nextProps.isLogin) {
    this.handleClose();
  }
}

// after
static getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.isLogin !== prevState.isLogin) {
    return {
      isLogin: nextProps.isLogin,
    };
  }
  return null;
}

componentDidUpdate(prevProps, prevState) {
  if (!prevState.isLogin && this.props.isLogin) {
    this.handleClose();
  }
}

这两者最大的不同就是:
在 componentWillReceiveProps 中，我们一般会做以下两件事，一是根据 props 来更新 state，二是触发一些回调，如动画或页面跳转等。

在老版本的 React 中，这两件事我们都需要在 componentWillReceiveProps 中去做。
而在新版本中，官方将更新 state 与触发回调重新分配到了 getDerivedStateFromProps 与 componentDidUpdate 中，使得组件整体的更新逻辑更为清晰。而且在 getDerivedStateFromProps 中还禁止了组件去访问 this.props，强制让开发者去比较 nextProps 与 prevState 中的值，以确保当开发者用到 getDerivedStateFromProps 这个生命周期函数时，就是在根据当前的 props 来更新组件的 state，而不是去做其他一些让组件自身状态变得更加不可预测的事情。
3.2. getSnapshotBeforeUpdate(prevProps, prevState)
代替componentWillUpdate。
常见的 componentWillUpdate 的用例是在组件更新前，读取当前某个 DOM 元素的状态，并在 componentDidUpdate 中进行相应的处理。
这两者的区别在于：

在 React 开启异步渲染模式后，在 render 阶段读取到的 DOM 元素状态并不总是和 commit 阶段相同，这就导致在
componentDidUpdate 中使用 componentWillUpdate 中读取到的 DOM 元素状态是不安全的，因为这时的值很有可能已经失效了。
getSnapshotBeforeUpdate 会在最终的 render 之前被调用，也就是说在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。
此生命周期返回的任何值都将作为参数传递给componentDidUpdate（）。
```

![](16775500-8d325f8093591c76.webp)

![](16775500-102dbe772034e8fa.webp)

## React中的style编写

```JS
1.在React中要是写行内样式 必须要写花括号
2.并且花括号里面 也是一个对象的形式
```

```JSX
class Ctm extends React.Component {
    constructor(){
        super()
        this.state = {
            ctmList : [
                {id:1,user:'盖伦',content:'人在塔在'},
                {id:2,user:'拉克丝',content:'命运与你同在'},
                {id:3,user:'哪吒',content:'抽你筋,扒你的皮'},
                {id:4,user:'花木兰',content:'离家太远会忘记故乡'}
            ]
        }
    }
    render(){
        return <div>
            {/*要用这种形式去写自定义属性 如果由-连接的 被链接的首字母要大写*/}
            <h1 style={{color:'red'}}>我是评论列表</h1>
            {this.state.ctmList.map( item => <CmItem {...item} key={item.id}/>)}
        </div>
    }
}

ReactDOM.render(<Ctm/>,document.querySelector('#app'))
```

```JSX
//也可以采用在外面 命名一个对象 在来写
//在外面 命名一个 样式的对象
const fontcolor = {
    color:'blue'
}
class Ctm extends React.Component {
    constructor(){
        super()
        this.state = {
            ctmList : [
                {id:1,user:'盖伦',content:'人在塔在'},
                {id:2,user:'拉克丝',content:'命运与你同在'},
                {id:3,user:'哪吒',content:'抽你筋,扒你的皮'},
                {id:4,user:'花木兰',content:'离家太远会忘记故乡'}
            ]
        }
    }
    render(){
        return <div>
            {/* 然后 在里面指定这个对象就好*/}
            <h1 style={fontcolor}>我是评论列表</h1>
            {this.state.ctmList.map( item => <CmItem {...item} key={item.id}/>)}
        </div>
    }
}

ReactDOM.render(<Ctm/>,document.querySelector('#app'))
```

```JSX
//让然我们也可以把样式写在一个集合里 然后去使用它
const style = {
    item :{border:'1px dashed #ccc',margin:'10px',padding:'10px',boxShow:'0 0 10px #ccc'},
    user:{ fontSize:'14px'},
    content:{fontSize:'12px'}
}
export default function CmItem (props){
    return <div style={style.item}>
            <h1 style={style.user}>评论人:{props.user}</h1>
            <p style={style.content}>评论内容:{props.content}</p>
        </div>
}
```

## React使用CSS

```JS
1.webpack打包的时候 不认识css文件 所以我们需要安装对应的loader style-loader css-loader -D
2.然后在webpack中配置
3.然后在对应的组件中 引入我们写好的css文件 
4.然后直接 用className 写入你写好的css名称即可
```

```JS
//webpack 配置 css loader
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    title:'React学习',
    inject:true,
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin
    ],
    resolve:{
        //后缀名称可以不写
        extensions:['.js','.jsx','.json'],
        alias: {
            '@':path.resolve(__dirname,'./src')
        }
    
    },
    //第三方模块的配置规则
    module:{
        rules:[
            //以js解为 或者 jsx 结尾的 使用 babel-loader去转换 排除 node_modules下的js文件
            {test:/\.js|jsx/,use:'babel-loader',exclude:/node_modules/},
            //这里loader的加载顺序 一定式重右向左
            {test:/\.css/,use:['style-loader','css-loader']}
        ]
    }
        
}
```

```JS
//在相关的组件引入你写好的css文件 直接 使用className 指定你写好的样式名称即可
//引入了我们写好的css文件
import cssObj from '@/css/cmitem.css'
export default function CmItem (props){
    //然后直接指定我们写好的css名称即可
    return <div className="item">
            <h1 className="user">评论人:{props.user}</h1>
            <p className="content">评论内容:{props.content}</p>
        </div>
}
```

### React中的css 配置作用域

```JS
1.因为我们css 没有导出 的语法 所以 导入的时候就是一个空对象  这个里面的所有 样式 都会对组件应用生效
2.比如 我们在写一个h1标签 的样式  如果你定义了别的h1 就都会 生效
3.可以用通过配置webpack 的css-loader的参数 给我们的css文件 加模块作用域
4.通过css-loader?modules 这样就给我们的css加上了作用域
5.配置好了之后 我们的导入的css文件 就增加了作用域 也就是css文件是导入了一个对象
6.这里的css模块话 指针对于类名 和 ID 选择器 去生效 如果 标签的话 是不会生效的
```

```JS
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    title:'React学习',
    inject:true,
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin
    ],
    resolve:{
        extensions:['.js','.jsx','.json'],
        alias: {
            '@':path.resolve(__dirname,'./src')
        }
    
    },
    module:{
        rules:[
            {test:/\.js|jsx/,use:'babel-loader',exclude:/node_modules/},
            //这里就是相当于给我们的css文件配置了模块作用域
            {test:/\.css/,use:['style-loader','css-loader?modules']}
        ]
    }
        
}
```

```JSX
//开启了模块作用域之后 我们可以看到 打印出来的css文件就是一个对象
import cssObj from '@/css/cmitem.css'
console.log(cssObj)
//打印如下 下面就是你写的类名
Object
content: "_3lUKvY3y-3umWYdseLKJfW"
item: "Fc4cHN8oGjWotN7k930rf"
user: "_6cxUR1gNCL_8LlQzfDm2"
__proto__: Object
export default function CmItem (props){
    //在使用的时候就可以这么写了
    return <div className={cssObj.item}>
            <h1 className={cssObj.user}>评论人:{props.user}</h1>
            <p className={cssObj.content}>评论内容:{props.content}</p>
        </div>
}
```

### css模块化自定义规则

```JS
1.上面我们看到了 css开启模块化之后 打印出来的对象里面的值
2.其实我们也可以使用 localIdenName  自定义命名的规则
3.[path] 表示样式表 相对于项目根目录 所在的路径
[name] 表示 样式标名文件的名称
[local] 表示 样式的类名定义名称
[hash:length] 表示32位的hash值
```

```JS
//例子 自定义了我们的类名
{tset:'/\.css/',use:['style-loader','css-laoder?modules&localIdenName=[path][name]-[loacal]-[hash:5]']}
```

### 高版本的css-loader配置

```JS
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
    title:'React学习',
    inject:true,
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})
module.exports = {
    mode:'development',
    plugins:[
        htmlPlugin
    ],
    resolve:{
        //后缀名称可以不写
        extensions:['.js','.jsx','.json'],
        alias: {
            '@':path.resolve(__dirname,'./src')
        }
    
    },
    //第三方模块的配置规则
    module:{
        rules:[
            //以js解为 或者 jsx 结尾的 使用 babel-loader去转换 排除 node_modules下的js文件
            {test:/\.js|jsx/,use:'babel-loader',exclude:/node_modules/},
            //这里loader的加载顺序 一定式重右向左
            {test:/\.css/,use:['style-loader',{
                loader:'css-loader',
                options:{
                    modules: {
                        mode: 'local',
                        localIdentName: '[path][name]__[local]--[hash:base64:5]',
                      }
                }
            }]}
        ]
    }
        
}
```

### css中的全局

```JS
1.开启了css 模块化之后 我们单独写的css文件就是一个模块 
2.如果我们 有一个单独的样式类名 希望它是全局的 而又在这个css模块里面 我们可以使用 :global(.test){font-size:italic} 这种语法去包括 此时 这个类样式 就不在这个模块中了
```

### css中的一个元素添加多个类名的方式

```JSX
1.可以采用类名拼接的方式去写
2.也可以采用数组的的方式去写
```

```JSX
import cssObj from '@/css/cmitem.css'
console.log(cssObj)
export default function CmItem (props){
    //这里采用拼接空格 来为一个元素添加多个类名
    return <div className={cssObj.item +' '+ cssObj.itemColor}>
            <h1 className={cssObj.user}>评论人:{props.user}</h1>
            <p className={cssObj.content}>评论内容:{props.content}</p>
        </div>
}
```

```JS
import cssObj from '@/css/cmitem.css'
console.log(cssObj)
export default function CmItem (props){
    //采用数组的join方法来切割
    return <div className={[cssObj.item,cssObj.itemColor].join(' ')}>
            <h1 className={cssObj.user}>评论人:{props.user}</h1>
            <p className={cssObj.content}>评论内容:{props.content}</p>
        </div>
}
```

## React中的事件绑定

```JS
1.React中 有一套自己的事件绑定机制 采用驼峰
2. <button onClick={一个函数}>按钮</button>
```

```JSX
//React中 事件里面是一个函数 
const mydiv = <div>
    <button onClick={function(){console.log(111)}}>按钮</button>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

```JSx
//class组件可以通过条用自己的方法 去产生事件处理函数
class MyEvent extends React.Component{
    constructor(){
        super()
    }
    //这里通过调用自己的方法 来传递事件处理函数
    render(){
        return <button onClick={this.say}>按钮</button>
    }
    say(){
        console.log(111)
    }
}
const mydiv = <div>
    <MyEvent/>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

```JS
//目前最规范的语法 这样写还可以传入参数 
class MyEvent extends React.Component{
    constructor(){
        super()
    }
    render(){
        //写一个箭头函数 然后里面写要函数的调用 即可传入参数
        return <button onClick={() => {this.say('我是传入的参数')}}>按钮</button>
    }
    say(str){
        console.log(str)
    }
}
const mydiv = <div>
    <MyEvent/>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

## React中的文本框绑定

```JS
1.在React中没有 指令的概念 也就是说我们使用不了 v-model 这种的双向绑定
2.所以在react中  我们要自己去写文本框 的数据绑定 利用绑定文本框的value 和 它的change 来处理
3.我们需要手动监听onChange事件 然后 拿到文本框最新的值 然后在用this.setState()去设置
4.获取文本框的当前值 有两种方案 一种是通过传入事件处理函数 e  第二种是 使用ref
```

```JSX
//第一种 通过事件处理函数e 拿到 当前文本框的值
class MyEvent extends React.Component{
    constructor(){
        super()
        this.state ={
            msg:'我是state中的数据'
        }
    }
    render(){
    return <div>
        <button onClick={() => {this.say('我是传入的参数')}}>按钮</button>
        <div>{this.state.msg}</div>
        /* 在调用onChange的时候 把事件处理函数 中的e传入进去 然后通过拿到e.target.value 拿到值 */
        <input type="text" value={this.state.msg} onChange={(e) => { this.model(e) }}></input>
    </div>
    }
    say(str){
       this.setState({
           msg:'我被改变了🐖 🍕'
       },() => {
           console.log(this.state.msg)
       })
    }
    model(e){
        /* 在调用onChange的时候 把事件处理函数 中的e传入进去 然后通过拿到e.target.value 拿到值 */
        console.log(e.target.value)
        /* 载用setState 去 设置  */
        this.setState({
            msg:e.target.value
        })
    }
}
const mydiv = <div>
    <MyEvent/>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

```JSX
//第二种 通过this.ref.value
class MyEvent extends React.Component{
    constructor(){
        super()
        this.state ={
            msg:'我是state中的数据'
        }
    }
    render(){
    return <div>
        <button onClick={() => {this.say('我是传入的参数')}}>按钮</button>
        <div>{this.state.msg}</div>
        绑定ref text
        <input type="text" value={this.state.msg} onChange={(e) => { this.model(e) }} ref="text"></input>
    </div>
    }
    say(str){
       this.setState({
           msg:'我被改变了🐖 🍕'
       },() => {
           console.log(this.state.msg)
       })
    }
    model(e){
        //通过this.refs.value 拿到 文本框的值
        console.log(this.refs.text.value)
	    //然后在通过setState中去设置
        this.setState({
            msg:this.refs.text.value
        })
    }
}
const mydiv = <div>
    <MyEvent/>
</div>
ReactDOM.render(mydiv,document.querySelector('#app'))
```

## create react app 脚手架的使用

```JS
1.需要全局安装 npm install -g create-react-app
2.可以通过 create-react-app -v 查看版本或者安装是否成功
3.创建项目 create-react-app 项目名称
```

## 在 create react app 配置跨域代理

```JS
1.我们这里的数据由于使用的是 json-server 所用需要跨域 详情的 json-server 笔记
2.首先我们需要在node_modules 文件夹下找到 react-scripts 文件夹 下面的 config文件夹 就可以看到webpackDevServer.config文件
3.然后添加 proxy 配置项
```

```JS
 //配置如下
publicPath: paths.publicUrlOrPath.slice(0, -1),
proxy:{
  "/api":{
    target:"http://localhost:4000",
    changeOrigin:true,
    "pathRewrite":{
      "^/api":"/"
    }
  }
},
```

## react 多行标签

```JSX
1.我们知道 vue中没个元素 只能由一个根节点 也就是 一个组件中需要由一个元素去包裹 不能写多行标签
2.React中 如果我们需要写多行 标签的化 可以由两种方式
```

```JSX
//使用空标签的形式
function Hellow(){
    return <>
            <div>我是一</div>
    	    <div>我是二</div>
    	   </>
}
//使用react中 Fragment
import React,{Component,Fragment} from 'react'
function Hellow(){
    return <Fragment>
            <div>我是一</div>
    	    <div>我是二</div>
    	   </Fragment>
}
```

## React中的路由的使用

```JSX
1.首先需要安装 react-router-dom 这个包 npm install renact-router-dom -S 这个依赖包的功能会更多一些
2.路由分两种 一种react-router 只提供了一些核心的API react-router-dom 提供了更多的选项
3.路由模式分两种 
一种是hash模式 带# 刷新的时候页面不会丢失 
一种是 BrowserRouter 历史记录模式 没有# 刷新会丢失 本地模式不会
4.首先需要在入口文件中 引入 react-router-dom 然后确定那种模式
5.然后 用你引入的模式 把我们的根标签包裹起来
```

## Route写法

```JS
1.Route 相当于 Vue中的 component 标签  path属性 是路径 component属性 相当于is 就是你要渲染的组件
2.首先我们需要用哪种路由模式 去包裹我们的根组件
3.然后在相关的根组件里 去引入 我们的route 然后写入 对应的路径 和 需要渲染的组件
```

```JSX
//入口文件 index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//引入路由的模式  这里也可以引入 HashRouter 
import {BrowserRouter} from 'react-router-dom'
//使用标签的形式 把你的根组件包裹起来 然后用HashRouter 标签的形式 把根组件包裹起来
ReactDOM.render(
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
reportWebVitals();
```

```JS
//在根组件中 引入 对应的组件 引入 Route 然后写入 需要渲染的组件 和路径
//引入Route 组件
import {Route} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App() {
  return (
    <div>
      我是公共部分
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
    </div>
  );
}
export default App;
```

![](2.gif)

### 路由导航 Link

```JSX
1.相当于 我们vue中的router-link 通过按钮的形式 去想去的组件 在React中 组件是Link 需要从react-router-dom中引入
2.通过 to 属性 指定要去的组件
```

```JSX
//引入了link 标签 
import {Route,Link} from 'react-router-dom'
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
function App() {
  return (
    <div>
      我是公共部分
      <div>
      {/*相当于vue中的router-link 指定路径 点击去路径匹配的组件*/}   
      <Link to="/coma">去coma</Link>
      <Link to="/comb">去comb</Link>
      <Link to="/comc">去comc</Link>
      </div>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
    </div>
  );
}
export default App;
```

![](3.gif)

### 路由导航 NavLink

```JS
1.使用方式和 Link 一样 需要从react-router-dom 中引入
2.和link 的区别 会默认 给我们点击的当前 项加一个class active的类
```

```JSX
//NavLink
import {Route,Link,NavLink} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App() {
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
    </div>
  );
}
export default App;
```

![](4.gif)

### 精准匹配  exact

```JS
1.我们知道 我们的路由路径 都是以 / 斜杠什么的而开头 
2.但是当我们的 路由路径只有斜杠的时候 只要我们访问以斜杠开头的路径 都会匹配到
3.所以这里就有了精准匹配 在route 的标签里 添加exact属性
```

```JS
import './App.css'
import {Route,Link,NavLink} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App() {
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      //这里 加了exact 只有 刚问 / 的路由地址的时候 才会显示了这个组件
      <Route path="/" exact component={ComA}></Route>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
    </div>
  );
}
export default App;
```

### 路由的唯一渲染 Switch标签

```JS
1.当我们有多个route标签 去渲染同一个组件的时候 会都渲染出来
2.这里为了 同一路径的 同一个组件 因为重复的route标签 重复渲染的情况 所以有了Swich标签
3.switch 标签 可以确保 当你有重复的路由地址 或者组件的化 只渲染一个
4.需要用switch标签 把我们的Route标签包裹起来
```

```JSX
import './App.css'
import {Route,Link,NavLink,Switch} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App() {
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
       {/*如果没有Switch标签的包裹 那么 ComC这个组件都会被重复渲染 */}
      <Switch>
      <Route path="/" exact component={ComA}></Route>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      </Switch>
    </div>
  );
}
export default App;
```

### 路由的重定向 Redirect 标签 

```JS
1.当你当问 一个路径的之后  我把它重定向到别的路径
2. 使用Redirect标签 即可
```

```JSX
import './App.css'
import {Route,Link,NavLink,Switch,Redirect} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App() {
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      {/* 这里 就是 当我们要去 '/' 路径的时候 我们把它重定向到'/comc'路径 然后去渲染 '/comc'所对应的组件 */}
      <Redirect from='/' to="/comc" exact></Redirect>
      </Switch>
    </div>
  );
}
export default App;
```

### 二级路由

```JS
1.我们刚刚看到了一级的路由 点击按钮 显示对应的组件 
2.二级路由就是 我们在一级路由显示完毕之后  像是你对应当前组件下的 匹配的组件
```

```JSX
//componentC.jsx
//当我一级路由切换到componentC 组件的时候 它下面又设置了二级路由 路径是的第一位 是我们一级路由的匹配路径 
import React ,{Component}from 'react'
import{Route,NavLink} from 'react-router-dom'
//引入二级路由对应要渲染的组件
import ComcA from '../comc/comca.jsx'
import ComcB from '../comc/comcb.jsx'
export default class ComC extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
            <div>我是COMC</div>
            <NavLink to="/comc/comca">去comcA</NavLink>
            <NavLink to="/comc/comcb">去comcB</NavLink>
            <Route path='/comc/comca' component={ComcA}></Route>
            <Route path='/comc/comcb' component={ComcB}></Route>
            也可以使用渲染函数 去渲染组件    
            <Route path='/comc/comcb' render={() => {return (<ComcC>)}}></Route>
            </div>
           
        )
    }
}
```

```JSX
import './App.css'
import {Route,Link,NavLink,Switch,Redirect} from 'react-router-dom'
//引入一级路由需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
//这里是一级路由的文件  可以看到 当访问到/的时候 我们让他去显示二级路由下的 /comc/comca组件
function App() {
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}
export default App;
```

```JS
//下面的动图可以看到 当我们点击 一级路由按钮的时候 它只显示 一级路由对应的组件 当切换到comc的时候 这里又二级路由所以在点击的时候 我们就在comc组件下面 显示到了二级路由对应的组件 当我们输入重定向的时候 它就去到了 /comc/comca 这个路径下面所匹配的组件
```

![](5.gif)

### 高阶组件  withRouter

```JS
1.当我们的组件 不是路由切换的组件也具有路由切换的组件的三个属性 
2.比如我们上面的comc组件 是用路由切换过去的组件 那么它上面无论你传值没传值 就会有三个属性 location math history 这三个属性
3.比如我们的根组件 不是用路由切换的 那么 它上面就没有location math history这三个属性
4.所以我们为了能使用这三个属性 就需要用 withRouter 把它包裹起来 那么它上面的props就会有这三个属性
5.这种就叫做高阶组件 HOC 参数是一个组件 返回也是一个组件
```

```JSX
import './App.css'
import {Route,Link,NavLink,Switch,Redirect} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App(props) {
  //这里打印出来 是空对象 因为 我们没有用 WithRouter 包裹起来
  console.log(props)
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}

export default App;

```

```JS
//使用WithRouter包裹
import './App.css'
import {Route,Link,NavLink,Switch,Redirect, withRouter} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App(props) {
  //我们在下面使用withRouter包裹 可以看到 的props上面就增加了
    location math history 这三个属性
  console.log(props)
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}
export default withRouter(App);
```

### 编程式导航

```JS
1.我们有了高阶组件之后 就可以使用它对应的api 可以在那三个属性里 拿到对应的值去使用
2.如果编程式导航 我们就可以使用history.push 方法  去到我们想去的组件
```

```JS
import './App.css'
import {Route,Link,NavLink,Switch,Redirect, withRouter} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App(props) {
  console.log(props)
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      <NavLink to="/comb">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      {/*这里我们把APP改成了高阶组件 就可以使用 history里的push方法 去做编程式导航 */}
      <button onClick={() => {props.history.push("/comc")}}>去comca二级路由</button>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}
export default withRouter(App);
```

### 路由传参

```JS
1.有的我们在页面跳转的时候 需要传递对应的参数
2.比如我们在列表 跳详情的时候 就需要传递参数
3.传参有两种 一种是使用 params 在路由规则中设置传递参数
二种是 直接在路径种传递
4.接收参数 props.match,params 参数名
5.params传参 刷新地址 参数依然存在 只能传递字符串
6.query传参 不需要在路由规则中 匹配 直接发送数据 使用this.props.location.query接收
```

### params传参

```JSX
//首先路由匹配的规则里 加动态参数 然后点击的时候 传参
import './App.css'
import {Route,Link,NavLink,Switch,Redirect, withRouter} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App(props) {
  console.log(props)
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to="/coma">去coma</NavLink>
      {/* 当点击按钮的时候 就传了一个参数过去 */}
      <NavLink to="/comb/我是传过来的ID">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <button onClick={() => {props.history.push("/comc")}}>去comca二级路由</button>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      {/* 当然我们这里 需要用动态路由匹配一下参数 */}
      <Route path="/comb/:id" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}
export default withRouter(App);
```

```JS
//然后我们在需要接收参数的组件里 使用this.props.match.params.id接收 
import React ,{Component}from 'react'
export default class ComB extends Component{
    componentDidMount(){
        //这里在生命周期函数里 打印了出来  这里就是打印的就是你接收的参数
        console.log(this.props.match.params.id)
    }
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>我是COMB</div>
        )
    }
}
```

### query传参

```JS
//query传参  就去要把按钮重新改写一下
import './App.css'
import {Route,Link,NavLink,Switch,Redirect, withRouter} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App(props) {
  console.log(props)
  return (
    <div>
      我是公共部分
      <div>
      //需要这样传参 使用括号包裹起来 然后打上query关键字 
      <NavLink to={{pathname:'/coma',query:{name:'zs'}}}>去coma</NavLink>
      <NavLink to="/comb/我是传过来的ID">去comb</NavLink>
      <NavLink to="/comc">去comc</NavLink>
      </div>
      <button onClick={() => {props.history.push("/comc")}}>去comca二级路由</button>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb/:id" component={ComB}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}
export default withRouter(App);
```

```JSX
//coma组件在接收的时候 使用this.props.location.query
import React ,{Component}from 'react'
export default class ComA extends Component{
    componentDidMount(){
        console.log(this.props.location.query,'-----coma')
    }
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>我是COMA</div>
        )
    }
}
```

```JSX
//剩下的一些按钮之间的传递的参数语法
import './App.css'
import {Route,Link,NavLink,Switch,Redirect, withRouter} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
//把需要渲染的组件 用 Route标签 包裹起来 写入组件渲染的路径 和需要渲染的组件
function App(props) {
  return (
    <div>
      我是公共部分
      <div>
      <NavLink to={{pathname:'/coma',query:{name:'zs'}}}>去coma</NavLink>
      <NavLink to="/comb/我是传过来的ID">去comb</NavLink>
      <NavLink to="/comc/我是navlink传过来的">去comc</NavLink>
      </div>
      <button onClick={() => {props.history.push("/comc")}}>去comca二级路由</button>
      <button onClick={() => {props.history.push({pathname:'/coma',query:{name:'我是按钮传过来的参数'}})}}>去comca</button>
      <button onClick={() => {props.history.push("/comc/我是按钮传过来的ID")}}>去comcc</button>
      <Switch>
      <Route path="/coma" component={ComA}></Route>
      <Route path="/comb/:id" component={ComB}></Route>
      <Route path="/comc/:id" component={ComC}></Route>
      <Route path="/comc" component={ComC}></Route>
      <Redirect from='/' to="/comc/comca" exact></Redirect>
      </Switch>
    </div>
  );
}

export default withRouter(App);

```

## Hook

```JS
1.HOOK 是React 16.7 新增的属性  让无状态组件 使用状态
2.在react中 状态的管理是必不可少的
3.使用的时候 需要引入 useState import {useState} from 'react'
4.我们需要调用useState 它返回的是一个数组 第一个事当前的状态值 第二个是对象 表明用于更改状态的函数(类似于setState)
5.useState 解构出来 两个参数 第一个参数就是你声明的值 第二个就是当你要修改这个值 所用到的api
```

```JSX
import './App.css'
//引入对应的useState hook 
import {useState} from 'react'
import {Route,Link,NavLink,Switch,Redirect, withRouter} from 'react-router-dom'
//引入需要渲染的组件
import ComA from './components/componentA.jsx'
import ComB from './components/componentB.jsx'
import ComC from './components/componentC.jsx'
function App(props) {
  //useState 是你声明的值 解构出来的val 是你的声明的值 setVal类似于setState 当修改的时候使用setVal  
  let [val,setVal] = useState('我是useState')
  return (
    <div>
      我是公共部分
      {val}
      {/* 使用 */}
      <button onClick={() =>{setVal(val+'1111')}}>修改状态</button>  
    </div>
  );
}
export default withRouter(App);
```

```JS
//我们可以使用传入对象的形式 去定义多个数据
unction App(props) {
  let [val,setVal] = useState({
    name:0,
    age:13
  })
  return (
    <div>
      我是公共部分
     <div>
      {val.age}
      {val.name}
     </div>
      <button onClick={() =>{多个状态修改以后在说}}>修改状态</button>  
    </div>
  );
}
export default withRouter(App);

```

## Redux的使用

```JSX
1.redux js 提供了一个可预测型的的状态容器  我们给一个固定的输入 那么必定可以得到一个结果
2. 集中管理react 中的多个组件的状态 
3.redux 是一个专门的状态管理库 是一个插件 在VUE 中等 也可以使用 
4.需求场景 多个组件的状态需要共享的时候 可以用redux 或者一个组件 需要改变另外一个组件状态的时候 或者组件中的状态在任何地方都可以拿到 数据
5.redux 三大原则 单一数据源 整个react 当中的状态 都会被统一的管理到store中 
redux 中的 数据 是只读的  我们不能够直接改变state 而是要通过触发 redux中 的特定方法  去改变state
redux 使用纯函数 来执行修改(action)
6.安装  npm install redux
7. redux中的state 是只读的 不要直接赋值 我们可以通过返回新对象的形式 去赋值
```

### redux的数据获取

```JSX
1.基本使用 首先创建数 这个数据一定是个函数 然后 返回你的数据
2.然后新建一个js文件  里面 引入 redux 使用createStore函数 把我们刚才创建的那个数据函数导入进去
3.然后 在使用公共数据页面里 引入 我们刚刚创建的那个 js 文件  然后使用getState函数 即可使用数据
```

```JSX
//我们新建一个store文件夹 下面新建一个数据文件 data.js 记住这里创建的数据 是以函数的形式返回的
const obj = {name:'张三',age:18}
export const data = (state= obj,action) => {
    return state
}
```

```JS
//然后在store 文件夹下面 新建一个 index.js 文件  这个文件用来 创建 redux 并且把我们刚才的那个数据文件 里的数据变成公共的数据管理状态 
//从redux中 导入我们的数据状态
import { createStore} from 'redux'
//导入我们的数据
import {data} from './data.js'
//把我们的数据变成 公共的数据状态管理
export const store = createStore(data)
```

```JSX
//然后在需要 使用到公共状态的 引入我刚刚创建的那个 index.js文件  使用getState来获取数据
//引入我们刚才的那个store
import {store} from '../store/index.js'
export default class Live extends Component{
    constructor(props){
        super(props)
        this.state ={
            opacity:1,
            timerID:null,
           // 然后 使用 getState函数 获我们的胡数据文件
            name:store.getState()
        }
    render(){
        return(
            <div>
                {/*这样我们定义的obj的那个 数据就获取到了*/}
                <div>{this.state.name.name}</div>
            </div>
        )
    }
}
```

### redux的数据修改

```JSX
1.我们redux 其实 和vue一样 不能直接修改数据 也是动过dispatch函数 发射action 来修改数据
2.当我们使用dispatch 发射action的时候 其实就是触发了 你挂载到 createStore 里面的那个函数 传进去了的第二个形参
3.而我们的公共数据状态改变了 要是页面也要改变的话 需要使用 subscribe 函数 来监听一下 在把数据重新赋值 页面才会改变
```

```JSX
//我们定义的数据函数的第二个参数用来接收 dispatch发送过来的函数 这个函数是带着参数过来的
const count = 20
//这里的数据的函数的第二个参数 就是当你使用store.dispatch触发函数的返回值 详细见下面  
export const data = (state= count,action) => {
    switch(action.type){
        case 'add':
        return state + action.data
        break
        case'del':
        return state - action.data
        break
        default :
        return state
    }
}
```

```JS
// store.dispatch 发送的函数 这个函数的返回值 就是我们上面 data函数里 第二个参数
export const add = (num) => {
    return {type:'add',data:num} 
}
export const del = (num) => {
    return {type:'del',data:num}
}
```

```JSX
//然后在页面中 触发 我们写入的这个函数
import {store} from '../store/index.js'
//引入 我们写好的action 函数  就是我们上面的代码
import * as action from '../store/action.js'
export default class Live extends Component{
    constructor(props){
        super(props)
        this.state ={
            num:store.getState()
        }
    }
    //最后要想数据在视图中也改变 就要需要在 组件挂载DOM的生命周期里 重新赋值
    componentDidMount(){
        store.subscribe(() => {
            this.setState({
                num:store.getState()
            })
        })
    }
    render(){
        return(
            <div>
                <div>我是Live</div>
                <div style={{opacity:this.state.opacity}}>{this.props.msg}</div>
                <button onClick={this.clearTimer}>不想活了111</button>
                <div>{this.state.num}</div>
                {/* 在这里使用store.dispatch 传递我们写好的那个函数  */}
                <button onClick={() => {store.dispatch(action.add(1))}}>年龄加</button>
                <button onClick={() => {store.dispatch(action.del(1))}}>年龄减</button>
            </div>
            
        )
    }
}
```

## combinReducers 

```JS
1.用来合并多个reducer 
2.可以理解为模块化 比如我们A组件 可以有自己的reducer B组件也可以有自己的Reducer 那么就需要创建两个Reducer 文件 
3.然后我们是 combinReducers  把两个Reducer都合并
```

```JSX
//首先我们写两个reducer 文件
// reducerA.js
const count = '我是reducerA'
export const data = (state = count,action) => {
    switch(action.type){
            case 'edit':
            return state = action.data
            break
            default:
            return state
        }
}

//reducerB.js
const str = '我是ReducerB'
export const reducerB = (state = str,action) => {
    switch(action.type){
        case 'edit':
        return state = action.data
        break
        default:
        return state
    } 
}

//然后我们需要在store里导入这两个rendcer 然后用combinReducers 来合并 
export const store = createStore(combineReducers({
    home:data,
    list:reducerB
}),{})

//这样我们在num组件中打印的时候 取值 就可以看到 home  和 list 字段挂载到了props上面

import React from 'react'
import { connect } from 'react-redux'
class Num extends React.Component{
   
    render(){
        console.log(this.props);
        //下面是打印
        {home: "我是reducerA", list: "我是ReducerB", dispatch: ƒ}
		dispatch: ƒ dispatch(action)
		home: "我是reducerA" //可以看到我们的值
		list: "我是ReducerB"
		__proto__: Object
        return(
            <div>{this.props.home} ----- 显示我是reducerA </div>
        )
    }
}
const numState = (state) => {
    return {
        ...state
    }
}
export default connect(numState)(Num)
```

```JSX
//关于触发 当我们发送actioc的时候 是要 reducer 写的 判断逻辑都一样 那么 就都会 改变值
import React from 'react'
import {connect} from 'react-redux'
class Plus extends React.Component{
    hanldeReducer = () => {
        //这里如果 dispathc 发送的type 在reducerA 和 reducerB 里都有相应的 判断 那么都会触发判断里的函数
        this.props.dispatch({
            type:'edit',
            data:'改变'
        })
    }
    render(){
        return(
            <div>
                <button onClick={ this.hanldeReducer}>reducer</button>
            </div>
        )
    }
}
export default connect()(Plus)
```

## React-redux 

```JS
1.我们上面已经讲过了 redux 的使用流程
如果我们想要改变状态 就需要在组件里发送一个action函数 我们每个组件都需要引入 store 才可以做到
如果我们组件想使用 公共的状态 就需要引入store 然后 使用store.getState()函数去获取状态
当我们 状态值改变的时候 我们还需要使用 store.subscribe函数去监听你状态的改变 然后把组件的值赋值给我们视图上的值
最后组件注销的时候 要取消我们的监听
2.react-redux 就是一个中间的代理执行者 他会把我们上面的所有操作动作都帮你处理了
```

### react-redux两个重要的概念

```JS
1.Provider 是一个组件 能够让你的整个app都能获取到store中的数据 一般放在根组件中
2.connect 是一个方法 能够使组件根store 来进行关联 用来包装 使用公共数据的组件
```

### Provider 组件

```JS
1.Provider 包裹在根组件最外层 是所有组件都可以拿到state
2.Provider 接收store 作为 props 然后通过context 向下传递 这样react 中任何组件都可以通过context 获取到store
```

### connect 方法

```JSX
1.被Provider 包裹的内部组件 并且把我们写好的reduc的store传入进去 要想使用 state中的数据 就必须要connect 进行一层包裹封装 
2.主要就是方便我们组件内部能够获取到 store中的state
3.connect 方法 是一个柯里化函数 第一个函数里面有两个参数 都是函数类型 第二个函数里面是你需要包装的组件
4.connect 的第一个函数里的第一个参数 是你需要使用数据而传递的函数 第二个参数 是你需要改变数据而传递的函数
```

```JS
1.如下图所示 我们在点击底部tab的时候 上面的header 的title也相应的改变
2.首先我们要在app根组件上 使用react-redux Provider 包裹起来 使其每个组件都会有store
3.然后我们需要在tab组件上 使用connect 包裹起来 因为当我们点击的时候 需要改变数据 所以我们需要在connect的第二个参数传入 对应的改变状态的函数 需要返回一个对象 其中有type
4.我们header是使用数据 所以也需要用connect 包裹起来 因为是使用数据 所以需要在connect 的第一个参数 去传入一个函数用来接收 数据 需要返回一个对象
5.以上无论怎样 我们使用connect包装完毕组件之后 你传入的函数都会挂载到当前组件的 props属性上 
```

![](6.gif)

```JSX
// 在app根组件 使用Provider 进行包裹 并且把我们的store 传入进去
import './App.css';
import Layout from './views/Layout/Layout'
import {Provider} from 'react-redux'
import store from '@/store/index.js'
function App() {
  return (
      {/*使用provider 组件对根组件进行包裹 并且把store传入进去*/}  
    <Provider store={store}>
    <div className="App">
      <Layout />
    </div>
    </Provider>
  );
}

export default App;

```

```JSX
//在我们的tab组件 使用connect 函数 进行包裹 并且 传入对应改变状态的第二个参数
import React from 'react'
import {connect} from 'react-redux'
import { TabBar } from 'antd-mobile';
import {icon} from './tabItem.js'
import Home from '../../pages/home/Home.jsx'
const icondata = icon()
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: '菜谱大全',
      hidden: false,
      fullScreen: true,
    };
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          Click to show/hide tab-bar
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              fullScreen: !this.state.fullScreen,
            });
          }}
        >
          Click to switch fullscreen
        </a>
      </div>
    );
  }

  render() {
    console.log(this.props,'---------Tab')
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          style={{zIndex:-1}}
        >
            {icondata.map(item => 
                <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${item.default}) center center /  21px 21px no-repeat` }}
                />
                }
                selectedIcon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${item.active}) center center /  21px 21px no-repeat` }}
                />
                }
                selected={this.state.selectedTab === `${item.title}`}
                onPress={() => {
                  this.setState({
                    selectedTab: `${item.title}`
                  });
                 //三、然后我们就可以使用this.props 触发这个函数 传入我们 需要的值 也就是TAB的每一项
                  this.props.setHeader(item.title)
                }}
              >
                {item.renderContent()}
              </TabBar.Item>
            )}
        </TabBar>
      </div>
    );
  }
}
//二、这是我们传入的第二个函数 首先它必须要返回一个对象 默认形参会有dipatch 
//这样就把我们返回的对象 挂载到了我们当前实例上 props 上 
const setHeader = (dispach) => {
  return {
    setHeader:(data) => {
      dispach({type:'set',data})
    }
  }
}
//一、首先要引入我们的 conect 从react-redux中 
//然后把我们的组件包装一下 从而 让我们传入的函数 能挂载到props上
//由于我们这里是 点击tab 改变公共数据 所以这里我们之传入第二个参数
export default connect(null,setHeader)(Tab)
```

```JSX
//home组件 作为使用公共主数据 我们也需要使用connect包装器来 然后传入第一个参数
import React from 'react'
import header from './header.css'
import {connect} from 'react-redux'
class Header extends React.Component{
    constructor(props){
        super(props)
        // this.state = {
        //     titile:this.props.state
        // }
    }
    //这里我们就不必在使用监听 依然可以改变视图
    // componentDidMount(){
    //     store.subscribe(() => {
    //         this.setState({
    //             titile:store.getState()
    //         })
    //     })
    // }
    render(){
        console.log(this.props,'----header')
        return(
            {/*这里就可以使用了*/}
        <div className='title'>{this.props.state}</div>
        )
    }
}
//二 在connect传入的第第一个函数 这个默认的形参 就是 你的状态数据 如果有改变 就是你改变之后的状态数据  
//并且 把这个函数的返回值 挂载到了我们的props上 我们就可以通过this.props去使用了
const getTitle = (state)  => {
    return {
        state
    }
}
//一、我们的header需要使用这个公共数据 所以传入一个对象进去
export default connect(getTitle)(Header)
```

### 多个action 发送的技巧

```jsx
1.因为我们有的时候需要发送多个action 所以 我们会把这些都单独写在一个文件下
2.这个时候的发送 我们就需要引入 然后 在 connect的第二个参数中 在去调用
3.这个时候 我们就可以使用 bindActionCreators 去统一处理
```

```jsx
//我们发送多个action 的文件 counter.js
export const add = () => {
    return {
        type:'add'
    }
}
export const jianjian = () => {
    return {
        type:'jianjian'
    }
}
```

```jsx
//然后我们需要在发送action的组件中引入
//引入我们上面的写好的action文件 并重新命名
import * counterActions from './counter.js'
//引入 redux 的 bindActionCreators API
import { bindActionCreators } from 'redux'


class App extends React.Component{
    render(){
        <div>
            3.这样在使用的时候 我们就可以直接用下面这种方式去调用了
            <button onClick={this.props.conterActions.add()}>增加</button>
             <button onClick={this.props.conterActions.jianjian()}>减少</button>
        </div>
    }
}
2.把握们引入的action(也就是我们写的add,和jianjian ) 当作参数 传入到我们的bindActionCreators 第二个参数把dispatch传入 
const mapDispatchToProps = (dispatch) => {
    return {
        conterActions:bindActionCreators(counterActions,dispatch)
    }
}
export default  connect(null,mapDispatchToProps)(App)
```



### react-redux流程图

![](07.jpg)

## redux-saga

```JSX
1.可以理解为一个中间件函数 在redux里 中间件是运行在action发送出去 达到 reducer 之间的一段代码 可以把代码的流程变为 action -> Middlewares -> reducer(公共状态) 这种机制可以让我们改变数据流 实现列入 异步的action action过滤 日志输入 异常报告等功能
2.redux 提供了一个叫applyMiddleware的方法 可以执行我们的中间件
3. react-saga 就是redux 的一个中间件 可以通过正常的redux action 从主应用程序启动 暂停和取消 它可以访问完成的redux state 也能够 dispatch redux aciton
4.redux-sage 使用了ES6的 Generrator生成器函数 让异步流程 更加易于读取 写入和测试 通过这种方式 让异步看起来更加像标准的同步代码 
```

### react-saga常用API

```JSX
1.createSagaMiddleware(options)创建一个Redux middleware 并将Saga 连接到redux store options参数 传递给middleware的选项列表 默认可以不用传递
2.middleware.run(saga,...args) 动态的运行saga 只能用于applyMiddleware阶段之后 执行Saga 
3.我们可以间接的理解为 使用redux-saga 创建一个中间件 然后在 使用redux 的 applyMiddleware 函数注册这个saga创建按出来的中间件 然后在执行
```

### saga的配置

```JSX
//引出创建store 和 注册中间件的函数 
import { createStore,applyMiddleware} from 'redux'
//我们的reducer
import {data} from './reducer.js'

//导入我们的saga 最终需要使用run 去执行一下
import {defSage} from './sages'

//引入 我们的saga的中间件  需要用redux的 applyMiddleware 注册以下
import createSagaMiddleware from 'redux-saga'
//引入之后 开始创建我们的saga 中间件
const sagaMiddleware  = createSagaMiddleware()

// 导出我们的store 然后把我们创建好的saga 中间件  使用redux的 applyMiddleware 函数注册
export const store = createStore(data,{},applyMiddleware(sagaMiddleware))

//我们的saga中间件 有了 然后开始执行  
//我们知道 saga 主要是 action 到 store state 中间的一段代码
//那么执行哪段代码 就是我们上面写好的saga 
sagaMiddleware.run(defSage)
```

### saga

```js
1.这里的saga 就是我们 发送action 到 store 中间执行的那一段代码
2.这个 saga 要基于 生成器函数去写 
3.有三个监听你发送action 的api  分别是 takeEvery takeLatest throttle 辅助函数
4.引入的时候 需要 使用 import {takeEvery} from 'redux-saga/effects'
```

```JSX
//代码如下  我们 写了一个组件 分辨发送了action
import React from 'react'
import {connect} from 'react-redux'
class Plus extends React.Component{
    handletakeEvery = () => {
       this.props.dispatch({
           type:'takeEvery'
       })
    }
    handletakeLatset = () => {
        this.props.dispatch({
            type:'takeLatset'
        })
    }
    handleThrottle = () => {
        this.props.dispatch({
            type:'Throttle'
        })
    }
    render(){
        return(
            <div>
                <button onClick={ this.handletakeEvery}>点击发送takeEvery</button>
                <button onClick={this.handletakeLatset}>点击发送takeLatset</button>
                <button onClick={ this.handleThrottle}>点击发送Throttle</button>
            </div>
        )
    }
}
export default connect()(Plus)
```

```JSX
class Plus extends React.Component{
    //点击的时候发送action 传递了 数据
    handletakeEvery = () => {
       this.props.dispatch({
           type:'takeEvery',
           data:{
               username:'wangzheng',
               password:1111
           }
       })
    }
    render(){
        return(
            <div>
                <button onClick={ this.handletakeEvery}>点击发送takeEvery</button>
            </div>
        )
    }
}




// sages 文件 下  我们可以使用它提供的api 分别去监听你发送的action  语法基于生成器函数去写 下面的这三个辅助函数都是用来监听发送action
//获取我们发送action 传过来的参数 需要使用select 
import {takeEvery,takeLatest,Throttle} from 'redux-saga/effects'
export function * defSage(){
    yield takeEvery('takeEvery', function*(){
        //我们使用 select 获取到了 当发送 takeEvery action的时候 发哦是那个的数据 全部获取
        const state = yield select()
        //我们也可以  获取指定的返回数据
        //const state = yield select((state) => {
           //这里里 返回的state 我们可以通过 这种形式 去获取执行的 数据
           //console.log(state,'----state')
       //})
       console.log('takeEvery',state) // username password
    })

    yield takeLatest('takeLatset',function*(){
        console.log('takeLatset')
    })
    yield Throttle(0,'Throttle',function*(){
        console.log('Throttle')
    })
}
```

```JSX
takeEvery,takeLatest,Throttle 的区别 
takeEvery 你发送了多少次的action 或者异步任务 他都会执行 
takeLatest 不论你在一定时间内发送了多少次 action 同步或者异步  他在一定能时间内 只会自行一次 类似防抖
Throttle   你一个参数 是时间 类似节流 在规定的时间 触发的action 只 触发一定的频率
select 用来 获取你发送action 的时候 传递的参数
call 用来执行异步的变成代码 比如请求 
take 用来阻塞代码的执行
put 用来 发送action
```



### call 和 put的使用

```JS
//比如登录时候 我们登录成功之后 后台会给我们返回一系列的用户信息之类的 数据 这个时候 我们需要 把它存放在store里 这里 就需要用put 再次发送action
import {takeEvery,takeLatest,Throttle,call,select，put} from 'redux-saga/effects'
import axios from 'axios'
export function * defSage(){
    yield takeEvery('takeEvery', function*(){
        //这里是获取到了 你发送action传递的数据
       const state = yield select()
       //然后使用call 去发送请求  第一个参数是你要请求后台的时候执行的参数 第二个参数 是你的ip地址 第三个参数 是你要传递的数据
       const res = call(axios.post,'http://127.0.0.1/login',{
           ...state 
       })
       //前面请求完毕之后 后台给我们返回的数据 我们需要在发送acion 去存放的store里
       yield put({
           type:'login_success',
           ...res.data
       })
       console.log('takeEvery',state)
    })
}
```

### all 使用

```JSX
1.我们通常会有多个对应的sagas文件  比如 我们获取商品列表页面的时候 要写一个saga文件 然后写订单列表的时候 又要写一个saga 文件
2.所以执行的时候 我们通常会写一个saga的总文件  然后把对应模块的saga文件 引入进来 然后用all 的方法 去执行以下
3.最后 我们的中间件 在去跑这个saga的总文件 
```

```JS
//这里用轮播图的请求举例 首先来看下我们总的saga文件   saga.js文件
//引入了all
import { all } from 'redux-saga/effects'
//引入了对应的swiper 的saga 文件 
import {getSwiper} from './sagas/swiperSaga.js'
//如果你还有对应别的模块 比如订单列表也可以引入
//import {getList} from './sagas/list.js'
export function * defsaga(){
    //由于是多个saga文件 所以我们要使用all 去执行所有的saga文件 
    yield all([getSwiper()])
    //yield all([getSwiper(),getList()])
}
```

```JS
//对应的模块的saga 文件 首先我们要是导出 然后还是要用生成器函数 切记 否则会报错 
//引入我们的action 常量对应的类型 因为我们在发送action的时候 是通过对应action 你发送的type 去做的判断 这里我们都写在一个文件 方便后期 维护 
import {ACTIONS} from '@/store/actionsType.js'
//引入对应的副作用函数
import {takeEvery,call,put} from 'redux-saga/effects'
//引入 请求
import {getSwiper as swiper} from '@/api/swiper.js'
//开始写swiper的saga文件 
export function * getSwiper(){
    //这里当我们的文件页面 也就是轮播图页面发送 action的时候 使用takeEvery监听到  注意这里的回到一定要写生成器函数
    yield takeEvery(ACTIONS.GETSWIPER,function*(){
        	//然后使用call 的方法 去调用我们对应的swiper的请求 拿到结果
            const {data}  = yield call(swiper)
            //然后在使用put 在去发送action  对应在我们的swiper reducer里 去做对应的判断
            yield put({
                type:ACTIONS.SETSWIPER,
                data:data.swiper
            })
    })
}
```

```JS
//swiper 的 reducer 文件
// 也对应的action 的type 的常量
import {ACTIONS} from '@/store/actionsType.js'
//初始默认值
const swiperList = [{}]
export const swiper = (state = swiperList,action ) => {
    //当我们轮播图开始的时候发送生命周期 走的是ACTIONS.GETSWIPER 返回空数据 
    //但是我们在上面的对应swiper的saga 文件里使用takeEvery也监听到了  ACTIONS.GETSWIPER 所以去发送了请求
    //请求之后拿到轮播图的数据 使用put 副作用 又发送了action 然后 走到了 case ACTIONS.SETSWIPER: 把我们请求回来的数据 又返回了回去
    //然后我们的轮播图 又再次触发了拿state数据的函数 所以 就能成功渲染轮播图
    switch (action.type){
        case ACTIONS.GETSWIPER:
        return state
        case ACTIONS.SETSWIPER:
        return  Object.assign([],state,action.data)
        break
        default:
        return state
    }
}
```

## saga 异步请求的流程

```JS
1.首先我们对应的组件 会先去对应的reducer 里面取数据 第一次没有触发action
2.然后我们开始取请求数据 触发对应的action 第一次都返回空 此时我们的组件 还是没有取到数据
3.然后由于第一次发送的action 会被我们的对应的saga 监听到 所以 在这中间 我们使用了call 去发送了请求 
4.然后请求的结果 我们拿到 在用put 再次发送了action 这个action 对应我们的reducer的判断 找到 开始设置请求回来的数据
5.由于数据变了 我们的组件又再一次触发了 去数据的函数 
6.下面用轮播图举例
```

![](3.png)

## react-thunk

```jsx
1.主要是用来处理 redux的异步请求  
2.相比来saga来说 比较容易一些
3.还是需要配置中间件的形式 去使用
```

```jsx
//配置 这里我们一商品列表 和 通知中心举例
import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import product from "./reducers/product";
import notice from "./reducers/notice";

const rootReducer = combineReducers({
  product, // product: product
  notice
});
//把我们的thunk通过如下的方式 写入进去
export default createStore(rootReducer, compose(applyMiddleware(...[thunk])));
```

```JS
// 这里在发送的时候 就有所不同 我们还是在 每个页面文件里 使用this.prop.dispatch去发送 不过这里的传参是个函数
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Popconfirm } from "antd";
import { connect } from "react-redux";
1.引入的thunk文件
import { loadProduct } from "../../../store/actions/product";
import { listApi, delOne, modifyOne } from "../../../services/products";
import { serverUrl } from "../../../utils/config";
import "./list.css";


function List(props) {
  useEffect(() => {
    2.在最开始的时候 我们需要发送action 这个时候 由于我们配置thunk 就可以传入一个函数进去  这个函数就是我们刚刚引入的 thunk文件
    props.dispatch(
      loadProduct({
        page: 1
        // name: "小米"
      })
    );
  }, []);

  const loadData = () => {
    props.dispatch(
      loadProduct({
        page: page
        // name: "小米"
      })
    );
  };

  return (
      <Table
        rowKey="_id"
        rowClassName={record => (record.onSale ? "" : "bg-red")}
        pagination={{
          total,
          defaultPageSize: 2,
          onChange: p => {
            props.dispatch(loadProduct({ page: p }));
          }
        }}
        columns={columns}
        bordered
        dataSource={list}
      />
  );
}
export default connect(state => state.product)(List)
```

```jsx
//store/actions/product目录下 的 函数
//请求的接口
import { listApi } from "../../services/products";
//这个就是我们传入刚刚页面dispath的时候 传入的函数
export const loadProduct = payload => async dispatch => {
  //它会返回一个函数 函数里面去请求了接口 然后 在发送action 到 reducer
  const res = await listApi(payload.page);
  // 当异步操作完成之后通过dispatch触发reducer改变数据
  dispatch({
    type: "PRODUCT_LOADED",
    payload: { ...res, page: payload.page }
  });
};
```

### react-thunk 多个action处理

```jsx
1.我们在发射多个action的时候  上面已经说到 通过 redux 自带的 bindActionCreators 去发送
2.当我们有异步的时候 我们在action的函数  处理 就变得比价重要
```

```jsx
//配置 redux
import { createStore,combineReducers,applyMiddleware} from 'redux'
//引入 异步的thunk 
import thunk from 'reduc-thunk'
//引入 reducer 
import count from './count.js';
//合并reducer
const root = {
    count
}
//导出仓库
export const {store} =  createStore(combineReducers(root),applyMiddleware(thunk))
```

```jsx
//配置 reducer
export const count = (state = 0,action) => {
    switch(action.type){
        case 'add':
            return state += 1
        case 'jj':
            return state -= 1
        default:    
            return state
    }
    
}
```

```jsx
//发射aciont的文件
export const add = () => {
    //这里就是请求了异步的处理 我们需要return 一个函数 然后在异步的程序中去发送action
    return dispatch => {
        setTimeout(() => {
            dispatch({
                type:'add'
            })
        },1000)
    }
}
export const jj = () => {
    return {
        type:'jj'
    }
}


//异步请求的话 我们就要写在dispatch里
//这是我的异步请求
import {getTable} from '@/api/table.js'
export const add =  () => {
    
    return async (dispatch) => {
        const data = await getTable( {
            pageItem:1,
            pageSize:3
          })
        dispatch({
            type:'add',
            data
        })
    }
}
export const jj = () => {
    return {
        type:'jj'
    }
}
```

```jsx
//需要发送action的 组件文件
import React, { Component } from 'react'
import {connect} from 'react-redux'
//引入 我们的API 这个api是为了让我们 一个action文件里的 多个action函数 合并成一个
import { bindActionCreators } from 'redux'
//引入我们的action文件  这个文件里 有多个action函数 我们通过*的这种形式重新命名
import * as countraction from './actionstype'
 class Test extends Component {
  constructor(){
    super()
  }
  render() {
    return (
      <div>
        测试
        <div>
          {this.props.state.count}
        </div>
        {/*这样我们就能使用挂载到 admincout 的action函数了*/}   
        <button onClick={() => this.props.admincout.add()}>增加</button>
        <button onClick={() => this.props.admincout.jj()}>减少</button>
      </div>
    )
  }
}
//1.创建获取函数
const getcount = (state) => {
  return{
    state
  }
}
//2.创建发送action的函数
const frachAction = (dispath) => {
  return{
    3.这里就是使用   bindActionCreators 把我们多个aciton都通过对象的形式挂载到了props上 
    admincout:bindActionCreators(countraction,dispath)
  }
}
4.调用 以上两个函数
export default connect(getcount,frachAction)(Test)
```



## 小技巧

```JS
1.VSCODE中的 注释的代码折叠
//#region
//#endregion
```

































