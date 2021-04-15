---
title: Vue源码开发-生命周期合并07
date: 2021-01-06
updated: 2021-01-06
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

# Vue源码开发之生命周期合并

```js
1. 首先我要明确一点  函数有三个功能 第一个 当作普通函数执行 第二个new 执行创造实例 第三个 当作对象去使用 所以对象是会有一些方法 比如 Vue.mixins Vue.Componet Vue.directive 等等
2. 这里我们的生命周期实现 就是用 Vue.mixins 去实现的 当然不止生命周期 比如我们实例上的mixins 也可以把不同文件的data methods 混入进去
```

## 混合的概念

```js
1. 首先会在 Vue对象上 有一个options 属性 这里是总的池子 也就是你混入其他的函数 或者属性的时候需要向这个options属性里去合并
2. 每合并一次我们的属性都是按顺序排列的
```

```js
// 第一次这个上面 
Vue.options = {} 
// 第一次调用
Vue.mixin({
	created:function a (){
    console.log(111)
  }
})
// 调用之后 向options里合并了你的函数 建就是你的created
Vue.options = {created:[console.log(111)]}
// 第二次调用
Vue.mixin({
	created:function b (){
    console.log(222)
  }
})
// 调用之后 接着还是向Vue.options 里合并 在合并的过程中发现 有created的键名了 就向这个键名的数组里合并函数 合并之后
Vue.options = {created:[a,b]}
```

```js
1. 直到最后都已经合并完毕了 
2. 我们就开始循环调用
3. 当然这里不单单是我们的created。包括我们实例上的data 和 methods 计算属性 watch等等 都可以
```

## initGlobalApi函数

```js
1. 这个函数就我们所说的 把Vue 当作对象去使用 它上面 会定义写静态的方法等等
2. 比如我们下面要写的混入 mixins 方法
3. 当我们初始化了数据 更新函数_update _render 等等 然后就开始初始化我们的静态方法
```

```js
import { initGlobalApi } from './global-api/index.js'
import {initMixin} from './init.js'
import { lifecycleMixin } from './lifecycle.js'
import { renderMixin } from './vdom/index.js'

// 这里我为了放便文件 分割 所以我们使用了构造函数的写法 而没有采用ES6 的class 类
// 如果采用 class 写法 我们在原型上写方法 只能写在class 里面 
// class Vue {
//     a(){}
//     b(){}
// }

// 如果采用 构造函数写法 我们就可以 在原型prototype上 把方法都拆分到不同的文件中去
function Vue(options){
    this._init(options)
}
initMixin(Vue)
lifecycleMixin(Vue) //扩展我们原型上的_update方法 主要为了把虚拟DOM渲染到真实DOM
renderMixin(Vue)


//20201 0219 静态方法 比如 Vue.component Vue.mixins  Vue.directive 等等
initGlobalApi(Vue)
export default Vue
```

```js
// 2021 0219 生命周期的混合 global-api / index.js

export function initGlobalApi(Vue){
    // 1. 我们的Component 和 mixin 还有 directive等属性 其实都是把Vue当做对象
    // 然后这些都是他对象上的一些方法
    // 这些方法都在 options属性上
    Vue.options = {} // Vue.components Vue.directive等等 都在这个options里
    Vue.mixin = function(mixin){
      //这里的this 谁调用的就是谁 首先这里我们方便举例 会用Vue.mixin去调用 所以这里的this 指的就是 Vue这个对象 那么他上面就是一些options的数据 接下来 就开始做合并的操作
      // 这里需要考虑的问题是 当我们用户把Vue当作构造函数去使用的时候 实例上也会传递进来一些函数 所以这里我们也要合并一下 
        console.log(this.options,'---this')
    }
}
```

## mergeOptions

```js
1. 这个就是我们合并的方法
2. 思路就是当调用一次mixin 传入进来的是个对象 第二次也是 所以我们核心逻辑 就是向 Vue.options 合并对象 把相同的键名 只保留一个 相对键名对应的方法都放在一个数组里
3. 这里我们首先只考虑生命周期   因为除了生命周期以外 我们还有 data watcher methods 等等
```

