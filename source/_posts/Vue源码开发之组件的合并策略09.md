---
title: Vue源码开发-组件合并策略09
date: 2021-01-07
updated: 2021-01-07
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

# Vue源码开发之组件的合并策略

```js
1. 我们知道生命组件使用的API是 Vue.component 这是把Vue当作对象去使用
2. 然后在我们实例上也可以生命组件 
3. Vue.component 其实是调用了 Vue.extend 方法。这个方法会通过对象创建一个类 然后通过这个类创建一个组件去使用
4. 既然你全局能创建组件 自己的实例上也可以创建组件 如果名字相同 那么肯定会调用实例上的组件 所以就会有一个查找规则 先查找自己身上有没有存在 如果没有在查找父亲 这个查找机制 是通过__proto__ 原型链去查找的 
5. 这个操作是在初始化的时候完成的 会先去把component合并 然后去找 组件 如果没有 在通过__proto__去找 也就是你全局的
```

```js
<script>
    Vue.component('my-button'{
        template:'<button>全局按钮</button>'
    })
    let vm = new Vue({
        el:'#app',
        data:function(){
            return {
                arr:[1,2,3]
            }
        },
        components:{
            'my-button':{
                template:'<button>实例按钮</button>'
            }
        }
    })
    setTimeout(() => {
       vm.arr.push(456)
    },1000)
</script>
```

## Vue.Component方法

```js
1. 首先我们在调用Vue.Component 方法的时候 他会注册一个全局组件
2. 其实就是把我们的全局组件 合并到了 实例的组件上 所以在任何组件里都可以使用
3. 其原理就是 我们在Vue.Component的时候 就会 调用extend函数 这个函数会返回一个构造函数
```

```js
// index.js

//2021 0221 组件的合并策略
    //3. 这里我们也需要以一个全局的变量
    Vue.options._base = Vue // 就是把Vue的构造函数 挂在到Vue对象上
    // 2.这里我们也会把你合并后的组件都放在下面的属性上
    Vue.options.components = {}
    //1. 首先我们注册全局组件的时候 会调用下面的方法去创建
    // 然后在把实例上的定义的组件 和 全局定义的组件合并
    // 合并的时候 是通过__proto__这种方式 合并的 如果实例上找不到你定义的组件 那么就去原型链上找
    Vue.component = function(id,definition){
        //id 就是 组件的名称  definition 就是你传进来的对象 里面有 template data props...等等
        //4. 这里我们每个组件会有name 属性 默认我们先去找name 属性去查找组件 如果没有在去使用id去找组件
        definition.name = definition.name || id
        //5. 然后开始写我们的原型链 主要就是调用Vue.extend方法 产生一个构造函数
        // 这里我们为了保证this 的指向是我们的Vue对象所以就用到我们上面保存的变量
        definition = this.options._base.extend(definition)
        // 6.然后把我们生成好的 构造函数 挂在到我们的 Vue.options.components上
        this.options.components[id] = definition
    }
```

## Vue.extend方法

```js
1. 主要就是返回一个构造函数 
2. 目的就是 在合并的时候 为我们的实例上的 components 属性增加一个原型链 原型链上可以找到 我们全局注册的组件 这样 组件在查找的时候 会先看 自己有没有 如果有就用自己的 如果没有在去我们增加的原型链上去找
3. 我们在组件传进来的配置项 也会有data methods props computed等等 这里 我们也要做数据的劫持一些操作 所以 extend方法里面 会新创建一个子类 Sub 这个构造函数 继承了 Vue的上的方法 使用了原型继承的方法 然后再把我们组件的那些配置项 这样Sub类原型上就有了 Vue上的那些方法 比如_init方法等等 然后在把我们配置项传入到_init
函数上去 就又相当于初始了一个Vue实例
4. 最后 我们开始合并 你Vue上的options 和 实例上的options
```

