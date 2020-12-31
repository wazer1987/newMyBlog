---
title: Webpack 前置概念
date: 2019-03-03
updated: 2019-06-03
tags: Webpack
categories: webpack
keywords: Webpack
description: Webpack 前置概念
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
## 1.空间

```JS
//关于变量空间
1.比如我们现在的js文件 两个文件中 变量的命名都是一样的 但是在我们使用script标签引入的时候 就会发生冲突
```

```JS
a.js文件  var a = 1;
b.js文件  var a = 2;
c.js文件  var b = 1 console.log(a + b)
//下面在html文件见中引入
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    //这样引入的时候 就会出问题 b.js文件会把a.js文件覆盖掉
    <script src="a.js"></script>
    <script src="b.js"></script>
    <script src="c.js"></script>
</body>
</html>
```

```JS
//所以这个时候 我们就采用了对象的形式
a.js文件  var a = {a:1};
b.js文件  var b = {a:2};
c.js文件  var b = 1 console.log(a.a + b)
```

```JS
//但是上面 会有问题 因为你对象里面的key值 会被随意更改 所以这里我们就要使用了函数作用域 
//这里用了闭包和子调用函数 我们只把tell的函数暴露了出去 并没有暴露 name 和 sex 你只能访问tell这个函数
var SunsanModule = (function () {
    var name = 'Susan'
    var sex = 'girl'
    return {
        tell: function (){
            console.log('我的名字是'，name)
            console.log('我的性别是'，sex)
        }
    }
}) ()
```

```JS
//这里 我们为了更好的暴露模块 就写了新的标准 像我们的Jquery  都是采用这种 自调用函数 然后把window传进去
( function () {
    var name = 'Susan'
    var sex = 'gril'
    function tell () {
        console.log('我的名字',name)
        console.log('我的性别',sex)
    }
    window.susanModule = {tell}
})(window)
```

## 2.模块化

```JS
1.作用域封装 解决变量冲突 暴露你想暴露的变量
2.复用性 重用性
3.接触耦合 等到代码量 文件多的时候 内部会有各种各样的功能 如果有了模块化 每一个模块负责一个功能 如果出问题 能快速定位到具体的模块
```

## 3.模块化演化史


```JS
1.AMD阶段 COMMONJS规范 ES6 MODUle
```

```JS
//AMD
求和模块
define ('get', ['math'], function(math){
    return function (a, b){
        console.log('sum:' + math.sum(a,b))
    }
})
```

```JS
//COMMONJS
const math = require('./math')
exports.getSum = function (a,b){
    return a + b
}
```

```JS
//ES6 MODULE
import math from './math'
export function sum (a,b){
    return a + b
}
```

## 4.webpack打包机制

```JS
1.先初始化一下 然后我们建立一个index.html文件
2.然后建立一个src文件夹 里面写一个index.js文件 书写我们的逻辑
3.然后我们运行 npx webpack 命令 他就会自动找到src下的index文件进行打包 dist
4.然后我们在我们的index.html里引入
```


## 5.打包逻辑

```JS
1.首先他就是一个子调用函数 入参会是一个数组 数组的每一位就是你的写的代码逻辑
首先从入口文件开始，分析整个应用的依赖树
将每个以来模块包装起来 放在数组中等待调用 就是我们的入参
实现模块的加载方法 并把他梵高模块执行的环境中
把执行吐口文件的逻辑放在一个函数表达式中 并立即执行这个函数
```

```JS
(function (modules) {
    var installedModules = {} //会把你的代码逻辑都放在这里
    function _webpack_require_(moduleId){
        /*code*/
    }
    return _webpack_require_(0) //entry file
})([/* modules array */]) //这里的参数就是你的代码逻辑或者你引入的库
```

```JS
//核心方法
function __webpack_require__(moduleId){
    //先去检查 你给我的这个模块我是不是已经加载过了 如果加载过了我就不在做二次加载了
    if(installedModules[moduleId]){
         return installedModules[moduleId].exports
    }
    //如果没有被加载过 我就存进来
    var module = installedModules[moduleId] = {
        i:moduleId,
        l:false,
        exports:{}
    }
    //改变this 只想他的导出 并执行他的逻辑
    modules[moduleId].call(
        module.exports,
        module,module.exports,
        __webpack_require__
    )
    module.l = true
    return module.exports
}
```

## 6.优化

```JS
1.打包结果优化 打包结果代码量小
2.构建过程的优化 提升时间
3.Tree-Shaking 摇树 把没用的代码搞下去
```

```JS
//打包结果 压缩 webpack 给我们提供了压缩的一个专门的字段
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    //这个字段
    optimization:{
        minimizer:[new TerserPlugin({
            //加快构建速度 缓存
            cache: true,
            terserOptions:{
                compress:{
                    unused:true //没用代码调试掉
                    drop_debugger:true //删除debugg
                    drop_console:true //删除console
                    dead_code:true
                }
            }
        })]
    }
}
```

