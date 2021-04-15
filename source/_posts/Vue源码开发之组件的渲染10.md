---
title: Vue源码开发-组件的渲染10
date: 2021-01-08
updated: 2021-01-08
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
# Vue源码开发之组件的渲染

```js
1. 通过了解组件的合并策略 我们的组件现在已经可以使用标签的形式渲染到页面上
2. 这里我们回顾一下 渲染流程 首先我们会根据模版拿到对应的标签的HTML字符串
3. 然后根据这些字符串 去生成AST语法树 然后在根据AST语法树生成render函数 
4. Vue初始化的时候会去 调用这些render函数生成虚拟DOM 然后在调用_update方法创建真实DOM
5. 那我们的组件 定义好了之后 会以你标签的名方式写在HTML里面 然后走上面的步骤
```

```html
<body>
    <div id="app" class="init" style="color: red;height: 200px;">
         <span>{{arr}}</span>
         <div>你好</div>
      	 <!--这里是我们定义的组件-->
         <my-button></my-button>
    </div>
    <script src="./dist/umd/vue.js"></script>
    <script>
        Vue.component('my-button',{
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
    </script>
</body>
```

```html
<!-- 初始化 之后 就变成如下的样子-->
<div id="app" class="init" style="color: red; height: 200px;">
  <span>[1,2,3,456]</span>
  <div>你好</div>
  <!--此时我们的真实DOM并不是我们想要的结果 我们想要的是 组件名称里面的对应的html结构-->
  <my-button></my-button>
</div>
```

## 组件的渲染

```js
1. 首先 在创建虚拟DOM的时候 如果你有组件 我们需要拿到组件对应的内容 也就是你的HTML字符串
2. 这里我们在创建虚拟DOM的时候如果是标签我们调取_c函数 然后里面会调取 createElement函数 
3. 所以在这个函数里面 你传进来的标签可能就是组件的标签 所以我们要做过滤
4. 过滤的逻辑就是 我们需要把HTML标签写成一个映射表 只有这些HTML标准标签我们采取生成虚拟DOM
5. 自定义组件的标签我们需要获取他对应的HTML字符串 然后在创建虚拟DOM
```

## makeUp 方法

```js
1. 这个方法就是用来 针对HTML标准标签 去生成虚拟DOM的方法
2. 我们会把HTML标准标签 都写出来
3. 然后 做成一个高极函数 你在调用的时候 把标签传进去 返回true 就是 标准标签 不是自定义的标签
```

```js
//2021 0222 1.在创建虚拟DOM的时候 我们传进来的标签可能是HTML标准标签名称
// 也有可能是我们的自定义组件的标签名称 所以这里要做过滤

function makeUp(str){
    const map ={}
    str.split(',').forEach(tagName => {
        map[tagName] = true
    })
    // 是不是标准的标签 我们在调用的时候我返回一个函数 然后我们在把你的标签传进去
    // 这里就会返回你是不是标准标签 如果是就为true
    return (tag) => map[tag] || false
}

//2. 判断是不是标准标签 源码中这里所有的标签都写成来了
export  const isReservedTag = makeUp('a,p,div,ul,li,span,input,button')
```

## 组件的虚拟DOM

```js
1. 我们在创建虚拟DOM 那里 就可以根据你是HTML标准标签 还是你 自定义组件的标签去创建虚拟DOM了
2. 首先我们会调用我们的extend方法 把你实例的组件变成构造构造函数 这个构造函数上有我们的Vue的构造函数上的一些初始方法_init _render _update patch等等
```