```js
// global-api / index.js

import { mergeOptions } from "../util"

export function initGlobalApi(Vue){
    // 1. 我们的Component 和 mixin 还有 directive等属性 其实都是把Vue当做对象
    // 然后这些都是他对象上的一些方法
    // 这些方法都在 options属性上
    Vue.options = {} // Vue.components Vue.directive等等 都在这个options里
    Vue.mixin = function(mixin){
        //2.开始合并的函数 
        //合并的的操作有两次
        //第一次 当我们把Vue当作对象去使用的时候 我们会调用Vue.mixin方法 然后把他传进来的 去合并到我们的options上
        // Vue.mixin({created:function a (){...}}) 需要合并到我们的Vue.options上
        // 第二次合并 就是当我们Vue 当作构造函数 去实例化对象的时候 还要把我们实例化的选项合并到我们的上一次合并好的地方
        this.options = mergeOptions(this.options,mixin)
    }
}
```

```js
// utils.js

Vue.mixin({
    created:function a {
        console.log('我是第一次调用mixin')
    }
})
Vue.mixin({
    created: function b{
        console.log('我是第二次调用mixin')
    }
})

// 2021 02 19 生命周期合并 我们调用一次 mixin的时候都会走到这个函数里 然后把 Vue.options 和 调用 Vue.mixin的参数传入进去
export function mergeOptions(parent,child){
  // 1. 所以我们第一次 parent 就是 Vue.options 是个空对象
    const options = {}
    //6. 第二次我们调用Vue.mixin的时候 因为上一次调用已经让我们的Vue.options变成 Vue.options{created:[a]} 这样了 所以 就会走到 下面的循环里 然后在接着去合并
    for(let key in parent){ 
      // 2. 所以第一次不会走这里
        mergeField(key)
    }


    for(let key in child){ 
      //3.child就是你调用Vue.mixin 传入的参数 可能是{created:function a (){}}等等
        if(!parent.hasOwnProperty(key)){
        // 4. 由于我们第一次 Vue.options里没有你传入的 created这个字段 所以我们要开始合并
        // 合并的时候 就是调取这个函数  
            mergeField(key)
        }
    }



    function mergeField(key){
       // 5. 这里现在就是做的合并操作 我们先省略
       // 结果就是 把我们第一次调用Vue.mixin传入的{created:function a (){}} 合并到了 Vue.options里
      // 合并后的结果是 Vue.options{created:[a]}
    }


    return options
}
```

## 策略模式

```js
1. 首先 我们知道 我们合并的东西有很多 生命周的就有 'beforeCreate','created','beforeMount','mounted','beforeUpdate','updated','beforeDestroy','destroyed' 这些
2. 除了生命周期之外 我们还有data computed watcher 等等
3. 因为 你调用mixin的时候的时候 混入的方式如下
Vue.mixin({
  created:function a (){...}
  data:function  () {...},
  computed:function () {....}
})
4. 所以这里我们要根据你 字段不同 才去不同的策略去合并
5. 这里我们先以生命周期为例
```

```js
// 我们先写好策略
// 以下是我们根据 合并不同字段 所采取的策略函数
const strats = {}

strats.data = function (){

}

strats.computed = function (){

}

strats.watch = function (){

}
// 然后是生命周期的

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

// 因为合并生命周期的策略 基本一样 所以我们循环一下 让他都等于一个函数

LIFECYCLE_HOOKS.forEach( hook => {
    //这里根据不同的配置合并去才去不同的策略
    strats[hook] = mergeHook
})
```

