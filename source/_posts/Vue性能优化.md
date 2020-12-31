---
title: Vue性能优化
date: 2019-03-20
updated: 2019-06-03
tags: Vue 
categories: 性能优化
keywords: Vue 性能优化
description: Vue性能优化
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
## Vue性能优化

## Vue核心 defineReactive 方法  会给data属性里的所有数据都增加getter和setter属性

```JS
1.不要讲所有的数据都放在data中 data中的数据都会 经过defineReactive  增加getter 和 setter 都会收集对应的watcher
2.data里面 尽量只放你需要的响应式数据 需要渲染到视图上的
```

## SPA 页面采用keep-alive 缓存组件

## 拆分组件

```JS
1.Vue的是按照组件级别更新 
2.提高复用性\增加代码的可维护性
3.减少不必要的渲染(尽量拆分组件)
```

## v-if

```JS
1.会有阻断的作用
2.如果v-if不执行 里面的代码逻辑根本不会执行
```

## key 保证唯一性

```JS
1.Vue的组件 采用基地策略
```

```JS
//Vue的组件 采用基地策略 
<input type="text" v-if="show">
<input type="password" v-else> 
<button @click="show = !show"/>
当我们在input type="text" 里面输入数值的之后 点击切换之后 值还会在第二个input type = password 的为文本框里 所以我们要加key    
```

## Object.freeze

```JS
1.Vue 会实现数据劫持 给每个属性增加getter 和 setter 这里我们可以使用freeze冻结数据
2.如果你的数据只是用来渲染到视图上 我们可以使用Object.freeze 来冻结我们的数据
Object.freeze([{value:1},{value:2}])
```

## 路由拦截、异步组件

```JS
1.动态加载组件、以来webpack-codeespliting功能
const router = new Router({
    routes:[
        {path:'/fo',component:() => import('组件路径')},
        {path:'/bar',component:() => import('组件路径')}
    ]
})
```

```JS
2.动态导入组件  采用这种形式去动态的导入组件 需要配插件
import Dialog form './Dialog'
export defualt {
    components:{
        Dialog: () => import('./Dialog')
    }
}
```

## 框架尽量采用 runtime运行时

```JS
1.在开发时尽量采用单文件的方式.vue 在webpack打包时
```

## 数据持久化

```JS
1.vuex-persist 合理使用(防抖、节流)
2.往浏览器 本地存储去存
```

## Vue加载性能优化

```JS
第三方模块按需导入 比如elementUI的 你用到哪个组件 就导入哪个组件
图片懒加载 滚动到可视区域动态加载
滚动渲染可视区域 数据较大时 只渲染可视区域 计算(scrollTop)
```

## app- skeleton 骨架屏

```JS
1.移动端的时候 我们首次进来 会给你显示一个base64的图片 然后等你全部等你数据回来了 我们在去渲染
2. 配置webpack插件 vue-skeleton-webpack-plugin 
```

