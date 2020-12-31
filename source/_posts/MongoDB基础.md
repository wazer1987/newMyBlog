---
title: MongoDB基础
date: 2019-03-27
updated: 2019-06-03
tags: MongoDB
categories: 数据库 
keywords: MongoDB
description: MongoDB
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

# 数据库之间的区别

```JS
1.数据库分为关系形数据库和非关系形数据库
2.非关系型数据就是减少了关系型数据库的一些功能 然后价格也十分的便宜
3.关系型数据库的数据结构 数据库 -> 数据表 -> 数据行(就是一行一行的数据)
4.非关系数据库结构 数据库 -> 集合(理解为数据表) -> 文件(理解为一行一行的数据)
```

# 基本操作

```JS
1.这里面可以写类似js的代码 如声明变量 或者 声明函数
```

# 基本命令

```JS
show dbs 查看链接中的所有数据库 如果库没有集合 就不会显示
use 数据库名称 使用数据库 进入数据库 如果当前没有这个库 使用这个命令就会新建
show collections 查看当前数据库中的集合
db 查看当前在哪个数据库
db.集合名称 在数据库新建一个集合
//下面我们一user集合名称举例
db.user.insert({"name":"wangzheng"})  //在user的集合里插入一个数据文件
db.user.find()  //显示user下面的所有文件
db.user.findOne() //显示当前集合的第一个文件 方法遵循小驼峰命名
db.user.update({"name":"wangzheng"},{"name":"newwangzheng"}) //修改第一个是你要修改的 第二个参数是你要改成的
db.user.remove({"name":"newwangzheng"}) //删除文件
db.user.drop() //删除集合
db.dropDatabase() //删除库 必须在当前库下才可
```

# 用js文件来写MongoDB

```JS
1.新建一个js文件 然后里面写json字符串 
2.运行命令行 使用mongo 要执行的js文件 即可
```

```JS
import { connect } from "http2"
var username = 'wangzheng'
var time = Date.parse(new Date())
var jsonString = {"name":usernamem,"time":time}
//链接一个数据库 如果没有则会自动创建
var db = connect('log')
db.login.insert(jsonString)
print('[demo]:log print success')
//当前目录下 mongo 执行文件即可
```

# 批量插入

```JS
//使用插入数据的方式即可 ID自己写入
> db.more.insert([{"_id":1},{"_id":2},{"_id":3}])
BulkWriteResult({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 3, //显示插入三条
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 0,
        "upserted" : [ ]
})
```

```JS
//插入数组 可以提升性能 test.js文件
var start = (new Date()).getTime()
var db = connect('plcr')
var tempArray = []
for(var i = 0 ; i < 1000; i++){
    tempArray.push({num:i})
}
db.plcrcollection.insert(tempArray)
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
//然后执行mongo test.js 首先记得开启服务
```

# 修改

```JS
//首先我们批量插入 修改的时候要记得整个对象一起修改
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男'
}
var two = {
    name:'李四',
    age:16,
    sex:'男'
}
var three = {
    name:'王五',
    age:26,
    sex:'女'
}
var tempArray = [one,two,three]

db.plcrcollection.insert({name:'王五'},tempArray)
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
//修改
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男'
}
var two = {
    name:'李四',
    age:16,
    sex:'男'
}
var three = {
    name:'王五',
    age:26,
    //改成女
    sex:'女'
}
var tempArray = [one,two,three]
//然后查找之后 在变成我们修改之后的对象
db.plcrcollection.update({name:'王五'},three)
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# 错误的修改

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男'
}
var two = {
    name:'李四',
    age:16,
    sex:'男'
}
var three = {
    name:'王五',
    age:26,
    //改成男
    sex:'女'
}
var tempArray = [one,two,three]
//这是错误的修改 这样修改完毕之后 这个three对象里就只有一个sex男了
db.plcrcollection.update({name:'王五'},{sex:'男'})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $set修饰符

```JS
1.上面是整个的修改 如果修改单项我们可以用$set修改器
2.也可以用来增加某一项数据
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男'
}
var two = {
    name:'李四',
    age:16,
    sex:'男'
}
var three = {
    name:'王五',
    age:26,
    sex:'女'
}
var tempArray = [one,two,three]
//这样就可以用$set这种形式去修改了
db.plcrcollection.update({name:'王五'},{$set:{age:28}})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

```JS
//如果是多层签到的数据 就和js语法一样 可以用点的形式 但是要加引号
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    }
}
//以上都是嵌套的数据
var tempArray = [one,two,three]
//这里我们就可以通过点的形式 但是要加引号 去修改该你要改变的值
db.plcrcollection.update({name:'王五'},{$set:{"skill.one":'css'}})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $unset修饰符

```JS
1.$unset主要是用来删除数据中的
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    }
}
var tempArray = [one,two,three]
// db.plcrcollection.insert(tempArray)
//这样就吧skill.one删除了
db.plcrcollection.update({name:'王五'},{$unset:{"skill.one":'css'}})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $inc修饰符

