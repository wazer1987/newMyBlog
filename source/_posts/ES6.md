---
title: ES6/ES7/ES8/ES9/ES10/ES11
date: 2020-04-22
updated: 2019-06-03
tags: JavaScript
categories: 原生Js
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

## 环境的搭建

```bash
1.首先我们写的是ES6的语法
2.在html里引入的js文件 是转换之后的 所以我们要用babel转换
3.需要安装的包 npm install -g babel-cli  npm install --save-dev babel-preset-es2015 babel-cli
4.然后在我们的根目录下输入文件夹 .babelrc文件
```

```JS
.babelrc文件 写的是json格式 主要就是告诉babel 我们用哪些插件  去转换
{
    "presets":[
        "es2015"
    ],
    "plugins": []
}
```

```JS
然后输入命令
babel .\src\index.js -o .\dist\index.js
src下的index.js 是你要转换的文件
dist文件夹下是你 转换完成的文件
// 我们本次转换 都需要这么输入文件  所以 我们用package.json 去设置脚本
{
  "name": "ES6",
  "version": "1.0.0",
  "description": "ES6学习",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    //设置命令脚本    
    "babel":"babel ./src/index.js -o ./dist/index.js"
  },
  "keywords": [],
  "author": "wangzheng",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.26.0",
    "babel-preset-es2015": "^6.24.1"
  }
}
```

## 声明方式

```JS
1.我们原来的声明方式 是用var 去声明 但是随着前端工程化的开发 var 会污染我们的全局变量
2.所有又了let 和 const 两种声明方式
3.let 
```

```JS
let 声明方式
let 的这种声明方式我们可以理解为局部声明
let 不能重复声明 而var 可以
var a = 'wangzheng'
{
    let a = 'hanyu'
}
console.log(a)  //输出是 wangzheng
输出的是 'wangzheng' 可以看到 我们的let a 是在{}里面声明的(这里花括号里面就相当与一个作用域) 所以外部的console.log是访问不到的
```

```JS
//let 声明的变量都块级作用域  只在代码块里面有效
{
    let a = '你好'
}
if(){} else{} while{} for
不存在变量提升
//不影响作用域链 
{
    let school = '学校'
    function fn() {
        console.log(school)
    }
    fn() //输出 学校 函数取向上找school这个变量
}
```



```JS
1.const 声明的时候一定要赋初始值
2. 常量值不能修改
3.也是块级作用域
const 声明方式
const 是一种常量声明  声明完之后 是不能赋值 和改变的 针对于对象 我们是可以改变值 
所以这里理解为 const 声明的对象 指针是不可以改变的 
```

## 变量的解构赋值

```JS
就是按照一定的格式 去解构赋值
1.数组的解构赋值
2.对象的解构赋值
3.字符串的解构赋值
```

```JS
数组的解构赋值 左边的结构和右边的结构要一致
let [a,b,c] = [1,2,3]
console.log(a,b,c) //输出 1 , 2 , 3
默认值
let [foo = '123'] = []
console.log(foo)  //输出 默认值 是123
let [a,b='你好'] = ['好的']
console.log(a,b) 输出是 你好  b因为有默认值 输出是 好的
```

```JS
对象的解构赋值
let {foo,bar} = {foo:'你好',bar:'好的'}
console.log(foo,bar) //输出  你好  好的
let foo 
({foo} = {foo:'你好'}) //注意这里要加圆括号
```

```JS
字符串的解构
const [a,b,c,d] = 'wang'
console.log(a,b,c,d) //输出 w  a  n  g
```

对象扩展运算符和rest运算符

```JS
对象扩展运算符 ... 当我们不知道 有多少参数传入进来的时候就可以用
function fn (...arg) {
    //这里的形参就可以用扩展运算符了
}
fn(1,2,3)
let arr1 = [1,2,3]
let arr2 = arr1
arr.push(4)
//这个时候 我们发现 arr1的值也会变 所以 如果我们完全希望得到arr1里面的值 就可以用拓展
let arr2 = [...arr1]
arr2.push(4) //这样arr1的值就不会变了
```

```JS
rest 剩余运算符 当我的函数传入的形参 我不知道是多少个的时候就可以用
function fn (first,...rest){
    //这里 我们的fitst的值 是 0 
    //剩余我们的12345 都在我们的...rest 里 三个点 就表示吧剩余的形参放进了我们的rest形参里
    for(let val of rest){
        console.log(val) //输出是 12345
    }
}
fn(0,1,2,3,4,5)
```

## 字符串模板

```JS
1.语法 就是反引号 你要渲染的变量 要用${变量} 
2.里面支持标签 和 运算
```

```JS
//字符串查找
ES5 
let str = '你好么我很好'
let str1 = '我'
str.indexOf(str1)
ES6
str.includes(str1) 返回就是 true 和 false
str.startsWith(str1) 看看开头有没有
str.endsWith(str1) 看看结尾有没有
//字符串的复制
let str = '你好'
str.repeat(3) //输出结果 就是 你好你好你好  应用场景 就是打注释 或者 栅格符
```

## 数字的操作

```JS
1.声明二进制数据 和 八进制 都是以0开头的
let binary = 0
```

```JS
//判断 一个数 是不是数字
let a = 11/4
Number.isFinite(a)  返回 true
Number.isNaN(NaN) 判断一个数 是不是 非数
Number.isInteger(123) 判断一个数是不是整数
Number.MAX_SAFE_INTEGER //js最大安全值 9007199254740991
Number.isSafeInteger() //判断一个数 有没有超过js的最大安全整数
```

## 箭头函数

