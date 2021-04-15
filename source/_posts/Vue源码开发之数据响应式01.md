---
title: Vue源码开发-数据响应式01
date: 2021-01-01
updated: 2021-01-01
tags: Vue
categories: 源码
keywords: Vue
description: Vue 
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

# Vue源码开发-数据响应式

## rollup 环境搭建

```js
1. rollup 是一个单独js打包工具 相比webpack来讲 速度好 编辑好 他更适合开发类库
2. 安装
rollup  // 打包用的
rollup-plugin-babel  // 让我们的rollup 和 我们的 巴babel 做关联
@babel/core // 编译ES6用的 
@babel/preset-env // 上面会调用这个里面的一些工具 去转换语法
rollup-plugin-serve -D // 启动本地服务的
```

### 配置

```js
import babel from 'rollup-plugin-babel' //转换语法的插件
import serve from 'rollup-plugin-serve' // 启动服务的插件

export default {
input:'./src/index.js', // 你要编译的入口文件
output:{
    format:'umd', // 编译完毕之后是哪中规范 这里我们是在浏览器中使用 所以用umd
    name:'Vue', // 挂在到window上的名字
    file:'dist/umd/vue.js', //打包完输出的目录
    sourcemap:true //是否开启调试
},
plugins:[
    // 使用哪个插件去转换语法 这里他会去找我们设置.babelrc里的配置文件
    babel({
        exclude:'node_modules/**'
    }),
    //开启一个本地服务
    serve({
        port:3000,
        contentBase:'',
        openPage:'./index.html'
    })
]
}

// .babelrc 配置文件 
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

```js
// 启动脚本

{
  "name": "package.json",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "rollup -c -w",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.12.13",
    "@babel/preset-env": "^7.12.13",
    "rollup": "^2.38.5",
    "rollup-plugin-babel": "^4.4.0",
    "rollup-plugin-serve": "^1.1.0"
  }
}
```

## Vue初始化流程

```js
1. 初始化 无非就是对我们传进来的参数 做一些列的判断校验
2. 这里为了能更好的扩展 我们一般都会写一个init函数挂在到原型上
```

```js
function Vue(options){
  this.init(options)
}

