---
title: Vue源码开发-虚拟DOM04
date: 2021-01-04
updated: 2021-01-04
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

# Vue源码开发-虚拟DOM

```js
1. 我们前面 已经把我们的拼接好的函数字符串 变成了真正的可执行函数
2. 接下来 我们就需要编写我们函数字符串里的 _c函数 和 _v函数 和 _s函数
3. 这些函数 其实就是在生成我们的虚拟DOM
```

## 初次挂载

```js
1. 此时我们的render函数已经写好了 
2. 所以接下来 我们就需要创建的我们DOM结构 然后 把数据 和方法渲染到我们的页面上
3. 所以我们在判断有没有render函数之后 接下来就要调用mountComponent方法 渲染页面
```

```js
export function initMixin(Vue){
    Vue.prototype._init = function (options){
        const vm = this
        vm.$options = options
        // 1. 这里我们初始化了数据 比如data里的响应式 mothds方法 props属性 watch computed等
        initState(vm)
        if(vm.$options.el){
        //2. 然后开始我们的首次渲染数据 这里分为两个部分  
            vm.$mount(vm.$options.el)
        }


    }

    Vue.prototype.$mount = function(el){
        const vm = this
        const options = vm.$options
        //2.1 第一个部分是 拿到我们的如果有render函数直接就调用如果没有就把template 里的HTML结构字符串解析成AST语法树 然后在编译成render函数 
        let ele = document.querySelector(el)
        if(!options.render){
            let template = options.template
            if(!template && ele){
                template = ele.outerHTML
            }
            const ast = compileToFunctions(template)
            const code = generate(ast)
            const render = `with(this){return ${code}}`
            let fn = new Function(render)
            options.render = fn
        }
      //3.第二个部分 就是在mountComponent里 执行我们的rendenr函数 这里我们需要编写_c函数 _v函数 _s函数等 并且生成虚拟DOM
        mountComponent(vm,ele)
    }
}
```

## mountComponent函数

```js
1. 这个方法 在lifecycle.js
2. 主要执行我们上面写好的render函数里的_c函数 _v函数 _s函数等 并且生成虚拟DOM
3. 这里主要的流程是先调用我们的 _render方法 他的返回值就是我们的虚拟DOM 传入到我们的_update函数里
4. 然后在调用我们的 _update方法 去把我们的虚拟DOM 生成真实的DOM 最后渲染到页面上
```

```js
// lifecycle.js

//2021 02 16
// 3. 在Vue的原想上混入我们的_update方法
export function lifecycleMixin(Vue){
    Vue.prototype._update = function(){
        //4. 这里主要把我们的虚拟DOM vnode 生成 真实DOM 渲染到页面上
    }
}
export function mountComponent(vm,el){

   //1. 调用render 方法 渲染 真实DOM

   //2. 先调用render函数生成虚拟DOM 为了以后更新使用
   // 然后调用_update方法 把我们的虚拟DOM 渲染成页面真实的DOM
   // 这里我们在 src/index.js 通过 renderMixin 方法已经把_render挂载到原型上了
   vm._update(vm._render())
}
```

## 函数的调用逻辑

```js
1. 首先我们在 写Vue的构造函数的时候 调用了我们的_init方法
2. _init方法 是通过我们调用initState方法 把Vue传入进去然后 然后在原型上挂载了_init方法 在这个里面执行了我们initState函数 初始化了状态 数据的响应式 methods watch computed props等等 然后调用了我们的$mount方法
3.然后我们在 $mount方法中 编译了template 生成AST语法树 然后编译成render函数 然后开始渲染我们的页面 调用了 mountComponent方法 
4. 此时这个mountComponent方法 里面 调用了我们的_update方法 和_render方法 这两个方法 和我们的 _init方法一样 也是在我们写Vue的方法 通过更重的混入函数 把这些方法挂在到了我们的原型 我们在可以嗲用
5. lifecycleMixin方法 把我们的_update 方法 挂载到了我们的原型上
6. renderMixin 方法 把我们的_render 方法挂在到了原型上
7. 而我们的 mountComponent方法 就调用了_update方法 里面的参数 就是调用_render方法的返回值 也就是虚拟dom
```

## _render方法

```js
1. 首先我们在 mountComponent方法 中调用了_update方法
2. 在 _update方法中 我们调用了_render方法 他的返回值就是虚拟DOM
3. 这个_render方法 就是我们通过AST语法树 生成的render函数 已经生成完毕之后 就把他挂在我们的option.render上了
```

```js
//2021 02 16
// 3. 在Vue的原想上混入我们的_update方法
export function lifecycleMixin(Vue){
    Vue.prototype._update = function(){
        //4. 这里主要把我们的虚拟DOM vnode 生成 真实DOM 渲染到页面上
    }
}

export function mountComponent(vm,el){

   //1. 调用_render 方法 创建虚拟DOM

   //2. 先调用render函数生成虚拟DOM 为了以后更新使用
   // 然后调用_update方法 把我们的虚拟DOM 渲染成页面真实的DOM
   // 这里我们在 src/index.js 通过 renderMixin 方法已经把_render挂载到原型上了
   vm._update(vm._render())
}
```

```js
1. _render方法 主要生成vdom 也就是虚拟DOM
2. 这里生成虚拟DOM的数据 就是我们通过AST语法树 生成的render函数 里面有_c函数 _v函数 _s函数 的执行结果
```

