---
title: Json-server
date: 2020-03-27
updated: 2019-06-03
tags: Json-server
categories: 数据库
keywords: Json-server
description: Json-server
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

# json-server的使用

## 配置

```JS
1.首先我们要全局安装 json-server  npm install json-server -g
2.然后新建一个文件夹 新建json文件 里面写上你的json数据 
3.然后进入到当前的目录文件 使用 json-server json文件的名称 --prot 4000
4.然后路径输入你的数据里的名字 
```

```JS
 json-server .\data.json --port 4000
//data.json 文件
{
    "arr":[
        {"name":"盖伦","skill":"转圈圈"},
        {"name":"拉克丝","skill":"激光柱"},
        {"name":"乌迪尔","skill":"龟仙人"}
    ]
}
```

## 实战项目

```JS
1.我们往往 在用数据的时候 会有多个json文件 比如美食分类的菜单是一个json数据文件 热么的菜单是一个json文件
2.所以我们统一写一个js文件  用来 引入上面数据文件
3.然后我们还需要配置一个路由的json文件 挂载到我们的mock文件的启动项目中
```

```JS
//数据文件 hotcate.json
{
    "hotcate":[
        {"title":"家常菜","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765080706&di=672462f0d791a79b644f62063dfa65cd&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw640h425%2F20171202%2F7828-fypikwt3113517.jpg" },
        {"title":"汤","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765127750&di=590b7e75790186cb6509f88cd8f84ad3&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20190220%2F47ff2e4c5068421abf7fbf4f891c27d7.jpeg" },
        {"title":"川菜","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765147537&di=72f1cff34faef05edbcfdc381b5fafba&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fphotoblog%2F1202%2F25%2Fc4%2F10591913_10591913_1330169696515_mthumb.jpg" },
        {"title":"粤菜","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765168194&di=b18ebe751958d06ecd494b189bd5d522&imgtype=0&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D3909022962%2C3605112292%26fm%3D214%26gp%3D0.jpg" },
        {"title":"早餐","icon":"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2039510083,1378721308&fm=26&gp=0.jpg" },
        {"title":"火锅","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765205246&di=11e7a068f71dd45797c9e18e90b0b960&imgtype=0&src=http%3A%2F%2Fp0.meituan.net%2Fdealwatera%2F1684685770d17952233dc072d943724f67035.jpg%40460h_702w_2e_90Q%257Cwatermark%3D1%26%26p%3D4" },
        {"title":"素菜","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765225005&di=f35a1b5a72ba24c324d7b4c76dadd6ed&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn07%2F275%2Fw640h435%2F20180514%2Faba8-hapkuvk2008569.jpg" },
        {"title":"粥","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765237697&di=25051774a4a53d38fd9b452f47da5ceb&imgtype=0&src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fnote%2Fl%2Fpublic%2Fp51143710.jpg" },
        {"title":"凉菜","icon":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765254396&di=e8526dced96f65a536d11bfefa1ac02e&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw640h388%2F20180115%2F79d3-fyqrewi1943747.jpg" },
        {"title":"烘培","icon":"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1447043791,4233183214&fm=11&gp=0.jpg" },
        {"title":"饮品","icon":"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3142912936,3824679316&fm=26&gp=0.jpg" }
    ]
}
```

```JS
// mock.js 文件 主要用来引入数据 
//引入了我们上面的数据文件
const hotcate = require('./hotcate.json')
module.exports = () => {
    return hotcate
}
```

```JS
//我们都知道 前台的请求路径一般都是用api开头的 但是我们的这里的json-server 不可能每个路径都给你写api 所以我们需要一个路由的json文件  当我们前台用api开头的字符串访问的时候 帮我们转入到我们应该去的路径
//下面的意思就是 当我们的前台 是/api开头的路径过来的请求 都去 /hotcate这个路径
mockRouter.json文件
{
    "/api/hotcate":"/hotcate"
}
```

```JS
//然后需要挂载到我们的json-server的启动命令 读取我们mock/mock.js文件 然后 -r 把握们的路由文件 挂载到启动文件上 
"mock":"json-server ./src/mock/mock.js -r ./src/mock/mockRouter.json --port 4000 --watch"
//这里当然你也可以用npm run  去启动
```

