---
title: JavaScript 事件循环机制
date: 2020-04-26
updated: 2019-06-03
tags: JavaScript
categories: 原生js
keywords: JavaScript
description: JavaScript
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

# JavaScript 事件循环机制

## 概念

```JS
1.JavaScript 是一门单线程的非阻塞的脚本语言
2.单线程意味着 代码在执行的任何时候 都只有一个主线程来处理所有的任务
3.那么我们代码在执行一个无法立刻返回结果,而需要花费一定时间才能返回的任务的时候 怎么办
4.这个时候就是我们上面说的非阻塞的体现 如I/O事件 如果执行了一个无法立刻返回结果的任务 主线程就会挂起(pending)这个任务 然后在异步任务返回结果的时候在根据一定的规则去执行响应的回调
5.HTML5的新特性中web worker 可以让 JavaScript 成为一门多线程的语言 但实际开发中 使用 webWorker 存在很多限制
```

## 执行栈与事件队列

```JS
1.当JavaScript 代码执行的时候 会将不同的变量存在于内存中不同的位置
2.基本类型 undefined null boolean number string 存放在栈内存中(数据大小确定,内存空间可以分配)
3.复杂数据类型 对象 数组 函数 存放在 堆内存中 保存的是指针 指向对应的地址
```

```JS
1.当我们调用一个方法的时候 js会生成一个与这个方法对用的执行环境 这里我们有叫做执行期上下文 这个实环境中存在着这个方法的私有作用域 上层作用域的指向 方法的参数 这个作用域中定义的变量 以及这个作用域的this对象 
2.而当一些列的方法一次被调用的时候 因为js是单线程的 同一时间只能执行同一个方法 于是这个方法被排队在一个独立的地方 这个地方叫做执行栈
3.当脚本第一次执行的时候 js引擎 会开始解析这段代码 并将其中的同步代码按照顺序加入到执行栈中 执行栈从头开始执行 吐过当前执行的是一个方法 那么js会在这个执行栈中添加这个方法的执行环境 然后进入到这个执行环境中执行其中的代码 当这个执行环境中的代码执行完毕 返回结果后 js退出这个执行环境并把这个执行环境销毁 回到上一个方法的执行环境 这个过程反复进行 知道执行栈中的代码 直到代码全部执行完毕
4.js的调用栈 是一种后进先出的数据结构 当函数调用的时候 会被添加到栈中的顶部 执行完成之后就会从栈顶部移除该函数 直到栈内被清空
```

## 事件循环机制

```JS
1.JS的事件循环机制 分为浏览器和node 事件循环机制 两者实现技术不太一样 浏览器Event loop 是 HTML中定义的规范 node Event Loop 是由 libuv库实现 我们这里主要说浏览器的部分
2.js 有一个main thread (主线程) 和 call-stack执行栈 素有的代码 也就是我们的任务 都会按照顺序 被放在执行栈里 等待着主线程执行
3.js 单线程中的任务分为同步任务 和异步任务 同步任务 会在执行栈中 按照顺序排队等待主线程执行 异步任务 则会在异步任务有了结果后 将注册的回调函数添加到任务队列中等待着主线程空闲的时候 执行 也就是栈内被清空的时候 被读取到栈中等待主线程执行 任务队列是先进先出的数据结构
4.执行栈中的同步任务都执行完毕 执行栈中被清空了 就代表主线程空闲了 这个时候就会去任务队列中按照顺序读取一个任务放到栈中执行 每次栈内被清空 都会去读取任务队列中的任务 一直循环 这就是我们所说的事件循环机制 也就是event loop
```

![](6100502-7831389bec37fe52.png)

```JS
//上图注解
同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数
当指定的事情完成时，Event Table会将这个函数移入Event Queue
当栈中的代码执行完毕，执行栈（call stack）中的任务为空时，就会读取任务队列（Event quene）中的事件，去执行对应的回调
如此循环，形成js的事件循环机制（Event Loop）
```

## 微任务和宏任务

```JS
1.在异步函数中 又可以分为 宏任务 和微任务
2.宏任务(macro-task)  I/O setTimeout setInterval setImmediate requestAnimationFrame script整体代码
3.微任务(micro-task)  process.nextTick MutaitionObserver Promise.then catch finally
4.
```

```JS
存在宏任务 和微任务的时候 浏览器 会先执行script的正常代码 如果 存在微任务 就会立即执行微任务 在执行宏任务 如果微任务里还有异步的回调 例如then 它会被当作是异步里的微任务去限制性
```

```JS
console.log('script start')
let promise1 = new Promise((resolve) => {
    console.log('promise1')
    resolve()
    console.log('promise1 end')
}).then(() => {
    console.log('promise2')
})
setTimeout(() => {
    console.log('setTimeout')
})
console.log('script end')
//执行顺序
'script start'  'promise1'  'promise1 end' 'script end' 'promise2' 'setTimeout'
//------------------------------------------//
1.首先执行正常的代码 'script start' 然后遇到了new promise 这就是微任务 然后开始执行里面的 然后.then 由于这是异步任务 所以不会立即执行 然后开始执行 'script end' 这个时候 执行栈的任务执行完毕了 开始执行异步任务 .then 和定时器 由于.then 在异步任务 里 是属于微任务的 所以开始执行.then 最后执行定时器
2.这里记住定时器 即使没有写了时间 也不会马上执行 最低是4ms
```

## async await

```JS
async 函数表示函数里面 可能会存在异步的方法 await 后面跟一个表达式 async方法执行的时候 遇到 await 表达式 会立即执行表达式 然后把表达式 后面的代码放到微任务队列里 让出执行栈 让同步代码先执行
```

```JS
 async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')

    }
    async function async2(){
      console.log('async2')
    }
    console.log('script start')
    async1()
    console.log('script end')
//执行顺序 
script start    
async1 start
async2
script end
async1 end
//----------------------//
首先还是执行同步代码 console.log('script start') 然后执行 async1() 函数 进去之后发现 有代码 执行 console.log('async1 start') 遇见  await async2() 然后立即执行async2()里面的代码  然后把await 后面的 代码放到微任务队列 让出执行栈 执行同步的代码 console.log('script end') 此时同步的代码执行完毕 然后 执行 微任务里的 console.log('async1 end')
```

```JS
 <script>
     async function async1(){
         console.log('async1 start')
         await async2()
         console.log('async1 end')
     }
     async function async2(){
         console.log('async2')
     }
     console.log('script start')
     setTimeout(() => {
         console.log('settimeout')
     })
     async1()
     new Promise((resolve) => {
         console.log('promise1')
         resolve()
     }).then(() => {
         console.log('promise2')
     })
     console.log('script end')
    //  'script start' 
    //  'async1 start'  
    //  'async2' 
    //  'promise1' 
    //  'script end' 
    //  'async1 end'
    //  'promise2' 
    //  'settimeout'
    </script>
```