```js
//  index.js

//7.Vue.extend 返回一个构造函数
    Vue.extend = function(options){
        //这里主要产出一个Vue的子类 options就是我们调用Vue.component的时候传入的配置项
        // 里面有 template data props...等等
        // 这里面 我们的options 也就相当于我们的new Vue传入的那些配置项
        // 所以这里我们组件也应该是数据也要是响应式的 我们刚刚写过 new Vue的时候的 _init方法 
        // 所以这里为了还可以使用 我们就要继承
        // 因为这里我们已经把Vue的构造函数存放在 this.options._base里了 所以这里不管我们调取
        // 这里的this就是我们的Vue的构造函数 然后我们Sub这个构造函数继承他上面的方法
        //8.1 开始继承
        const Super = this  // 这里的this不管你怎么调取 都是Vue的构造函数
        const Sub = function VueComponent(options){
            // 8.3 这里我们使用_init方法 他就会根我们new Vue一样 初始化你的状态 做数据劫持 AST语法树 render函数等等
            this._init(options)
        }
        //8.2 这里 就是让我子类的原型 指向 Vue的原型 这样就可以调取 Vue构造函数上的那些 _init方法 _render _update 等等方法
        Sub.prototype = Object.create(Super.prototype)
        // 为了 保证我们构造函数 的准确 所以还要重些一些构造函数
        Sub.prototype.constructor = Sub
        // 9. 这里我们Sub 现在也就是一个构造函数了 那么它上面也应该有extend方法 这里我们就让他永远调用Vue.extend方法
        Sub.extend = Super.extend
        // 10. 现在我们Vue上有options 属性 那么子类上也要有 所以这里我们开始合并 把子类和父类的合并 然后在赋值给子类的options
        Sub.options = mergeOptions(Super.options,options)
        // ...这里还有很多方法
        return Sub 
    }
```

## components的合并策略

```js
1. 主要句是为了 让我们实例上的components 属性 产生一个 原型链
2. 这个原型链的指向 就是我们全局注册的组件 Vue.component 方法注册组件
3. 所以组件在渲染的时候先找自己身上的 如果没有 就沿着原型链去找
```

```js
// 2021 0221 1. 合并 component属性 到Vue.options上
strats.components = function(parentVal,childVal){
    //2. 这里就开始做原型链了 让我们 实例上的components 上增加了原型链__proto__
    //  而这里的 parentVal 还是我们Vue上的options 属性 上的component 经过Vue.extend的处理已经变成一个构造函数
    // 所以 我们实例上的 components 的原型链 就指向了 我们extend处理过的构造函数
    const res = Object.create(parentVal)
    if(childVal){
        for(let key in childVal){
            res[key] = childVal[key]
        }
    }
    return res
}
```

## 代码逻辑

```js
// 1. 这里会调用我们的 extend方法 在调用之间 我们把Vue  构造函数 存放在 Vue.options._base属性上了
// 这样做的目的 是为了 永远this指向是我们的 Vue构造函数
//2. 然后我们传进去的 { template:'<button>全局按钮</button>' } 会传入到我们的extend函数里面 这个函数 首先会产生一个子类的构造函数Sub 这里是为了让我们实例的的components上增加一个原型链 
//3. 然后这里我们需要把传进去的 { template:'<button>全局按钮</button>' } 这些 也可以 数据响应式 等等 一些Vue的操作。所以这里 Sub的原型重写了 他继承了Vue上的方法 这样我们配置项 就可以传入到_init函数里了
//4. 然后让我们Sub类上的 extend 方法 就等于了 Vue.extend方法
//5. 最后 在我们Sub上增加了一个 options属性 值是你调用mergeOptions方法 合并了你传进来的 配置项 返回值也就是合并之后的 Vue.options  Vue上options 经过合并 上也有了 Vue.options.components属性
Vue.component('my-button',{
      template:'<button>全局按钮</button>'
  })
// 6. 我们合并的策略 是利用Object.created() 方法 创建一个空对象 然后让__proto__ 指向你传进来的函数里的参数 也就是我们Vue.options.components属性 这个在上面已经合并过一次了 所以里面他的值就是 my-button:{ template:'<button>全局按钮</button>'} 
//7. 最后让们实例上的components属性 原型链__proto__ 指向了我们刚刚传进来的
//8. 这样我们就做了一个components的原型链
  let vm = new Vue({
      el:'#app',
      data:function(){
          return {
              arr:[1,2,3]
          }
      },
      components:{
          'my-button':{
              template:'<button>实例按钮</button>'
          }
      }
  })
```

