---
title: 手写一个mini版本vue-router
date: 2019-03-18
updated: 2019-06-03
tags: Vue-Router
categories: 源码
keywords: Vue 源码
description: 手写一个lmini版本vue-router
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
# mini版本vue-router

## router的挂载流程

```JS
//首先我们看看原本的vue-router都挂在流程 
router.js文件
//引入Vue
import Vue from 'vue'
//引入了vue-router 这里也就是我们构造函数
import Router from 'vue-router'
//引入了对应的组件
import Home from './views/Home.vue'
import About from './views/About.vue'

// 使用了vue的use方法 把router挂在到了 vue上
Vue.use(Router);
//配置了模式 和 基础地址 还有里有表 把这些当作了配置项目传进了我们的router构造函数 导出了我们router构造函数 挂在到了vue构造函数上
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [ 
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
  ]
})
```

```JS
//main js文件 
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
//把我们导出的router的构造函数挂在到了vue的构造函数上
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

## Vue.use都干了什么

```JS
1.首先我们Vue.use()  默认会调install方法 所以我们需要在你传进去的构造函数上 添加一个install方法
2.这个install方法的形参 就是你的Vue实例
3.这里我们会把传进来的vue存放一下 方便我们扩展属性 或者 组件（elementtUI）和指令
```

```JS
//如下所示
class Router {
  constructor () {
    this.a = '11' //测试
  }
}
// 默认我们的Vue.use会调用函数install
// 所以我们需要在我们传进去的Router里写个install方法
// 这里的形参就是我们的Vue实例
Router.install = (_Vue) => {
  const Vue = _Vue
}
export default Router
```

```JS
//我们在new Vue的时候传进去了配置项
new Vue({
  router, //这里把我们的router的构造函数也传进去了
  render: h => h(App)
}).$mount('#app')
//然后又通过Vue.use(Router)触发了install函数 拿到了Vue的实例
Router.install = (_Vue) => {
 //所以当前的Vue实力上是有router的   
  const Vue = _Vue
}
export default Router
```

## 如何在每个组件上拿到router实例

```JS
1.我们知道每个Vue组件都是一个Vue的实例 
2.我们在根组件的时候 也据是new Vue的时候 会把router传进去
3.那么我们怎么在每个组件都拿到router呢
//可能我们可以把router 挂在到Vue的原型上 如Vue.prototype.router = xxx 
//但是这样做了以后 我们重新 new Vue的时候 也会在原型上增加
4.所以这时候为了避免这样 我们就要给每个组件都单独添加一个router 就要使用Vue的api minxin() 混合
```

## Vue.mixin() API

```JS
1.这个api会把我的new Vue的时候 传入的配置对象 给每个组件的属性混合一起
2.内部有个方法 叫beforeCreate() 会把我们组件的声明周期都在一个数组里 然后把他自己放在数组的最前面 所以在组件调用的时候会在组件自己的声明周期之前执行eforeCreate()方法
```

## 给每个组件都添加router实例

```JS
1.我们知道 我们的router实例 实在根组件的时候在会传进去的 所以我们要判断 是不是根组件 如果不是 我们就继续向上找 
2.由于我们的每个组件里都会有beforeCreate() 所以会一直向上找 知道找到根组件
```

```JS
let Vue
class Router {
  constructor () {
    //这里可以在组件里拿到a的值  
    this.a = '11'
  }
}
// 默认我们的Vue.use会调用函数install
// 所以我们需要在我们传进去的Router里写个install方法
// 这里的形参就是我们的Vue实例