```JS
1.可以对数据进行计算 和 操作
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    }
}
var tempArray = [one,two,three]
//此处使用$inc就把年龄-2了
db.plcrcollection.update({name:'王五'},{$inc:{age:-2})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# multi

```JS
1.当我们需要给所有的数据增加一个新的字段的时候 我们要用$set
2.这个时候我们只会给第一行数据增加了这个新的数据
3.所以我们要用multi这个配置 当他为true的时候 就会一行行的查找
```

```JS
//没有multi
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    }
}
var tempArray = [one,two,three]
//当没有multi的时候 他只会为第一个数据添加这个like的字段
db.plcrcollection.update({},{$set:{like:'women'}})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

```JS
//multi为true
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    }
}
var tempArray = [one,two,three]
//这样就给我们上面所有的数据都添加了like字段
db.plcrcollection.update({},{$set:{like:'women'}},{multi:true})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# upset

```JS
1.用于往现有的数据里插入一条新的数据
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    }
}
var tempArray = [one,two,three]
//此刻我们上面的数据里并没有name:赵六这个数据 所以我们开启了upsert选项之后 就会自动添加到我们的数据里面去
db.plcrcollection.update({name:'赵六'},{$set:{like:'women'}},{upsert:true})
var end = (new Date()).getTime()
var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $push修饰符

```JS
1.在现有的数据上 插入新的key
2.比如我们的一行数据 其中有个字段是个数组 你想向里面插入新的数据 就可以用
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[]
}
var tempArray = [one,two,three]
// db.plcrcollection.insert(tempArray)
//向arr这个数据行中 插入了元素
db.plcrcollection.update({name:'王五'},{$push:{arr:'数组1'}})
//对象也是使用的 向skill对象里增加了一个新的字段叫two 值是css 但是类型是数组
db.plcrcollection.update({name:'王五'},{$push:{'skill.two':'css'}})
var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $ne修饰符

```JS
1.去查找某一下的数据里的某个值 如果查到了就不添加值 如果查不到就添加新的值
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[
        '数组1',
        '数组2'
    ]
}
var tempArray = [one,two,three]
//我们去查找一下name:王五里面的arr字段里的数组3 如果能找到我们就不push数组4 如果找不到就push数组4
db.plcrcollection.update({name:'王五',arr:{$ne:'数组3'}},{$push:{arr:'数组4'}})
var end = (new Date()).getTime()
var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $addToSet修饰符

```JS
$ne的升级版 和上面意思一样
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[
        '数组1',
        '数组2'
    ]
}
var tempArray = [one,two,three]
//我去找name:'王五'的数据 找到他下面的arr看有没有数组五没有就添加
db.plcrcollection.update({name:'王五'},{$addToSet:{arr:'数组五'}})

var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')

```

# $each

```JS
1.如果我需要往一个数组里插入多个字段 就需要用到$each
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[
        '数组1',
        '数组2'
    ]
}
var tempArray = [one,two,three]
var newArr = ['数组七','数组8','数组9']
//我先去看看 你有没有这些数据 如果没有我在添加 用$echa一次性添加
db.plcrcollection.update({name:'王五'},{$addToSet:{arr:{$each:newArr}}})

var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')
```

# $pop

```JS
1.数组的删除修饰符 有两个参数 如果是1从数组的末端开始删除 -1从数组的开始进行删除
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[
        '数组1',
        '数组2',
        '数组七',
        '数组8',
        '数组9'
    ]
}
var tempArray = [one,two,three]
//pop为1的时候从数组的末端开始删除了 如果参数为-1就从数组的开始删除了
db.plcrcollection.update({name:'王五'},{$pop:{arr:1}})

var end = (new Date()).getTime()

var running = end - start
print('dmoe run time is'+ running +'ms')

```

# 数组的定位修改

```JS
1.主要是是用$set 然后选择数组的对应的索引进行修改
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[
        '数组1',
        '数组2',
        '数组七',
        '数组8',
        '数组9'
    ]
}
var tempArray = [one,two,three]
//这样就是把arr的数据的索引为第一位的数据修改了
db.plcrcollection.update({name:'王五'},{$set:{'arr.1':'我是被修改的'}})
var end = (new Date()).getTime()
var running = end - start
print('dmoe run time is'+ running +'ms')

```

# 应答式操作

```JS
1.我们刚刚上面的操作都是非应答式的  是没有返回值的 
2.所以我们现在要用有返回值的的操作 db.runCommand({getLastError:1})
```