```js
1. this 指向是静态的  始终指向函数在声明时 所在 作用域下的 this 的值
2.  不能作为 构造函数使用
3. 不能使用arguments  变量  没有实参列表
4. 还能减写  当形参只有一个的时候 可以胜率小括号 当函数体只有一行的时候 可以省略花括号
5. 箭头函数 不适合 和this有关的回调 去使用 比如dom元素的事件回调
ad.addEventListener('cilck',function(){这里就不适合使用箭头函数 使用之后this 就指向window了 拿不到当前的事件源})
比如 对象的方法 也不适合
```

```JS
function getname() {
  console.log(this.name)    
}
const getname1 = () => {
    console.log(this.name)
}
window.name = '你好'
const school = {
    name:'nihao'
}
getname() //输出 你好
getname1() //输出 你好
//通过call 去改变 this的指向 去指向school
getname().call(school) // 输出是 nihao
getname1().call(school) // 而箭头函数 输出的还是 你好  //因为他是在window的作用域下生成的
```

## 迭代器

```JS
1.迭代器(iterator) 是一种接口 为各种不同的数据结构 提供统一的访问机制 任何数据结构 只要部署interator 就可以完成遍历 
2. ES6 创造了一种新的遍历命令 for of 循环 只要有 iterator接口的数据结构 都可以使用 for of 循环遍历
3. 原生具备interator接口的数据 Array Arguments Set Map String TypedArray NodeList
```

```JS
迭代器的应用 用来自定义遍历数据 也就是按照我们自己的意愿 去遍历
const banji = {
    name:'终极一班',
    stus:[
        'xiaoming',
        'xiaoning',
        'xiaotian',
        'knight'
    ]
}
for(let val of banji){
    console.log(val) //报错  banji is not iterableat
}
//因为了个班级的对象是我们自己定义的 我们也没有部署 interator接口 所以 使用for of 遍历不了
现在要按照自己的意愿 去遍历 stus 每次只返回一个
<script>
const banji = {
    name:'终极一班',
    stus:[
        'xiaoming',
        'xiaoning',
        'xiaotian',
        'knight'
    ],
    //先部署接口 
    [Symbol.iterator](){
        let index = 0
        let _this = this
        //接口必须返回一个对象
        return {
            //对象里面必须设置一个next的函数
            next:function(){
                if(index < _this.stus.length){
                    //返回的值就是这些 done 就是结束的
                    const res = {value: _this.stus[index],done:false}
                    index++
                    return res
                }else{
                    return {value:'undefined',done:true}
                }  
            }
        }
    }
}
//然后就可以调用for of 循环去遍历了
for(let val of banji){
    console.log(val)
}
</script>
```

## 生成器函数

```JS
//生成器其实就是一个特殊的函数 异步编程 纯回调函数 一种新的解决方案
1.声明方式
function * gen(){}
2.结果不会立即输出
function * gen(){ console.log('hello gennerator') }
let interator = gen() //gen {<suspended>} 输出这个东西 一个迭代器对象 有一个next 方法可以执行里面的函数
interator.next() //输出了上面的函数体的内容
3.生成器函数里面 可以写 yield 语句 yield 就是把生成器代码分割 然后使用next 去执行
function * gen(){ 
    console.log(111)
    yield '------'    //分割代码 现在写了三个yield 把代码分割成了四块
    console.log(222)
    yield '------'
    console.log(333)
    yield '------'
    console.log(444)
 }
let interator = gen() //
interator.next() //这里首先输出 yield的分割第一段代码 也就是会输出 111 返回值是一个对象 {value:'yield语句',done:false}
interator.next()  //执行第二段被分割的代码 输出 222  以此类推
//生成器 函数 可以使用 for of 去遍历
for(let key of gen()){
    console.log(key) //这里输出的是yield 里面写的语句 
}
```

## 生成器函数的参数传递

```JS
function * gen(arg){ 
    console.log(arg)
    yield '------'
    console.log(222)
    yield '------'
    console.log(333)
    yield '------'
    console.log(444)
 }
let interator = gen('AAA') //
interator.next() //打印输出 'AAA'
console.log(interator.next())
//next 方法 可以传递实参
function * gen(arg){ 
    console.log(arg)
    yield 111
    let one = yield 111  
    console.log(one)
    yield '我是第二个yield'
    console.log(333)
    yield '我是第三个yield'
    console.log(444)
 }
let interator = gen('AAA') //
console.log(interator.next())
console.log(interator.next('BBB'))  //每次next传递的参数将是上一个yield的返回值
console.log(interator.next())
```

## 生成器函数实例

```JS
//生成器函数就是为了解决异步变成中的回调地狱 
1s 输出 111 2s输出222 3s 后输出 333  下面就是用定时器的写法 如果业务代码很长的话 就不是很好维护
setTimeout(() => {
            console.log(111)
            setTimeout(() => {
            console.log(222)
            setTimeout(() => {
            console.log(333)  
        },3000)
        },2000)
        },1000)
//生成器函数 写法
function one () {
    setTimeout(() => {
        console.log(111)
        //2.然后在调用下一个two函数
        interator.next()
    },1000)
}
function two () {
    setTimeout(() => {
        console.log(222)
        //3.调用three函数
        interator.next()
    },2000)
}
function three () {
    setTimeout(() => {
        console.log(333)
    },3000)
}
function * gen () {
    yield one()
    yield two()
    yield three()
}
let interator = gen()
//1.先调用开始的函数 one
interator.next()
```

