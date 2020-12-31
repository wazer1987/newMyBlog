---
title: Koa2
date: 2019-03-25
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

## koa-router的配置

```JS
1.这里我们还是采取分层办法 MVC 路由作为我们C层
2.这里配置路由是通过koa-router去配置的 所以要安装
3.然后在启动文件里 引入 和注册
```

```JS
//首先我们分层 在controller的 文件夹下新建一个user.js 文件  这里存放所有跟用户相关的接口
const Router = require('koa-router')
const router = new Router()
router.get('/index',async (ctx) => {
    ctx.body='hellow index'
})
router.get('/',async (ctx) => {
    ctx.body='user'
})
module.exports = router
```

```JS
//然后在启动文件里注册 和引入
const Router = require('koa-router')
//这就是帮我们上面的建设的那些用户某块的接口
const user = require('./controller/user.js')
const home = require('./controller/home.js')
const router = new Router()
//然后注册一下 就可以使用了 这里的路径是二级路径 /user对应的是我们上面的接口的'/'
router.use('/user',user.routes())
//如果还有其他模块 就继续如下处理
router.use('/home',home.routes())
//加载路由中间件
app.use(router.routes())
//和所有的方法
app.use(router.allowedMethods())
```

## koa-bodyParser

```JS
1.用来接收post请求 安装koa-bodyParser包
2.然后在启动文件里注册
const bodyParser = require('koa-bodyParser')
app.use(bodyParser())
```

```JS
//参数的接收在ctx.request.body里接收
router.post('/index',async (ctx) => {
    //前端传过来的参数
    ctx.request.body
})
```



## 设置跨域 cors

```JS
1.这里设置了头 支持所有的前端去请求
2.使用koa2-cors安装包
3.然后注册一下
3.在启动文件里写下面这些
const cors = require('koa2-cors')
app.use(cors())
```





## mongoose链接

### 1.建立链接

```JS
//链接
const mongoose = require('mongoose')
const db = "mongodb://localhost/smile-vue"
const glob = require('glob')
const {resolve} = require('path')
//这里就是读取了我们的数据模型schema
exports.initSchemas = ()=>{
    glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}


exports.connect = ()=>{
    //连接数据库
    mongoose.connect(db)
    let  maxConnectTimes = 0

    return new Promise((resolve,reject)=>{

        //增加数据库监听事件
        mongoose.connection.on('disconnected',()=>{
            console.log('***********数据库断开***********')
            if(maxConnectTimes<=3){
                maxConnectTimes++
                mongoose.connect(db)
            }else{
                reject()
                throw new Error('数据库出现问题，程序无法搞定，请人为修理.....')
            }
           
        })

        mongoose.connection.on('error',(err)=>{
            console.log('***********数据库错误')
            if(maxConnectTimes<=3){
                maxConnectTimes++
                mongoose.connect(db)
            }else{
                reject(err)
                throw new Error('数据库出现问题，程序无法搞定，请人为修理.....')
            }
        })
        //链接打开的时
        mongoose.connection.once('open',()=>{
            console.log('MongoDB connected successfully')   
             resolve()
        })
    })
}
```

### 2.调用链接

```JS
//在我们的index.js文件里即可 也就是启动文件
//调用 使用我们的用函数  然后 让数据库链接成功
const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
//引入connect
const {connect,initSchemas} = require('./model/init.js')

//立即执行函数
;(async () =>{
    //启动链接
    await connect()
    //读取数据模型文件
    initSchemas()
    //随便插入一下文件实验一下
    let User = mongoose.model('User')
    console.log(User,'-----user')
    let oneUser = new User({userName:'wangzheng',password:'123456'})
    oneUser.save().then(() => {
        console.log('插入成功')
    })
})()
```

### 3.密码的加密处理

```JS
1.这里我们采用了bcrypt包 也就哈希的一种 先去加盐
2.上面的操作我们在数据模型里完成
```

```JS
const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
const bcrypt = require('bcrypt')
//这个是一种加字节的数量和长度
const SALT_WORK_FACTOR = 10

//创建UserShema
const userSchema = new Schema({
    UserId :{type:ObjectId},
    userName : {unique:true,type:String},
    password : String,
    createAt:{type:Date, default:Date.now()},
    lastLoginAt:{type:Date, default:Date.now()}
},{
  collection:'user'  
}) 
//这面就是加盐的处理了
userSchema.pre('save', function(next){
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.password,salt,(err,hash)=>{
            if(err) return next(err)
            this.password = hash
            next()
        })
    })
})
//发布模型
mongoose.model('User',userSchema)
```

## 注册的代码

```JS
1.首先要确保你的数据库是链接的状态 和模型已经数据模型已经映射到了本地
```

```js
//确保已经链接 并已经把数据模型映射到文件本地 在index.js文件里 启动文件
const mongoose = require('mongoose')
const {connect,initSchemas} = require('./model/init.js')
// 立即执行函数
;(async () =>{
    await connect()
    initSchemas()
})()
```

```JS
//当前端访问进口的时候 我们把前端传过来的参数 放进我们的新的User里 然后保存
const mongoose = require('mongoose')
router.post('/',async (ctx) => {
    //导入User数据模型
    const User = mongoose.model('User')
    //然后  把前端传过来的 新创建 一个用户信息
    let newUser = new User(ctx.request.body)
    //然后保存 如果成功 就返回给前端的状态
    await newUser.save().then(() => {
        ctx.body = {
            code:200,
            message:'注册成功'
        }
    })
})
module.exports = router
```

## 登录