Router.install = (_Vue) => {
  Vue = _Vue
  // 为了在我们每个Vue的组件中拿到router实例 所以使用mixin方法 而不是使用原型上的那种添加方法
  Vue.mixin({
    // 在每个组件的生命周期 之前调用 每个组件都会调用所以会一直执行类似递归
    beforeCreate () {
      // 判断你是不是最开始的根组件 也就是我们new Vue的时候传进去的配置
      if (this.$options && this.$options.router) {
        // 如果是我就赋值
        this._router = this.$options.router
      } else {
        // 如果不是我就继续向上找 这里你也可能没有父亲 可能是新new Vue 所以多了一层判断
        this._router = this.$parent && this.$parent.router
      }
      // 以上就是让所有的组件都有了router的实例 也可拿到我们传进router构造函数的值
      console.log(this.router.a, '----- 11 ')
    }
  })
}
export default Router
```

## 添加属性

```JS
1.我们知道在每个Vue的组件里 都可以使用this.$route 和 this.$route
2.这个其实就是相当于给对象添加了一个属性 这里我们要做数据劫持
let Vue
class Router {
  constructor () {
    this.a = '11'
  }
}
// 默认我们的Vue.use会调用函数install
// 所以我们需要在我们传进去的Router里写个install方法
// 这里的形参就是我们的Vue实例

Router.install = (_Vue) => {
  Vue = _Vue
  // 为了在我们每个Vue的组件中拿到router实例 所以使用mixin方法 而不是使用原型上的那种添加方法
  Vue.mixin({
    // 在每个组件的生命周期 之前调用 每个组件都会调用所以会一直执行类似递归
    beforeCreate () {
      // 判断你是不是最开始的根组件 也就是我们new Vue的时候传进去的配置
      if (this.$options && this.$options.router) {
        // 如果是我就赋值
        this._router = this.$options.router
      } else {
        // 如果不是我就继续向上找 这里你也可能没有父亲 可能是新new Vue 所以多了一层判断
        this._router = this.$parent && this.$parent.router
      }
      // 以上就是让所有的组件都有了router的实例 也可拿到我们传进router构造函数的值
      // 为每个组件添加$router 和 $route 属性 这里的this就是当前的Vue实例也就是组件
      Object.defineProperty(this, '$router', {
        value: {}
      })
      Object.defineProperty(this, '$route', {
        value: {}
      })
    }
  })
}
export default Router
```

## 生成组件

```JS
1.以上我们已经完成了增加属性
2.我们都知道 router会有两个组件 一个是router-link 其实就是一个a标签 另一个是router-view 一个渲染的视口
3.所以接下来我们需要创建这个两个组件
```

```jsx
let Vue
class Router {
  constructor () {
    this.a = '11'
  }
}
// 默认我们的Vue.use会调用函数install
// 所以我们需要在我们传进去的Router里写个install方法
// 这里的形参就是我们的Vue实例

Router.install = (_Vue) => {
  Vue = _Vue
  // 为了在我们每个Vue的组件中拿到router实例 所以使用mixin方法 而不是使用原型上的那种添加方法
  Vue.mixin({
    // 在每个组件的生命周期 之前调用 每个组件都会调用所以会一直执行类似递归
    beforeCreate () {
      // 判断你是不是最开始的根组件 也就是我们new Vue的时候传进去的配置
      if (this.$options && this.$options.router) {
        // 如果是我就赋值
        this._router = this.$options.router
      } else {
        // 如果不是我就继续向上找 这里你也可能没有父亲 可能是新new Vue 所以多了一层判断
        this._router = this.$parent && this.$parent.router
      }
      // 以上就是让所有的组件都有了router的实例 也可拿到我们传进router构造函数的值
      // 为每个组件添加$router 和 $route 属性 这里的this就是当前的Vue实例也就是组件
      Object.defineProperty(this, '$router', {
        value: {}
      })
      Object.defineProperty(this, '$route', {
        value: {}
      })
    }
  })
  // 生成一个router-link组件 其实就是一个a标签 这里使用了jsx语法 能拿到你标签上传过来的to的值 这里当我们点击的时候a标签会让浏览器地址跳到你传给的地址栏上的值
  Vue.component('router-link', {
    props: {
      to: String
    },
    render () {
      return <a href={`${this.to}`}>{this.$slots.default}</a>
    }
  })
  // 生成视口组件
  Vue.component('router-view', {
    props: {
      to: String
    },
    render () {
      return null
    }
  })
}
export default Router
```

```JS
//下面我们就在app.vue里使用了这个组件
<template>
  <div id="app">
    //这里就是我们刚才使用的组件  
    <router-link to="/index">去首页</router-link>
    <router-link to="/about">去about页</router-link>
  </div>
