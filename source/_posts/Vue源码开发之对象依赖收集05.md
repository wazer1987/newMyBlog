---
title: Vue源码开发-数据收集依赖05
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

# Vue源码开发-对象的依赖收集

```js
1. 我们前面已经初次把我们的虚拟DOM 渲染到页面上了
2. 渲染步骤就是首先我们要看下是不是首次渲染 如果是首次渲染 我们就要我们创建好的虚拟DOM创建成真实DOM
3. 然后 插入到我们老节点的后面 然后在删除老的节点
4. 如果不是 我们就要进行diff算法
5. 这个步骤是在patch函数里完成的
```

```js
export function patch(oldVnode,vnode) {
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
				// 如果是更新渲染 这里我们就要对老的虚拟DOM 和新的 虚拟DOM进行对比 然后在进行渲染
      	// 这里我们先留着
    }
}
```

## 更新流程

```js
1. 这要知道 当我们访问 Vue实例上 data 里的数据的时候 也就是改变上data里的数据 页面会自动更新
2. 前面我们知道我们首次渲染的时候 是调用了_update 和 _render函数 去 把页面更新的
3. 所以这里当我们改变data里的数据的时候 也继续调用 _update(_render()) 页面就会更新
```

```html
<body>
    <div id="app" class="init" style="color: red;height: 200px;">
         <span>{{product}}</span>
         <div>你好</div>
         <div>{{list}}</div>
    </div>
    <script src="./dist/umd/vue.js"></script>
    <script>
        let vm = new Vue({
            el:'#app',
            data:function(){
                return {
                    arr:[{name:'zs'}],
                    product:'3;33',
                    list:'333',
                    name:'北城'
                }
            },
            methods:{}
        })
        // 这里我们手动调用更新函数
        setTimeout(() => {
           vm.list = '你好'
           vm._update(vm._render())
        },1000)
    </script>
</body>
```

```js
1. 我们上面通过手动调用 _update 和 _render 方法 从而更新了视图
2. 所以下面我们就要开始自动更新视图
```

![](1.gif)

## 自动更新视图

```js
1. 这里我们首先要注意一些问题 只有我们模版上 依赖了我们data里的数据 当data里的数据更新了 我们才去更新视图
```

```html
<body>
    <div id="app" class="init" style="color: red;height: 200px;">
         <span>{{product}}</span>
         <div>你好</div>
         <div>{{list}}</div>
    </div>
    <script src="./dist/umd/vue.js"></script>
    <script>
        let vm = new Vue({
            el:'#app',
            data:function(){
                return {
                    arr:[{name:'zs'}],
                    product:'3;33',
                    list:'333',
                    name:'北城'
                }
            },
            methods:{}
        })
        // 这里 由于我们上面的 模版没有依赖 也就是没有使用到 name 这个数据 所以我们就不需要自动更新
        vm.name = '张三'
    </script>
</body>
```

## 依赖收集

```js
1. 首先还是和我们的上面一样 我们的模版中 用到了 data中的数据  而data中的这个数据变化了 我们就要去更新视图
2. 所以这里就产生个问题 我们如何知道模版中依赖了data里的哪些数据？
3. 这里我们要清楚 首先我们拿到模版中的HTML字符串之后 会生成AST语法树 然后我们会把AST语法树编译成了render函数 这个render函数 我们里面使用 with 语法包了一下 所以当们首次调用 _render 函数的时候就去我们 Vue 实例上取值了 
4. 而我们的 _update 函数 和 _render 函数 逻辑代码是写在我们的 mountComponent 我们在调用 mountComponent函数的时候 创建了 Watcher 类 然后 把我们的 _update 函数 和 _render 函数传入了进去 然后在这里面调用的
```

```js
export function mountComponent(vm,el){
	//1. 当我们render函数生成完了 就会调用 mountComponent 函数
  //2. 此时我们的 _update函数 和 _render函数 就写在这里
   let updateComponent = () => {
        vm._update(vm._render())
   }
	 //3. 然后创建了一个 watcher的类 把我们上面的函数都传入了进去
   new Watcher(vm,updateComponent,() => {},true)
}
```

```js
// observe / watcher.js
//1. 然后在这里 我们调用了 你上面传入进来的 updateComponent函数 也就是 vm._update(vm._render())
let id = 0
class Watcher {
    constructor(vm,fn,cb,options){
        this.vm = vm
        this.fn = fn
        this.cb = cb
        this.options = options
        this.id = id++
				//2. 这个fn 就是我们传入进来的 updateComponent 函数 里面调用了 vm._update(vm._render())函数 对页面进行了渲染 所以在这里我们就知道了 模版对data中的哪些数据进行了依赖
        this.fn()
    }
}
export default Watcher
```