```JS
//获取用户数据 订单数据 商品数据 有先后顺序的
function getUsers() {
    setTimeout(() => {
        let data = '用户数据'
        interator.next(data) //这是第二次掉next 函数 会把你传递的参数 给第一个yield的语句的返回值
    },1000)
}
function getOrders() {
    setTimeout(() => {
        let data = '订单数据'
        interator.next(data) //第三次调next 函数 会把你传递的参数 给第二个yield语句的返回值
    },1000)
}
function getGoods() {
    setTimeout(() => {
        let data = '商品数据'
    },1000)
}
function * gen () {
    const userData = yield getUsers()
    console.log(userData) //第二次调取next的传递的参数
    const ordersData = yield getOrders()
    console.log(ordersData)
    yield getGoods()
}
let interator =  gen()
interator.next()

```

## Promise

```js
Promise 是一个构造函数 用来封装异步操作并可以获取其成功或失败的结果
const p = new Promise((resolve,reject) => {
    //这是异步操作
    setTimeout(() => {
        let data = '数据库中的用户数据'
        resolve(data)
        let err = '读取失败'
        rejject(err)
    },1000)
})
//成功和失败不能同时存在 这里是为了掩饰清楚才这么写
p.then(function(成功的形参走第一个函数){},function(失败的形参会走第二个函数){})
```

```JS
then 方法 的返回结果 是promise 对象 
1.如果你在then方法里返回的是一个非promise对象类型 那么状态未成功  返回值 就是 你成功的值
2.如果是Promise 对象  你接收的变量 还是要用then去使用
```

```JS
catch 方法 用来指定Promise 失败的方法
const p = new Promise((resolve,reject) => {
    setTimeout(() => {
        reject('失败了')
    })
})
p.catch((res) => {
    console.warn(res)
})
```

## Promise.allSettled 和 Promise.all

```JS
1.可以用来返回多个Promise对象的数组
const p1 = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('商品数据-1')
    })
})
const p2 = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('商品数据-2')
    })
})
const res = Promise.allSettled([p1,p2])
console.log(res)
//输出如下 整体式成功的 如果单个Promise 有失败的情况 下面的status字段就会从fulfilled 变成 rejected
__proto__: Promise
[[PromiseStatus]]: "resolved"
[[PromiseValue]]: Array(2)
0: {status: "fulfilled", value: "商品数据-1"}
1: {status: "fulfilled", value: "商品数据-2"}
length: 2
__proto__: Array(0)
2.Promise.all 和上面的相反 必须都成功 整体才成功 如果有一个失败的 整体就都失败了
```

## 可选连操作符

```JS
1.用于深层的对象取值 
//如下 我们想把config的db里的hostq取值出来 
 function main(config){
    const host = 
}
main({
    db:{
        host:'1111'
    },
    cath:{
        host:'222'
    }
})
//传统做法
function main(config){
    //这里 如果你没传入config就会报错
    const host = config && config.db && config.host
    console.log(host)
}
main({
    db:{
        host:'1111'
    },
    cath:{
        host:'222'
    }
})
// 可选连操作符
 function main(config){
    //先看看 你config有没有 在看看 有没有db 在看又没有host 如果你下面的没有传入 那么就式undefined不会报错 阻碍程序运行 
    const host = config?.db?.host
    console.log(host)
}
main({
    db:{
        host:'1111'
    },
    cath:{
        host:'222'
    }
})    
```



## 数组的操作

```JS
1.JSON的数组格式
let json = {'0':'我是0','1':'我是1','2':'我是2', length:3} //json 的数组格式
//也可以把伪数组变成数组
const arr = Array.from(json) //输出就是 ['我是0',我是1','我是2'] 
console.log(Array.from('foo'));
// expected output: Array ["f", "o", "o"]
console.log(Array.from([1, 2, 3], x => x + x));
// expected output: Array [2, 4, 6]
2.把字符串转成数组 也可以字节传换字符串
let arr = Array.of(2,3,4,5)  //输出 就是 [2,3,4,5]
```

```JS
find() 实例方法 用于查找数组里的某个元素 返回值  是当前满足条件的元素
let arr = [1,2,3,4,5]
arr.find((val,index,arr) => {
    val 就是数组的每个值
    index 每个值的索引
    arr 数组本身
    return val > 5
})
```

```JS
fill() 数组的填充替换方法 IE 11 及更早版本不支持 fill() 方法。 会改变原有数组
let arr = ['你好','好的','再见']
//这里的位置 就是 单纯我们的看见数组的个数 而不是下标
arr.finll('你要替换成什么','开始替换的位置','结束填充的位置')
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.fill("Runoob", 2, 4); //从第二个之后开始替换 一致替换到第四个
//输出 Banana,Orange,Runoob,Runoob
```

```JS
for(let item of arr){} 循环 可以遍历字符串 映射Maps Set集合等数据解构
for(let item of arr) {
    console.log(item) //数组的每个值
}

var fruits = ["Banana", "Orange", "Apple", "Mango"];
for(let item of fruits.keys()){
    console.log(item) //用keys方法 输出了数组的索引
}
//使用了 entries 来输出了索引的数组的索引 和每个元素
var fruits = ["Banana", "Orange", "Apple", "Mango"];
for(let [index,val] of fruits.entries()){
    console.log(index,val)
}

const iterable = new Map([['one', 1], ['two', 2]]);
//iterable的值
 Map(2) {"one" => 1, "two" => 2}
[[Entries]]
0: {"one" => 1}
1: {"two" => 2}
size: 2
__proto__: Map

for (const [key, value] of iterable) {
  console.log(`Key: ${key} and Value: ${value}`);
}
// Output:
// Key: one and Value: 1
// Key: two and Value: 2

const iterable = new Set([1, 1, 2, 2, 1]);
 
for (const value of iterable) {
  console.log(value);
}
// Output:
// 1
// 2
```