</template>

<script>

export default {
  name: 'App'
}
```

![](1.gif)

```JS
//我们看到上面已经实现了组件的跳转 并且地址栏也改变了 接下来就是要拿到我们的路由表 然后 把对应的组件渲染在视口里面
```

## 拿到路由表

```JS
1.我们在new Router时候 传进去了配置项目 里面就有我们的路由表
2.拿到路由表之后 我们需要吧数据从新渲染一下 变成{'路径':'对应的组件'}
export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
//变成这样
{'/':Home,'/about':About}
```

```jsx
//在实例里拿到路由表之后 我们就需要处理一下路由表的格式变成我们上面的那样 然后我们在定义一个默认的显示的路径 让我们的router-view去默认显示这个路径下的路由 
/* eslint-disable no-return-assign */
let Vue
class Router {
  constructor ({ routes }) {
    const obj = {}
    routes.forEach(item => {
      obj[item.path] = item.component
    })
    // 这里建立映射关系 把我们的路由表遍历成了 {'/':Home,'/about':About}
    this.routeMap = obj
    // 定义了当前路由 也就是默认路由 然后我们根据路由表的映射关系去把组件渲染到我们的router-view里面去
    this.route = { current: '/' }
  }
}
// 默认我们的Vue.use会调用函数install
// 所以我们需要在我们传进去的Router里写个install方法
// 这里的形参就是我们的Vue实例

Router.install = (_Vue) => {
  Vue = _Vue
  // 为了在我们每个Vue的组件中拿到router实例 所以使用mixin方法 而不是使用原型上的那种添加方法
  Vue.mixin({
    // 在每个组件的生命周期 之前调用 每个组件都会调用所以会一直执行类似递归
    beforeCreate () {
      // 判断你是不是最开始的根组件 也就是我们new Vue的时候传进去的配置
      if (this.$options && this.$options.router) {
        // 如果是我就赋值
        this._router = this.$options.router
      } else {
        // 如果不是我就继续向上找 这里你也可能没有父亲 可能是新new Vue 所以多了一层判断
        this._router = this.$parent && this.$parent.router
      }
      // 以上就是让所有的组件都有了router的实例 也可拿到我们传进router构造函数的值
      // 为每个组件添加$router 和 $route 属性 这里的this就是当前的Vue实例也就是组件
      Object.defineProperty(this, '$router', {
        value: {}
      })
      Object.defineProperty(this, '$route', {
        value: {}
      })
    }
  })
  // 生成一个router-link组件 其实就是一个a标签 这里使用了jsx语法 能拿到你标签上传过来的to的值
  Vue.component('router-link', {
    props: {
      to: String
    },
    render () {
      return <a href={`#${this.to}`}>{this.$slots.default}</a>
    }
  })
  // 生成视口组件
  Vue.component('router-view', {
    props: {
      to: String
    },
    //这里this是我们当前的组件 因为在上面的时候 也就是beforeCreate 我们已经把router的构造函数挂载到了我们的当前组件上 所以这里就能拿到我们定义的路由伊用的映射关系
    render (h) {
      //还记得我们便利的路由表的结构么  {'/':Home,'/about':About} 这样的 然后我们把当前的路由就切换过去了 
      return h(this._router.routeMap[this._router.route.current])
    }
  })
}
export default Router

