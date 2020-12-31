---
title: SSR 之 服务端渲染
date: 2020-04-13
updated: 2019-06-03
tags: Nuxt
categories: 服务端渲染
keywords: Nuxt
description: Nuxt
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

## nuxt安装

```JS
1.npx create-nuxt-app <项目名称> //相当于先全局安装 npm i nuxt 然后在创建一个项目 两个命令执行在一起了
```

## 路由的生成

```JS
1.首先我们需要在你的page下的文件目录里去创建你的页面
2.然后我们在浏览器的地址栏里输入你的文件名称 就会跳转到你对应创建的文件的页面
3.当你在page文件夹里创建文件的时候 在.nuxt文件里的router.js文件就会给你自动添加进去你的路由跳转路径
```

```JS
// pages/detail.vue pages文件夹 新建了一个页面 这个时候路由就会自动帮我们添加进去 
<template>
  <div>
    detail
  </div>
</template>

<script>
export default {

}
</script>
```

![](1.png)

```JS
以上我们新建了一个页面 detail文件  这个时候路由就会自动帮我们生成路由 这里是一级路由 我们可以通过 访问浏览器地址的detail路径访问到
```

![](2.png)

![](3.png)

## 视口

```JS
1.首先我们的项目创建完毕之后会自动生成一个layout的文件夹 里面有default.vue文件 这个相当于我们前台的app.vue文件 
2.我们的视口标签是<nuxt> 相当于我们前台的router-view标签 你所有在pages下里面页面文件都会同构这个nuxt视口的标签去显示
```

## 导航跳转

```JS
1.我们在传统的Vue项目里 是通过<router-link></router-link> 标签 to属性去指定跳转的地址
2.这里的nuxt框架 也是一样 为我们提供了三种跳转的方式 <nuxt-link to="/"> <NLink to=""> <n-link to="">
```

```html
<template>
  <div>
    <nuxt-link to="/">
      首页
    </nuxt-link>
    <NLink to="/admin">
      管理
    </NLink>
    <n-link to="/cart">
      购物车
    </n-link>
     <!--这个是视口 相当于我们的router-view-->
    <Nuxt />
  </div>
</template>

```

![](4.gif)

## 预加载

```JS
1.ssr渲染 所有的页面都采用了预加载 好比我们现在有首页 和admin页面 他会把首页的js文件加载进来之后 又去加载admin的js页面文件  
```

![](4.png)

```JS
2.有的时候 我们有些页面 不需要预加载 只有在点击的时候才去加载 只需要在跳转的 标签上 粘贴图下即可
禁用预加载： <n-link no-prefetch>page not pre-fetched</n-link> 
```

```html
<template>
  <div>
    <nuxt-link to="/">
      首页
    </nuxt-link>
    <NLink to="/admin">
      管理
    </NLink>
    <!--我们的购物车页面禁止预加载  这样 加上no-prefetch之后 就不会在去加载购物车的js页面文件了-->
    <n-link to="/detail" no-prefetch>
      购物车
    </n-link>
    <Nuxt />
  </div>
</template>
```

## 路由跳转的传参

```JS
1.我们往往需要在跳转路由的时候带过去一些参数 以前前台渲染的时候 是需要在路由文件里配置{path:'/detail/:id'}
2.ssr渲染的时候 我们需要新建一个文件夹 文件夹的名字是detail(这里是你要跳转的路径) 然后文件夹里面的文件需要写成_id.vue
detail(文件夹)-_id.vue(文件)  等同于 {path:'/detail/:id'} 这个路由地址 如果存在多个参数  就多个嵌套即可
3.参数的获取还是和以前一样 用$route.params.id
```

```JS
比我们的商品列表 跳转到 我们的商品详情列表 是需要带着当前你点击的商品 然后把ID通过地址栏的传过
```

```html
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <li v-for="good in goods" :key="good.id">
        <!--这里点击的时候 跳转到商品详情页面 带着我 们的商品的ID过去-->  
        <nuxt-link :to="`/detail/${good.id}`">
          <span>{{ good.text }}</span>
          <span>￥{{ good.price }}</span>
          <button @click.prevent="addCart(good)">
            加购物车
          </button>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods: [
        { id: 1, text: 'Web全栈架构师', price: 8999 },
        { id: 2, text: 'Python全栈架构师', price: 8999 }
      ]
    }
  },
  methods: { addCart () {} }
}
</script>

```

```JS
此时我我们就需要在pages下 新建一个文件夹detail 然后在此文件夹下新建一个_id.vue文件 这个时候我们的路由文件也会自动生成 如下 当我们在点击跳转的时候 他就会自动的去往detail文件夹下的_id.vue文件去跳转
 { path: "/detail/:id",component: _4eeced0d,name: "detail-id"},
```