```JS
var start = (new Date()).getTime()
var db = connect('plcr')
var one = {
    name:'张三',
    age:28,
    sex:'男',
    skill:{
        one:'ppt'
    }
}
var two = {
    name:'李四',
    age:16,
    sex:'男',
    skill:{
        one:'ps'
    }
}
var three = {
    name:'王五',
    age:26,
    sex:'女',
    skill:{
        one:'html'
    },
    arr:[
        '数组1',
        '数组2',
        '数组七',
        '数组8',
        '数组9'
    ]
}
var tempArray = [one,two,three]
// db.plcrcollection.insert(tempArray)
// db.plcrcollection.update({name:'王五'},{$push:{arr:'数组1'}})
var newArr = ['数组七','数组8','数组9']
// db.plcrcollection.update({name:'王五'},{$addToSet:{arr:{$each:newArr}}})

db.plcrcollection.update({name:'王五'},{$set:{'arr.3':'我是被修改的'}})
//这里就是有了返回值
const res = db.runCommand({getLastError:1})
var end = (new Date()).getTime()
var running = end - start
printjson(res)
//打印出来的内容
{
        "connectionId" : 17,
         //这里就是修改成功了   
        "updatedExisting" : true,
        "n" : 1,
        "syncMillis" : 0,
        "writtenTo" : null,
        "err" : null,
        "ok" : 1
}
//也可以用来看看数据库链接成功了没有
db.runCommand({ping:1})
```

# findAndModify

```JS
1.我们可以理解为是写配置的方式去写操作数据库
query参数 用于 需要查询的条件
sort 进行排序
remove 查找到相同的条件之后删除
new 布尔什  返回更新之前的文档 或者更新之后的
fields 需要返回的字段
upsert 同上面一样 鹤remove只能存在一个
```

```JS
var db = connect('plcr')
//这样就是用写配置的方法 去写查询修改
const findAndModify = {
    findAndModify:'plcrcollection', //你要修改的是哪个集合
    query:{name:'王五'},
    new: true,
    update:{$set:{'arr.2':'我被修改了'}}
}
//然后用runCommand去运行这个配置 返回结果
const res = db.runCommand(findAndModify)
printjson(res,'---')
```

# 查询

```JS
1.首先我们来熟悉几个比较的操作符
$lt 小于 全称 less-than
$lte 小于等于 全称 less-than-equal
$gt 大于 全称 greater-than
$gte 大于等于 全称 greater-than-equal
$ne 不等于 全称 not-equal
```

```JS
数据库数组
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a8f"), "name" : "JSPang", "age" : 33, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a90"), "name" : "ShengLei", "age" : 31, "sex" : 1, "job" : "JAVA后端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "J2EE", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a91"), "name" : "MinJie", "age" : 18, "sex" : 0, "job" : "UI", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "UI", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a92"), "name" : "XiaoWang", "age" : 25, "sex" : 1, "job" : "UI", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "UI", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a93"), "name" : "LiangPeng", "age" : 28, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a94"), "name" : "HouFei", "age" : 25, "sex" : 0, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a95"), "name" : "LiuYan", "age" : 35, "sex" : 0, "job" : "美工", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "CAD" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a96"), "name" : "DingLu", "age" : 20, "sex" : 0, "job" : "美工", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "CAD" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a97"), "name" : "JiaPeng", "age" : 29, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a98"), "name" : "LiJia", "age" : 26, "sex" : 0, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
```

```JS
//我们去根据条件查找以上的数据 下面是查找的条件
db.workmate.find({'skill.skillOne':'HTML+CSS',name:'HouFei'})
//查找年龄 大于30 小于15   为true只为返回的字段
db.workmate.find({age:{$lt:30,$gt:10}},{name:true,_id:true,sex:true})
```

# 多条件查询

```JS
1.$in 修饰符 可以查询指定值的多条数据
2.$nin 修饰符 同上面相反
```

```JS
//查询年龄为25 和 35的数据 
db.workmate.find({age:{$in:[25,35]}},{name:true,skill:true})
//查询年龄不是25和35的数据
db.workmate.find({age:{$nin:[25,35]}},{name:true,skill:true})
```

# $or 修饰符

```JS
1.满足我们的一个查询条件即可
```

```JS
//查询要不年龄大于30 要不 就会PHP
db.workmate.find({$or:[{age:{$gte:30}},{'skill.skillThree':'PHP'}]})
```

# $and修饰符

```JS
1.同上面相反
2.并且的关系
```

```JS
//查询年龄大于30岁并且会PHP的数据
db.workmate.find({$and:[{age:{$gte:30}},{'skill.skillThree':'PHP'}]})
```

# $not 修饰符

```JS
1.查找查询条件之外的数据
```

```JS
//查找年龄大于20 小于30 之外的数据
db.workmate.find({age:{$not:{$lte:30,$gte:20}}})
```