```js
//2021 02 16

export function renderMixin(Vue){
    //7. 创建元素
    Vue.prototype._c = function(tag,attrs,children){
        //7.1 这里我们在单独写一个创建元素的方法 createElement
        return createElement(...arguments)
    }
    //8. 创建文本
    Vue.prototype._v = function(val){
        //8.1 这里我们在单独编写一个创建文本的方法createTextVnode
        return createTextVnode(val)
    }
    // 9. 创建我们的 data里面变量的数据 因为我们模版 有可能是文本和{{}}这种混合的
    // 由于这里我们已经用with语法处理过 所以他会自己去找this上的变量 也就是我们data里的数据上的变量
    Vue.prototype._s = function(val){
        //9.1 因为这里 你data里的其中一个数据 的值 还有可能是个对象 所以这里我们要用JSON转换一下
       return val == null?'':(typeof val == 'object')?JSON.stringify(val):val
    }
    //5. 这个方法我们已经在 src/index.js 已经混入了
    Vue.prototype._render = function(){
        //6. 这个方法的主要目的生成vnode 也就是虚拟DOM  然后生成的虚拟DOM 在传入给我们的_update方法 生成真实的DOM渲染页面
        const vm = this
        // 这里面调用的方法 其实就是我们刚刚最开始写拼接的字符串函数
        const render  = vm.$options.render
        let vnode = render.call(vm)
        console.log(vnode,'----vnode')
        return vnode
    }
}
//10. 创建虚拟元素的方法 在_c中调用
// _c('div,属性,儿子1,儿子2,儿子3......)
function createElement(tag,data={},...children){
    // 这里就相当于在生成我们的虚拟DOM了 如果你是元素的化 应该生成什么样的虚拟DOM
    // 比如有我们的标签名 有没有数据 孩子
    return vnode(tag,data,data.key,children)
}
//11. 创建虚拟文本的方法 在_v中调用
function createTextVnode(text){
    // 如果是文本的化我们就对应生成我们的什么样的虚拟DOM
    // 文本就是一个文本 没有 属性 没有标签名之类的
    return vnode(undefined,undefined,undefined,undefined,text)

}
//12. 创建虚拟DOM的方法
function vnode(tag,data,key,children,text){
    return{
        tag,
        data,
        key,
        children,
        text
    }
}
```

## _update方法

```js
1. 我们通过上面的已经知道 函数的调用逻辑 以及_render方法 返回的是虚拟DOM
2. 接下来我们就需要 虚拟DOM 去创建真实的DOM
3. 首先 我们需要拿到老的节点。和新的虚拟DOM
4. 这里其中我们还有一对比的逻辑 这里先不写
5. 然后 我们根据拿到的虚拟DOM创建真实的DOM 插入到老的真实DOM后面 然后在删除老的虚拟DOM
```

```js
// 3. 在Vue的原想上混入我们的_update方法
export function lifecycleMixin(Vue){
    
    Vue.prototype._update = function(vnode){
        const vm = this
        //4. 这里主要把我们的虚拟DOM vnode 生成 真实DOM 渲染到页面上
        //5. 主要就是调用我们的patch方法 
        patch(vm.$el,vnode)
    }
}
```

```js
// vnode格式
children: (3) [{…}, {…}, {…}]
data: {id: "app", class: "init", style: {…}}
el: div
key: undefined
tag: "div"
text: undefined
```



```js
// vdom / path.js

//2021 02 16

export function patch(oldVnode,vnode) {
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
}
//4. 创建我们的真实DOM
function createElm (vnode){
    let {tag,children,key,data,text} = vnode
    //4.1 如果是标签我们就创建标签 如果有儿子我们就接着创建 递归
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
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

## 总结

```js
1. 以上我们就 写好首次渲染的逻辑 这里首次渲染。是指我们的模版都解析完毕之后 生成了render函数 然后创建虚拟DOM 然后 把虚拟DOM 变成真实的DOM 插入到页面中 这里并没有更新的操作
2. 这里我们还是有几个流程 首先 我们在init函数里 调用initState 函数 初始化了 数据 方法 props watch 等等 
3. 然后判断你有没有传入el 如果有 我们就调用$mount函数开始渲染 
4. 首先 $mount 函数 第一步 根据我们的tepmlate 生成了我们的render函数 这里所生成的render函数 是根据我们template 编译之后生成的AST语法树去生成的 主要 就是就是拼接函数的字符串 _c函数 _v函数 _s函数
5. 然后调用我们的mountComponent函数 去开始生成我们的虚拟DOM 和我们的 真实的DOM 并把真实DOM插入到页面上 然后删除老的DOM
6. 这面 在 mountComponent 主要调用了_update函数 而_update函数 调用了我们的_render函数
7. 这两个函数 我们在创建Vue构造函数的的时候 通过写根init函数一样的逻辑 挂在到了原型上 
8. 而_render函数 就是我们以上通过AST创建的render函数 这个函数调用的时候 就是调用了里面的生成_c函数_v函数_s函数
9. _render函数里 主要是编写了以上我们的 _c函数_v函数_s函数 这里 主要的目的是生成vnode 也就是虚拟DON
10. 然后我们在_update函数里 拿到我们刚刚生成的虚拟DOM 去做首次的渲染
11. _update函数在拿到虚拟DOM的时候 如果你是标签 我们就创建真实DOM 然后在便利你的孩子 才递归的去判断是不是标签 然后插入到自己这里 
12. 最后我们把创建好的真实的DOM 插入到我们的老DOM下一个节点 然后删除 老的节点
```