![](5.png)

![](5.gif)

## 动态路由传参的获取

```JS
1.还是通过$route.params 可以获取到
```

## 动态路由多个传参

```JS
1.刚刚上面我们从商品列表跳转到商品详情的时候 值传了ID过去 现在想把价格也传过去
2.这个时候就需要写嵌套的语法
3.在detail文件下新建_id的文件夹 在_id的文件夹下 新建_price.vue文件
4.这个时候浏览器在传参的时候 就会先把id作为最前面传进去 在传进去price
```

```html
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <li v-for="good in goods" :key="good.id">
        <!--我们把商品ID 和 price都传递过去了-->  
        <nuxt-link :to="`/detail/${good.id}/${good.price}`">
          <span>{{ good.text }}</span>
          <span>￥{{ good.price }}</span>
          <button @click.prevent="addCart(good)">
            加购物车
          </button>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods: [
        { id: 1, text: 'Web全栈架构师', price: 8999 },
        { id: 2, text: 'Python全栈架构师', price: 8999 }
      ]
    }
  },
  methods: { addCart () {} }
}
</script>
```

```JS
这个时候 由于我们传递的是两个参数 所以就需要在detail文件夹下 新建 _id文件夹 在_id文件夹下新建_price.vue文件
```

![](6.png)

![](6.gif)

## 路由的query传参 

```JS
1.我们这里依然可以使用编程式导航去跳转 this.$router.push
2.去参的时候 还式使用 $route.query
```

```html
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <li v-for="good in goods" :key="good.id" @click="goDetail(good)">
        <span>{{ good.text }}</span>
        <span>￥{{ good.price }}</span>
        <button @click.prevent="addCart(good)">
          加购物车
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods: [
        { id: 1, text: 'Web全栈架构师', price: 8999 },
        { id: 2, text: 'Python全栈架构师', price: 8999 }
      ]
    }
  },
  methods: {
    addCart () {},
    //这里我们用编程式导航去跳转 把我们点击的当前商品传了进去  
    goDetail (good) {
      this.$router.push({ path: '/detail', query: { good } })
    }
  }
}
</script>

```

```html
<!--商品详情页面-->
<template>
<!--通过 $route.query 取参-->
  <div>
    我是商品详情 -----{{ $route.query }}
  </div>
</template>
```

![](7.gif)

## 嵌套视口

```JS
1.如果我们需要在一个页面下面有一个视口 当点击按钮的时候去跳转不同的页面 首先我们需要在当前页面 添加一个 路由视口标签
    <!-- 路由视图 -->
    <nuxt-child></nuxt-child>
2.新建一个跟你当前页面名称一样的文件夹 然后文件夹里面是你要在<nuxt-child></nuxt-child> 这个视口里要显示的页面
3.如果有参数的话 和上面路由跳转的传参的一样文件名称需要写_id.vue这种名称
4.跳转的按钮要的to属性 <nuxt-link :to="{name:'index-id',params:{id:good.id}}">
  这里的跳转路由的名字就需要写成 你当前文件的文件名 和你要跳转的文件的文件名
```

```JS
1.上面的例子我们看到 当我们商品列表跳转到详情页面的时候 其实换了一个页面
2.下面我们需要把我们的商品详情列表展示在我们的商品列表下方
3.所以我们需要一个视口 这里我们要用nuxt-child标签 去充当
4.然后我们的商品列表 是在我们的index.vue文件下 所以我们需要新建一个index文件夹 作为我们的子页面
5.传递的参数还是照长去写
```

```html
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <li v-for="good in goods" :key="good.id">
        <!--这里记住跳转的时候 就是要写我们的名字了 这个是你新建之后自动生成的-->  
        <nuxt-link :to="{name:'index-id',params:{id:good.id}}">
          <span>{{ good.text }}</span>
          <span>￥{{ good.price }}</span>
          <button @click.prevent="addCart(good)">
            加购物车
          </button>
        </nuxt-link>
      </li>
    </ul>
    <!--这里新建了一个视图窗口-->
    <nuxt-child />
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods: [
        { id: 1, text: 'Web全栈架构师', price: 8999 },
        { id: 2, text: 'Python全栈架构师', price: 8999 }
      ]
    }
  },
  methods: { addCart () {} }
}
</script>

```

![](7.png)

```JS
1.上面写完之后 我们的路由文件生成如下
```

![](8.png)

![](8.gif)

## 多套布局