```JS
entries()  数组方法
const arr = ['你好','好的','再见']
let list = arr.entrise() //这里生成的值是看不到 但是在循环中可以起作用 暂时可以理解为 生成了一个由索引和元素组组成的新数组
[0,'你好'] [1,'好的'] [2,'再见'] 
//会把数组生成一个 ArrayIterator{} 支持我们的手动循环
list.next().value //手动循环 [0,'你好']
//这里里的空隙 就可以写的别的操作
list.next().value //手动循环 [1,'好的']
list.next().value //手动循环 [2,'再见']
```

## forEach

```JS
forEach((item,index,arr) => {}) 
//如果数字里面的元素 是基本数据类型 是改变不了原有数组的
const array = [1, 2, 3, 4];
array.forEach(ele => {
ele = ele * 3
})
console.log(array); // [1,2,3,4]
//如果数组里面是 复杂数据类型 比如对象 是可以改变的 因为保存的是指针
const objArr = [{
    name: 'wxw',
    age: 22
}, {
    name: 'wxw2',
    age: 33
}]
objArr.forEach(ele => {
    if (ele.name === 'wxw2') {
        ele.age = 88
    }
})
console.log(objArr); // [{name: "wxw", age: 22},{name: "wxw2", age: 88}]


//如果改变单个item也是改变不了的
const changeItemArr = [{
    name: 'wxw',
    age: 22
}, {
    name: 'wxw2',
    age: 33
}]
changeItemArr.forEach(ele => {
    if (ele.name === 'wxw2') {
        //单个对象的引用 没有改变指针 值 是改变不了的
        ele = {
            name: 'change',
            age: 77
        }
    }
})
console.log(changeItemArr); // [{name: "wxw", age: 22},{name: "wxw2", age: 33}]
//如果非要改变 就只能通过索引去改变了

// 基本类型可以欧~
const numArr = [33,4,55];
numArr.forEach((ele, index, arr) => {
    if (ele === 33) {
        arr[index] = 999
    }
})
console.log(numArr);  // [999, 4, 55]

// 引用类型也可以欧~
const allChangeArr = [{
    name: 'wxw',
    age: 22
}, {
    name: 'wxw2',
    age: 33
}]
allChangeArr.forEach((ele, index, arr) => {
    if (ele.name === 'wxw2') {
        arr[index] = {
            name: 'change',
            age: 77
        }
    }
})
```

## filter

```JS
//有返回值 返回值是满足条件的新数组 这里改变数组的和上面的forEach 一样
注意： filter() 不会对空数组进行检测。
注意： filter() 不会改变原始数组。
 const arr = [1,2,3,4,5,7]
console.log(arr.filter(item => item >3))  // [4,5,6]  这里如果没有符合条件的 想返回空的数组
```

## some

```js
some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
some() 方法会依次执行数组的每个元素：
如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
如果没有满足条件的元素，则返回false。
注意： some() 不会对空数组进行检测。
注意： some() 不会改变原始数组。
const arr = [1,2,3,4,5,7]
console.log(arr.filter(item => item == 3))  输出为true 看看数组中有没有等于3的元素存在
```

## map

```JS
map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
map() 方法按照原始数组元素顺序依次处理元素。
注意： map() 不会对空数组进行检测。
注意： map() 不会改变原始数组。
map 会返回一个信的数组 数组里面都是满足你条田的值 如果不满足 新的数组的每个元素就会返回undefind
const arr = [1,2,3,4,5,7]
console.log(arr.map(item => item > 3)) //[false,false,false,true,true,true]
const arr = [1,2,3,4,5,7]
console.log(arr.map(item => {
    if(item >3){
        return item 
    }
}))   // [undefined, undefined, undefined, 4, 5, 7]
//可以理解为一种替换

const arr = [1,2,3,4,5,7]
console.log(arr.map(item => {
    return '你好'
}))   // ["你好", "你好", "你好", "你好", "你好", "你好"]
```

## includes ES7

```JS
1.用来判断数组种包含不包含某个元素 如果包含 返回true 如果不包含 返回false
const mingzhu = ['西游记','红楼梦','三国演义','水浒传']
console.log(mizhu.includes('西游记')) 返回为true
```

## flat 和 flatMap ES10

```JS
1.用来降低数组的维度 比如三维数组 转 二维数组 
//二维数组 转 一维
const arr = [1,2,3,4,[5,6]]
console.log(arr.flat()) //输出结果(6) [1, 2, 3, 4, 5, 6]
//三维 转 二维
const arr = [1,2,3,4,[5,6,[7,8]]]
console.log(arr.flat()) //输出结果(6) [1, 2, 3, 4, 5, 6,[7,8]]
//如果想把三维转以为 可以在参数里输入深度
const arr = [1,2,3,4,[5,6,[7,8]]]
//这里输入深度即可
console.log(arr.flat(2)) //输出结果(6) [1, 2, 3, 4, 5, 6,7,8]
2.把flatMap 把遍历之后的形成的 二维数组降低维度
const arr = [1,2,3]
const res = arr.map( item => item * 10) //res [10,20,30]
const res = arr.map( item => [item * 10])  //res [[10],[20],[30]]
//如果此时我想把上面产生的数组的维度降低
const res = arr.flatMap(item => [item * 10])//res [10,20,30]
```



## 字符串的方法 trimStart() 和 trimEnd()

