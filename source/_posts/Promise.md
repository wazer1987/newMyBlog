---
title: Promise
date: 2019-03-30
updated: 2019-06-03
tags: JavaScript 
categories: JS高级
keywords: JS高级
description: JS高级
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

# Promise

## Promise

```js
1. Promise 是 ES6 新增的一个内置类
2. 他 是一个承诺模式 主要用来规划异步编程的
3. 为什么要用Promise  因为传统的模式 会形成回调地狱 
4. 回调函数 就是把一个函数作为实参 传递给另外一个函数 然后在这个函数执行的时候调用 处理
5. Promise 本身是同步的 但是他是用来管理异步编程的
6. Promise 里面必须要传一个函数 否则会报了类型错误
```

```JS
// 我们在new Promise 的时候 会立即把传进取函数的里面代码执行
let p1 = new Promise(() => {
    console.log('ok') // 
})
console.log('No')
//先输出ok  在输出No
```

```js
1. new Promise的时候 会把我们传进去的函数立即执行
2. 还会创建一个Promise的实例
3. 每个实例都会有状态(会根据异步的结果改变) 和 值(初始值)
4. 我们一般都会在传进去的函数 管理一个异步操作 异步结果返回了的时候 我们就执行resolve函数 比并且 获取成功的结果 如果失败 就执行 reject 让状态变为失败 这样 实例就可以修改状态
5. 只要Promise的状态发生改变 那么状态就不能在改变了
```

```js
// 我们 new Promise的时候 会立即执行我们传进去的 会反Promise的实例
let p1 = new Promise(() => {
    console.log('ok') // 
})
console.log('No')
// 这个实例的特点
[[PromiseState]] // Promise的状态
//下面是Promise的三种状态 我们在new Promise的时候 状态是 初始状态也就是pedding
+pending //初始状态
+fulfilled / resovled //成功状态
+ rejected  // 失败状态
[[PromiseResult]] // Promise的结果/值
// 初始值是undefined
// 不论成功还是失败状态 都会给我们的 PromiseResult 赋值
```

### Promise 上的方法

```js
1.作为构造函数 在Promise.prototype
 + then([A函数],[B函数]) 基于 then 方法存放两个回调函数 A / B 当promise状态成功 执行A 失败则实行B 并且把[[PromiseResult]]的值传递给对应的函数
 + catch 就相当于 then(null,(feil) => {})
 + finally
```

```js
2. 做为对象 Promise
 + resolve  返回一个状态成功的Promise 实例
 + reject   返回一个状体为失败的Promise 实例
 + all Promise.all([Promise1,Promise2]) // 里面是一个参数 存放的是Promise实例组成的一个数组 要等到 所有 Promise 实例 都返回成功的状态 Promise.all 返回的总实例才是成功 返回结果是一个依次存储了每一个Promise 的实例成功的结果 只要 有一个实例是失败的 Promise.all 就是失败的 失败的结果 就是你那个失败的实例
 + race  Promise.rece // 也是管理多个实例 但是它先看谁的实例现有结果(不论成功还是失败) 总实例 结果就是有结果的那个实例
```

```js
1.我们  new 了一个 Promise 实例
new Promise((resolve, reject) => {
    //这里因为 只要状态改变了 就不会在改变了状态 值已经被赋值成 10了
    resolve(10);
    // 这里因为我上面状态已经改变过了 这里 就不在执行了
    reject(20);
}).then(result => {
    //所以 就会走成功的函数 
    console.log(`成功了 -> ${result}`); // 输出 10
    //然后我们返回了100 我们知道 只要在不报错的情况下 且没有 返回一个新的Promise实例 就都是成功的
    return result * 10;
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
}).then(result => {
    //所以会走这里
    console.log(`成功了 -> ${result}`); //输出 100
    return result * 10 // 同上 
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
}).then(result => {
    console.log(`成功了 -> ${result}`); // 输出1000 
    return result * 10;
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
}); 
```

```js
// 这里我们成功之后 then的第一个函数传个null 进去  那么他会找下一个then中的A 函数
// 这种叫顺延  因为你传个nul  他相当于默认给你传了个函数 () => { return res} 也不会报错
Promise.resolve(10).then(null ,() => {
    
}).then((res) => {
    // 由于 上一个 then 中的 A 函数没有传递 所以直接走这个 结果是10
    console.log(res)
}, (feil) => {
    console.log(feil)
})
```



```js
// 问题来了 既然有状态 我们怎么取改变Promise的状态呢 
// 我们在new Promise的时候 里面传进去的函数 会传递两个 参数 一个是 resolve reject 这两个函数会把我们的状态修改成功还会失败 如果成功或者失败 会把我们传进去的值 赋值给我们的 PromiseResult
let p1 = new Promise((resolve,reject) => {
    resolve(10)
})
//这里就把P1的 PromiseState 修改为成功 并且 把PromiseResult 赋值为10
```