```JS
1.同通过上面的学习我们可以知道 我们在pages文件夹下 每次创建一个文件 就会对应生成一个路由地址 而这些最终页面文件都会走 我们layout文件夹下 default.vue 的视口
```

```html
<!--layout文件夹下 default.vue文件 我们自己的些的页面文件默认都会走这个视口-->
<template>
  <div>
    <Nuxt />
  </div>
</template>
```

```JS
2.如果此时我们有别的页面文件 要走指定的路由视口 就需要我们自己去配置
3.需要在页面文件 添加下面配置 export default { layout: 'blank' }
4.然后在layout文件夹下面新建 一个名字交blank.vue文件 里面写上视口标签nuxt
```

```html
<!--pages文件夹下的login.vue文件-->
<template>
  <div>我是登录</div>
</template>

<script>
export default {
  //这里给我们的登录页面配置指定的视口文件
  layout: 'blank'
}
</script>
```

```html
<!--这里需要在layout文件夹下 新写一个视口文件 名字是我们上面login指定的那个-->
<template>
  <div>
    登录的视口
    <!--这里写上视口标签-->  
    <nuxt />
  </div>
</template>

<script>
export default {

}
</script>
```

## head函数

```JS
1.我们的每个vue文件 都会有不同的nuxt的函数 
2.head() 主要这是每个页面文件的title 再浏览器的上面显示的title 对seo友好
3.只需要在每个页面文件配置如下 浏览器就会在titel 上生成你写的 而且你加入的 js和图标也会显示出来
export default {
head () {
    return {
      title: '课程列表',
      meta: [{ name: 'description', hid: 'description', content: 'set page meta' }],
      link: [{ rel: 'favicon', href: 'favicon.ico' }]
    }
  }
}    
```

## 如何发送请求

```JS
1.首先这里我们还需要用axios去发送请求 这里需用装一下包 npm install @nuxtjs/axios -S nuxt整合axios的包
2.然后再nuxt.config.js里配置一下
```

## 配置：nuxt.config.js 

```JS
modules: [
'@nuxtjs/axios',
],
 
axios: {
proxy: true
},
//配置代理 下面是你要访问的服务的端口号 以api开头的 都去下面的服务器访问    
proxy: {
"/api": "http://localhost:8080"
},
```

## asyncData函数 获取异步数据

```js
1.asyncData 方法使得我们可以在设置组件数据之前异步获取或处理数据。
2.asyncData里的this不能用 因为这个是最早创建出来的你的this还没有没实例化 
3.形参里nuxt是传递的上下文 再这里我们能拿到很多有用的参数
4.这个函数只有在页面组件里才能使用 也就是在pages里新建的Vue文件 才有 components文件夹下新建的组件文件是没有这个函数的
//注意事项
asyncData 方法会在页面组件每次加载前被调用(是能使用再page文件里的组件)
asyncData 可以再服务端或者路由更新之前被调用
第一个参数被设定为当前页面的上下文对象
nuxt会将组件asyncData和data 方法返回的数据融合
由于asyncData再组件初始化前被调用的 所以不能通过this引用组件实例 因为那个时候vue组件实例还没有被创建
```

## 发送请求

```JS
<template>
  <div>
    <h2>商品列表</h2>
    <ul>
      <li v-for="good in goods" :key="good.id">
        <nuxt-link :to="{name:'index-id',params:{id:good.id}}">
          <span>{{ good.text }}</span>
          <span>￥{{ good.price }}</span>
          <button @click.prevent="addCart(good)">
            加购物车
          </button>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  async asyncData ({ $axios, error }) {
    const { ok, goods } = await $axios.$get('/api/goods')
    if (ok) {
      // 此处返回的数据会和data中的数据合并 
      return { goods }
    }
    // 重定向到错误页面
    error({ statusCode: 400, message: '数据查询失败' })
  },
  methods: {
    addCart () {}
  },
  head () {
    return {
      title: '课程列表',
      meta: [{ name: 'description', hid: 'description', content: 'set page meta' }],
      link: [{ rel: 'favicon', href: 'favicon.ico' }]
    }
  }
}
</script>
```

## 中间件

```JS
1.中间件 首先我们需要在middleware文件夹下 创建一个js文件 导出一个函数 所有所有页面跳转之前就会执行你这个函数 这个函数里的形参 我们可以拿到很多东西 比如你的route redirect 和 store 等等
2.中间件一般分为两种 一种是全局的 就是你所有的页面跳转的时候都要走我的这个中间件的函数 第二种是单页面的 比如从一个页面跳转到某一个页面的时候 需要走我这个中间件
```

```JS
1.这里我们先展示页面跳页面 比如我们从A页面 到 B页面的时候 需要走中间件 而A - C 不用
```