```JS
1.主要用来清楚一个字符串左右的空白 trim是清除 两侧的
let str = '    i  love you  '
console.log(str.trim())  //两侧全部清楚
console.log(str.trimStart()) //清除了开始
console.log(str.trimEnd()) //清除了结束
```



## async 和 await ES8

```JS
1.async 函数 的返回值 为Promise 对象
2.Promise对象的结果由async 函数执行的返回值决定
async function fn() {
    return '你好'
}
const res = fn()
console.log(res) //这里输出是返回一个Promise对象 并不是'你好'
```

```JS
3.await 必须写在async函数里 
await 右侧 的表达式一般为promise对象
await 返回的是promise 成功的值
await 的promise 失败了 就会抛出异常 需要通过try .catch 捕获去处理
```

## Object.values 和 Object.entries ES8

```js
Object.values()方法 返回一个给定对象所有可枚举属性值的数组
const school ={
    name:'学校',
    cities:['北京','上海','深圳'],
    xueke:['美容美发','挖掘机']
}
//获取一个对象所有的键
console.log(school.keys()) //输出 是一个对象所有的键名组成的数组
console.log(school.values())//输出 是对象所有的键值 组成的数组
Object.entries() 方法 返回一个给定对象自身可便利属性的[key.value]的数组
console.log(Object.entries(school)) //输出结果是由 键 和键值 组成的数组
Array(3)
0: (2) ["name", "学校"]
1: (2) ["cities", Array(3)]
2: (2) ["xueke", Array(2)]
length: 3
__proto__: Array(0)
//这样的数据结构方便我们去创建map
const m = new Map(school) 这样就创建了一个map
对象的属性描述对象
我们在用Object.create()创建对象的时候 可以对一个对象去表述 其中可以设置这个对象是否能克隆之类的
所以可以用 Object.getOwnPropertyDescriptors(school)
//输出是下面那样
{name: {…}, cities: {…}, xueke: {…}}
name:
value: "学校"
writable: true
enumerable: true
configurable: true
__proto__: Object
cities:
value: (3) ["北京", "上海", "深圳"]
writable: true
enumerable: true
configurable: true
__proto__: Object
xueke: {value: Array(2), writable: true, enumerable: true, configurable: true}
__proto__: Object
```



## 函数的操作

```JS
function add (a,b = 1){} 形参可以设置默认值
//也可以获取到你传递参数的个数
add.length //这里是你传递实参的个数
```

## 对象和数组的函数解构

```JS
const obj = {a:'你好',b:'再见'} 
//现在要在函数里打印出来a和b 以前的写法肯定就是去循环 现在就可以用解构
function fn ({a,b}) {
    console.log(a,b)  //这个时候由于我们把对象解构了 所以就直接打印出来了
}

let arr = ['你好','好的','再见']
function fn (a,b,c){ console.log(a,b,c) }
fn(...arr)
```

## in的用法

```JS
//判断某个值 在不在 对象或者数组里
let obj = {a:'你好',b:'好的'} console.log('a' in obj) //返回为true
//数组的判断是根据索引去判断 如果 你的数组每个值都是空的 那么返回为false
let arr = [,,,] //数组是由长度的 但是每个元素都是空的
console.log(0 in arr) 返回是 false 
```

## 对象的key值构建

```JS
1.当我们的对象不知道key 是什么的时候 可以采用key值构建
let key = 'skill' 假设这里skill字段就是后台取出来的
const obj = {
    [key] :'web'
}
console.log(obj) // obj{skill:'web'}
```

## Object.is()

```JS
//判断两个值是否相等
Object.is() 方法  对两个对象 进行比较
const obj1 = {name:'你好'}
const obj2 = {name:'你好'}
Object.is(obj1.name,obj2.name) //true
console.log(object.is(NaN === NaN)) // 为true
```

## Object.assign() 合并对象

```JS
const obj1 = {name:'你好'}
const obj2 = {name1:'你好1'}
const obj3 = {name2:'你好2'}
console.log(Object.assign(obj1,obj2,obj3)) //输出{name: "你好", name1: "你好1", name2: "你好2"}
console.log(obj1) //输出{name: "你好", name1: "你好1", name2: "你好2"} 
//这里上面就相当于 把obj2 和 obj3 都向 obj1合并了
console.log(Object.assign({},obj1,obj2,obj3)) //改成这样就没问题了 obj1 就不会改变
```

## Object.setPrototypeOf 设置原型对象 

```JS
const school = {
    name:'尚硅谷'
}
const cities = {
    xiaoqu:['北京','上海','深圳']
}
console.log(school) //看到原型应该是Object
Object.setPrototypeOf(school,cities) //这里就设置了school的原型 为cities
Object.getPrototypeOf // 获取原型对象
```

## object.fromEntries  ES10

```JS
1.用来创建一个对象
2.接收一个二维数组
3.和Object.entries相反 Object.entries是把对象转换为二维数组
const res = Object.fromEntries([
    ['name','王正'],
    ['skill','web,js,node']
])
console.log(res)  //输出对象 {name: "王正", skill: "web,js,node"}	
```

## Symbol 新增的数据类型

```JS
1.Symbol 的值 是唯一的 用来解决变量命名冲突的问题
2.Symbol 值 不能与其他数据进行运算
3.Symbol 定义的对象属性不能使用for in 循环遍历出来 但是可以使用Reflect.ownKeys 来获取对象所有的键名
```

