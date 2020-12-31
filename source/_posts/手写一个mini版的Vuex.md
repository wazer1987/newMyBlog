---
title: 手写一个mini版Vuex
date: 2019-03-19
updated: 2019-06-03
tags: Vuex
categories: 源码
keywords: Vue 源码
description: 写一个mini版Vuex
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
# 手写一个mini版Vuex

## 概念

```JS
1.Vuex 也是一个插件 
2.实现了四个东西 state / mutaitions / actions /getters
3.还是利用了Vue的数据响应式 这里就是为什么 Vuex 和 VueRouter 对Vue是强依赖 而 reacte 的 rudex 不是
```

## 流程

```JS
1.首先我们会 引入Vuex 然后 new Vuex.Store({配置项})
2.然后会Vue.use(Vuex) 这里就是调用了install函数
3.然后我们可以通过this.$store 拿到 store 说明 这里把store挂载到了 Vue上
```

```JS
//引入 Vuex
import Vue from 'vue'
import Vuex from '../vuex'
Vue.use(Vuex)
import Vue from 'vue'
import Vuex from '../vuex'
Vue.use(Vuex)
const state = {
  cont: 1
}
const mutations = {
  plus (state) {
    state.cont++
  }
}
const actions = {
  asyncPlus ({ commit, state }) {
    commit('plus')
  }
}
const getters = {
  sum (state) {
    return `共扔出${state.cont}`
  }
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
```

```JS
//挂载store
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入了我们刚才导出的store
import store from './store'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

## 使用

```JS
1.使用state 因为这里我们把我们的new Vuex.Store的配置最后都挂载到了 Vue上 所以在使用的时候 直接 this.$Store.state.cont 即可 
2.在使用Vuex.Store的mutations里 我们是使用commit去触发的 也就是提交mutations的函数 然后传参
3.在有异步请求的时候  我们是把请求写在actions的函数里 然后 在页面文件 dispatch 发射actions的函数 然后 如果有修改state里的数值状态的话 也是在commit mutations 
4.getters也是一样的 把Store的实例挂载了 Vue的原型上
```

```vue
<template>
  <div>
      我是HOME
      <span>Vuex:</span>
      <!--这里由于状态已经挂载到Vue的实例上了所以可以通过this.$store 拿到你传进去的配置项里的state-->
      <span>{{$store.state.cont}}</span>
      <!--getter也是一样的道理-->
      <div>{{$store.getters.sum}}</div>
      <button @click="add">扔炸弹</button>
      <button @click="addActions">隔一秒仍</button>
  </div>
</template>

<script>
export default {
  methods: {
    // 然后这里提交了mutations
    add () {
      this.$store.commit('plus')
    },
    addActions () {
      // 这里发射了actions 然后actions里去提交了mutations
      setTimeout(() => {
        this.$store.dispatch('asyncPlus')
      }, 1000)
    }
  }
}
</script>

```

## mini版Vuex

```JS
1.首先我们使用的时候 是通过Vue.use 去使用的 所以会有一个install函数 然后我们在new Vuex.Store 说明 会有一个Store的构造函数 也就是说 这个Store的构造 和install函数 是在一个文件里 导出的时候是通过一个对象去导出的
2.我们访问这个Store里的配置项 都是通过thit.$store去访问的 所以这里是把store挂载到了 当前Vue的原型上
3.我们的state里状态 是通过mutations 去修改的 也就是需要在mutations里写对应的函数 然后里面修改state的状态 而触发mutations里的函数 就是通过commit去触发的
4.actions 也是如此 只不过是通过dispatch去发射的
```

```JS
let Vue
// 这就是store的构造函数 也就是你的 new Vuex.Store({})的时候 传进去的配置项目 然后挂载到了 Vue的实例上
class Store {
  constructor (option) {
    // 因为这个数据是响应式的 所以 我们需要 new Vue  然后把你的 new Vuex.Store的option里传进去的state拿到
    this.state = new Vue({
      data: option.state
    })
    // 这里的option.mutations 是个对象 里面是一个一个的函数 当我们触发他的时候 需要commit 所以我们需要一个commit函数 去调mutations里的函数
    this.mutations = option.mutations
    // 这里的actions 和我们的mutations一样
    this.actions = option.actions
    // 有可能你的option里传 getters 了 也有可能没传
    option.getters && this.handleGetters(option.getters)
  }

  // 当我们在commit的时候 第一个参数 传进去的就是 我们mutations对象里的函数的名字 第二个参数 就是你要传进去的参数
  commit = (type, arg) => {
    // 触发了mutations里的函数 然后把我们的state的数据也传进去 还要你要修改的参数
    this.mutations[type](this.state, arg)
  }

  // 我们的actions对象里的函数 是 incrementAsync({commit,dispathc}) 这里为什么没有使用箭头函数 是因为 保证this的指向 一致都是store 才能 有我们下面的 commit:this.commit
  dispatch (type, arg) {
    this.actions[type]({ commit: this.commit, state: this.state }, arg)
  }

  handleGetters (getters) {
    this.getters = {}
    // 遍历getters的所有key
    Object.keys(getters).forEach(key => {
      // 为this.getters定义若干的属性,这些属性是只读的
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state)
        }
      })
    })
  }
}
function install (_Vue) {
  Vue = _Vue
  // 这里还是混入了我的方法 在你每个Vue实例里面
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        // 如果 你new Vue({})的时候 给我传过来的 配置项里 有 store 我就把他挂载到原型上
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
//这里 用默认导出一个对象 
export default { Store, install }
```

![通过this.$store拿到配置项](1.png)

## commit实现

```JS
1.首先我们在new Vuex.Store的时候 会传进去一个配置对象 里面会有mutations
2.我们mutations里会有函数 这些函数是修改state的状态 但是触发这些函数的时候 是通过commit 
3.所以我们在Store的构造上 会有一个commit函数 
4.我们在使用commit的时候 会传进去一个 你要触发mutations里的函数的名称的字段 和 你要修改的状态值
5.所以 commit函数 首先要拿到我们Store里的mutations对象 然后 通过你你commit传进来的 函数字段去触发mutations
6.然后在去传参 如下图
```

![commit的实现](2.png)

## 总结

```JS
1.跟我们上次写的 router 是一样的 都是插件 使用 use 调install函数
2.把我们new Store的时候 配置项 挂载到了 Vue的实例上
3.commit的 我们在实例上 把配置项传进来的参数 给了我们Store实例的mutations 然后 commit的时候 就调我们mutations里的函数
```