```js
// 开始合并

export function mergeOptions(parent,child){
    const options = {}
    for(let key in parent){ 
        mergeField(key)
    }

    for(let key in child){ 
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }
    }

    function mergeField(key){
      //1.第一次调用Vue.mixin的 会走到便利你调用 Vue.mixin传入的参数里的循环里面去 {created:function a() {}}
      // 2. 这里我们要保证我们的合并策略中有你传入的字段
        if(strats[key]){
          // 3.strats[key] 其实就是 strats.created 上面我们已经循环便利好了 所以他是一个函数 也就是我们的  mergeHook  那么 parent[key] 就是你 Vue.options{created:function(){}}函数 第一次的时候是没有 Vue.options.created这个字段的 所以在 mergeHook我们还需要判断 
          // child[key] 就是 你调用 Vue.mixin({created:function a (){}}) 传入的 {created:function a (){}} 中 function a (){} 函数
            options[key] = strats[key](parent[key],child[key])
        }else{
            // 没策略 就默认合并
        }
        
    }
    return options
}
```

## mergeHook函数

```js
1. 我们采用策略的模式来说 你混入对应的选项 就会走到对应的处理函数中去
2. 比如 生命周期的合并就会走到 mergeHook 函数里来
3. 第一次为们调用Vue.mixin({created:function a () {}}) 的时候 Vue.options 上是没有 字段的 
4. 所以我们调用Vue.mixin之后 就希望 Vue.options{created:[a函数]}
5. 第二次调用的时候 Vue.options上面已经有东西了 是 Vue.options{created:[a函数]} 所以当我们在调用 
Vue.mixin({created:function b () {}}) 的时候 因为已经 created这个字段了 就希望把第二次调用的时候对应的字段的值 也就是 function b () {} 放到created的后面 Vue.options{created:[a函数，b函数]}
```

```js
// 这里就是开始生命周期的合并
function mergeHook (parentVal,childVal){
    //6. 这里就开始我们的合并 第一次的调用 Vue.mixin 的时候 childVal就是我们传入的参数
    if(childVal){
        if(parentVal){
            // 6.1 这里就是 儿子也有 爸爸也有 那么就需要把儿子的值和爸爸的值进行混合一定的爸爸对应字段的方法在前面儿子在后面
            return parentVal.concat(parentVal)
        }else{
            // 6.2 这里就是爸爸没有这个字段 但儿子有 那么直接就向爸爸合并即可
            // 我们距离如果第一次调Vue.mixin 我们的Vue.options 肯定是个空对象 那么我们就需要把儿子的对应字段的函数包装成一个数组
            // 等我们第二次在调Vue.mixin的时候 第二次传入的字段 要向上合并放在第一次调Vue.mixin的包装好的数组的后面
            return [childVal]
        }
    }else{
        //如果当你调去mixin的时候 没有传入对应的字段 比如你调用Vue.mixin({created:function a (){}})的时候 created没有处理函数
        // 那么我们直接就返回父亲的即可
        return parentVal
    }
}
```

## 合并实例

```js
1. 我们现在把Vue当作对象的时候 调用Vue.mixin 方法 把你每次调用的都合并到Vue.options上
2. 现在我们要合并实例的
3. 也就是当我们在new Vue的时候 也会传递一些配置项 这些配置项都是实例上的 比如实例的 data 实例的生命周期 等等等
4. 所以我们现在也要把实例传入的配置项 合并到 Vue.options上
5. 这里我们上面已经写好了合并的方法 
6. 所以这里在初始的时候我们就要进行合并 因为你在 new Vue的时候传入了这些
6. 最后合并的结果 其实就是 把实例上传入到了我们的Vue.optionss上 然后在赋值给了我们的实例的$options
```

```js
Vue.mixin({
    created:function a (){
        console.log('我是第一次调用mixin')
    }
})
Vue.mixin({
    created:function b (){
        console.log('我是第二次调用mixin')
    }
})
//这里我们在new Vue的时候 也就是创建实例的时候 也会合并到Vue.options上
let vm = new Vue({
    el:'#app',
    data:function(){
        return {
            product:'3;33',
            list:'333',
            name:'北城'
        }
    },

    created(){

    }
})
```