```js
function createElement(vm,tag,data={},...children){
    // 这里就相当于在生成我们的虚拟DOM了 如果你是元素的化 应该生成什么样的虚拟DOM
    // 比如有我们的标签名 有没有数据 孩子
    //2021 0223 1.这里我们要判断 如果他是正常的标签 div span 之类的 我就正常生成虚拟DOM
    if(isReservedTag(tag)){
         return vnode(vm,tag,data,data.key,children)
    }else{
        //2. 这里如果不是 那么就是你 自定义的组件标签 那我们就要对应的去取到他的HTML字符串
        // 这里我们因为之前有过合并 所以 你实例化的组件都在我们的$options.components属性上
        // 如果你实例话的组件找不到对应的标签名字 当时我们在做全局组件的时候做了一个原型链 会顺着原型链去找
        // 这里去要知道一点 我们实例的组件 是个对象 component:{'my-button':{template:'<div>实例安努</div>'}}  全局组件 是一个Vue的子类 
        // 如果是实例的组件我们就需要让他向Vue 一样做数据劫持等 初始话操作 
        // 这里我们就要使用Vue.extend方法去实现 可以把一个对象变成一个构造函数 这个构造函数里面有Vue构造函数上的init方法 全局组件就是调用了extend方法
        // 这里的Ctor 就是你实例的时候 自定义组件 'my-button' 后面对应的对象
      	// components:{'my-button':{template:'<button>实例按钮</button>'}}
        const Ctor = vm.$options.components[tag]
        // 调用 createComponent 方法去创建 组件的虚拟DOM
        return createComponent(vm,tag,data,data.key,children,Ctor)
    }
   
}
```

```js
1. 由于这里我们组件会有两种情况
2. 调用Vue.component方法创建的组件 其实是已经调用了我们的extend方法 已经把组件变成一个构造函数了
3. 然后就是我们实例话组件创建的 就是一个对象 此时我们也需要调用extend方法 去创建一个构造函数
4. extend方法 最开始我们是挂在到Vue.options._base上了  在vue初始化的时候我们已经合并到实例的$options属性上 所以直接调用即可
```

```js
// 2021 0223 2. 创建组件的虚拟Dom 方法
function createComponent(vm,tag,data,key,children,Ctor){
    // 如果你实例话的组件找不到对应的标签名字 当时我们在做全局组件的时候做了一个原型链 会顺着原型链去找全局注册的组件
    // 这里去要知道一点 我们实例的组件 是个对象 component:{'my-button':{template:'<div>实例安努</div>'}}  全局组件 是一个Vue的子类 是个构造函数
    // 如果是实例的组件我们就需要让他向Vue 一样做数据劫持等 初始话操作 
    // 这里我们就要使用Vue.extend方法去实现 可以把一个对象变成一个构造函数 这个构造函数里面有Vue构造函数上的init方法 全局组件就是调用了extend方法
    if(isObject(Ctor)){
        // 这里的 就说明你是个对象 也就是实例组件  所以我们需要调取Vue.extend方法去把他转换成一个构造函数
        // 我们前期已经把extend方法 挂在到了Vue的对象上 然后Vue在初始化的时候我们有合并了一下 所以这个方法 在vm.$options._base身上
        Ctor = vm.$options._base.extend(Ctor)
        // 这样就把我们实例上的组件 变成了构造函数 然后我们直接 new 的时候 就会走一遍 new Vue的方法 数据劫持 绑定 合并 等等
        // console.log(Ctor,'---ctor')
    }


    //2021 0223 3. 给组件增加生命周期 这里的生命周期不是 created 之类的
    // 这里给组件的data 添加hook的意义 是因为我们创建了虚拟DOM之后 我们要创建真实DOM
  	// 所以我们就要根据hook 去判断 你到底是组件的虚拟DOM去创建真实DOM 还是 HTML标准标签去创建真实DOM
    data.hook = {
        // 初始化钩子
        // 2021 0223 6. 这里知道 我们我们现在是要创建组件的虚拟 DOM
        // 组件的虚拟DOM创建好了之后 我们要根据 虚拟DOM 去创建真实DOM
        // 在创建真实DOM的时候我们需要判断 你是标准的HTML字符串 创建真实DOM 还是组件创建真实DOM
        // 如果判断 你是HTML字符串 还是组件 就是 在这里 如果我们是组件 就在组件的虚拟DOM的data属性上 添加了一个hook属性
        // 所以我们在判断你是组件的时候 再次调用了 这个init方法并且把 组件生成的vnode传入了进去 组件的vnode上 组件的构造函数
        // 这里我们还知道 我们实例组件 最后都会返回一个构造函数 这个构造函数继承了Vue的构造函数 上面有数据劫持 合并等一些里方法
        // 所以我们要调用组件的构造函数 
        init(){
          
        }
    }

    // 这里的Ctor.cid 就是区别不同实例创建的组件的名称不同 
    // 组件的虚拟节点 拥有hook 和当前组件的 componentOptions 存放的组件的构造函数
    // 然后我们去创建组件的虚拟节点


    return vnode(vm,`vue-component-${Ctor.cid}-${tag}`,data,key,undefined,undefined,{Ctor})
}
```

