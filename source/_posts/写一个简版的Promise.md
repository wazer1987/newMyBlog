---
title: 手写一个简版的promise
date: 2020-04-27
updated: 2019-06-03
tags: JavaScript
categories: 源码
keywords: JavaScript
description: JavaScript 源码
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
# 手写一个简单版的Promise

## Promise都做了哪些事情

```js
1. 首先我们 new 的时候 会穿进去一个立即执行的函数 如果这个函数不传 就会报错
2. 在类的实例上 会有两个值 一个是状态 初始值是 pending 一个是值 初始值 为 undefined
3. 这个立即执行函数 会接受两个参数 一个参数是 resolve 函数 会把我们类里面的状态变为成功 fulfilled 并且把我的值改变为你穿进来的值 一个是 reject 函数 会把我们类里面的状态变成为失败 rejected 值也会跟着改变
4. 做为对象的时候 调用Promise.resovle方法会返回一个状态为成功的promise对象 调用Promise.reject 方法会返回一个状态为失败的promise对象
5. 而不论成功或者失败 当你用resolve 或者 reject 的时候 都会通知then方法的里面的成功 或者失败的函数 异步的去获得结果
```

## 作为构造函数

```js
1. 首先 在类上 会有 状态 初始是pending 而 默认值 是undefined
2. 然后穿进来的立即执行函数 如果不传 就会报错 这个函数会被调用 然后传出去两个实参 一个是 成功的resolve函数 一个是 失败的reject函数
3. 我们还需要写一个change 函数 用来改变你的状态 和 你的 默认值 调用resolve 函数的时候因为是成功 我们就在change里传入成功的状态 fulfilled 而失败 正好相反
4. 一旦我们的状态改变了 就不能在改变了
```

```js
function MyPromise(executor) {
    //1.这个立即执行函数我们必须要传入 如果不穿就报错
    if(typeof executor !== 'function') return new TypeError('MyPromise resolver undefined is not a function')
    //2.定义我们的初始状态 和我们的默认值
    this.MyPromiseState = 'pending'
    this.MyPromiseValue = undefined
    //3. 然后这个立即执行函数会执行 参数为两个函数 一个是成功的函数 resolve 一个是失败的函数 reject
    var resolve = function resolve (result){
    //4. 当我们 new Promise((resolve,reject) => { resolve(ok)}) 成功的时候会执行这个函数 改变状态为成功并且赋值
        change('fulfilled',result)
    }
    var reject = function reject (reason){
        change('rejected',reason)
    }
    //5.这里当我们调用resolve的时候 由于前面没有任何东西 我们要保证我们change函数里面的this指向正确 所以要缓存一下
    var _this = this
    var change = function change(state,value) {
    if(_this.MyPromiseState !== 'pending') return
      _this.MyPromiseState = state
      _this.MyPromiseValue = value
    }
    executor(resolve,reject)
}
var p1 = new MyPromise(function(){
  resovle('ok')
})
```

## 作为普通对象

```js
1. 会有4个方法 分别是resolve reject all(传递一个 promise实例组成的数组 当数组中所有的实例都返回成功的时候才会成功) race 这里我们现在暂时实现 Promise.resolve() Promise.reject()
2. resolve 会返回一个成功的 Promise实例 
3. reject  会返回一个失败的 Promise实例 
```

```js
MyPromise.resolve = function resolve (result){
    return new MyPromise(function (resolve){
        resolve(result)
    })
}
MyPromise.reject = function reject (reason) {
    return new MyPromise(function(_,reject){
        reject(reason)
    })
}
```

## then的时候执行

```js
1. 我们上面的类 写完之后都是立即执行的 也就是 当你调用resolve函数的以后 就已经把状态改变
2. 但是我们要通过then 拿到结果 这个里面是异步的微任务 这里我们用定时器模拟
3. then 是公共方法 所以我们要写在原型
```

```js
//如果 我们then 里什么也没有传 我们就需要默认给补充一个
var p1 = new Promise(function(resolve,reject){
  resolve(res)
})
p1.then(null,null) 就相当于下面的情况 所以我们要在then执行的时候判断一个 如果没传就补充上
p1.then(function(res){
  Promise.resolve(res)
},function(reason){
   Promise.reject(reason)
})
```