```JS
//middleware 文件夹 新建中间件函数auth.js文件  这里我们能通过形参拿到很多我们有用的饿参数  
export default function({ route, redirect, store }) { 
    // 上下文中通过store访问vuex中的全局状态 
    // 通过vuex中令牌存在与否判断是否登录 
    if (!store.state.user.token) { 
        redirect("/login?redirect="+route.path)
    } 
}
```

```html
<!--然后我们需要在走中间件的B 页面 写上如下配置 以后只要有别的页面走到我们的B页面的时候 都会先走auth.js文件-->
<template>
	需要走中间件的B 页面
</template>
<script>
    export default { 
        //写如下配置 这个auth 就是我们刚刚新建的中间件函数 auth.js
        middleware: ['auth'] 
    } 
</script>
```

```JS
2.全局中间件的配置 就是所有的页面之间的跳转都要走我的这个中间件
```

```JS
//只需要在nuxt.config.js的 router里配置接可
router: {
   middleware: ['auth']
 },
```

## nuxt中的vuex的使用

```JS
1.不需要再去挂在index文件 只需要再store文件夹目录下创建对应的store模块即可 下面是user模块 
export const state = () => ({
  token: ''
})
export const mutations = {
  init (state, token) {
    state.token = token
  }
}
export const getters = {
  isLogin (state) {
    return !!state.token
  }
}
export const actions = {
  login ({ commit, getters }, u) {
      //利用nuxt提供的inject方法注入了$login方法 this指的是store的实例
    return this.$login(u).then(({ token }) => {
      if (token) {
        commit('SET_TOKEN', token)
      }
      return getters.isLogin
    })
  }
}
```

## nuxt插件注入 inject方法

```JS
1.这里我们用接口函数去举例 我们以前再页面掉接口函数的时候 都需要用import导入接口函数文件
2.nuxt这里给我们提供了插件的方法 只需要把你写的接口函数通过插件的形式注入到nuxt里面去 然后再文件的任何地方都可以调用了
```

```JS
//步骤
1.首先需要在plugin文件夹里创建你的接口文件(api-inject 文件名) 写入下面函数 inject是们nuxt自带的函数
// 参数1上下文，参数2 inject函数
export default ({ $axios }, inject) => {
  inject("login", user => {
    return $axios.$post("/api/login", user);
  });
};
2.然后再我们的nuxt.config.js文件里 再plugin选项里把我们方才创建的文件名字写入进去
  plugins: [
    "@/plugins/element-ui",
     //这里写入你刚才的文件名
    "@/plugins/api-inject",
    "@/plugins/interceptor",
  ],
以上你写的 login函数就能全局共用了   
3.调用的时候 我们直接就可以写
this.$login() 才可以使用
```

## 配置请求拦截

```JS
1.配置和上面一样 还是需要再plugin里写请求拦截文件 
2.然后再nuxt.config.js里的plugin选项去注册
```

```JS
//配置 plugin-> interceptor.js
export default function ({ $axios, store }) {
  // onRequest是$axios模块提供的帮助方法
  $axios.onRequest((config) => {
    if (store.state.user.token) {
      // 将令牌附加到请求头
      config.headers.Authorization = 'Bearer ' + store.state.user.token
    }
    return config
  })

  //
}
//注册 nuxt.config.js -> plugin选项
plugins: [
    "@/plugins/element-ui",
    "@/plugins/api-inject",
    "@/plugins/interceptor",
  ],
```

## 关于cookie

```JS
1.首先我们的是服务端渲染 cookie是存放在服务端的 所以 当我们刷新页面的时候 你没有办法获取到服务端的cookie 还是会让你去登录页面
2.这里我们就需要安装一个可以再任何端都拿到cookie的模块cookie-universal-nuxt,
3.接下来我们就需要再store的根实例 也就是index.js文件里创建nuxtServerInit方法 Nuxt再初始化的时候调用他 会把我们想将服务端的一些数据传到客户端
```

```JS
1.安装 cookie-universal-nuxt 模块
2.再nuxt.config.js的modules选项里配置
modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],
3.store(文件夹) ->index.js 
export const actions = {
  // nuxtServerInit必须声明在根模块
  //   参数1是action上下文，参数2是组件上下文
  nuxtServerInit ({ commit }, ctx) {
    console.log(ctx)

    const token = ctx.app.$cookies.get('token')
    if (token) {
      console.log('nuxtServerInit: token:' + token)
      commit('user/SET_TOKEN', token)
    }
  }
}
当你每次刷新的时候 他就取cookie里的token然后 存放再vuex中 nuxtServerInit只能写再根vuex的实例 
```

