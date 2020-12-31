---
title: EggJs
date: 2020-03-22
updated: 2019-06-03
tags: Egg
categories: Node
keywords: Egg
description: Egg
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

# 1.egg.js 项目初始化

```JS
1.创建命令
npm init egg --type=simple 初始化项目
npm i 安装egg
2.启动命令 
进去项目文件夹下
yarn run dev
```

# 2.项目目录结构

```JS
1.app 文件夹 用于存放我们的主要业务代码 比如我们的controller层的代码 router.js路由文件 model 数据层 middlerware中间层文件 
在这里所有的文件的this就是app 我们都可以通过把this结构出来 然后通过ctx.model(文件夹).文件 这种方式 拿到里面的方法
2.config文件 里面有config.default.js文件 和 plugin.js文件 
 config.default.js 主要用于配置我们的插件 比如mongoose 和 jwt 
 plugin.js 插件 主要用于加载我们的 mongoose 和 jwt 插件 
 我们所有的插件都必须在plugin.js里加载一下 然后在去 config.default.js里去配置一下
3.以上是我们项目命令搭建以后自动会产生的文件夹
```

```JS
4.app文件夹下的 service 文件夹 我们新建的 一般用于存放公共的方法 在任何地方都可以调用
//service 文件夹 下user.js 文件  切记最后一定要导出
'use strict';
const Service = require('egg').Service;
class UserService extends Service {
  async getAll() {
    return [{ name: 'zs' }];
  }
}
module.exports = UserService;
//然后我们在app文件夹下 的controller文件夹下的文件就可以调用
'use strict';
const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    //这里就是调用了我们上面的service下文件夹下 user.js文件里面的方法 
    //语法 就是ctx.service(文件夹名称).user(你的js文件).getAll(你写在里面的方法) 注意 这里一定要用async 和 await的语法 
    ctx.body = await ctx.service.user.getAll();
  }
}

module.exports = HomeController;
```

# 3.swagger-doc 结构文档的写法

```JS
1.用于自动生成接口
2.需要安装swagger-dov插件
安装命令 yarn add egg-swagger-doc-feat -S
3.这个插件会自动帮你生成接口文档
```



```JS
//首先第一步我们需要在config文件夹下的 plugin.js文件里加载一下
'use strict';
module.exports = {
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc-feat',
  },
};
//然后我们需要在config.default.js文件里配置一下
config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: '开课吧接口',
      description: '开课吧接口 swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    enableSecurity: false,
    // enableValidate: true,
    routerMap: true,
    enable: true,
  }
```

```JS
//我们需要在app文件夹下新建一个contract文件夹 这里面用于存放你接口文档的一些字段类型和规则
contract 文件夹下 index.js文件 用于存放你接口文档的基本字段和规则
module.exports = {
    //一下就是我们自己定义的基本字段 就是无论你的接口是哪个 都会以下面的两个为基本字段去返回给你
    baseRequest:{
      id: { type: 'string', description: 'id 唯一键' ,required:true,example:'1'},
  
    },
    baseResponse: {
      code: { type: 'integer', required: true, example: 0 },
      data:{type: 'string',example: '请求成功' },
      errorMessage: { type: 'string', example: '请求成功' },
    },
  };
```

```JS
//上面基本字段定义完毕 我们可以单独分别定义不同模块的 字段和柜子下面我们用controller文件夹下的user.js文件举例
//contract文件夹下 user.js文件 
module.exports = {
    createUserRequest: {
        mobile: { type: 'string', required: true, description: '手机号', example: '18801731528', 		    format: /^1[34578]\d{9}$/, },
        password: { type: 'string', required: true, description: '密码', example: '111111', },
        realName: { type: 'string', required: true, description: '姓名', example: 'Tom' },
    },
}
```

```JS
//上面都定义为了我们来定义controller文件夹下的user.js文件里的具体接口字段
const Controller = require('egg').Controller
//一下是语法 必须要这么写 swagger-doc查进会自动读取下面的语法 第一个用于规定整组接口的大类
/**
 * @Controller 用户管理
 */
class UserController extends Controller {
  constructor(ctx) {
    super(ctx)
  }
  //下面是单独一个方法 需要的一些传入的参数  和 一些说明  注意注释的语法 是固定写法
  /**
   * @summary 创建用户  
   * @description 创建用户，记录用户账户/密码/类型 
   * @router post /api/user 
   * @request body createUserRequest *body 
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(ctx.rule.createUserRequest)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.user.create(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }
}
```