```js
// 当我们调用resolve reject 实例的状态以后 我们可以通过then方法 去执行两个函数
Promise.prototype
 + then([A函数],[B函数]) 当promise(实例的状态) 为成功的时候 就执行A函数 如果失败就执行B 函数
 let p1 = new Promise(() => {
     setTimeout(() => {
         let ran = Math.random()
         ran < 0.5? reject('NO'):resolve('OK')
     },1000)
 })
 //就可以通过then里面的两个函数 执行成功 还是是失败
 p1.then((res) =>{
     console.log(res) // 成功就会输出OK
 },(feil) => {
     console.log(feil) // 失败 就会输出 NO
 })
```

```js
1. Promise 中的异步 
2. 我们知道Promise 里的传进去的函数 是立即执行的函数 是同步的
3. 但是我们 改变状态之后 then函数里面的代码我们还没有写好 所
4. 所以这里Promise中的异步
```

```js
let p1 = new Promise((resolve,reject) => {
    resolve('ok')
})
p1.then((res) => {
    console.log(res)
},(feil) => {
    console.log(feil)
})
console.log('2222') 
//输出顺序 2222 先被输出 ok 因为是异步的微任务 后被输出
// 当我们通过resolve 和 reject 改变我们的Promise 中状态的时候 我们的then方法里面的两个函数还没有写成 不知道执行哪一个 所以 异步的 因为我们结果已经有了 但是我们的还没有函数去执行这两个结果
```

![](pomise.png)

```js
// 执行then 方法
1. 为了把当前实例成功执行的A以及失败执行的B 存储起来
2. 同时返回一个新的 Promise 实例
3. 新实例的状态 是上一个实例 p1 基于then方法存放的 A / B 函数执行来决定饿
4. 不论 是A 还是 B 执行 只要执行不报错 则新实例的状态都是成功
5. p2的结果是A 或者 B 函数执行的返回值
6. 存在特殊情况 如果 A B 函数中返回的是一个新的 Promise实例   他的状态 才是 由 立即执行函数 中的 resolve 和 reject 决定的
```

```js
 let p1 = new Promise(() => {
     setTimeout(() => {
         let ran = Math.random()
         ran < 0.5? reject('NO'):resolve('OK')
     },1000)
 })
// 这里的p2 的状态 取决p1 执行 then 方法后的来决定的  无论执行 p1的A方法 还是B 方法 p2的状态都会是成功 值 就是 你A 函数 或者 B 函数 返回的值
 let p2 = p1.then((res) =>{
     console.log(res) // 成功就会输出OK
     return res
 },(feil) => {
     console.log(feil) // 失败 就会输出 NO
     return feil
 })
```

## async 和 await

### async

```js
1. async 修饰一个函数 保证返回一个Promise实例 ES7中的新提供的语法
2. async 和then方法很相似 函数执行不报错 返回成功的Promise 实例 如果报错 返回失败的 return的值 或者报错原因就是Promise 实例的结果
3. async 最常见的应用 是为了修饰函数 让函数中可以使用 
```

```js
async function fn(){
    console.log(a)
    return 10
}
console.log(fn()) // 输出一个Promise 状态是成功 值是10 
//如果没有写返回值 返回的也是一个成功的Promise 
```

```js
// 如果代码报错了 就会返回一个失败的Promise
async function fn(){
    console.log(a)
    return 10
}
console.log(fn()) 
```

```js
// 会返回一个失败的Promise 状态以你自己返回的Promise 为准
async function fn(){
    return Promise.reject(10)
}
```

```js
// 即使里面 有异步的代码 也不会立即返回
async function fn(){
   setTimeout(() => {
       return 10
   },1000)
}
console.log(fn())  //  状态还是成功 值是 undefined
```

### await

```js
1. await 修饰的 Promise 实例 会等待Promise实例状态为成功的时候 在执行 下面的代码
2. await 修饰之后 看上去是同步 实则是异步的 是异步中的微任务 await 会把 后面的代码 都变成微任务 要等到 Promise实例状态变成成功 才会执行后面的代码
```

```js
// awiat 会把一个异步的代码 变成一个类似的同步代码 
// 以下代码执行顺序 由于用了 await修饰了 所以代码会先把异步的程序输出完毕之后 在执行代码下面的
function fn() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log('异步编程完成')
            resolve('ok')
        },1000)
    })
}
async function func(){
    await fn()
    console.log('AAAA')
}
func()
// 先输出 定时器里的 异步编程完成 才会输出 AAAA
```

![](await1.png)