```js
1. 上面只要render函数一调用。我们就要对 Vue 实例中的data 进行了取值
2. 这里我们要清楚 因为最开始init的时候 我们就 初始化了data里面的数据 并且对里面的数据进行了劫持
3. 当我们调去render函数之后。会对data中的数据 进行取值 一取值 就会走到我们的做过劫持的 get函数
```

## Dep 类

```js
1. 首先我们知道 我们 在 new Vue 之后 会开始初始化数据 
2. 这个时候 会对我们的data里的数据做响应式数据的劫持 是在defineReactive里完成的 
3. 所以这里 我们为了方便 会给你每一个响应式劫持的数据 都添加一个Dep 类
4. 这个Dep类的作用就是 当数据发生改变的时候 我们去告诉我们watcher类 去更新视图页面 重新渲染页面
5. 而 watcher 类 渲染页面更新视图 就是调去了我们的 _update方法 和 _render方法
```

```html
<!--这里我们知道当我们new Vue 的时候 data 里的数据 product list name 都已经没劫持过了-->
<body>
    <div id="app" class="init" style="color: red;height: 200px;">
         <span>{{product}}</span>
         <div>你好</div>
         <div>{{list}}</div>
    </div>
    <script src="./dist/umd/vue.js"></script>
    <script>
        let vm = new Vue({
            el:'#app',
            data:function(){
                return {
                    product:'3;33',
                    list:'333',
                    name:'北城'
                }
            },
            methods:{}
        })
    </script>
</body>
```

```js
function defineReactive(data,key,value){
    observe(value)
    //1. 这里我们开始创建dep类 我们上面data里的数据有 product list name 三个变量
  	// 所以我们这里 product对应一个dep类 list 对应创建了一个dep类 name 对应了一个dep类
    let dep = new Dep()
    Object.defineProperty(data,key,{
        get(){
          if(Dep.target){
                dep.depend()
            } 
            return value
        },
        set(newValue){
            if(newValue === value) return 
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })
}
```

```js
1. 接下来 我们就需要首次渲染了 首次渲染通过我们的模版 HTML字符串 会编译成我们的 AST语法树 
2. AST语法树 还会 编译成render函数 render函数 由于 with 语法 所以会去Vue 的实例上去值变量 
3. 这个时候 由于我们数据劫持已经完毕了 就会触发我们的 get 函数 
4. 这里我们注意 由于我们的HTML模版 只依赖了 data中的 product数据 和 list 数据
5. 所以当我们修改模版不依赖的data中的数据变量的时候 我们就不应该调用 更新的方法
```

```js
// 首次渲染 我们需要在 watcher类中去调用 _update 函数。和。_render函数

export function mountComponent(vm,el){
   let updateComponent = () => {
        vm._update(vm._render())
   }
   // 首次渲染 我们需要在watcher里调用 上面的函数 等到数据更新的时候我们也需要调用
   new Watcher(vm,updateComponent,() => {},true)
}
```

## watcher 类

```js
1. 首先这里需要知道 watcher类 里面要会有 你模版依赖 需要的 Dep 类 
2. 这里的意思也就是说 因为我们要做更新 只要模版依赖的 data中的数据改变了 我才去更新 
3. 而模版不依赖的数据改变了 我们不需要做更新
4. 所以问题就是 我们怎么知道 模版依赖了哪些 data中的数据 因为 模版是通过 AST语法树编译生成的rendenr函数
5. 所以当我们调用render函数的时候 就知道 模版依赖了哪些data中的数据 相反的也就是说 我们可以更精准的知道 哪些数据发生改变的时候 我们就可以调用他对应的dep类 去更新数据
```

```js
// observe / watcher.js

import { popTarget, pushTarget } from "./dep"
let count = 0
//20201 02 17
let id = 0
class Watcher {
    constructor(vm,exprOrFn,cb,options){
        this.vm = vm
        //1. exprOrFn 就是我们传入进来的 updateComponent函数 这里面就是
        this.getter = exprOrFn
        this.cb = cb
        this.options = options
        this.id = id++
        this.deps = []
        this.depsId = new Set()
        this.get()

    }
    get(){
        //2. 这里就相当于 把我们的 Dep类 当成一个普通对象 在他的target上面 添加我们的watcher
      	//这么做的目的 就是 我们知道 你是render函数的方法触发的get函数
        pushTarget(this)
      	//5.开始渲染触发了render函数 就会去我们的Vue上去值 然后触发我们的get函数
        this.getter()
      	// 3. 挂在完毕之后 我们还需要 把他卸载掉
        popTarget()
    }
  //8. 这里我们注意 我们需要去冲一下 因为我们有可能出一下一个数据在页面上不同的地方使用 比如如下情况
  //<div>{{product}}</div> <span>{{list}}</span> <div>{{product}}</div>
  //这我们注意有两个 product 那么我们在向watcher 中 存放dep的时候 就会存放两个 对应 product的实例
  // 所以这里我们需要去重复 这里我们使用 集合的方式 去重
    addDep(dep){
        let id = dep.id
        //每次拿到了 dep类的id
        if(!this.depsId.has(id)){
          // 如果没有 我就向集合里去存放id
            this.depsId.add(id)
          // 然后 把我们的对应的 product 和 list 的 对应的 dep实例 存放到到里面
            this.deps.push(dep)
          // 并且每个dep的实例 也存放一下我们的watcher 因为我们以后要调用 watcher类里的方法去更新
            dep.addSub(this)
        }
    }
  //13. 调用我们的更新的方法。在调用 get 在把我们 这个流程重新走一次
    update(){
        this.get()
    }
}

export default Watcher
```