```JS
1.首先我们要先去查用户名 
2.如果用户名查到 再去查密码
3.密码这里我们前期是经过  const bcrypt = require('bcrypt') 这个包处理过的
4.所以 密码需要比对 和解密 这里我们直接卸载数据模型里
```

```JS
//数据模型的方法
const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
const bcrypt = require('bcrypt')
//这个是一种加字节的数量和长度
const SALT_WORK_FACTOR = 10

//创建UserShema
const userSchema = new Schema({
    UserId :{type:ObjectId},
    userName : {unique:true,type:String},
    password : String,
    createAt:{type:Date, default:Date.now()},
    lastLoginAt:{type:Date, default:Date.now()}
},{
  collection:'user'  
}) 
//这面就是加盐的处理了
userSchema.pre('save', function(next){
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.password,salt,(err,hash)=>{
            if(err) return next(err)
            this.password = hash
            next()
        })
    })
})
//比对密码的方法 在我们的数据模型中去完成 这里在我们登录接口的时候 就可以用
userSchema.methods = {
    comparePassword:(_password,password) => {
        return new Promise((resolve,reject) => {
            //调用了bcrypt的方法 去比对密码 err是错误 isMatc是成功
            bcrypt.compare(_password,password,(err,isMatc) => {
                //如果没有错误 就返回成功
                if(!err) resolve(isMatc)
                //如果失败了 就返回错误
                else reject(err)
            })
        })
    }
}
//发布模型
mongoose.model('User',userSchema)
```

```JS
//登录接口
router.post('/loging',(cxt) => {
    //把前端的用户和密码解构出来
    let userName = ctx.request.body.userName
    let password = ctx.request.body.password
    //映射我们的数据模型
    const User =  mongoose.model('User')
    //去数去模型中查找先看看有没有用户名.exex就是找到了  然后 他返回的是用户和密码
    await User.findOne({userName:userName}).exec().then( async (res) => {
        //如果找到了 我们新把数据模型实力化出来
        if(res){
            let newUser = new User()
            //用我们自己写好的方法 去比对密码 这里因为上面我们已经封装了 所以就直接返回成功
            await newUser.comparePassword(pasword,res.password).then(isMatc)
        }else{
            //如果找不到就提示用户名不存在
            ctx.body = {
                code:200,
                message:'用户名不存在'
            }
        }
    }).catch( error => {
        ctx.body = {
            code:'500',
            message:'服务器错误'
        }
    })
})
module.exports = router
```

## 数据库文件的写入

```JS
1.核心就是读文件 的功能 然后插入到数据库里去
2.首先你要准备一个JSON文件 里面放你的数据
3.然后你的数据模型要和那个json文件的字段一样
```

```JS
//这里我们用商品举例 下面是数据模型文件
const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型
//这些字段都和你的json文件里的要一致
const goodsSchema = new Schema({
    ID:{unique:true,type:String},
    GOODS_SERIAL_NUMBER:String,
    SHOP_ID:String,
    SUB_ID:String,
    GOOD_TYPE:Number,
    STATE:Number,
    NAME:String,
    ORI_PRICE:Number,
    PRESENT_PRICE:Number,
    AMOUNT:Number,
    DETAIL:String,
    BRIEF:String,
    SALES_COUNT:Number,
    IMAGE1:String,
    IMAGE2:String,
    IMAGE3:String,
    IMAGE4:String,
    IMAGE5:String,
    ORIGIN_PLACE:String,
    GOOD_SCENT:String,
    CREATE_TIME:String,
    UPDATE_TIME:String,
    IS_RECOMMEND:Number,
    PICTURE_COMPERSS_PATH:String
},{
    collections:'Goods'
})

mongoose.model('Goods',goodsSchema)
```

```JS
//然后我们写新写的接口 appAPI文件夹下的good.js文件 
const Koa = require('koa')
const app = new Koa()
const Router = require ('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const fs = require('fs')

//这里就是当有请求这个接口的时候
router.get('/insertAllGoodsInfo',async(ctx)=>{
	//去读文件
     fs.readFile('./goods.json','utf8',(err,data)=>{
         //转换JSON
        data=JSON.parse(data)
        let saveCount=0
        //映射数据模型
        const Goods = mongoose.model('Goods')
        //循环我们读取的文件
        data.map((value,index)=>{
            console.log(value)
            //每次循环一次就创建一条数据 并把我们的数据模型插入进去
            let newGoods = new Goods(value)
            //然后保存数据
            newGoods.save().then(()=>{
                saveCount++
                console.log('成功'+saveCount)
            }).catch(error=>{
                 console.log('失败：'+error)
            })
        })


    })
    ctx.body="开始导入数据"


})
//导出路由
module.exports=router;
```

```JS
//然后在启动文件里 挂在路由 index.js
let goods = require('./appApi/goods.js')
router.use('/goods',goods.routes())
```

## 分页算法

```JS
1.首先你需要知道当前页 这和是前台给你传过来
2.你要知道每一页给前台传过多少条数据
3.你要知道从从数组的那个位置开始传
```

```JS
router.post('/fenye',async (ctx) => {
    let page = ctx.request.body.page //前台给你传过来的当前页书
    let num = 10 //你每一页给他返回十条数据
    //这里的意思就是 当你前台是第一页的时候 我就从数据库的第0的索引给你查 如果你是第二页 那我就从数据的索引为10的开始给你查如果你是第三页 我就送数据库索引为20的位置开始给你查
    let start = (page-1) * num
    //skip就是我从索引第几的位置开始给你查  limit就是查几条
    let retsult = await Goods.find().skip(start).limit().exec
})
```