```js
( async function () {
    let x = await 10
    console.log(x)  //输出10
    let y = await Promise.resolve(20)
    console.log(y)  //输出20
    let z = await Promise.reject(30)
    //由于 你上面代码 是失败了 所以下面的代码 不会执行  可以用try{}catch(e){} 捕获以下 就会走catch
    console.log(z)
})()
```

```js
//实例
1. 首先代码从上向下执行 
async function async1() {
    6. 然后输出 async1 start
    console.log('async1 start');
    7. 执行async2 我们知道 await 修饰过的函数 会同步执行 然后返回一个Promise 而 await 后面的代码会被变成异步的微任务 要等到我们 await 修饰过的函数 状态变成成功 才会执行后面的代码
    await async2();
    9. 然后这个由于在 await 后面所以被放在微任务队列里 微任务1
    console.log('async1 end');
}
async function async2() {
    8. 所以 先执行这个 
    console.log('async2');
}
console.log('script start');  2. 肯定先出输出这个 
3. 是个定时器 所以就存放在宏任务队列里 要等所有的同步代码 和 微任务代码执行完毕之后才会执行 如果有多个定时器在宏任务队列里 就看哪个先到时间就先执行哪个定时器
setTimeout(function () {
    console.log('setTimeout');
}, 0)
async1();  4.async1 调用
9. 继续执行同步代码 
new Promise(function (resolve) {
    10.立即执行
    console.log('promise1');
    11. 一看是异步的微任务 就放在微任务队列里 微任务2 如果微任务队列里 有多个微任务 就从上至下之心的 谁先放进来就执行谁
    resolve();
}).then(function () {
    12.被放在微任务队列里了
    console.log('promise2');
});
13.执行这个
console.log('script end');
14. 以上同步代码就执行完毕了 然后开始 event Loop  去看微任务对队列里有哪些 有微任务1 和微任务2 然后拿出来执行执行 执行完毕之后 在看宏任务 看到定时器到时间了 就开始执行到时间的定时器
// script start -> async1 start -> async2 -> promise1 -> script end -> async1 end -> promise2 -> setTimeout
```

![](await2.png)

```js
// 实例
function func1() {
    console.log('func1 start');
    return new Promise(resolve => {
        resolve('OK');
    });
}

function func2() {
    console.log('func2 start');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('OK');
        }, 10);
    });
}

console.log(1);
setTimeout(async () => {
    console.log(2);
    await func1();
    console.log(3);
}, 20);
for (let i = 0; i < 90000000; i++) {} //循环大约要进行80MS左右
console.log(4);
func1().then(result => {
    console.log(5);
});
func2().then(result => {
    console.log(6);
});
setTimeout(() => {
    console.log(7);
}, 0);
console.log(8);
// 输出结果
1 -> 4 -> func1 start -> func2 start -> 8 -> 5 -> 2 -> func1 start 3 -> 7 -> 6
```

```js
1. 首先代码是从上向下执行 那么 我们首先走到的console.log(1) 所以输出1 
2. 然后下面是一个定时器 是一个宏任务里 所以放在 event queue 任务队列里  然后开始计时 20ms后执行 编号宏任务一
3. 然后是一个循环 时间大概80ms 此时宏任务一的定时器已经到时间了 但是 我们同步代码还没有执行完毕 所以等着
4. 然后执行congsole.log(4) 输出4
5. 开始执行func1() 进去一看 有个congsole.log('func1 start') 输出 func1 start 然后返回一个Promise 立即执行函数里面没有可执行函数 resolve('OK') 是异步的微任务 然后放在微任务队列里 微任务一
6.然后下向执行 func2() 进去 有个console.log('func2 start') 输出 func2 start 然后返回一个promise 立即执行函数里面 有个定时器 10ms 之后执行 然后放在宏任务里 宏任务2
7. 然后向下走又是一个定时器 放在宏任务里 宏任务3
8. 然后console.log(8) 输出 8
9. 此时同步代码执行完毕 1 -> 4 -> func1 start ->  func2 start -> 8
10. 同步代码执行完毕了 此时宏任务和微任务里面 都有任务 而且宏任务里的任务 也已经到时间了 但是还是要执行微任务
11. 执行微任务一 输出 5
12. 然后去看宏任务 宏任务20ms 早就到时间了 所以开始执行 输出console.log(2) 输出 2 然后 下面是 await func1() 
13. 我们知道 await  会把它修饰过的函数 立即执行 而后面的代码会放在微任务里  所以立即执行之后 输出func1的函数 先输出 func1 start 
14. 输出完毕之后在去任务队列里看 有没有微任务 一个还有一个console.log(3) 
15. 此时 已经没有微任务了 去看宏任务有没有到时间的 然后 0ms的的那个到时间 然后拿出来输出 输出 7 
16. 然后 宏任务 10ms 的那个也到时间了 放在微任务队列里 然后输出 6
```

![](await3.png)