```JS
1.是一种全局的原始数据
数据类型的特点是唯一性，即使是用同一个变量生成的值也不相等。 括号里面是输入的你对这个Symbol数据的描述详情
如果想要获取描述详情 
 let id1 = Symbol('id'); //id1.description即可 就能获取你在创建Symbol的时候的描述
 let id2 = Symbol('id');
 console.log(id1 == id2);  //false
Symbol 数据类型的另一特点是隐藏性，for···in，object.keys() 不能访问
 let id = Symbol("id");
 let obj = {
  [id]:'symbol'
 };
 for(let option in obj){
     console.log(obj[option]); //空
 }
在创建symbol类型数据 时的参数只是作为标识使用，所以 Symbol() 也是可以的
//用例 当不希望别人知道 对象里的一个值的时候
比如下面 我不希望下面对象的age
let obj = {name:'你好',skill:'web'}
const age = Symbol()
obj[age] = 18
for(let key in obj){
    console.log(obj[key]) //这个时候 是输出不了18的
}
```

## Set 和 WeakSet 数据结构类型

```JS

1.Set 是一种数据解构 里面是数组 不允许有重复的值
let setArr = new Set(['你好','好的','web'])
console.log(setArr) //输出 {'你好','好的','web'}
//增加值
setArr.add('再见') //追加一个值  delete删除
//查找
setArr.has('你好') //返回true
//循环输出
for(let key of setArr){console.log(key)}
forEach 也可以
//长度用size
setArr.size
```

```JS
WeakSet() //用来存放对象 不可以在括号里直接使用 要用add 添加
let weakObj = new weakSet({a:'你好'}) //报错
//只能通过add去添加
let weakObj = new weakSet()
const obj = {name:'你好'}
weakObj.add(obj)
weakObj // WeakSet {Object {name:'你好'}}
```

## set集合实践

```JS
let arr = [1,2,3,4,5,4,3,2,1]
1.数组去重
let res = [...new Set(arr)]
2.求交集
let arr2 = [4,5,6,5,6]
let res = [...new Set(arr)].filter(item => {
    let s2 = new Set(arr2)
    if(s2.has(item)){
        return true
    }else{
        return false
    }
})
console.log(res) //输出 [4,5]
3.两个数组的并集
let union = [...new Set([...arr,...arr2])]
4.差集 就是求两个数组里没有元素 如果数组1里有123 数组2里有345 两个数组共同的元素是3 如果是数组1差数组2 就是45 数组2差数组1 就是12
let diff = [...new Set(arr).filter( item => !(new Set(arr2).has(item)))] 
console.log(diff) //返回结果是[1,2,3] 因为这几个元素 在数组arr2里是没有的
```



## map数据结构类型

```JS
JSON的数据类型  
let json = {name :'你好',skill:'web'}
//当我们访问json.name的时候 其实是要循环的 
声明map
let map = new Map()
map.set(json,'iam') //增加
//这里输出结果如下 就相当于 我们的json 为key  值 是iam
console.log(map) // Map{ Object {name:'你好',skill:'web'} => 'iam'}
值和key 是可以相互灵活的
//取值
map.get(json) //输出 iam
//删除特定的值
map.delete(json) 
//删除全部
map.clear()
// 有多少数据
map.size
//查找
map.has(json) //返回 true 或者 false
```

## proxy 代理

```JS
1.主要是增加 对象和函数 就相当于一个钩子函数 在真正的方法执行之前 先预处理
let obj = { add(val){ return val + 100},name:'I am king'}
let pro = new Proxy({这里写你要预处理的对象},{这里写你要怎么预处理})
```

```JS
//当我们访问对象里面的key 的时候 会触发proxy 的 get方法
let obj = {
    add(val){
        return va; + 100
    },
    name: 'I am King'
    }
    let pro = new Proxy(obj,{
    get(target,key,prox){
        console.log(target) //就是我们传进来的obj
        console.log(key) //可以 就是当你pro.name的时候 访问的key
        console.log(prox) //整个代理对象
        return target[key]
    }
    })
    console.log(pro.name)
```

```JS
// 当我们设置对象里面的值的时候 会触发 proxy的 set方法
let obj = {
            add(val){
                return val + 100
            },
            name: 'I am King'
        }
        let pro = new Proxy(obj,{

            set(target,key,val){
                console.log(target)  //就是我们传进来的obj
                console.log(key) //可以 就是当你pro.name的时候 访问的key
                console.log(val) //你设置的值
                console.log(receiver) //整个代理对象
                //这个时候 就可以做劫持
                return target[key] = val
            }
        })
        pro.name = 'lisi'
```

```JS
//apply 用来改变方法
let target =  function () {
    return '你好'
}
let handler = {
    apply(target,ctx,args){
        console.log('do apply')
        //可以劫持函数
        return Reflect.apply(...arguments)
    }   
}
let pro = new Proxy(target,handler)
console.log(pro())
```

## class类 ES7

```JS
1.ES5的方式 用构造函数 去声明一个对象
function Phone(brand,price){
    this.brand = brand
    this.price = price
}
Phone.prototype.call = function () {
    console.log('我可以打电话')
}
//实力化对象
let huawei = new Phone('华为',5999)
huawei.call() //输出我可以打电话
2.ES6的声明
class Phone {
    //我们在new的时候 会自动执行这个constructior 方法
    constructior(brand,price){
        this.brand = brand
    	this.price = price
    } //注意这里没有逗号 没有逗号
    //方法必须使用改语法 不能使用ES5的对象完整形式 call:function 这种不支持
    call() {
        console.log('我可以打电话')
    } 
}
let huawei = new Phone('华为',5999)
```

## 静态成员