# 数据的数组操作

```JS
//新的数据 里面增加了数据
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a8f"), "name" : "JSPang", "age" : 33, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a90"), "name" : "ShengLei", "age" : 31, "sex" : 1, "job" : "JAVA后端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "J2EE", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a91"), "name" : "MinJie", "age" : 18, "sex" : 0, "job" : "UI", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "UI", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
{ "_id" : ObjectId("5ea6d19d2f016fa8aca30a95"), "name" : "LiuYan", "age" : 35, "sex" : 0, "job" : "美工", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "CAD" }, "regeditTime" : ISODate("2020-04-27T12:35:41.746Z"), "interest" : [ ] }
> db.workmate.drop()
true
> db.workmate.find()
{ "_id" : ObjectId("5ea82a08ccd68891a847ff74"), "name" : "JSPang", "age" : 33, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "看电影", "看书", "吃美食", "钓鱼", "旅游" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff75"), "name" : "ShengLei", "age" : 31, "sex" : 1, "job" : "JAVA后端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "J2EE", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "篮球", "看电影", "做饭" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff76"), "name" : "MinJie", "age" : 18, "sex" : 0, "job" : "UI", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "UI", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "做饭", "画画", "看电影" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff77"), "name" : "XiaoWang", "age" : 25, "sex" : 1, "job" : "UI", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "UI", "skillThree" : "PPT" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "写代码", "篮球", "画画" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff78"), "name" : "LiangPeng", "age" : 28, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "玩游戏", "写代码", "做饭" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff79"), "name" : "HouFei", "age" : 25, "sex" : 0, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "化妆", "读书", "做饭" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff7a"), "name" : "LiuYan", "age" : 35, "sex" : 0, "job" : "美工", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "CAD" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "画画", "聚会", "看电影" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff7b"), "name" : "DingLu", "age" : 20, "sex" : 0, "job" : "美工", "skill" : { "skillOne" : "PhotoShop", "skillTwo" : "CAD" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "美食", "看电影", "做饭" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff7c"), "name" : "JiaPeng", "age" : 29, "sex" : 1, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "写代码", "篮球", "游泳" ] }
{ "_id" : ObjectId("5ea82a08ccd68891a847ff7d"), "name" : "LiJia", "age" : 26, "sex" : 0, "job" : "前端", "skill" : { "skillOne" : "HTML+CSS", "skillTwo" : "JavaScript", "skillThree" : "PHP" }, "regeditTime" : ISODate("2020-04-28T13:05:12.460Z"), "interest" : [ "玩游戏", "美食", "篮球" ] }
```

```JS
1.数据的查询 必须是完全比配 比如我们上面的每一项数据的interest 是个数据 我们在查询的时候 必须都要写全才会查询
```

```JS
//错误的示范 这样写是完全匹配了
db.workmate.find({interest:["玩游戏", "美食", "篮球" ]})
```

```JS
//我们要查询数组里 会玩游戏的 数据 就可以不用加数组括号 这样就会把数组里含有玩游戏的人数据都查询出来了
db.workmate.find({interest:"玩游戏"})
```

# $all 数组修饰符

```JS
1.查询数组数据都满足条件的数据
```

```JS
//查询数组 数据 必须有 看书 看电影
db.workmate.find({interest:{$all:['看书','看电影']}})
```

# $in 数组修饰符

```JS
1.查询数组数据中满足我们查询条件的其中一个即可
```

```JS
//查询出来的数据 他的interest数组中 要不就有看书 要不就有看电影
db.workmate.find({interest:{$in:['看书','看电影']}})
```

# $size 数组修饰符

```JS
1.查询数据的数组中 长度为多少的数据
```

```JS
//查出来的数据就是 interest这个字段的数组 长度为5的数据
db.workmate.find({interest:{$size:5}})
```

# $slice数组修饰符

```JS
1.用于查询出来的数组数据 只显示几位
```

```JS
//我们取查询interest这个字段的数组长度为5的数据 然后显示给我们的只有数组的第一位
db.workmate.find({interest:{$size:5}},{name:true,age:true,_id:false,interest:{$slice:1}})

//查询结果如下
{ "name" : "JSPang", "age" : 33, "interest" : [ "看电影" ] }
```

# 在js文件里写查询

```JS
1.还是用打印的形式 只不过这里用了游标
```

```JS
var db=connect('company');
const res = db.workmate.find() //这是查询如果来的结果
//如果有下一条
while(res.hasNext()){
    //我们就打印
    printjson(res.next());
}
```

```JS
//也可以用mongodb自带的forEach 去打印
var db=connect('company');
const res = db.workmate.find()
res.forEach(item => {
    printjson(item)
})
//以上就把所有查询的数据都打印出来了
```

