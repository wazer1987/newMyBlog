---
title: Vue源码开发-批量更新06
date: 2021-01-05
updated: 2021-01-05
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
# Vue源码开发-批量更新

```js
1. 我们前面已经知道了 每个属性都会对应一个dep实例 而每个dep实例都会有一个watcher 这个watcher 是渲染用的 
2. 而 watcher 实例里面 有模版 依赖的 data里面数据的变量 对应的dep实例
3. 当我们改变对应data里的数据 就会触发set函数 然后对应的变量的dep就会触发notify函数 从而调用watcher里面更新函数 也就是调用了_update函数 和 _render 函数 
4. 所以这我们改变了几个data的数据变量 就会调用几次watcher 这样是不合理的 
5. 这里我们要改用异步更新的方式去处理批量更新 如果多个data里的数据放生改变了 我们只更新一次
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
                    product:'3;33',
                    list:'333',
                    name:'北城'
                }
            },
        })
        setTimeout(() => {
            vm.product = '我改变了'
            vm.list = '你好'
        },1000)
    </script>
</body>
```

```js
1. 我们上面可以看到 我们改变了 product 和 list 数据
2. 此时已经触发了两次watcher里的更新视图的方法 就会重复渲染
3. 这样是不合理的 因为我们只做一次渲染  所以我们要做批量更新 和 异步更新 也就是防抖
```

![](1.gif)

## 异步更新 批量更新

```js
1. 首先我们要明确 如果你多次改变data中的数据 我们更新视图的操作应该只执行一次
2. 另外我们的视图更新 应该是异步的形式 也就是说等你同步的操作都完毕了 我们才去更新视图
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
                    product:'3;33',
                    list:'333',
                    name:'北城'
                }
            },
        })
        // 这里我们对data里的数据做了多次重复的操作 按照我们之前的代码 肯定改变一次就会调用一个渲染
        // 视图的方法 所以这样是不合理的 
        // 另外没改变一次数据 我们应该只取最后一次去改变
        setTimeout(() => {
            vm.product = '我改变了'
            vm.list = '你好'
            vm.product = '要改变'
            vm.list = '是的'
        },1000)
    </script>
</body>
```

```js
1. 这里我们知道 我们更新的时候 是调用watcher里的方法去更新 
2. 每个数据改变 就会调用对应的dep 然后dep去调用watcher中的更新方法 这些dep中的watcher有一些是相同的
3. 所以我们首先要去重 让拥有相同watcher的dep实例 只保留一个 watcher 
4. 然后我们更新的时候 采用一个调度函数的方法去更新
```

```js
import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./schedular"
let count = 0
//20201 02 17
let id = 0
class Watcher {
    constructor(vm,exprOrFn,cb,options){
        this.vm = vm
        //1. exprOrFn 就是我们传入进来的 updateComponent函数 这里面就是
        // _update _render 函数 调用之后就会更新页面
        this.getter = exprOrFn
        this.cb = cb
        this.options = options
        this.id = id++
        this.deps = []
        this.depsId = new Set()
        //2. 这里我们抽离一下 方便我们记录 模版都依赖了data中的哪些数据变量
        this.get()

    }
    get(){
        //4. 走到这里的时候 我们就把watcher放入到我们的dep上
        pushTarget(this)
        // 3. 这个方法 就会对我们的 data 中的数据进行取值 
        // 因为我们的data是被劫持过的 所以我们一取值 就会触发get函数
        this.getter()
        //5. 当页面更新之后 我们在把target 至为null
        popTarget()
    }
    // 6.存放dep的方法 要去重 
    // 因为我们 会出现多个重复的依赖数据 而我们只需要用一个 所以要去重复
    //<div>{{product}}</div> <span>{{product}}</span>
    // 以上 我们由于编译成render函数之后 会去 data的数据上去值
    // 一取值 就会触发get函数 而这里 触发了两次get函数 但是数据是相同的
    // 所以要去重复
    addDep(dep){
        let id = dep.id
        if(!this.depsId.has(id)){
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    update(){
        // console.log('调用了watcher里面的方法')
        // this.get()
        //2021 0218 这里我们知道我们如果多次数据发生改变 都会调用这个update方法
        // 而我们其实只需要调用一次更新视图的方法 所以这里我们要写一个调度的函数
        // 目的就是为了多次更新的时候我们只更新一次视图
        queueWatcher(this)
    }
    //4. 这个就是真正意义上的更新视图的方法 通过 调度函数 flushSchedularQueue 去做更新
    run(){
        this.get()
    }
}
export default Watcher
```

```js
// observe / schedular.js

//  2021 0218 
//2. 这里的目的就是更新的时候 就多次去重
// 这里我们知道 每个劫持的数据对应的dep 当触发更新的时候 使用的都是同一个watcher 
// 所以这里我们要去重
let has = {}
let queue = []
function queueWatcher(watcher){
    // 第一次has里是没有id的键的 所以会进入到判断条件里面
    // 在if里面 我们就把has[id]的值设置为true
    // 所以第二次的时候 就不会进入到if里 此时 queue只有一个watcher
    let id = watcher.id
    if(has[id] == null){
        queue.push(watcher)
        has[id] = true


        // 让queue清空 这里是异步完成的 
        setTimeout(flushSchedularQueue,0)
    }
}
//3. 这里主要就是做调度去使用 调度我们更新的函数 去做视图更新 执行完毕之后 清空我们的调度队列
function flushSchedularQueue(){
    // watcher 会有多个 所以 我们要 循环
    for(let i = 0; i < queue.length; i++){
        let watcher = queue[i]
        watcher.run()
    }
    queue = []
    has = {}
}
```