```JS
1.首先我们知道 函数也是一个对象
function Phone(){

}
2.所以我们向上面添加 成员 name 和方法
Phone.name = '手机'
Phone.change = function () {
 console.log('我可以改变世界')
}
3. 然后我们在new 出来
let nokia = new Phone() //这里我们new 出来是一个实例对象 而我们上面的操作 只是向函数对象上添加了东西 这两个是不通的 所以会导致下面我们实力化对象的时候 访问不到 你向函数对象里面添加的一些东西
console.log(nokia.name) //undefined
nokia.change() //报错
4. 我们的实力化对象 其实跟我们的构造函数的原型是相同的
Phone.prototype.size = '5.5inch'
console.log(nokia.size) //输出 5.5inch
```

```JS
所以 我们每个函数对象 都可以由自己的属性 但是当你作为实例的时候访问不到 因为这些属性 只属于我们自己的函数对象
class Phone {
    //声明 函数自己的静态成员 用static声明的属性 指数徐我们自己构造函数 你实力化对象的时候 实例对象是访问不到的
    static name = '手机';
    static change = function () {console.log('我可以改变世界')}
}
let nokia = new Phone()
console.log(nokia.name) //访问不到的 因为你是访问不到函数对象里的成员的
console.log(Phone.name) // 手机 因为我们是用Phone 也就是函数对象 访问自己的成员 能打印出来
```

## 对象继承

```JS
ES5 的继承方法
function Phone (brand,price){
        this.brand = brand
        this.price = price
    }
    Phone.prototype.call = function(){
        console.log('我可以打电话')
    }
    //只能手机
    function SmartPhone (brand,brand,color,size){
        //这里为了把我们上面的颜色 和价格都继承过来  改变了this的指向
        Phone.call(this,brand,brand)
        this.color = color
        this.size = size
    }
    //设置子集构造函数的原型 
    SmartPhone.prototype = new Phone
    //为了能分辨 到底是哪个构造函数构造出来的
    SmartPhone.prototype.constructor = SmartPhone
    //设置自己的方法
    SmartPhone.prototype.photo = function () {
        console.log('我能拍照')
    }
    let shouji = new SmartPhone('锤子',199,'red',5.5)
    shouji.call()
    console.log(shouji)
```

```JS
ES6 类的继承
class Phone {
    constructor(brand,price){
        this.brand = brand
        this.price = price
    }
    call(){
        console.log('我可以打电话')
    }
}
//现在继承父类 使用 extends 关键字
class SmartPhone  extends Phone{
    //先声明自己的构造器
    constructor(brand,price,color,size){
        //我们上面使用了 extends关键字 下面的super就相当于调取了Phone的constructor方法
        super(brand,price) 
        this.color = color
        this.size = size
    }
    //然后在声明自己的方法
    photo(){
        console.log('我可以拍照')
    }
}
```

## class 的 get 和 set

```JS
1.这里可以理解我们的对象里的数defindPrototy 数据劫持 是一个道理 当我们当问 类里面的某一个成员的时候 如果这个成员设置了get 和 set 关键字 就可以做到劫持
class Phone {
    get price(){
        console.log('价格被读取了')
        return 'i love you'
    }
    set price(newval){
        console.log('价格被设置了')
        console.log(newval)
    }
}
let s = new Phone()
s.price  //这里会走我们设置get关键字的那个函数
s.price = 'free' // 这里会走我们设置set 的那个函数
```

## 对象的私有属性

```JS
1.声明私有属性之后 外部访问不到 只能在内部才可以使用
class Prsion {
    name  //这里是设置了共有属性
    #age  //加了 # 号 就是设置了 私有属性
    #weight //加了 # 号 就是设置了 私有属性
    constructor(name,age,weight){
        this.name = name
        this.#age = age
        this.#weight = weight
    }
	say(){
        console.log(this.#age)
    }
}
//实例化对象 
const gril = new Prsion('小红',18,55)
//在外部是访问不到的
console.log(gril.#age) //这个时候输出是报错的
//写在内部可以访问到 比如我调取了say方法
gril.say()
```



```JS
//声明类
class Coder {
    //注意这里面方法 和 方法 之间不要写逗号
    name(val) { console.log(val)}
    skill(item) { console.log(item)}
}
let prsen = new Coder
prsen.name('名字')
```

```JS
//class 里的this 值得整个class的作用域
class Coder {
    //注意这里面方法 和 方法 之间不要写逗号
    name(val) { console.log(val) return val //注意这里一定要有返回值}
    skill(item) { console.log(item) this.name('你好')+ item}
}
let prsen = new Coder
prsen.skill('面对疾风') // 输出 你好面对疾风
```

```JS
//contructor 用来接收创建实例类的时候参数
class Coder {
    name (val){
        console.log(val)
        return val
    }
    skill(item){
        console.log(this.name('你好') + item)
    }
    //构造器
    constructor(a,b){
        this.a = a
        this.b = b
    }
    add(){
        console.log(this.a + this.b)
    }
}
let prse = new Coder('我来了','我走了')
prse.add() //输出   我来了我走了
```

```JS
//继承 extends
class Coder {
    name (val){
        console.log(val)
        return val
    }
    skill(item){
        console.log(this.name('你好') + item)
    }
    //构造器
    constructor(a,b){
        this.a = a
        this.b = b
    }
    add(){
        console.log(this.a + this.b)
    }
}
class Coder {
    name (val){
        console.log(val)
        return val
    }
    skill(item){
        console.log(this.name('你好') + item)
    }
    //构造器
    constructor(a,b){
        this.a = a
        this.b = b
    }
    add(){
        console.log(this.a + this.b)
    }
}

//使用extends继承 Coder
class Htmler extends Coder{

}
const htm = new Htmler(1,2)
htm.add()
```

