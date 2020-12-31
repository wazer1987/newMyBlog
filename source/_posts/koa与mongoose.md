---
title: Koa与mongoose
date: 2019-03-26
updated: 2019-06-03
tags: Koa2
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

## koa正常流程

```J
1.安装 koa
2.创建服务
```

```js
index.js -> 创建服务代码
const Koa =  require('koa')
const app = new Koa()
app.use((ctx,next) => {
    //这里就返回了数据
    ctx.body =[ {
        name:'koa'
    }]
})
app.listen(3000)
```

```JS
const Koa =  require('koa')
const app = new Koa()
app.use((ctx,next) => {
    ctx.body =[ {
        name:'koa'
    }]
    //这里切记要加next() 否则我们下面的无法访问
    next()
})

app.use((ctx,next) => {
    if(ctx.url === '/html'){
        console.log('url' + ctx.url) //这里就是你前端请求的地址
        ctx.type = 'text/html;charset=utf-8' //这里就是请求的头
        ctx.body = `<p>我的名字是${ctx.body[0].name}</p>` //这里就是返回的数据
    }
})
app.listen(3000)
```

## 上传文件

```JS
1.我们前端再长传文件的时候 用input框 type=flie类型即可 然后可以通过DOM拿到这个选择框的值 直接发送给后台就好
```

## 后端接收文件 三种方式

```JS
1.采用流的形式 就好比管道 你那边供水 我这边指定一个地方 我们所写的后台代码就是搭接管道
2.采用buffer 的方式 就是我们把前端传过来的转换成二进制数据 然后再把他写再我们指定的文件里
3.采用流写入 有点像第一钟和第三种相互结合的方式
```

```JS
//流
 if (pathname === '/upload') {
        console.log('upload....')
        const fileName = request.headers['file-name'] ? request.headers['file-name'] : 'abc.png'
        //写好要存入的路径
        const outputFile = path.resolve(__dirname, fileName)
        //开始搭管道 管道的一头是你是服务器的这段最终的路径
        const fis = fs.createWriteStream(outputFile)
        //然后你的管道开始链接
        request.pipe(fis)
        response.end()
 }
```

```JS
//转换二进制数据
const chunk = []
//开始接受你前端传过来的数据 
request.on('data',data => {
    chunk.push(data)
    size += data.length
    console.log('data:',data ,size)
})
request.on('end',() => {
    console.log('end...')
    //然后转换成二进制数据
    const buffer = Buffer.concat(chunk,size)
    size = 0
    //然后把他写再一个文件里
    fs.writeFileSync(outputFile,buffer)
    response.end()
})
```

```JS
//流写入
 request.on('data', data => {
    console.log('data:',data)
    fis.write(data)
})
request.on('end', () => {
    fis.end()
    response.end()
})
```