## 存在问题

```js
1. 通过上面的代码 我们已经实现了异步更新
2. 但是有个问题 由于我们更新是 异步的 所以我们拿不到最新渲染之后的DOM元素
3. 这里需要注意的是 我们每次执行完_update 和 _render 函数之后 都把最新创建的DOM挂在到了 $options.el上
4. 所以我们可以通过实例的$options.el拿到更新后的DOM元素
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
                    product:'3;33',
                    list:'333',
                    name:'北城'
                }
            },
            methods:{}
        })
        setTimeout(() => {
            vm.product = '我改变了'
            vm.list = '你好'
            console.log(vm.$options.el.innerHTML,'---')
        },1000)
    </script>
</body>
```

```js
1. 我们打印出来可以看到 拿到的还是之前的DOM元素
2. 这里我们可以看到 我们的DOM元素 数据已经由333 变成你好了 但是这里我们拿到的html还是原来的
```

![](2.gif)

## $nextTick方法

```js
1. 所以这里我们就要采用这种$nextTick 去拿到最新的DOM
2. 为什么这么做 因为你视图更新是异步的 当我们同步代码执行完步之后 你的视图还没更新过来
3. 这里我们的核心思想就是 把你的视图更新的代码 变成微任务 然后排在任务队列的第一位 所有需要视图更新拿到的结果 都一次向后排列执行
4. 这样就能保证我们拿到最新的渲染后的DOM了
```

```js
1. 所以我们刚刚的异步更新是采用定时器的方法 定时器是宏任务 这里我们采用promise的方法
2. 这里就要单写一个nextTick文件了
```

```js
// observe / schedular.js
import { nextTick } from "../util"

let has = {}
let queue = []
let pending = false
export function queueWatcher(watcher){
    let id = watcher.id
    if(has[id] == null){
        queue.push(watcher)
        has[id] = true

			 // pending 主要是为了防止不同watcher 创建多个 微任务
       if(!pending){
           pending = true
        	 nextTick(flushSchedularQueue)
       }
    }
}
function flushSchedularQueue(){
    console.log('执行一次')
    for(let i = 0; i < queue.length; i++){
        let watcher = queue[i]
        watcher.run()
    }
    queue = []
    has = {}
    pending = false
}
```

```js
// 2021 0218
let callbacks = []
let waiting = false

function flushCallbacks(){
    for(let i = 0; i<callbacks.length;i++){
        let callback = callbacks[i]
        callback()
    }
    waiting = false
    callbacks = []
}

//1. 这里我们视图更新的时候会调用这个函数 cb就是我们视图更新的函数
export function nextTick(cb){
    // 我们向数组里存放这个视图更新的函数
    callbacks.push(cb)
    if(!waiting){
    // 第一次我们进入到这个if里来    然后改变锁
        waiting = true
        //这个时候 我们的then后面的函数 会被放到微任务里来 等到同步代码执行完毕之后才会执行
        // 我们的同步代码还有 vm.$nextTick(() => { console.log(vm.$options.el.innerHTML,'---')})没有执行
        // 所以再次调用 nextTick这个函数 于是就会在向callbacks 里去存放我们的回调函数 函数是 打印的这个函数
        // 然后 没有同步代码了 我们开始执行微任务里的函数 callbacks 数组里有两个函数 一个是 更新视图的函数 一个是 获取最新DOM的函数
        // 然后一次执行 所以DOM更新完了 然后执行打印拿到最新DOM的函数 
        // 这就是 $nextTick的原理 多个任务执行 只开启一个微任务
        Promise.resolve().then(flushCallbacks)
    }
}
```

## 总结

```js
1. 首先我们知道 我们每改变一次 data中的数据的时候 就会调用watcher中一次更新的方法 就会重新渲染页面
2. 所以我们改变数据的时候 只调用一次 watcher中的更新方法 并且 我们只取最后一次改变值的 更新方法 而且是异步的去更新
3. 首先我们改变数据的时候 我们要保证 数据对应的dep里的watcher 要去重
4. 然后我们写一个nextTick方法 把我们更新的方法传入进去 然后我们开启一个promise 把更新的视图的方法也就是watcher中的方法 存放进去 
5. 这样当我们 同步代码 都执行完毕了之后 就会去执行微任务中的代码 也就是watcher中更新视图的函数 
6. 然后 当我们需要拿到最新DOM的时候 我们再次调用 nextTick 把需要执行的代码 放入到我们的 我们微任务中的队列去 也就是放入到了我们的 watcher中更新函数的后面 
7. 等到同步代码执行完毕之后 我们就一次循环这个队列 然后一次执行 这个时候代码是同步
8. 我们就能保证 每次视图先更新 然后 再去执行我们的逻辑代码 拿到最新的数据
```