```

## 点击跳转路由 router-view切换不同的组件

```JS
1.上面我们已经设置当前路由 所以当我们点击按钮的时候 就应该把当前路由的路径改变 
2.然后去映射表里找到对应的路径的组件
3.首先我们在初次加载的时候要给显示默认的组件 
4.当我们点击按钮的时候 我们知道浏览器的地址栏会变成我们点击的那个路径 然后我们取到值 赋值给当前路由 然后我们的组件也会跟着改变
```

```jsx
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
let Vue
class Router {
  constructor ({ routes }) {
    const obj = {}
    routes.forEach(item => {
      obj[item.path] = item.component
    })
    this.routeMap = obj
    this.route = { current: '/' }
    // 初次加载的时候会监听laod事件 默认跳到/首页
    window.addEventListener('load', () => {
      location.hash ? '' : location.hash = '/' // 默认就跳转到 首页
    })
    // 当我们点击跳转的时候浏览器的地址栏会发生改变 用hashchange就可以监听到 然后我们取值在把路径赋值给我们的当前路由即可
    window.addEventListener('hashchange', () => {
      this.route.current = location.hash.slice(1)
    })
  }
}
Router.install = (_Vue) => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.router) {
        this._router = this.$options.router
      } else {
        this._router = this.$parent && this.$parent.router
      }
      Object.defineProperty(this, '$router', {
        value: {}
      })
      Object.defineProperty(this, '$route', {
        value: {}
      })
    }
  })
  Vue.component('router-link', {
    props: {
      to: String
    },
    render () {
      return <a href={`#${this.to}`}>{this.$slots.default}</a>
    }
  })
  Vue.component('router-view', {
    props: {
      to: String
    },
    render (h) {
      return h(this._router.routeMap[this._router.route.current])
    }
  })
}
export default Router

```

![](2.gif)

```JS
//这里看到我们的地址栏是变的了 但是我们的组件并没有没渲染出来 这是因为我们的这里的赋值给当前路径不是响应式的 所以没有发生改变
```

## 当前路由路径响应式

```JS
1.因为数据现在不是响应式的 所以没有发生改变
2.这里我们使用Vue自带的工具 把我们的this.current 变成响应式即可
```

```jsx
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
let Vue
class Router {
  constructor ({ routes }) {
    const obj = {}
    routes.forEach(item => {
      obj[item.path] = item.component
    })
    // 这里建立映射关系 把我们的路由表遍历成了 {'/':Home,'/about':About}
    this.routeMap = obj
    // 定义了当前路由 也就是点击的那个 变成响应式数据
    Vue.util.defineReactive(this, 'route', { current: '/' })
    window.addEventListener('load', () => {
      location.hash ? '' : location.hash = '/' // 默认就跳转到 首页
    })
    window.addEventListener('hashchange', () => {
      //当路由跳转变化的时候 监测到 然后我们就把浏览器的地址栏的路径取到 赋值给我们的当前路径  
      this.route.current = location.hash.slice(1)
    })
  }
}
Router.install = (_Vue) => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.router) {
        this._router = this.$options.router
      } else {
        this._router = this.$parent && this.$parent.router
      }
      Object.defineProperty(this, '$router', {
        value: {}
      })
      Object.defineProperty(this, '$route', {
        value: {}
      })
    }
  })
  Vue.component('router-link', {
    props: {
      to: String
    },
    render () {
      return <a href={`#${this.to}`}>{this.$slots.default}</a>
    }
  })
  Vue.component('router-view', {
    props: {
      to: String
    },
    render (h) {
      //这里由于浏览器的路径变化了 所有我们的对应的组件也变化了  
      return h(this._router.routeMap[this._router.route.current])
    }
  })
}
export default Router
```

![](3.gif)

## 总结

```JS
1.Vue.use的时候 我们会默认调用install这个函数 形参是Vue实例
2.为了我们能在每个组件里把router的实例挂在到组件上 所以我们使用了mixin 的混合 而没有使用Vue.prototype.router
3.然后我们创建了两个组件router-link 和 router-view 一个渲染成a标签 在点击的时候会跳转 然后浏览器的路径也会变
4.然后我们可以在router的实例中拿到你传进来的配置项 把路由表变成 路径:组件 这样的对象 建立映射关系
5.然后定义当前路径 这里用了Vue.util 把这个当前路径变成响应式
6.初次加载监听了浏览器的load事件 并把当前路由设置了一下
7.当点击router-link的时候 浏览器的地址会跳转 hash也会发生改变 这个时候我们又监听了 并且把浏览器跳转的路径地址做了截取出来
8.然后router-view 根据我们建立的映射关系表 渲染不同的组件
9.代码 地址 https://github.com/wazer1987/mini_VueRouter
```

