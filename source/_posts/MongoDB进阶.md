---
title: MongoDB进阶
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

# 插入百万级别的数据

```JS
1.我们要生成随机数 然后要生成随机的英文字母
2.然后使用for循环 insert去插入这个数据数组
```

```JS
//代码如下
//生成随机数
function GetRandomNum(min,max){
    let range = max-min;   //得到随机数区间
    let rand = Math.random(); //得到随机值
    return (min + Math.round(rand *range)); //最小值+随机数取整
}
//生成随机用户名
function GetRadomUserName(min,max){
    let tempStringArray= "123456789qwertyuiopasdfghjklzxcvbnm".split("");//构造生成时的字母库数组
    let outPuttext = ""; //最后输出的变量
    //进行循环，随机生产用户名的长度，这里需要生成随机数方法的配合
    for(let i=1 ;i<GetRandomNum(min,max);i++){
        //随机抽取字母，拼装成需要的用户名
        outPuttext=outPuttext+tempStringArray[GetRandomNum(0,tempStringArray.length)]
    }
    return outPuttext;
}
//链接数据库 利用for循环插入数据
var db = connect('company');
db.randomInfo.drop();
var  tempInfo = [];
for (let i=0;i<2000000;i++){
    tempInfo.push({
        username:GetRadomUserName(7,16),
        regeditTime:new Date(),
        randNum0:GetRandomNum(100000,999999),
        randNum1:GetRandomNum(100000,999999),
        randNum2:GetRandomNum(100000,999999),
        randNum3:GetRandomNum(100000,999999),
        randNum4:GetRandomNum(100000,999999),
        randNum5:GetRandomNum(100000,999999),
        randNum6:GetRandomNum(100000,999999),
        randNum7:GetRandomNum(100000,999999),
        randNum8:GetRandomNum(100000,999999),
        randNum8:GetRandomNum(100000,999999),
    })
}

db.randomInfo.insert(tempInfo);
//查看成功与否
插入完成后，我们可以使用 db.randomInfo.stats() 这个命令查看数据中的数据条数。
```

# 建立索引

```JS
1.在上面我们的已经插入了200万的数据
2.如果此时我们在这些数据中查找一个数据 是很浪费时间的 
3.所以我们需要给我们的数据简历索引 来提升查找的性能
4.数据不超过万条时 不需要使用索引 性能提升不明显 查询数据超过表的30%时 不需要索引
5，使用索引 数字索引 把你经常查询的数据做成一个内嵌的数据
```

```JS
//下面是没有建立索引 所查询的时间
var startTime = new Date().getTime()  //得到程序运行的开始时间
var  db = connect('company')          //链接数据库
var   rs=db.randomInfo.find({username:"qjqxb2eoi7"})  //根据用户名查找用户
rs.forEach(rs=>{printjson(rs)})                     //循环输出
var  runTime = new Date().getTime()-startTime;      //得到程序运行时间
print('[SUCCESS]This run time is:'+runTime+'ms')    //打印出运行时间
//查询结果
{
        "_id" : ObjectId("5ea9882757578369e9da1aea"),
        "username" : "qjqxb2eoi7",
        "regeditTime" : ISODate("2020-04-29T13:58:10.580Z"),
        "randNum0" : 484194,
        "randNum1" : 237154,
        "randNum2" : 191352,
        "randNum3" : 552425,
        "randNum4" : 545687,
        "randNum5" : 953026,
        "randNum6" : 965915,
        "randNum7" : 352092,
        "randNum8" : 632881
}
[SUCCESS]This run time is:915ms //平均接近1S
```

```JS
//建立索引   //为我们的username字段建立索引
db.randomInfo.ensureIndex({username:1})
//返还
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}
```

```JS
//查看索引
db.randomInfo.getIndexes()
//返还结果
[
        {
                "v" : 2,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "company.randomInfo"
        },
        {
                "v" : 2,
            //可以查看到已经建立了索引
                "key" : {
                        "username" : 1
                },
                "name" : "username_1",
                "ns" : "company.randomInfo"
        }
]
```

```JS
//最后我们在从新查询了一下
{
        "_id" : ObjectId("5ea9882757578369e9da1aea"),
        "username" : "qjqxb2eoi7",
        "regeditTime" : ISODate("2020-04-29T13:58:10.580Z"),
        "randNum0" : 484194,
        "randNum1" : 237154,
        "randNum2" : 191352,
        "randNum3" : 552425,
        "randNum4" : 545687,
        "randNum5" : 953026,
        "randNum6" : 965915,
        "randNum7" : 352092,
        "randNum8" : 632881
}
[SUCCESS]This run time is:14ms //缩短为了14ms
```