Vue.prototype.init = function (options) {...在这里做一些参数的判断}
```

```js
但是以上那么写法 不方便我们扩展 如果我们还需要在原型上 写很多方法 我们要写很多的 类似下面的代码 而写都写在一个文件里了 以后在维护的时候也不方便
Vue.prototype.a = function (options) {...在这里做一些参数的判断}
Vue.prototype.b = function (options) {...在这里做一些参数的判断}
Vue.prototype.c = function (options) {...在这里做一些参数的判断}
所以我们为了结偶可以写成一个一个的插件的写法 方便我们以后也扩展
```

```js
1. 我们写一个函数 这个函数 就是为了以后我们拓展用
2. 这个函数的传惨 就是我们的 Vue 然后我们在这个函数体内去 写我们的原型扩展的方法
```

```js
// 新建 init.js 
export function initMixin(Vue){
    Vue.prototype._init = function (options){
        
    }
}
```

```js
// 然后在我们index.js 导入这个方法 把我们的构造函数传入进去
import {initMixin} from './init.js'
function Vue(options){
    this._init(options)
}
// 调用我们写的初始化方法 把我们的Vue 传入禁区
initMixin(Vue)
export default Vue
```

## 初始化状态

```js
1. 我们上面 已经把初始化的init方法 通过扩展的方式 写成了方法
2. 那么在init方法里面我们就需要初始化状态
3. 这里所谓的状态就是 你传进来的 data(比如要做数据劫持) methods(要绑定方法) computed watch
4. 所以这里我们要在拆分出一个initState的方法 用来初始花我们上面的状态 做对应的处理
5. 所以我们在init方法里面 要把我们的options(就是你传进来的参数) 挂在到我们的实例一份 然后在传入到我们的initaState方法中去 
```

```js
// init.js
import { initState } from "./state"
export function initMixin(Vue){
    Vue.prototype._init = function (options){
        // 因为 vue 会把我们的传进来的参数都挂在到我们的实例上的$options
        const vm = this
        // 把传进来的参数 挂在到我们的实例上面
        vm.$options = options
      	// 开始初始化状态
        initState(vm)
    }
}
```

```js
// state.js
// 开始对我们的传进来的状态 做不同的逻辑处理 比如你的props 不能和 data 重名 如果重名了 我们优先采用props里的
// data 不能和 methods 重名 重名就会报错等等 逻辑处理
export function initState(vm){
    const opts = vm.$options
    if(opts.props){
        initProps(vm)
    }
    if(opts.methods){
        initMethods(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}
// 下面是对应的函数处理
function initProps(){

}

function initMethods (){

}
function initData (vm){
   
}
function initComputed(){

}
function initWatch(){

}
```

## 数据响应式

```js
1. 我们这里先对我们的data 做初始化处理
2. 这里就需要劫持你传进来的data 当数据改变的时候 开始劫持
3. 这里我们也是 数据劫持的方法 单独写入一个文件
```

```js
// 开始判断你传进来的data 是函数 还是对象 是函数 我们就调用 返回一个对象么 如果是对象我们直接就赋值
// 然后把data 传入到我们的 observe 就是我们的数据劫持的方法
// 数据的初始化操作
import { observe } from "./observe/index"
function initData (vm){
    let data = vm.$options.data
    // 1.因为 你传进来的data 可能是函数 用可能是对象 所以这里我们要做判断
    // 如果是函数我们就调用然后返回对象如果不是 我们直接就把data覆盖
    // 这里我们在规定的时候 就知道 调用完完毕时候 肯定是个对象
    data = typeof data === 'function'?data.call(vm) : data
    //2. 数据处理完了 我们开始做数据劫持了 对象 Object.defineProperty
    // 如果这个对象里面还有数组我们就单独处理
    // 这里我们单独把数据劫持的模块拿出去写 observe文件夹 下的index.js
    observe(data)
}
```

### 数据劫持

```js
1. 这我们数据劫持的核心api 就是 Object.defineProperty
2. 我们这里需要劫持的 有对象 有数组 所以这一我们单独写一个类去处理 Observer
```

```js
new Vue({
  data(){
    return { a: 1}
  }
})

// state.js 
function initData (vm){
    let data = vm.$options.data
    // 这里我要给我们的数据做劫持 也就是说 我们在给data里的数据 做取值 和 赋值的时候
    // 要触发我们昨晚劫持后的get函数 和我们 set 函数
    // 所以要把这个判断后的数据挂在我们实例上一下
    // 当我们以后用的时候就是 vm._data.a = 200 
    vm._data = data = typeof data === 'function'?data.call(vm) : data
 
    observe(data)

}
```

### observe

```js
1. 如果你传进来的data 如果不是对象 或者 是null 我们就不做任何处理
2. 这里我们做数据劫持的方法 单独在一些类 如果我们是对象怎么做劫持 如果 是数组怎么做劫持 因为以后这个数据劫持的方法 肯定也还会用到 所以结偶出去
3. 然后我们在单独写个 方法 这个方法 就是 调用了 Object.defineProperty 方法
4. 当然这里面还有一些特殊情况 就需要我们去递归的调用 我们的observe方法
```

```js
// observe/index.js
export function observe(data){
    //1.首先这个data 就是 你在new Vue的时候 传递进来data函数返回的对象
    // 所以我们要对他进行判断 如果不是对象 或者 你穿进来的是个null 我们进行处理 什么也不错 或者抛出错误
    if(typeof data !== 'object' && data !== null) return
    //2. 然后开始我们的数据劫持  数据劫持的方法 可能在别的地方也会用到 所以我们单独写个类
    return  new Observer(data)
}
```

```js
// Observer 类
new Vue({
  data(){
    return {
      a:1,
      b:2
    }
  }
})

class Observer {
    constructor(value){
        // 这里的value 就是你 new Vue 的时候传进进来的 data 里的数据
        this.walk(value)
    }
    walk(data){
        // data => {a:1,b:2}
        // keys => [a,b]
        let keys = Object.keys(data)
        keys.forEach( key => {
            // key => a , b
            // data[key] => 1 , 2
            defineReactive(data,key,data[key])
            // 在 Vue里我们 defineReactive 这个方法 是写在 util 上的
        })
    }
}
```

### defineReactive

```js
1. 这个方法就是我们的数据劫持的方法
2. 这里的几种情况 如果我们 数据 是{a:{a:{a:1}}} 当我们取值的 a.a.a 我们触发了一次劫持之后的 get 方法 所以要递归一下 当我访问的值还是对象的时候的时候 我们就在调用ovserve方法 递归
3. 当我们 设置的值的时候 如果我们 原来是 {a:{a:{a:1}}} 但是这里我们改变值 a.a.a = {b : 1} 但是我们 在设置值的时候 a.a.a.b =100 这个时候 是触发不了 劫持后的set函数的 所以 我们还在在改变的时候 如果你设置的新值还是个对象 我们就还要调用 observe 一次 并且把我们设置的 {b:1} 传进去 在进行一次劫持
```

```js
//4. 数据劫持的方法
function defineReactive(data,key,value){
    // 4.2  如果我们的 a:1 还好 我们走我们的 Observer
    // 但是如果 我们 a:{a:{a;1}} 所以 我们就需要递归的在去调用我们的observe方法 在接着给我们的属性加get 和 set
    // 所以这也是Vue2性能上的不足 因为嵌套的越深 我们就一层一层递归 导致性能下降
    observe(value)
    // 开始对数据劫持
    Object.defineProperty(data,key,{
        // 当你访问data的时候触发get方法
        get(){
            return value
        },
        // 当你设置值的时候触发 set newValue 就是你设置的值
        set(newValue){
            //4.1 这里 如果我们原来是 a:1 如果你设置 a=1 我们不应该做处理 因为 你设置的值和你原来设置的一样
            if(newValue === value) return 
            //4.3 如果我们这里重新赋值为了一个对象 这就有又观测不到了 所以我们还需要调用一次observe 把设置的新值传递进去
            // 原本是 a:{a:{a:1}} 现在我们 a.a.a = {b : 1} 这个时候我们在 a.a.a.b =100 这个时候就监测不到了
            observe(newValue)
            value = newValue
        }
    })
}
```

### 数组的劫持

```js
1. 我们以上的写法 其实已经已经把数组索引进行拦截了 当你通过索引取值或者赋值的时候 其实是会触发get 和 set 函数的
2. 但是这里存在一个问题 如果你的数组很多的话 几百个元素 我们每项都进行了拦截 就会导致性能下降
3. 而且 在修改数组值的时候我们也很少采用 arr[997] = 3 这种写法
4. 所以这里为了性能考虑 我们就不对数组进行劫持  
5. 但是数组数据的时候我们怎么办 所以这里 我们想到 我们只对改变数组的方法进行拦截 
```

```js
let vm = new Vue({
    el:'#app',
    data:function(){
        return {
            a:[1,2,3]
        }
    },
    methods:{}
})
console.log(vm._data)
vm._data.a.a

// 我们打印出来可以看到 对数组的每一项都进行了拦截

a: Array(3)
0: 1
1: 2
2: 3
length: 3
get 0: ƒ ()
set 0: ƒ (newValue)
get 1: ƒ ()
set 1: ƒ (newValue)
get 2: ƒ ()
set 2: ƒ (newValue)

// 如果数组很多的话 我们每一项就都会添加 get 和 set 务必会导致性能下降 所以这里我们支队改变数组的操作进行拦截 触发了我们这些操作 我们采取改变数据
```

### 重写数组方法

```js
1. 综合上面的原因 我们知道为了要进行数组的方法
2. 我们在判断的 如果你访问的值 是个数组 我们就在去 重写数组的方法
```

```js
// 如果当你的数据是这个数组的时候 我们就要重写做劫持 这里劫持的值我们可以改变我们数组的方法
let vm = new Vue({
    el:'#app',
    data:function(){
        return {
            a:[1,2,3]
        }
    },
    methods:{}
})


class Observer {
    constructor(value){
        // 5. 如果你访问的值是个数组 为了性能考虑 我们只要在改变数组的时候 我们才去做劫持
        // 所以这里我们要重写 你数组里的方法
        if(Array.isArray(value)){
          	// 这里的value 就是你上面的 a:[1,2,3]
            // 5.1这里我们就要重写数组的方法了 push shift unshift splice sort reverse pop
            // 这我们就要把数组上原有的这些方法重写一下 也就是切片一下
            // 这里的value 就是 我们 data => {a:[1,2,3]}
            // 然后把这个数组的原型链重写  可以调用我们自己劫持的方法 
          	// arrayMethods就是我们重写的可以改数组的方法
            value.__proto__ = arrayMethods
        }else{
            // 这里的value 就是你 new Vue 的时候传进进来的 data 里的数据
            this.walk(value)
        }
        
    }
    walk(data){
        let keys = Object.keys(data)
        keys.forEach( key => {
            defineReactive(data,key,data[key])
        })
    }
}
```

```js
1. 我们重写数组的方法 可以做切片
2. 思路就是 如果有 就先调用我们自己的方法里的逻辑。然后 在调用 数组原型上的方法 如果没有 就直接调用数组原型上的方法
```

```js
//  observe/array.js
//1.拿到 数组原型上所有的方法
let oldArrayProtoMethods = Array.prototype  
// 2. 然后我们自己创建一个对象 这个对象上有我们自己的 push shift unshift splice sort reverse pop等方法
// 但是没有的方法 他又会去数组的原型上去找
// 创建一个空对象 并且让 这个空对象的 __proto__ 指向你传进去的
export let arrayMethods = Object.create(oldArrayProtoMethods)
//3. 我们要重新写的方法 可以改变愿数组的的方法
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

// 4. 添加到我们自己重写的方法 
// 这里当我们调用push的方法 他会先找 arrayMethods.push 方法 
// 如果没有 由于上面我们已经让原型链 指向了 数组的原型 所以还会去数组原型上去找方法
methods.forEach( method => {
    arrayMethods[method] = function () {

        // 这里就是在我们原有的数组方法做了一个切片 当我们push的时候 先走我们自己写的这个函数 也就是我们自己的逻辑
        // 然后在走 我们数组原型上的push
        const result = oldArrayProtoMethods[method].apply(this,arguments)
        return result
    }
})
```

```js
let vm = new Vue({
    el:'#app',
    data:function(){
        return {
            a:[1,2,3]
        }
    },
    methods:{}
})
// 当我们调用push 的时候 先走我们 arrayMethods 的push  这个时候我们就知道数组修改了 就可以做一些我们想做的逻辑 比如劫持数据之类的 然后再走我们原始数组的push 
vm._data.a.push(456)
// 当我们调用concat的时候 由于我们没有写concat方法 所以 这里 会直接调用我们数组的concat方法
```

### 对数组数据中的对象再次劫持

```js
1. 刚才我们只是把数组中的方法做了一个大概的切片 
2. 所以这里存在一个问题 如果我们数组中 每一个元素是个对象 这个时候我们就观测不到了
3. 所以我们就要在继续判断 如果你的数组中是个对象我们就要继续调取我们observe方法 对数组中的对象进行劫持
```

```js
// 以下这种情况 我们是劫持不到 数组中的对象的
let vm = new Vue({
    el:'#app',
    data:function(){
        return {
            arr:[{name:'zs'}]
        }
    },
    methods:{}
})
// 我们打印出来可以看到 数组中的的对象是没有 添加get 和 set 的
arr: Array(1)
0: {name: "zs"}
length: 1
__proto__: Array
get arr: ƒ ()
set arr: ƒ (newValue)
```

```js
// 如果数组中的元素是对象的话
class Observer {
    constructor(value){
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods
            // 6. 如果数组中还是个对象所以我们就要再次调用我们的observe方法进行劫持
            // 所以这里我们在单独写一个方法
            this.observeArray(value)
        }else{
            // 这里的value 就是你 new Vue 的时候传进进来的 data 里的数据
            this.walk(value)
        }
        
    }
    //6.1 开始劫持书中的每一项
    observeArray(value){
        //然后开始劫持我们数组中的嘘对象
        value.forEach( item => {
            //调用我们的observe去进行劫持
            observe(item)
        })
    }
    walk(data){...好多代码}
}

//就给我们数组中的对象有添加了劫持
arr: Array(1)
0:
name: (...)
get name: ƒ ()
set name: ƒ (newValue)
__proto__: Object
length: 1
__proto__: Array
get arr: ƒ ()
set arr: ƒ (newValue)
```

### 对数组中添加数据(对象)在劫持

```js
1. 上面我们已经通过处理 对我们的数据中的数组类型里的对象 做了在劫持
2. 如果我们 对数组中的数据 进行push unshift 等操作 我们传进数组的数据需要在劫持
```

```js
let vm = new Vue({
    el:'#app',
    data:function(){
        return {
            arr:[{name:'zs'}]
        }
    },
    methods:{}
})
// 这里我们先去调用我们自己的push 方法 然后 在调用了 数组原型上的push 方法
// 所以这里我们 push 进去的 {age:28} 也许要劫持
vm._data.arr.push({age:28})
console.log(vm._data.arr)
```

```js
// array.js

//1.拿到 数组原型上所有的方法
let oldArrayProtoMethods = Array.prototype  
// 2. 然后我们自己创建一个对象 这个对象上有我们自己的 push shift unshift splice sort reverse pop等方法
// 但是没有的方法 他又会去数组的原型上去找
// 创建一个空对象 并且让 这个空对象的 __proto__ 指向你传进去的
export let arrayMethods = Object.create(oldArrayProtoMethods)
//3. 我们要重新写的方法 可以改变愿数组的的方法
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]
methods.forEach( method => {
    arrayMethods[method] = function (...args) {
        const result = oldArrayProtoMethods[method].apply(this,args)
         //7. 如果我们是向数组里添加了一个对象 那么添加的对象也应该被劫持到 
         // 这两个方法 都是向数组中添加元素 所以我们应该在去劫持你向数组中添加 到元素
         // 这里添加到元素 就是你在调用 vm._data.arr.push('arg') push方法中的参数
         // 但是这里我们的 数据劫持的 observe 方法 在 另外一个文件
        let inserted
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(0,2)
            default:
                break;
        }
        //7.2 如果我们调用上面的方法却是传进来参数是对象了 我们就需要对你传进来的对象和数据在进行观测
        // 在进行观测 也就是数据在劫持 也就是调用我们 的observe方法 但是这个方法在别的文件
        if(inserted){
        // 7.6 首先这里慢的this我们数据 因为只有我们的数据才会调用push... 这些方法
        // 这里在做数据劫持的时候 我们劫持过的数据 上面就会加上 __ob__ 的自定义属性 他的值就是我们的 数据劫持类 这上面也劫持数组的方法
        // 随意我们向数组中添加对象的时候 就可以再次被劫持到
            this.__ob__.observeArray(inserted)
        }
        return result
    }
})
```

```js
class Observer {
    constructor(value){
        //7.3 如果我们的数据 需要观测 就会走到段逻辑 所以我就给他添加一个自定义属性 __ob__ 表示用来观测
        // 并且为了能在 array.js 里 当我们的数据是数组的时候 调用push unshift方法等 向数组里添加的
        // 数据也能被劫持到 所以我们还要把 劫持的方法写在我们的数据上 这样 我们就可以在array.js中调用我们的observe方法
        Object.defineProperty(value,'__ob__',{
            enumerable:false, // 不可枚举 就是循环不了   
            configurable:false, // 删不掉
            value:this //这的this 就是我们 Observer 类 这样做 是为了能 在array.js 中使用我的 observeArray方法
        })
        //7.4 这需要注意不能下面哪种写法 这样写 你的__ob__ 就又是一个 Observer实例对象 会一致进行死循环劫持
        //value.__ob__ = this
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods
            this.observeArray(value)
        }else{
            this.walk(value)
        }
        
    }
    observeArray(value){...}
    walk(data){ ... }
}
```

### 属性的代理

```js
1. 当我们访问Vue里面的数据的时候我们直接 vm.数据
2. 而我们现在 访问的方式是 vm._data.数据
3. 所以这里我们需要做一层代理 也就是当我们访问 vm.数据 = vm._data.数据
4. 其实就是给我们的数据再次做了劫持
```

```js
// state.js