## 创建组件的真实DOM

```js
1. 上面我们已经创建完组件的虚拟DOM了
2. 然后我们要创建真实DOM 那么这里就会存在一个问题 我怎么知道你是要创建组件的真实DOM 还是HTML的真实DOM
3. 所以我们就可以利用刚刚 组件里的data属性上的hook 去判断
4. 创建真实DOM 是在patch方法里 我们调用了 createElm方法 创建了真实DOM 这个方法也返回真实DOM
5. 然后我们在把创建好的真实DOM插入到了元素中去
```

```js
//4. 创建我们的真实DOM
function createElm (vnode){
    let {tag,children,key,data,text} = vnode
    //4.1 如果是标签我们就创建标签 如果有儿子我们就接着创建 递归
    if(typeof tag === 'string'){
        // 2021 0223 4. 这里我们们虚拟DOM有可能是真实标签生成的 也有个能组件生成的 
        // 所以这里我们要有两种 一种是根据标签生成真实节点 一种是根据组件生成真实节点
        // 如果是组件 我们就要拿到组件的HTML标签的字符串去创建真实节点 
        if(createComponent(vnode)){
            // 4.1如果 createComponent 方法结果是true 那我们就要拿到 组件对应的HTML字符串

            return vnode.componentInstance.$el
        }



        vnode.el = document.createElement(tag)
        // 处理样式的方法 因为此时我们的样式都在我们的虚拟DOM上
        updateProperties(vnode)
        children.forEach(child => {
            //并且 插入到我们创建好的元素中
            vnode.el.appendChild(createElm(child))
        })
    }else{
        //4.2 如果是文本我们就直接创建
        vnode.el = document.createTextNode(text)
    }
    //最后创建好的 就是返回的我们的真实元素 
    return vnode.el
}
```

## createComponent方法

```js
1. 这个方法就是判断 你是不是组件来创建真实DOM
2. 并且我们刚刚调用vnode方法创建虚拟DOM的时候 把我们extend出来的构造函数也传进去了 也就是说我们创建出来的虚拟DOM里 能拿到 我创建出来的构造函数
3. 既然我们能拿到组件的构造函数了 我们就可以new然后来初始化这个组件了
4. 以上就是这个方法的作用
```

```js
// 2023 0223 5.createComponent方法用来判断是不是组件
function createComponent(vnode){
    // 这里我们知道 你是不是组件的  是因为我们刚刚 创建vnode 的时候 如果是组件的虚拟DOM 我们在data上加了一个hook属性
    // 所以我们可以根据hook属性去判断 你是不是组件
    let i = vnode.data
    // 这里的逻辑我先去看看 i上面有没有hook  如果有我 把hook 赋值给 i 走下一个 然后在看看 有没有init 方法 如果有我就赋值给i
    if((i = i.hook) && (i = i.init)){
        // 这里我们就相当于调取了 data.hook.init方法 这里 hook 属性是有只有组件才有的
        i(vnode)
    }
    if(vnode.componentInstance){
        return true
    }
    // 如果取 不到 我们就返回false
    return false
}
```

