---
title: Mock
date: 2020-03-27
updated: 2019-06-03
tags: Mock
categories: 数据库 
keywords: Mock
description: Mock
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

## mock的配置

```JS
1.首先要安装mockjs npm install mockjs
2.在main.js文件里引用你新建好的mock函数
```

## 实例

```JS
//mock文件夹下index.js文件
//引入mock
import Mock from 'mockjs'
//这个是模块 在mock文件夹下的tree文件夹下index.js文件
import treeNode from './tree'
//正则 当访问/gettreenode开头的get请求的时候  mock就会拦截 然后去调用 treeNode.getNodeTree函数 此函数些的数据
Mock.mock(/\/gettreenode/, 'get', treeNode.getNodeTree)
```

```JS
//mock文件下 -> tree文件夹 -> index.js
// import Mock from 'mockjs' 这里我是写随机数的话 就要引入mock.js
export default {
  //这个函数就是我们上面调用的那个方法   
  getNodeTree: () => {
    return {
      code: 200,
      data: [
        {
          label: '表单类',
          children: [{ label: '表单1', path: 'form/formone' },
            { label: '表单2', path: 'form/formtwo' }]
        },
        {
          label: '表格类',
          children: [{ label: '表格1', path: 'table/tableone' },
            { label: '表格2', path: 'table/tabletwo' }]
        }]
    }
  }
}

```

```JS
//在main.js文件里引用
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入mock即可
import './mock'
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

## 参数的接收

```JS
//这里我们又封装了一层axios  还是一上面的代码为例传递参数 get请求
<el-button type="primary" @click="getTreeData">
           点击弹框获取树形和异步组件
</el-button>
<script>
//这里调用了我们自己封装的API接口模块
import { gettreenode } from '@/api/treenode'
export default {
  data(){
      return{
          treedata:[]
      }
  },  
  methods: {
    async getTreeData () {
      const { data: { data } } = await gettreenode('1111')
      this.treedata = data
    }
  }
}
</script>
```

```JS
//api文件夹下treenode.js文件
//这里是我们封装了axios的通用函数 
import { createAPI } from '@/utils/request'
export const gettreenode = (data) => {
  return new Promise((resolve, reject) => {
    resolve(createAPI('/gettreenode', 'get', data))
  })
}
```

```JS
//mock文件夹下 index.js文件
import Mock from 'mockjs'
import treeNode from './tree'
Mock.mock(/\/gettreenode/, 'get', treeNode.getNodeTree)
```

```JS
//mock文件夹下 tree文件夹下 index.js文件
export default {
  getNodeTree: (config) => {
     //这就可以拿到参数 如果是get请求就要字符串拼接 如果是post请求 就可以在config.body里拿到
    console.log(config, '-----我是传递的参数')
    return {
      code: 200,
      data: [
        {
          label: '表单类',
          children: [{ label: '表单1', path: 'form/formone' },
            { label: '表单2', path: 'form/formtwo' }]
        },
        {
          label: '表格类',
          children: [{ label: '表格1', path: 'table/tableone' },
            { label: '表格2', path: 'table/tabletwo' }]
        }]
    }
  }
}
```

## 基本的语法

```JS
import Mock from 'mockjs'
//生成了一个数组从1-10 长度从1-10之间随机生成 每生成一个对象自身id都+1 从2开始
//@ 是占位符的意思 @String 随机生成字符串 @boolean随机布尔类型 当然只要又了@占位符你可以生成你想要的数据类型 @first就是名字
const testdata = Mock.mock({
  'data|1-10': [{ 'id|+1': 2，name: '@String' }]
})
//导出我们的函数
export default {
  gettestdata: () => {
    return testdata
  }
}
//当前端访问这个接口的时候 就掉哟个
Mock.mock(/\/gettestdata/, 'get', treeNode.gettestdata)

```

![生成的数据](mock基本语法.png)

# Random的使用

```JS
1.Radmon是Mock的所及函数 他内置很多的方法 可以生成随机的数据 比如 城市的 名字的
```

```JS
import Mock from 'mockjs'
const Radom = Mock.Random
const testdata = []
for (let i = 0; i < 10; i++) {
  //生成随机的城市 和随机的name
  testdata.push({ city: Radom.city(), name: Radom.cname() })
}
//导出
export default {
  gettestdata: () => {
    return testdata
  }
}
//拦截
Mock.mock(/\/gettestdata/, 'get', treeNode.gettestdata)
```

![生成数据](Radmom.png)