```js
function MyPromise(executor) {
    if(typeof executor !== 'function') return new TypeError('MyPromise resolver undefined is not a function')
    this.MyPromiseState = 'pending'
    this.MyPromiseValue = undefined
    //1.为了then能拿到我们的状态所以在上面定义了这两个方法
    this.resolveFunction = function rejectFunction ()  {}
    this.rejectFunction = function rejectFunction () {}
    var resolve = function resolve (result){
        change('fulfilled',result)
    }
    var reject = function reject (reason){
        change('rejected',reason)
    }
    var _this = this
    var change = function change(state,value) {
    if(_this.MyPromiseState !== 'pending') return
    _this.MyPromiseState = state
    _this.MyPromiseValue = value
    //2. 由于then的时候 是异步的微任务 这里我们就用宏任务模拟一下
    setTimeout(function(){
    //3.这里 就是当我们使用then去拿结果的时候 需要异步的方式去拿 而then里的两个函数 就是我们的this.resolveFunction this.rejectFunction 如果我们只用var p1 = new MyPromise((resolve,reject) => {resolve(ok)}) 这个时候下面没有同步代码了 所以直接就把定时器里的代码拿出来执行了 但是当我们 p1.then((res) => {},(reason) => {}) 的时候 then 里的执行函数 属于同步代码 在原型上 先做了 一些处理 然后 执行完了 在去宏任务里去看看 我究竟要执行哪个函数
    state === 'fulfilled'? _this.resolveFunction(_this.MyPromiseValue):_this.rejectFunction(_this.MyPromiseValue)
    },0)
    }
    executor(resolve,reject)
}
//4. 所以我们需要在我们的原型上写一个then的方法 来拿到我们的值 因为原型重写了 所以我们要写我们构造器
MyPromise.prototype = {
    constructor:MyPromise,
    //5. 然后上面有一个then方法 这个方法是异步的 接收两个函数 这个就是我们方面写的
    then:function then(resolveFunction,rejectFunction){
        //6.我们这里还有一个顺延效果  当你已经改变了promise的状态 但是你then里面不传resolve的时候 或者 reject的时候 就会返回一个没有值的promise实例 
        if(typeof resolveFunction !== 'function'){
            resolveFunction = function resolveFunction(result){
                return MyPromise.resolve(result)
            }
        }
        if(typeof rejectFunction !== 'function'){
            rejectFunction = function rejectFunction(result){
                return MyPromise.reject(result)
            }
        }
        this.resolveFunction = resolveFunction
        this.rejectFunction = rejectFunction
    }
}
```

## then链的调用机制

```js
1. 首先 当我们创建一个 promise 实例的时候 通过resolve 改变了成功的状态 然后可以通过then 里面的 第一个函数 拿到结果
2. 如果then里面的函数 我们不传 他会有一个顺延的的效果
3. 其实是返回一个 promise成功的实例 然后在通过then去调用
```

```js
var p1 = new Promise(function (resolve,reject) {
  resolve('OK')
})
//这里什么也没有传 但是我状态是成功的 所以 可以在下一个then中的第一个函数 再次拿到结果
p1.then(null).then((res) => { console.log(res) 输出ok})
//如果这里传了 一个别的值  那我们也需要判断 原路返回
p1.then((res) => { return 10 或者对象 或者别的什么)
// 如果这传了一个 promise 我们还需要从新调用then
p1.then((res) => { return new Promise(function(){}))
```

```js
function MyPromise(executor) {
    if(typeof executor !== 'function') return new TypeError('MyPromise resolver undefined is not a function')
    this.MyPromiseState = 'pending'
    this.MyPromiseValue = undefined
    this.resolveFunction = function rejectFunction ()  {}
    this.rejectFunction = function rejectFunction () {}
    var resolve = function resolve (result){
        change('fulfilled',result)
    }
    var reject = function reject (reason){
        change('rejected',reason)
    }
    var _this = this
    var change = function change(state,value) 
    if(_this.MyPromiseState !== 'pending') return
    _this.MyPromiseState = state
    _this.MyPromiseValue = value
    setTimeout(function(){
    state === 'fulfilled'? _this.resolveFunction(_this.MyPromiseValue):_this.rejectFunction(_this.MyPromiseValue)
    },0)
    }
    executor(resolve,reject)
}
MyPromise.prototype = {
    constructor:MyPromise,
    then:function then(resolveFunction,rejectFunction){
        //1.我们这里还有一个顺延效果  当你已经改变了promise的状态 但是你then里面不传resolve的时候 或者 reject的时候 就会返回一个没有值的promise实例 
        //在下个then中可以拿到值
        if(typeof resolveFunction !== 'function'){
            resolveFunction = function resolveFunction(result){
                return MyPromise.resolve(result)
            }
        }
        if(typeof rejectFunction !== 'function'){
            rejectFunction = function rejectFunction(result){
                return MyPromise.reject(result)
            }
        }

    //2. 这里为了能当状态改变成功或者失败之后 我们then 里面什么也不传  然后在在第二个then中调用 能拿到结果 所以我们还是要返回一个promise实例 
    //这样才能接着用then调用 为了保证this 指向正确我们缓存一下
        var _this = this
        return new MyPromise(function(resolve,reject) {
            //3.这里由于我们不知道 究竟调用的是 成功的函数  还是 失败的函数 所以 这我们在把函数包装一层方便监控
            _this.resolveFunction = function(result){
                //4.这里有两种情况 第一种是 你自己有返回值 比如10 20 一个对象之类的 不是一个promise的成功的状态 我们直接返回就可以
                // 第二种 就是 你代码写的问题 直接报错了 所以我们要返回失败的状态
                try{
                    var x = resolveFunction(result)
                    // 判断 你是返回的promise实例 我们就接着调用then 如果是特殊的值 我们就直接返回
                    x instanceof MyPromise? x.then(resolve,reject):resolve(x)
                }catch(e){
                    reject(e)
                }
            }
            _this.rejectFunction = function(reason) {
                try{
                    var x = rejectFunction(reason)
                    // 判断 你是返回的promise实例 还是特殊的值
                    x instanceof MyPromise? x.then(resolve,reject):resolve(x)
                }catch(e){
                    reject(e)
                }
            }
        })
    }
}

MyPromise.resolve = function resolve (result){
    return new MyPromise(function (resolve){
        resolve(result)
    })
}
MyPromise.reject = function reject (reason) {
    return new MyPromise(function(_,reject){
        reject(reason)
    })
}


var p1 = new MyPromise((resolve,reject) => {
    resolve('ok')
})
p1.then().then((res) => console.log(res))

```