## 数值扩展

```JS
0.Number.EPSILON 属性 主要用于浮点数的精确计算 这个属性接近于2.2204----------16
console.log(0.1+0.2) //输出是 0.30000000-----4 这样是不科学的
function equal(a,b){
    //这里就是 认为 两个数值相减 如果小于 Number.EPSILONG 就说明你们两个是相当的
    if(Math.abs(a-b) < Number.EPSILONG){
        return true  
    }else{
        return false
    }
}
console.log(equal(0.1 + 0.2, 0.3)) 返回是true
1. 二进制 和 八进制
let b = 0b1010 二进制 是0b开头
let o = 0o777 八进制 是0o开头
2.Number.isFinite 监测一个数值是否为有限数
console.log(Number.isFinite(Infinity)) //fanse
3.Number.parseInt() //转换为整数  Number.parseFloat() 转换为浮点数
Number.parseInt('5111love') //5111
Number.parseFloat('5.111love') //5.111
4.Number.isInteger() //判断一个数组是否为整数
console.log(Number.isInteger(3.33)) //false
5.Math.trunc //将数组的小数部分去掉
6.Math.sign // 判断一个数到底是正数 返回1 0的话返回0 负数返回 -1
```

## 模块化操作

```JS
ES6之前的模块化规范由
CommonJS => NodeJS Browserfy
AMD => requireJS
CMD => seaJS
```

## 模块暴露 模块导入

```JS
m1.js文件
1.分别暴露
export let school = '三小'
export function teach () { console.log('我可以教会你们技能')}
2.统一暴露
export let school = '三小'
export function teach () { console.log('我可以教会你们技能')}
export {
	school,
    teach
}
3.默认暴露
export default {
    school,
    teach
}
index.html文件 现在需要导入m1.js文件 以前是用 script 的 src 直接引入 现在就要变一下了
<script type="module">
    1.第一种引入方式 把你所有暴漏的出来的方法和变量 全部引入并且存在m1对象种
    import * as m1 from './scr/m1.js' //无论哪种方式 都可以用 这种方式去引入
	//使用 m1.name
	2.第二种引入方式 和上面一样
     import {schhol as xuexiao,teach} from './scr/m1.js' //第二种引入形式 可以重新命名
	3.第三种引入方式 
    import {default as m3} from './scr/m1.js'
	//使用 m3.default.teach()  因为你上面的是用export default 暴漏的 在使用的时候也要加default使用
</script>
```

```JS
//引入的第二种方法
我们在index.html里 还是用script标签 去引入一个入口文件app.js  然后app.js 使用我们上面的几种方法 去引入 对应的JS文件
<script src="./src/app.js" type="module"></script>
app.js
import * as m1 from './scr/m1.js'
import * as m2 from './scr/m2.js'
```

## import 动态引入

```JS
1.比如我们有三个文件  当我们点击按钮的时候才希望加载其中的一个文件
const btn = document.getElementById('btn')
btn.onclick = function () {
    //只有当我们点击按钮的时候 才希望触发 hello文件里的 hellow方法 所以就可以使用下面的方式 
    import('./hello.js').then( item => {
        item.hellow()
    })
}
```



## 正则-命名捕获分组 ES9

```JS
1.需要对a标签里面的href 和 文本进行提取
传统的方式
let str = '<a href="www.baidu.com">百度</a>'
const reg = /<a href="(.*)">(.*)<\/a>/
const res = reg.exec(str)  返回值 是一个 数组 一共由三个元素 第一个 是你整个字符串本身 第二个 是 你第一个(.*)里的东西 第三个是 是你第二个(.*)通配里面的东西
(3) ["<a href="www.baidu.com">百度</a>", "www.baidu.com", "百度", index: 0, input: "<a href="www.baidu.com">百度</a>", groups: undefined]
0: "<a href="www.baidu.com">百度</a>"
1: "www.baidu.com"
2: "百度"
index: 0
input: "<a href="www.baidu.com">百度</a>"
groups: undefined
length: 3
__proto__: Array(0)
//命名捕获 跟上面写法差不多 只要是给你要捕获的内容 写个名字 这些你些名字的捕获都会放在groups里
let str = '<a href="www.baidu.com">百度</a>'
const reg = /<a href="(?<url>.*)">(?<text>.*)<\/a>/
const res = reg.exec(str)
//下面的group
(3) ["<a href="www.baidu.com">百度</a>", "www.baidu.com", "百度", index: 0, input: "<a href="www.baidu.com">百度</a>", groups: {…}]
0: "<a href="www.baidu.com">百度</a>"
1: "www.baidu.com"
2: "百度"
index: 0
input: "<a href="www.baidu.com">百度</a>"
//在这里 我们命名的 都被存到这里了
groups:
url: "www.baidu.com"
text: "百度"
length: 3
__proto__: Array(0)
```

## 正则-反向断言 ES9

```JS
1.提取字符串里面的数组 比如一个字符串里存在两段数字 而你只想提取某一段 就可以通过判断 你向提取数字的前面或者后面的字符串 去做正向断言 和反向断言的提取
let str = 'js5211314你知道么555拉拉'
//正向断言 我们现在向提取555这个数字 可以通过在些正则的时候 去看看他后面的字符串 来提取
let reg = /\d+(?=拉)/ 正向断言 看看我要提取的数字后有没有拉字 有拉字的我才提取
let res = reg.exec(str)
//反向断言 刚好相反 就是提取你要提取的数字前面的一个字符串
let reg = /(?<=么)\d+/
```



