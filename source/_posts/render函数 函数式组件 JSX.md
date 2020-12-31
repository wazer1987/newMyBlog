---
title: Vue中的函数式组件
date: 2020-04-14
updated: 2019-06-03
tags: Vue
categories: Vue
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

# 函数式组件

```JS
1.我们在写vue模板的时候 有些不是很灵活 所以就有了函数式组件
2.主要还式在写jsx 然后用render函数渲染到页面上
3.jsx 可以把他看成js 和html的集合 里面的变量可以写在标签上
```

## 解析

```JS
1.我们现在比如像实现一个标题组件 你给我传过来类型 我显示对应的H1、H2、H3之类的标签
```

```JS
//调用标题组件的页面
<template>
  <el-card class="box-card">
      <div style="margin-bottom:30px;">render函数 函数式组件 JSX</div>
      <div>
        //你给我传进去的值 我就去判断  
        <level :numbner="1">标题</level>
        <level :numbner="2">标题</level>
        <level :numbner="3">标题</level>
        <level :numbner="4">标题</level>
      </div>
  </el-card>
</template>

<script>
import level from '@/views/page/nine/level'
export default {
  components: {
    level
  }
}
</script>
```

```JS
//组件 写了大量的if 和else 而且没用代码很多就不灵活
<template>
  <div>
      <h1 style="margin-bottom:20px;" v-if="numbner === 1">
          <slot></slot>
      </h1>
      <h2 style="margin-bottom:20px;" v-else-if="numbner === 2">
          <slot></slot>
      </h2>
      <h3 style="margin-bottom:20px;" v-else-if="numbner === 3">
          <slot></slot>
      </h3>
      <h4 style="margin-bottom:20px;" v-else-if="numbner === 4">
          <slot></slot>
      </h4>
      <h5 style="margin-bottom:20px;" v-else-if="numbner === 5">
          <slot></slot>
      </h5>
  </div>
</template>

<script>
export default {
  props: {
    numbner: {
      type: Number
    }
  }
}
</script>
```

## 函数式组件

```JS
1.这个时候 函数式组件 和 jsx语法就变的很灵活
2.跟我们平时的vue组件一样的 也有自己的声明周期 和watche之类的
```

```JS
//基础语法 默认导出一个对象 然后式一个render函数 h式形参 式一个createElement 创造元素的意思
export default {
  created(){
      
  }, 
  render (h) {
    return h('你要创建的标签div什么的'，{'这里要写属性 比如绑定事件啊什么的'},'标签里的内容')
  }
}
```

```JS
//示例 创建了一个h1标签绑定事件 设置了a=1的属性 内容式你好
export default {
  render (h) {
    return h('h1',{
        on:{
            click(){
                alert(1)
            }
        },
        attrs:{
            a:1
        }
    },'你好')
  }
}
```

```JS
//如果h1下还有标签 就要写数组 继续去创建
export default {
  render (h) {
    return h('h1',{
        on:{
            click(){
                alert(1)
            }
        },
        attrs:{
            a:1
        }
    },[h('span',{},'来了')])
  }
}
```

## jsx语法

```JS
1.我们刚刚看到了h参数的让我们很头痛 要写很多嵌套
2.所以这里就有了jsx语法
```

```JS
//注意jsx上的语法 只要涉及到事件 样式 变量的 都是以大括号开头
export default {
  render (h) {
    return <h1 on-click={() => { alert(1) }} style={ { color: 'red' } }> 你好 </h1>
  }
}
```

```JS
//这样我们在回到我们刚才的标题组件上去就好写了
export default {
  //首先这里拿到了你过来的式 是1 还是2  
  props: {
    numbner: {
      type: Number
    }
  },
  render (h) {
    //然后我们用字符串品标签 你给我传过来及 就是H几的标签  
    const tag = 'h' + this.numbner
    //然后把变量写在标签里 如果有插槽的话 就可以通过this.$slots.default拿到插槽的值
    return <tag style={{ color: 'red' }}>{this.$slots.default}</tag>
  }
}
```

```JS
//我们使用一下函数式组件 导入js文件 然后命名render函数
<template>
  <el-card class="box-card">
      <div style="margin-bottom:30px;">render函数 函数式组件 JSX</div>
      <div>
        <level :numbner="1">标题</level>
        <level :numbner="2">标题</level>
        <level :numbner="3">标题</level>
        <level :numbner="4">标题</level>
      </div>
  </el-card>
</template>

<script>
import level from '@/views/page/nine/nine'
export default {
  components: {
    level
  }
}
</script>
```

## render方法定制组件

```JS
1.我们现在实现一个列表组件 组件里都式li 然后外层传进来一个数组 我们开始循环
2.但是又一天 我这个列表不想用li了 想用span 或者比的什么 这个时候就会很不灵活
3.所以我们来写一种高级的函数式组件
```

```html
<!--这式我们常写的方式-->
//这个是我们的列表组件 我们把数组传进去了
<List :data="data"></List>
<script>
import List from "./components/List";
export default {
 data() {
  return { data: ["苹果", "香蕉", "橘子"] };
 },
 components: {
  List
 }
};
</script>
<!-- List组件渲染列表 开始循环渲染-->
<template>
 <div class="list">
  <div v-for="(item,index) in data" :key="index">
   <li>{{item}}</li>
  </div>
 </div>
</template>
<script>
export default {
 props: {
  data: Array,
  default: () => []
 }
};
</script>
```

```JS
//这个时候我们希望用span标签了 所以我们就可以让用户自己定义标签 然后传入到我们的render 函数里里面 其实说白了就是一个回调
//传进一个render函数到我们的列表组件里
<List :data="data" :render="render"></List>

methods:{
    render(h, name) {
       return <span>{name}</span>;
     }
}
```

```JS
//这是我们的列表组件
<template>
 <div class="list">
  <div v-for="(item,index) in data" :key="index">
   //然后我们判断你有没有传进来render函数 如果没有 我就用我自己的 如果我就用我下面的函数式组件   
   <li v-if="!render">{{item}}</li>
   <!-- 将render方法传到函数组件中，将渲染项传入到组件中，在内部回调这个render方法 -->
   <ListItem v-else :item="item" :render="render"></ListItem>
  </div>
 </div>
</template>
<script>
import ListItem from "./ListItem";
export default {
 components: {
  ListItem
 },
 props: {
  render: {
   type: Function
  },
  data: Array,
  default: () => []
 }
};
</script>
```

```JS
//函数式组件 在这里调用给我们传进来的render函数 把每一项目传进去了 然后渲染到页面上
export default {
 props: {
  render: {
   type: Function
  },
  item: {}
 },
 render(h) {
  return this.render(h, this.item);
 }
};
```

## 插槽

```HTML
<List :arr="arr">
    //这里就结构出来
    <template v-slot="{item}">
        {{item}}
    </template>
</List>

<div v-for="(item,key) in arr" :key="key">
    //把值传了出去
    <slot :item="item"></slot>
</div>
```

 