```js
// 以上操作完毕之后 我们就知道 你已经是组件来创建真实的DOM了 所以这里我们可以在data.hooke里的init方法中去new一下 这样 他上面就会有我们Vue上所有的方法_init 啊 数据劫持啊 等等 


function createElement(vm,tag,data={},...children){
    if(isReservedTag(tag)){
         return vnode(vm,tag,data,data.key,children)
    }else{
        const Ctor = vm.$options.components[tag]
        return createComponent(vm,tag,data,data.key,children,Ctor)
    }
   
}
function createComponent(vm,tag,data,key,children,Ctor){
    if(isObject(Ctor)){
        Ctor = vm.$options._base.extend(Ctor)
    }

    data.hook = {
        init(vnode){
          	// 经过以上的操作代码就会走到这里来
            // 然后我们就开始new一下这个组件的构造函数 这里因为我们的调用extend的时候已经把配置项传进去了  所以不用子传 new 完之后 他vue 初始化的流程一样 
            let child = vnode.componentInstance =  new vnode.componentOptions.Ctor({})
            // 由于这里我们有传el 所以不会挂载 然后我们调用 $mount方法 有会走 ast语法树解析  数据劫持 关联dep watcher 等等  生成render函数 创建虚拟DOM 这个时候创建的虚拟DOM就是你组件template里面的对应的HTML字符串了 
            // 然后开始挂在的逻辑 生成虚拟DOM 走到patch 方法 开始走里的挂载逻辑等等
            child.$mount()
        }
    }

    return vnode(vm,`vue-component-${Ctor.cid}-${tag}`,data,key,undefined,undefined,{Ctor})
}
```

```js
// 由于我们创建完组件的虚拟DOM之后没有 传el属性 所以我们需要在创建真实DOM的时候去判断一下 也就patch的方法中最开始


export function patch(oldVnode,vnode) {

		// 如果我们是首次挂载 这个 oldVnode 就是我们的<div id="app"></div> 所以会有值
  	// 如果是我们的组件挂载 那么我们是没传el的 所以要判断一下
    // 这里 组件会直接去查找我们的父亲节点 直接挂载到上面
    if(!oldVnode){
        return createElm(vnode)
    }
    const isRealElement = oldVnode.nodeType
    if(isRealElement){
        //1. 这里面就是如果是首次渲染 就把我们的vnode虚拟DOM生成我们的真实DOM
        // 该创建元素的创建元素 该生成文本的 生成文本
        // 然后我们最早挂在el上的元素干掉替换成我们的创建好的真实DOM
        //2. 根据虚拟DOM创建真实DOM
        let el = createElm(vnode)
        //3. 第一次 oldVnode 就是我们的<div id="app"></div>
        // 然后拿到我们的父节点删除我们的老节点
        let parentElm = oldVnode.parentNode
        // 然后把我们创建好的真实DOM 插入进去我们老节点的下一个节点
        parentElm.insertBefore(el,oldVnode.nextSibling)
        //然后移除我们的元素
        parentElm.removeChild(oldVnode)
        return el
    } else {

    }
}
```

## 总结

```js
1. 首先我们要知道 我们创建组件的方式 有全局组件 调用 Vue.component方法 这种方式创建出来的 是一个构造函数
2. 还有就是在实例的components属性上创建出来的 这种方式最后也调用extend方法转变成 构造函数
3. 为什么要转换成构造函数 是因为 我们转换的构造函数 继承了我们Vue构造函数 我们组件里的配置项 data methods 渲染到页面 数据劫持 也不更新等 等等属性也需要 初始化
4. 这件事情我们是在创建虚拟DOM的时候 去做的 也就是 我们现在创建虚拟DOM的时候 有两种情况 第一种就是你标准的HTML标签 去创建的虚拟DOM 第二种就是你的组件组件创建虚拟DOM  这里要清楚一点 此时我们只是为了分清楚 你到底是 HTML标签去创建虚拟DOM 还是 标准的HTML去创建
5. 组件去创建虚拟DOM 此时我们已经把创建好的组件的构造函数 挂载到了组件的虚拟DOM上 而在创建真实的DOM的时候我们 new 这个构造函数 那么他又会在走一次我们 new Vue 的时候流程
6. 在这个时候我们才是真正的去创建了组件的虚拟DOM 上一次只为了区分 你是HTML来创建虚拟DOM 还是组件来创建虚拟DOM
```