//8.1 属性代理的方法 当我们访问 vm.数据 的时候  === vm._data.数据
function proxy(vm,data,key){
    Object.defineProperty(vm,key,{
        get(){
            // 当我们访问 vm.a  == vm._data.a
            return vm.data[key]
        },
        set(newValue){
            // 当我们设置 vm.a  == vm._data.a
            vm.data[key] = newValue
        }
    })
}

function initData (vm){
    let data = vm.$options.data
    vm._data = data = typeof data === 'function'?data.call(vm) : data

    //8.属性代理
    for(let key in data){
        proxy(vm,'_data',key)
    }
    observe(data)

}
```

## 小结

### 初始化流程

```js
1. 首先我们用 rollup 搭建的开发环境 我们在配置文件里到处去的时候 使用的umd 的规范 所以可以直接在浏览器中使用
2. 我们在new Vue 的时候 其实调用了 init 函数 并且把我们的参数传入了进去
3. 调用init 函数的时候 我们为了能够以后能更好的扩展 所以没有 直接写在Vue.prototype.init = function(){}
4. 而是单独用了一个函数 initMixin 函数 并且 把Vue 作为参数传入了进去 然后在 initMixin函数里面 我们在Vue.prototype 上添加了init 方法
5. init方法 主要把你传进来的参数 挂在到了实例$options属性上 然后开始 调用了 initState函数 把Vue传了进去 initState函数主要是用来初始化状态的
6. 在initState函数里我们的参数就是你传进来的 Vue 上面有一个$options 就是我们传进来的参数 然后我们分别根据你传进来的参数  做了不同的初始化 
this.$options.props ? -> initProps(this)
this.$options.methods ? -> initMthods(this)
this.$options.data ? -> initData(this)
this.$options.computed ? -> initComputed(this)
this.$options.watch ? -> initWatch(this)
7. initData 当法 这个就是我们数据劫持的方法
```

### 初始化data

```js
1. initData 方法中 我们知道 你的数据都在data中 所以我们要判断你的$options中的data 可能一个函数返回一个对象 也可能直接就是一个对象 所以我们要校验一下
2. 然后我们做了一层代理 让我们可以是用 this.数据 就可以访问data中的数据 这里也是用了属性代理
3. 然后我们创建了一个observe文件夹 index.js 创建一个 observe方法 做数据截止 把我们的 data 中的数据传入禁区 做了劫持
```

### data的数据劫持

```js
1. 数据劫持的核心api 就是 Object.defineProperty 给你的对象上添加get 和 set 函数 
2. 所以这里我们创建了一个 class Observer 的类 分别来给我们不同的数据类型 做不同的数据劫持
3. defineReactive方法 给我们的数据做劫持 方法 核心API就是 Object.defineProperty
4. 所以 当我们在调用 observe 的方法的时候 他会 new Observer 并且返回了这个类的实例
```

### 第一种情况

```js
1. 第一种情况 当我们的数据 就是 {name:'zs',age:18}
2. 那我们直接就调用 Observer 的 walk 方法 并且 把 {name:'zs',age:18} 传入进去
3. walk 方法 会把  {name:'zs',age:18} 循环 调用 defineReactive方法 并且 把 对象 {name:'zs',age:18} 属性 name,age  值 'zs',18 分别传入 defineReactive方法中 然后开始使用API Object.defineProperty 给每个属性添加get 和 set 函数
```

### 第二种情况

```js
1. 第二种情况 当我们的数据 {name:'zs',age:18,obj{sex:'男',skill:'web'}} 
2. 这里我们 obj又是一个对象 所以 还需要在对他进行劫持 调用 observe方法 
3. 所以这个时候 我们在每次 defineReactive方法 开始的时候 在调用一次 observe方法 因为是循环调用的 所以 第一次我们传入的 observe方法放中的是 'zs' 第二次 传入 observe方法放中的是 18 第三次传入  observe方法放中的是 obj:{sex:'男',skill:'web'}}
4. 我们 observe方法中在最开始的时候就会判断 如果你传进来的不是对象 我们就 return 所以 第三次传入的 obj 就又会执行 observe 方法 去给 obj中的每个属性 做劫持 添加了 get 和 set 方法 
```

### 第三种情况

```js
1. 当我们做好数据劫持 访问数据的时候 会get方法 改变数据的时候 会触发set方法
2. 所以当我们的数据 是 {name:'zs'}的时候 当我们访问 this.name 会触发我们 get 方法 当我们 使用 this.name = 'ls' 的时候 会触发set方法
3. 所以第三种情况是 当我们设置值的时候 这个值是个对象 这个时候我们就劫持不到了 this.name = {obj:11} 这种情况我们就需要对 你重新设置的值 {obj:11} 重新做劫持
4. 所以 当我们复制的时候 会触发set 函数 默认形参 就是你的改变的值 也就是{obj:11} 
5. 这个时候 我们就在set函数调用你一次 observe 把set 函数里的形参传入到我们的observe 也就是 {obj:11}
6. 这样就给我们后赋值的类型如果又是对象类型 做了一次劫持
```

### 数组数据情况

```js
1. 第四种情况 当我们的数据 是 {arr:[1,2,3]}
2. 其实我们上面的种种方法 已经可以对们数据中arr 做劫持了 会给数组中的索引 添加 get set 方法 当我们访问arr[0]的时候 触发get 赋值的时候 触发 set 但是我们这种操作很少
3. 但是这里会有一个问题 如果我们的数组 有几千个 几万个 都会给我们所有数组中的索引做劫持 这样就会浪费性能
4. 所以我们对数组类型的数据 单独做处理
5. 所以我们在 class Observer 在添加一个方法 observeArray 如果判断 你传进来的 数据是个数组我们在去做单独的处理
```

### 数组数据情况一

```js
1. 数组情况一 {arr:[{name:'zs'},{name:'ls'}]} 数组中的每个元素都是对象 
2. 我们就用我们的 observeArray方法 把arr传入进去
3. observeArray 方法 会循环你的数组 然后调用我们的劫持方法observe 把数组中的每一项传入进去
```

### 数组数据情况二

```js
1. 数组情况二 {arr:[{name:'zs'},{name:'ls'}]} 当我们使用this.arr.push({name:'ww'})的时候 你push进去 {name:'ww'} 是劫持不到的 所以这些 数组的push unshift pop shift sort splice reverse 都是改变原有数组的这些方法 这些方法 都是js 内置类  而传进去的参数 你都是拿不到的 所以也就调用不了 observe 方法 做不了劫持
2. 所以我们就要重新写这个方法 做个切片 就是当你调用push 的方法的时候 我们先走我们自己的push方法 然后在走你原型上的push方法
3.我们知道 我们数据劫持调用的是observe方法 参数是你的数据 你所有的数据 肯定是定义在一个对象里面 然后我们把数据传入了 我们 observe 中的 class Observer 类里 这个类 然后循环你传进来的数据 每一项 再去根据不同的数据类型调用 observe方法 走数据劫持
4. 所以当我们数据是数组的时候 会走到 class Observer 判断条件里 那么在这里 我们开始对数组上的方法重写 就是按照我们上面的分析
6. 我们知道 arr.__proto__ 原型链 指向我们的 Array.prototype 原型 在原型上有push unshift ... 等等方法
7. 所以这个时候 我们就创建一个 空对象 让这个空对象的__proto__  指向 Array.prototype 然后在这个空对象上我们在写我们的push unshift... 等等方法 
8. 然后在让我们的 arr.__proto__ 指向我们的刚刚创建的空对象 
9. 这样我们在调取我们的arr.push 的时候 他会顺着原型链去找push 方法 首先找到的是我们的push方法 这个时候我在我们的push方法中就可以拿到参数 然后做劫持 然后在我们自己的push方法中在调用我们数组原型上的方法
10. 以上的操作 就可以做到切片
```

```js
1. 以上我们重写的方法是在一个array.js 文件中去完成的 
2. 首先我们会创建一个 空对象 Object.create(Array.prototype)
3. 然后把创建的空对象到处去 然后在 class Observer 文件中 判断数组哪里 让参数.__proto__ 等于我们的这个对象
4. 然后我们 把我们重写的方法 列在一个数组中 循环这个数组 把每一项都写入到我们创建的空对象中 值是一个函数
5. 然后在这个函数里 调用我们的 Array.prototype 原型上的方法 并且改变 this 并且把我们的参数传入进去
6. 然后在这个函数里 我们需要把你push unshift ...等等 你进来的参数 继续调用 class Observer 进行数据劫持
7. 所以问题来了 class Observer 是在另外一个文件里 我们怎么调用我们的 observeArray方法
8. 这我们在 class Observer constructor 里给我们传进来的数据都自定义个属性 叫__ob__ 这个属性 这个属性的值就是我们的 class Observer
9. 所以我们就可以在 array.js文件里 当调用了我们自己的push unshift 等等 方法的时候 就可以使用我们的__ob__上的  class Observer 中的方法了
```

```js
1.所以这里 我们就可以 在observe 的时候 最开始就判断一下 你传进来的数据 有没有__ob__ 如果有 就说明你已经被劫持过了 我们就什么也不做
```