## 3.1swagger-doc字段详解

```JS
* @summary 创建用户  //对应我们swagger 页面的 大的标题
* @description 创建用户，记录用户账户/密码/类型 //对应我们详细接口的小的标题
* @router post /api/user  //对应请求方式 和接口地址
//下面通俗的讲 就是前端给我们传过来的参数 
* @request body createUserRequest 
//这里对应我们 contract文件夹下的 user.js文件里的字段
    module.exports = {
        createUserRequest: {
            mobile: { type: 'string', required: true, description: '手机号', example: '18801731528', 		    format: /^1[34578]\d{9}$/, },
            password: { type: 'string', required: true, description: '密码', example: '111111', },
            realName: { type: 'string', required: true, description: '姓名', example: 'Tom' },
        },
    }
//对应的是我们给前端返回的东西
* @response 200 baseResponse 创建成功
```

## 3.2swagger-doc访问

```JS
最后在浏览器里输入 localhost:7001/swagger-ui.html 就能进入接口文档页面
```

# 4.统一异常错误处理

```JS
1.首先是用中间件去完成 所以需要在app文件夹下 新建一个middleware的文件夹 下面新写一个文件
2.由于是统一的错误处理 所以不管哪个层都会调用 是一个全局的 所以我们需要在config.default.js里去配置
3.核心原理就是用try catch 函数 去 尝试执行
```

```JS
//app文件夹 middleware error.js文件
'use strict';
module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 素有异常都在APP上出发一个error事件 框架会记录一条错误信息
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境 500 错误的详细信息内容不返还给客户端
      const error = status === 500 && app.config.env === 'pro' ? 'Internal Server Error' : 				  err.message;
      ctx.body = {
        code: status,
        error,
      };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = 200;
    }
  };
};

```

```JS
// 配置全局中间件 config.default.js文件 直接在这个选项里写你中间件的文件名称即可
config.middleware = [ 'error' ];
```

# 5.设置统一前端格式

```JS
1.我们接口不可能是一个人写 如果多个人的话 难免会不统一 就有个我返回给前端的格式是code , message , 响应内容 而你的不是
2.所以需要写一个公共的返还给前端的函数 把你查出来的结果 通过这个函数去返还给前端 这样就固定了
3.我们可以用继承的方式去写 在我们项目里已经记录过了
4.还可以通过使用框架自带的方式去写
```

```JS
//app文件夹下 extend文件夹 helper.js文件
'use strict';
const moment = require('moment');
// 处理成功响应
exports.success = ({ ctx, res = null, msg = '处理成功' }) => {
  //这里就规定了返回给前端的固定格式
  ctx.body = {
    code: 0,
    data: res,
    msg,
  };
  ctx.status = 200;
};

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')
;
```

```JS
//然后我们在请求接口的时候 通过ctx.helper.success()调用即可 把我们的参数传进去
'use strict';
const Controller = require('egg').Controller;
class UserController extends Controller {
  async create() {
    const { ctx } = this;

    const res = [{ name: 'zs', age: 15 }];
    ctx.helper.success({ ctx, res });
  }
}

module.exports = UserController;
```

# 6.字段校验

```JS
1.我们前端在传递给我们参数的时候 如果字段正确 就可以通过接口
2.如果字段不正确 我们就需要给他做提示信息
3.这个提示信息 我们就需要校验 使用第三方库去完成 egg-validate
4.然后去配置一下
```

```JS
//config文件夹下 的plugin.js文件
'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc-feat',
  },
  //这个直接加载就好
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};
```

```JS
//使用
'use strict';
const Controller = require('egg').Controller;
/**
 * @controller 用户管理
 *
 */
class UserController extends Controller {
  /**
   * @summary  新建用户
   * @description 新建用户   记录用户/账户/密码/类型
   * @router post /api/user
   * @request body createUserRequest
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx } = this;
    //这里就是我们设置swagger的时候设置的前端传入的参数规则 他会走我们contract文件夹下user.js的文件里的规则  
    ctx.validate(ctx.rule.createUserRequest);
    const res = [{ name: 'zs', age: 15 }];
    ctx.helper.success({ ctx, res });
  }
}
module.exports = UserController;
```

# 7.哈希的定义

```JS
哈希就是摘要算法 把一个不定长的字节摘要成定长字节的过程
```

