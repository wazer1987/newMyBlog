---
title: NodeJs 
date: 2019-03-25
updated: 2019-06-03
tags: Node
categories: Node 
keywords: Node
description: Node
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

# node 基础

## node的常用模块

```bash
1.核心模块 global buffer module process 
2.内置模块 os fs path http event
```

```JS
1.核心模块
buffer 主要处理二进制数据流 alloc from write contact toString
module 比如 require(引入模块) module.exports(导出模块) 
2.内置模块
os(内存) fs(读取文件) path(路径) http(协议) event(事件)
```

```js
//示例
const os = require('os') //内存模块
//比如我现在想看 内存使用了多少
// os.freemem() 空闲内存量 os.totalmem() 总内存量
const men = os.freemem() / os.totalmem()
console.log('内存使用情况',men)
```

## 下载

```bash
1.用node 第三方包 去下载github 上下载一个东西 第三方包 download-git-repo
```

```JS
const download = require('download-git-repo')
//这里面的下载路地址规则是 github:+ 你github上浏览器地址的的后半段 第二个参数 是要存放的路径
download('github:wazer1987/mini_VueRouter','../test',err => {
    console.log(err?'下载失败':'下载成功')
})
```

## 进度条

```JS
1. 主要使用node  ora模块 需要安装
```

```JS
//这样就会又提示的字样了
const adress = 'github:wazer1987/mini_VueRouter'
const download = require('download-git-repo')
const ora = require('ora')
const process = ora(`正在下载.....${adress}`)
//进度条开始
process.start()
download(adress,'./test',err => {
    if(err){
        //如果下载失败了 进度条关闭 
        process.fail()
    }else{
        //如果下载成功 显示成功
        process.succeed()
    }
})
```

## 封装模块

```JS
1.我们上面的那个下载已经写好了现在需要封装成函数 然后导出
2.然后在别的文件里导入这个导出的模块 基本上这样一个封装的模块就写好了
3.这里我们使用async 和 await 去是用
```

```JS
1.导出的文件模块 base.js
const download = require('download-git-repo')
async function clone(adress,desc) {
    
    const ora = require('ora')
    const process = ora(`正在下载.....${adress}`)
    //进度条开始
    process.start()
    try{
        await download(adress,desc)
    }catch(e){
        process.fail()
    }
    process.succeed()
}
module.exports.clone = clone
2.在clone.js 文件里 引入 刚刚导出的模块
const {clone} = require('./base.js')
//调用即可
clone('github:wazer1987/mini_VueRouter','./test')
```

## fs对象

```JS
1.主要是对文件进行相关的操作
2.比如读取 写入等
```

```JS
//文件的读取
const fs = require('fs')
//读取了上一级下的base文件 这个是同步读取
const data = fs.readFileSync('../base.js')
console.log(data)
//下面是在控制器下打印的东西 读取的是二进制的数据
<Buffer 2f 2f 20 63 6f 6e 73 74 20 6f 73 20 3d 20 72 65 71 75 69 72 65 28 27 6f 73 27 29 20 2f 2f e5 86 85 e5 ad 98 e6 a8 a1 e5 9d 97 0d 0a 2f 2f 20 2f 2f e6 ... 619 more bytes>
//为了能看到 所以我们这里要toString 这里 转换的是Buffer的二进制
console.log(data.toString())
下面就是你文件里面的功能了
// const os = require('os') //内存模块
// //比如我现在想看 内存使用了多少
// // os.freemem() 空闲内存量 os.totalmem() 总内存量
// const men = os.freemem() / os.totalmem()
// console.log('内存使用情况',men)
// const ora = require('ora')
// console.log(ora)
const download = require('download-git-repo')

async function clone(adress,desc) {

    const ora = require('ora')
    const process = ora(`正在下载.....${adress}`)
    //进度条开始
    process.start()
    try{
        await download(adress,desc)
    }catch(e){
        process.fail()
    }
    process.succeed()
}
module.exports.clone = clone
```

```JS
//异步读取 fs.readFile('路径',(err,data) => {})
//异步读取 第一个参数 是你要读取路径的地址 第二个参数 是异步的回调 形参 是错误 和你成功读取的数据
const data = fs.readFile('../base.js',(err,data) => {
    if(err) throw err
    console.log(data.toString())
})
```

```JS
几个常用的操作
fs.mkdir('文件夹名称',() => {})
fs.appendFile('要追加到那个文件里','要追加的内容',() => {})
//读取一个文件夹下的所有文件
const data = glob.sync('./modules/*')
data 返回是一个数组 数组的每个元素 是你读取的文件名的路径全称
然后我们开始分割一下即可
for(var x in data){
    console.log(data[x].split('/'))
}
```