```js
// init.js 
Vue.prototype._init = function (options){
        const vm = this
        //从这里开始我们就要把实例传进来的 合并到我们的 Vue.options上 然后在赋值给我们的实例的$options
        // 这里 vm.constructor.options 就是Vue.options 
        // options 就是你创建实例传入的配置项
        vm.$options = mergeOptions(vm.constructor.options,options)
  			// 打印之后 就是 vm.$options.created 现在就有三个个函数了 前两个是我们调用 Vue.mixin的时候created对应的函数 第三个就是 我们实例上的created函数 因为我们实例上还有data 当便利的时候 因为key是data 所以他就走到他对应的策略里面去了
        console.log(vm.$options,'---')
        initState(vm)
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
```

## 全局组件和局部组件

```js
1. 这里我们已经知道了上面的合并 会循环配置项里的key 然后一次向Vue.options上合并 然后在 赋值给我们的实例的 $options上
2. 我们在注册全局组件的时候使用的Vue.components这样注册组件在全局都可以用的
3. 学过上面的合并我们知道 其实就是在初始化的时候 我们吧 Vue.components 全局组件 合并到了 实例上component
```

## 生命周期的调用

```js
1. 以上我们就把生命周期都合并了到了实例的$options 每个字段的对应的值合并之后都是数组
2. 现在我们针对不同的生命周期去在不同的初始化的时候调用
3. 所以这里我们需要有一个调用的方法 callHook
```

```js
// lifecycle.js

//2021 0220 调用生命周期的方法
export function callHook(vm,hook){
    // 1. 如果你传入了生命周期比如 created 
    // 那么我们在new Vue的时候 已经合并到当前实例的$options上了 
    // vm.$options.created:[a函数,b函数]
    const handlers = vm.$options[hook]
    //2. 然后开始循环 调用
    if(handlers){
        for(let i = 0; i<handlers.length;i++){
            // handlers[i] 就是我们合并的每一个字段 因为合并完之后都变成数组了
            // 在调用的时候 我们也要保证函数里面的this 是我们的实例
            handlers[i].call(vm)
        }
    }
}
```

```js
// init.js

Vue.prototype._init = function (options){
        const vm = this
        vm.$options = mergeOptions(vm.constructor.options,options)
        //2021 0220 调用生命周期 经过上面的合并操作 我们vm.$options 就有你传入的配置项的字段 然后我们就可以调用了
        callHook(vm,'beforeCreated')
        //初始化我们的状态 data methods computed watch等等
        initState(vm)
        // 2021 0220 上面状态初始完毕了 我们就可以调用 created了
        callHook(vm,'created')
        //8. 我们初始化了 State以后就要开始 首次渲染
        //8.1 如果当前有el属性 我才渲染
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }


    }
```

```js
// lifecycle.js 

export function mountComponent(vm,el){
   let updateComponent = () => {
       //2021 0220 生成真实DOM之前我们可以调用 beforeMounted
        callHook(vm,'beforeMounted')
        vm._update(vm._render())
        //2021 0220 上面update函数调用完毕之后我们就调用mounted
        callHook(vm,'mounted')
   }
  

   new Watcher(vm,updateComponent,() => {},true)
}
```

## 总结

```js
1. 我们生命周期的原理 简单来说 就是一个发布订阅的模式
2. 首先把我们的Vue 当作对象去使用 然后在上面也有一个options属性
3. 然后通过调用mixin函数 合并我们的配置项 
4. 核心api 就是 mergeOptions 函数 他会 把你调用 mixin 传进来的 配置项 然后合并到 Vue.options上 然后返回这个 options上属性 
5. 相同配置项项的属性 最后会合并成一个数组
6. 合并实例的时候的 也是在initState之前 就调用mergeOptions函数 把 你new Vue的时候传进来的选项 合并到 Vue.options 最后在赋值给我们实例的 $options上 这样我们实例的$options就有合并和的
6. 然后我们在写一个调用的方法 然后别在 new Vue不同的时期去调用这些 生命周期函数
```



