---
title: Vue源码开发-数组的依赖收集08
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

# Vue源码开发之数组的依赖收集

```js
1. 如果我们数组每一个元素 就是一基本数据类型的时候 当我们做修改的时候 是没有更新的
2. 因为我们没有对数组里的每一项做依赖收集
3. 如果数组是对象的 这里当我们修改了之后 就可以更新 因为 数组里的对象 我们通过 JSON.Stringify做了转换 并且我们在对数组进行劫持的时候 如果是对象的话 我们也多了劫持
```

```html
<body>
    <div id="app" class="init" style="color: red;height: 200px;">
         <span>{{arr}}</span>
         <div>你好</div>
    </div>
    <script src="./dist/umd/vue.js"></script>
    <script>
        let vm = new Vue({
            el:'#app',
            data:function(){
                return {
                    arr:[1,2,3]
                }
            },
        })
        // 过了 1S 我们向数组里 添加了456 这个时候 页面是没有更新的 还是 [1,2,3]
        // 主要原因就是我们没有做依赖和收集
        setTimeout(() => {
           vm.arr.push(456)
        },1000)
    </script>
</body>
```

```js
1. 这里我们要知道 在做数据劫持的时候 因为数组会有很多元素 所以我们没有对数组的索引做劫持
2. 这里我们只是重写了数组里面的一些方法 push 等等等
3. 但当我们数组里的元素是 对象的话 这里我们就劫持过了 所以 页面会更新
4. 也就是说 当我们数组里的元素 是基本数据类型的时候 我们修改数组的长度 或者 向数组里面添加 或者修改的时候 还应该在做一下劫持 添加dep
```