```js
// observe / dep.js

//2021 02 17 
let id = 0
class Dep {
    constructor(){
        this.id = id++
        this.subs = [] 
    }
    depend(){
      //7. 这里我们知道 了是哪些模版上的数据 依赖了我们data上的变量  而每个data上的数据变量 有会产生一个对应的dep实例 
      // 所以我们现在 要把 product对应的 dep 的实例放在watcher类 上 在把 list 对应的dep实例 也放在watcher 上 
        Dep.target.addDep(this)
    }
  //9. 这里 我们注意 我们每一个模版对应的data中的数据变量 生成的dep类 我们都存放在了watcher类的一个池子里 也就是 product 对应的dep实例 会有一个watcher list 对应的 dep实例 会有一个watcher
  // 当我们 product 和 list 的数据改变的话 就调用对应自己watcher中的方法 就去更新视图
    addSub(watcher){
        this.subs.push(watcher)
    }
  //12.当数据改变的时候就触发这个函数 然后调去我们的subs 里面的 watcher 进行数据的更新
    notify(){
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null
// 4. 这里就是相当于 记住我们是render方法触发的get 函数
export function pushTarget (watcher) {
    Dep.target = watcher
}

export function popTarget () {
    Dep.target = null
}
export default Dep
```

```js
// observe / index.js 

function defineReactive(data,key,value){
    observe(value)
    let dep = new Dep()
    Object.defineProperty(data,key,{
        get(){
          //6. render函数一触发 就会走到这里 
          // 此时我们的 Dep.target 已经有值了 因为在render函数调用之前我们已经把 watcher 挂在到了Dep的target上  这里我们就知道了 模版依赖了哪些data中的数据变量
          // 我们上面HTML模版中只依赖了 product 和 list 而 name 我们是没有依赖的 
          // 所以这里 我们进去到两次get函数 一次是。product去值的时候进入get函数 那么此时的dep实例对应的就是 我们的 product  一次是 list去值的时候进入的这个get函数 此时的dep实例对应的就是我们的list
            if(Dep.target){
              // 然后我们把每个data中的数据变量 存放到我们的watcher上
                dep.depend()
            } 
            return value
        },
        set(newValue){
            console.log('触发了set')
            if(newValue === value) return 
            observe(newValue)
            value = newValue
            //11. 当我们改变 product 数据的时候 这个dep就是我们 product对应的dep 当改变list数据的时候 这个dep实例 就是我们list对应的dep
          	// 他里面就会有一个 watcher 然后里面会有更新视图的方法
            dep.notify()
        }
    })
}
```

## 总结

```js
1. 首先我们知道 我们data里的每一个数据都已经被劫持过了 也就是在data上每一个变量的数据 都添加了get 和 set函数 当访问的时候 触发get 函数 当赋值的时候 触发set函数
2. 所以这里 当我们对数据劫持的时候 我们就创建一个 dep 的实例 也就说 我们上面劫持的data里的数据 每一个都对应创建了一个dep的实例
3. 当我们data中的其中一个数据 改变的时候 我们就要更新我们的视图 这里需要注意的 只要我们模版使用的data中的数据改变 才会调去方法 更新视图 如果data中的一个数据改变了 而这个数据我们的template 并没有依赖 所以这个数据改变的时候 我们就不应该调去更新视图的方法
4. 所以这里我们要写一个watcher的实例 而这个实例 就是我们熟悉渲染 需要调用 _update函数 和 _render函数 去更新视图 而我们对应的数据变量改变了 也需要调取对应的dep 然后dep里在去调去watcher 中的方法 去更新视图
5. 这里就涉及到了一个问题 我们怎么知道 template 都是用了 data中的那些变量数据 这里我们知道 只要调取_render的时候 我们才知道 调用了哪些数据变量 所以在调去这个方法之前 我们通过在 把Dep 当作一个纯对象 去把他上面属性添加一下 
6. 当我们render执行的时候 会去data中获取数据 这个时候就触发了get 方法 这个时候我们就判断当前的dep上有没有watcher 如果有 我们就去向dep实例中添加 我们的对应的data里劫持的数据变量 也就是 一个数据变量 对应一个dep实例 
7. 然后我们改变值的时候 就会在调去dep里的通知方法 在去更新视图
```

![](1.png)