## catch的方法

```js
1. catch 的时候就比较简单了 直接返回一个失败的就好
2. 我们直接调用then 然后第一个参数不传 然后让他走第二个失败的函数
```

```js
catch:function(rejectFunction){
        // xxx.catch(() => {}) => xxx.then(null,() => {})
        return this.then(null,rejectFunction)
}
```

## all方法

```js
1. Promise.all([fn1(),fn2(),fn3(),10]) 返回的也是promise实例 每个参数都是一个promise的实例
2. 只要有一个promise实例 是失败的 那么返回的整个状态就是失败
3. 如果最后都成功了 那么返回就是一个数组 里面是每个实例返回的值
```

```js
MyPromise.all = function(promiseArr) {
    //1. 先缓存下this
    var _this = this
    //2. 最后返回的也是一个promise的实例数组 值是有所有单个实例组成的数组
    return new MyPromise(function(resolve,reject){
        var index = 0 //用来计数
            results = [] //用来存放我们每次promise实例的结果
        //5. 这里我们还需要写一个通知的函数 当我们已经循环完了所有你传进来的数组 就我们就该把结果 拿出去了
        var fire = function () {
            if(index >= promiseArr.length){
                resolve(results)
            }
        }
        for(var i = 0; i < promiseArr.length; i++){
            //3. 这个是每个实例
            var item = promiseArr[i]
            //4. index++ 开始计数
            index++

            //5. 这里开始判断 如果你不是promise实例 那么我们就直接返还给你 并且结束当前 开始下一轮循环
            if(!(item instanceof MyPromise)){
                results[i] = item
                index++
                //看看 循环结束了么 如果结束了 我们就要返回结果了
                fire()
                continue
            }
            //6. 如果不是promise实例 我们就要拿到它的返回结果 放进results
            item.then(function(res){
                results[i] = res
                index++
                fire()
            }).catch(function(reason){
                //7. 这里我们需要注意一下 这里只要有一个失败的 那么整体就失败了
                reject(reason)
            })
            //8.以上那么写 是会有错的 因为 你then 里面是异步的 这个时候循环已经结束了 i 的值 已经变成最后循环那轮结束的了 所以我们需要用闭包包起来 保证i的值是当前的
        }
    })
}
```

```js
// 为了保证i 的准确 所以我们该用闭包的写法
```

```js
MyPromise.all = function(promiseArr) {
    //1. 先缓存下this
    var _this = this
    //2. 最后返回的也是一个promise的实例数组 值是有所有单个实例组成的数组
    return new MyPromise(function(resolve,reject){
        var index = 0 //用来计数
            results = [] //用来存放我们每次promise实例的结果
        //5. 这里我们还需要写一个通知的函数 当我们已经循环完了所有你传进来的数组 并且结果都已经返回了 就我们就该把结果 拿出去了
        var fire = function () {
            if(index >= promiseArr.length){
                resolve(results)
            }
        }
        for(var i = 0; i < promiseArr.length; i++){
            (function(i){
            //3. 这个是每个实例
            var item = promiseArr[i]

            //5. 这里开始判断 如果你不是promise实例 那么我们就直接返还给你 并且结束当前 开始下一轮循环
            if(!(item instanceof MyPromise)){
                results[i] = item
                index++
                //看看 循环结束了么 如果结束了 我们就要返回结果了
                fire()
                return
            }
            //6. 如果不是promise实例 我们就要拿到它的返回结果 放进results
            item.then(function(res){
                results[i] = res
                index++
                fire()
            }).catch(function(reason){
                reject(reason)
            })
            })(i)
            //8.以上那么写 是会有错的 因为 你then 里面是异步的 这个时候循环已经结束了 i 的值 已经变成最后循环那轮结束的了 所以我们需要用闭包包起来 保证i的值是当前的
        }
    })
}
```

```js
1.完整代码
https://github.com/wazer1987/easy_MyPromise
```









