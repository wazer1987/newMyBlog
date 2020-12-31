---
title: 异步组件(左树右表)和Mock的基本使用
date: 2019-03-12
updated: 2019-06-03
tags: Vue 
categories: 组件封装
keywords: Vue 异步组件(左树右表)和Mock的基本使用
description: 异步组件(左树右表)和Mock的基本使用
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
# 异步组件

```JS
1.我们都知道vue的router-view标签 当你在路由表里配置完毕之后可以渲染不同的组件 如果有多个视口还可以嵌套多个路由
2.当我们点击不同的菜单的时候 通过配置好的路由的路径 然后通过浏览器的地址跳转到不同的组件 当然前提是我们在配置路由的时候需要把组件写入进去
3.异步组件和router-view标签渲染不同的组件的原理相似 只不过路由是点击跳转路径 而异步组件是点击读取路径 前提都是要把组件引入
4.这里我们就到了import 函数
```

# 异步组件核心

```JS
1.首先我们需要用到<component> 标签 通过动态绑定他的is属性去读取不同的组件
2.我们需要用到import函数 当我们点击不同的路径的时候 去加载不同的组件
```

<img src="1.gif" style="zoom:80%;" />

# 实例

```JS
1.这里我们以左树右表为例 首先我们把tree标签 和 异步组件 封装在一个弹窗里 当我们点击按钮的时候需要绑定ref 然后拿到弹框里面的值 从而出发弹框
```

```JS
//这个是点击按钮的页面
<template>
    <div class="five-container">
       <h1>
           我是视口标签router-view显示的内容
       </h1>
       <el-button type="primary" @click="getTreeData">
           点击弹框获取树形和异步组件
       </el-button>
       <!-- 这里是我们封装的左树右表的弹框标签 -->
       <tree-dialog ref="dialog"></tree-dialog>
    </div>
</template>

<script>
import treeDialog from '@/components/treedialog'
export default {
  components: {
    treeDialog
  },
  methods: {
    //点击之后出发弹框
    getTreeData () {
      this.$refs.dialog.drawer = true
    }
  }
}
</script>
```

```JS
2.treedialog.vue文件 里面就是封装了我们的tree标签 和我们的compoent标签 
3.当我们点击不同的树的结点时候 就把我们的组件的路径传给我们的compoent标签
4.data中的path就是我们想要渲染的文件的所在的项目结构的路径
```

```JS
//treedialog.vue文件 
<template>
  <div class="async-container">
      <el-tree :data="data" style="width:100px" @node-click="getNode">

      </el-tree>
      <div class="component-container">
          <async-component :nodepath="path"></async-component>
      </div>
  </div>
</template>

<script>
import asyncComponent from './asyncComponent'
export default {
  components: {
    asyncComponent
  },
  data () {
    return {
      data: [{ label: '表单类', children: [{ label: '表单1', path: 'form/formone' }, { label: '表单2', path: 'form/formtwo' }] },
        { label: '表格类', children: [{ label: '表格1', path: 'table/tableone' }, { label: '表格2', path: 'table/tabletwo' }] }],
      path: 'form/formone'
    }
  },
  methods: {
    getNode (res) {
      if (!res.path) {
        this.path = res.children[0].path
        return
      }
      this.path = res.path
    }
  }
}

</script>
```

![](1.png)

```JS
5.当我们点击每个树形节点的时候在回调里会获取到我们当前点击的节点 可以获取到我们的文件的路径 然后把他传给我们的copoment标签里面 is属性就会动态渲染不同的组件内容了
6.当节点再次改变的时候 我们需要监视一下 然后从新调用我们的render函数
```

```JS
//asyncComponent.vue文件
<template>
    <div class="component-container" >
        <h1>我是异步组件</h1>
        <component :is="componentFile" />
    </div>
</template>

<script>
export default {
  props: {
    nodepath: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    // 初始的时候先调用一下这个函数
    const componentFile = this.render
    return {
      componentFile: componentFile
    }
  },
  watch: {
    nodepath () {
      this.render()
    }
  },
  methods: {
    render () {
      this.componentFile = (reslove) => ({
        component: import(`@/views/${this.nodepath}`),
        timeout: 3000
      })
    }
  }

}
</script >
```