# 复合索引

```JS
1.复合索引 就是把查询两条条件 都做索引
2.建立复合索引 和上面方法一样
```

```JS
//这是我们建立的索引表 数据库在查询的时候 他是按照索引表的一定顺序取查询的 ID是默认的   
[
        {
                "v" : 2,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "company.randomInfo"
        },
        {
                "v" : 2,
                "key" : {
                        "username" : 1
                },
                "name" : "username_1",
                "ns" : "company.randomInfo"
        }
]
```

```JS
//然后我们又建立了randNum0 的索引 这样就成了符合索引了  db.randomInfo.ensureIndex({randNum0:1})
//然后我们查看索引表如下
> db.randomInfo.getIndexes()
[
        {
                "v" : 2,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "company.randomInfo"
        },
        {
                "v" : 2,
                "key" : {
                        "username" : 1
                },
                "name" : "username_1",
                "ns" : "company.randomInfo"
        },
    	//可以看到ranNum0也建立了索引 
        {
                "v" : 2,
                "key" : {
                        "randNum0" : 1
                },
                "name" : "randNum0_1",
                "ns" : "company.randomInfo"
        }
]
```

```JS
//数据库在查询的时候 是按照索引表的顺序去查的 数字类型的值 永远比 字符串类型的值要快
//那么我们如何数据库按照我们的指定的索引取查询
db.workmate.find({username:'zcbvc8lp9f',ranNum0:908274}).hint({randNum0:1})
//以上就是 我们用randNum0的索引去进行查找
```

# 删除索引

```JS
//删除索引 这里注意 我们删除索引的时候 一定去索引表里查看他的name值 然后在删除
db.randomInfo.dropIndex('randNum0_1')
//删除成功
{ "nIndexesWas" : 3, "ok" : 1 }
```

# 全文索引

```JS
//全文索引 一般用于搜索你文章的关键字 性能会有很大的提升 要建立全文索引的字段
> db.info.insert({name:"good moring is context"})
> db.info.insert({name:"good night is running geart"})
db.randomInfo.ensureIndex({name:"text"})
//建立成功
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}
```

```JS
//使用全文索引 这里就是使用全文索引 去查找含有 good 和 is 的数据
db.info.find({$text:{$search:"good is"}})
//排除 就是没有is的数据 
db.info.find({$text:{$search:"good -is"}})
```

```JS
//需要查找两个词 就需要用到\转义符
db.info.find({$text:{$serach:"\"good moring\" is"}})
```

# MongoDB管理

```JS
1.我可以给我们的MongoDB创建一个用户 也可以设置这个用户的管理权限等
```

```JS
//创建用户
db.createUser({
    user:"jspang",
    pwd:"123456",
    customData:{
        name:'技术胖',
        email:'web0432@126.com',
        age:18,
    },
    //这里就是创建的这个用户 对所有库只能只读 不能操作
    roles:['read']
})
```

```JS

db.createUser({
    user:"jspang",
    pwd:"123456",
    customData:{
        name:'技术胖',
        email:'web0432@126.com',
        age:18,
    },
    roles:[
        {
            role:"readWrite",
            db:"company"
        },
        'read'
    ]
})
```

```JS
//权限表的value为下
数据库用户角色：read、readWrite；
数据库管理角色：dbAdmin、dbOwner、userAdmin;
集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManage；
备份恢复角色：backup、restore；
所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
超级用户角色：root
内部角色：__system
```

# 查找用户信息

```JS
//就可以查看库的用户信息了
db.system.users.find()
```

# 删除用户

```JS
//删除用户信息
db.system.users.remove({user:"用户名称"})
```

# 鉴权

```JS
1.你建立好了用户 我们希望用我们建立好的用户去登录
2.然后我们就要鉴权 然后就可以登录了
```

# 数据库备份和还原

```JS
//备份
mongodump
 --host 127.0.0.1
 --port 27017
 --out D:/databack/backup //备份到哪了
 --collection myCollections //备份的集合
 --db test //备份的数据库
 --username username //账户
 --password password //和密码
 //以下是命令
 mongodump --host 127.0.0.1 --port 27017 --out D:/databack --collection info --db company
```

```JS
//还原
mongorestore
 --host 127.0.0.1
 --port 27017
 --username username
 --password password
 mongorestore --host 127.0.0.1 --port 27017 D:/databack/
```

```JS
//以上命令 在net start MongoDB 服务请求成功之后就可以使用
```