## Buffer 对象

```JS
1. Buffer对象是node.js 对二进制数据的一个封装 在node里我们所有的二进制数据读取出来都是Buffer
2. 主要是为了操作二进制数据 
```

```JS
const buf1 = Buffer.alloc(10) //分配资源
console.log(buf1)
//打印结果如下 写了一个一个是个字节的二进制数据
<Buffer 00 00 00 00 00 00 00 00 00 00>
//a的二进制数据是多少 打印出来的是  a的二进制数据(ascI)表  
const buf2 = Buffer.from('a')
console.log(buf2,buf2.toString()) //打印出来是 <Buffer 61> a
const buf3 = Buffer.from('中文') //打印出来是  <Buffer e4 b8 ad e6 96 87>
console.log(buf3)
const buf4 = Buffer.concat([buf2,buf3]) //把buf2 ,buf3 链接在了一起
console.log(buf4)  //打印出来是 <Buffer 61 e4 b8 ad e6 96 87>
```

## http操作

```bash
1.最简单的创建了一个http的请求服务 当访问localhost:3000的时候 就给你回复 'hellow....'
const http = require('http')
const server = http.createServer((req,res) => {
    res.end('hello ....')
})
server.listen(3000)
```

```js
2.通过判断浏览器地址 去读取文件 返回给浏览器文件
const http = require('http')
const fs = require('fs')
const server = http.createServer((req,res) => {
    const {url,method} = req
    //看看你访问的类型
    if(url ==='/' && method === 'GET'){
        //去读文件
        fs.readFile('index.html',(err,data) => {
            //设置响应报文的头
            res.statusCode = 200
            res.setHeader('Content-Type','text/html')
            //给浏览器返回你读取的文件
            res.end(data)
        })
    }
})
server.listen(3000)
```

```JS
3.返回一个接口
const http = require('http')
const fs = require('fs')
const server = http.createServer((req,res) => {
    const {url,method} = req
    if(url ==='/' && method === 'GET'){
        fs.readFile('index.html',(err,data) => {
            res.statusCode = 200
            res.setHeader('Content-Type','text/html')
            res.end(data)
        })
    }else if( url === '/users' && method === 'GET'){
        //返回一个接口
        //这是了响应报文的内容类型 
        res.writeHead(200,{
            'ContentType':'appLication/json'
        })
        res.end(JSON.stringify({
            name:'老王'
        }))
    }
})
server.listen(3000)
```

## stream 流 

```JS
1.这里我们比如要用node 复制一张图片 逻辑就是要先读取这个图片 然后在写入这个图片
//这里是我们的常规操作
const fs = require('fs')
fs.readFile('./123.png',(err,data) => {
    if(data){
        fs.writeFile('./conpy.png',data,(err) => {
           if(!err){
               console.log('复制成功')
           }
        })
    }
})
//但是这样会存在一个问题 当你访问量多的时候 这个消耗是巨大的 所以我们有了流的概念
```

```JS
2.stream 就是类似一个流 流的话 就需要有管道 让你的文件 通过管道流入到 你指定的地点
const fs = require('fs')
//这个流的源头是哪 你要创建一下 就是出发的管道
const rs = fs.createReadStream('./123.png')
//这个流 最终要去哪 你要指定一下 就是最终结束的管道
const ws = fs.createWriteStream('./1234.png')
//上面我们两个管道都已经定义好了 现在要把他们的完整的拼接在一起 一个流 的管道就畅通了
rs.pipe(ws)
//以上就是一个流的概念
```

![](2.gif)

```JS
3.我们的网页在访问的时候会有img标签 它也是一个get请求 我们可以用headers.accept 拿到它请求的格式 从而来判断 你这个请求是不是图片的请求 然后来写个流
const http = require('http')
const fs = require('fs')
const server = http.createServer((req,res) => {
    const {url,method,headers} = req
    if(url ==='/' && method === 'GET'){
        fs.readFile('index.html',(err,data) => {
            res.statusCode = 200
            res.setHeader('Content-Type','text/html')
            res.end(data)
        })
    }else if( url === '/users' && method === 'GET'){
        res.writeHead(200,{
            'ContentType':'appLication/json'
        })
        res.end(JSON.stringify({
            name:'老王'
        }))
    }else if( method === 'GET' && headers.accept.indexOf('image/*') !== -1){
        //就是在这里判断了 你是img 标签发来的请求 这里我们读取了你的url 然后去创建liu 然后随后链接到res里
        fs.createReadStream('./'+url).pipe(res)
    }
})
server.listen(3000)
```

