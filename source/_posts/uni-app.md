---
title: Uni-app
date: 2020-04-21
updated: 2019-06-03
tags: 小程序
categories: 微信
keywords: 微信
description: 微信
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

## uni-app介绍

```JS
uni-app是一个使用vue.js开发所有前端的应用的框架，开发者编写一套代码 可发布到IOS Android H5 以及各种小程序
即使不跨段 uni-app同时也是更好的小程序开发框架
```

## 环境搭建

```JS
1.需要安装HbuilderX  APP开发板
2.安装微信开发者工具
3.创建项目 新建 - uni-app项目
4.运行 直接点运行 就可以看到运行到浏览器 模拟器之类的
5.运行 到微信开发者工具 首先第一次运行需要在Hbuilder配置微信开发者工具所在的位置 第二 需要在微信开发者工具里的安全设置端口
```

## 文件目录详解

```JS
1.pages.json  主要用来对uni-app进行全局设置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生tabbar等
2.manifest.json 主要是应用的配置文件、用于指定应用的名称、图标、权限等
3.app.vue 是我们的根组件，所有页面都是在app.vue下进行切换的，是页面的入口文件，可调用应用的生命周期函数
4.main.js 是我们项目文件的入口文件 主要作用是初始化vue实例并使用需要的插件
uni.scss 用途是为了方便整体控制应用的风格，比如按钮颜色、边框风格，uni.scss 文件里预设了一批scss变量预值
unpackage 就是打包目录 在这里有各个平台的打包文件
page 所有页面存放的目录
static 静态资源目录 列入图片
components 组件存放目录
```

## page.json文件详解

```JS
1.这里分为全局的配置和页面级的配置
2.比如头部 我们全局都会有头部和标题 但是每个页面也会有头部和标题 这样就可以单独配置一下全局的和页面的
3.如果页面的头部和标题没有配置 那么全局会替代掉
4.其他配置项页是如此
5.具体的一些详细配置查看API文档 比如下拉刷新之类的
```

```JS
//初始结构
1.初始结构
{
    //页面的配置 如每个页面的头部颜色 文字
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		}
	],
     //全局的配置
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#7FFF00",
		"backgroundColor": "#F8F8F8"
	}
}
```

## 创建新的页面

```JS
1.在page文件夹里右键新建页面和文件即可
2.新建完毕之后 需要在pages.json文件里 把你的页面路径写入进去
```

```JS
//这里那个是在数组的第一位 就会显示为当前页面
"pages": [ 
    {
        "path": "pages/message/message",
        "style": {
            "navigationBarTitleText": "新建页面"
        }
    },
    {
        "path": "pages/index/index",
        "style": {
            "navigationBarTitleText": "uni-app"
        }
    }
],
```

## Tabbar的配置

```JS
1.首先需要写在page.json文件里
2.他和page 和 globalStyle 是同级别的配置
3.具体的tabbar要求和规范见详细文档
```

```JS
//最少要有两个
"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#7FFF00",
		"backgroundColor": "#F8F8F8"
	},
     //和global为同级
	"tabBar":{
		"list":[
			{
				"test":首页"",
				"pagePath":"pages/index/index", //点击的时候显示的页面
				"iconPath":"static/tabs/1.png", //默认图标
				"selectedIconPath":"static/tabs/active.png" //选中图表
			}
		]
	}
```

## condition启动模式配置

```JS
1.我们在浏览器的地址栏中可以直接输入文件目录来访问文件
2.在小程序中可以把page提到数组的第一个位置 但是比较麻烦
3.就可以通过condition来配置当前页面显示
4.比如我们在从商品列表跳转到商品详情页面的时候 需要传递一个ID 
```

```JS
//和global-style page tabbar 是同级
"condition":{
		"current": 0,
		"list":[
			{
				"name":"详情页",
                //调换到哪个页面
				"path":"pages/message/message",
                //跳转的时候带的参数
				"query":"id=80"
			}
		]
	}
//以上配置完毕之后 会在微信开发这工具普通编译的下拉框里 就会出现你name的那个页面 点击页面参数 就可以看到传递过来的参数
```

## uni-app组件的使用

```JS
1.view标签 相当于div
2.text标签 相当于span 里面会有一些属性 
3.其他标签组件 查看具体uni-app文档
```

## uni-app样式

```JS
1.首先我们的uni-app采用的是rpx单位 即所有的屏幕宽度都是750 所以我们在做小程序的时候 让设计高变成750即可 然后我们就按照设计稿的单位去布局即可
2.导入外部的样式的时候 我们就采用@import url('要导入文件的路径') 支持常用选择器 但是不能使用* page 相当于baody节点
3.当使用字体图标的时候 小于40kb会自动转换为base64 如果大于40kb 需要自己转换 否则不生效
4.app.vue文件里写的样式 是全局的样式 生效于所有页面
```

## uni-app中使用预编译处理器sass或者less

```JS
1.首先需要在页面上的style的标签上 lang="scss"
2.点击工具-> 插件安装 安装scss编译
```

## uni-app生命周期

```JS
1.uni-app的生命周期主要分为俩部分
2.一个是应用的生命周期 比如你的应用开启关闭切换到后台的时候
3.是页面的生命周期
```

```JS
//应用的生命周期 一般定义在app.vue文件里
onLuanch 当uni-app初始化完成的时候出发(全局只触发一次)
onShow 当uni-app 启动 或从后台进入前台显示
onHide 当uni-app 从前台进入后台
onError 当uni-app 报错时出发
```



```JS
//页面生命周期
onLoad 监听页面加载 其参数为上个页面传递的数据 
onShow 监听页面显示 页面每次出现在屏幕上 包括从夏季页面点返回露出当前页面
onReady 监听页面初次渲染完成
onHide 监听页面隐藏
onUnload 监听页面卸载
```

## 页面的下拉刷新第一种方式

```JS
1.开启页面的下拉刷新有两种方式 
2.在page.json的文件里 找到配置页的当前的路径配置 然后在style选项中开启enablePullDownRefresh
3.然后可以在页面的文件里onPullDownRefresh方法中监听到这个下拉刷新
4.停止下来刷新可以调用uni.stopPullDownRefresh()
```

```JS
//page.json文件里
{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/message/message",
			"style": {
				"navigationBarTitleText": "新建页面",
                //这里就是为当前的页面开启了下拉刷新
				"enablePullDownRefresh":true
				
			}
		},
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		}
	],
}       
```

```JS
//下拉刷新
<template>
	<view>
		我是新建的页面
		<view v-for="item in list" :key="item">
			{{item}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[1,2,3,4,5]
			}
		},
		methods: {
			
		},
         //监听到页面的下拉刷新事件
		onPullDownRefresh(){
			this.list.push(6)
            //停止下拉刷新事件
			uni.stopPullDownRefresh()
		}
	}
</script>

```

## 页面下拉刷新第二种方式

```JS
1.调用uni.startPullDownRefresh()
2.停用uni.stopPullDownRefresh()
```

## 上拉加载

```JS
1.onReachBottom() 当页面滚动到底部的时候就会加载 
```

```JS
//代码
<template>
	<view>
		我是新建的页面
		<view class="box" v-for="item in list" :key="item">
			{{item}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14]
			}
		},
         //页面触底事件
		onReachBottom(){
			console.log('我到底部了')
		}
	}
</script>

<style>
.box{
	margin-top: 30px;
}
</style>
```

## 网络请求

```JS
getData(){
    uni.request({
        url:' http://127.0.0.1:7001/',
        success(res){
            console.log(res)
        }
    })
}	
```

## 数据缓存

```JS
1.分为同步和异步
2.存和取都是一样的
3.其他跟H5的本地存储差不多
```

```JS
//存的基本用法
uni.setStorage({
    key:'',
    data:'要存的数据',
    success:() => {
        //保存成功的回调函数
    },
    fail(){
        //调用失败的回调函数
    }
})
```

```JS
//取的基本用法
uni.getStorage({
    data:'id',
    success(res){
        console.log(res,'我是取的数据')
    }
})
```

## 图片上传和预览

```JS
1.uni.chooseImage({
    count:'几张图片',
    sizeType:'原图还是压错图 默认二者都有',
    sourceType:'从相册选图 还是从相机',
    success:() => {'成功返回突变的本地文件路径列表'},
    fail:() => {'失败返回的回调'}
})
```

## 条件编译跨段兼容

```JS
1.有的元素我们希望在H5中显示 在小程序中不显示 有的需要在小程序中显示 不想他在APP中显示 这个时候就需要条件编译
2.在元素结构中的语法 就是 具体的端的标识查看文档
<!-- #ifdef 端的标识 -->
你要跨端的元素
<!-- #endif -->
3.在方法中的语法
// #ifdef MP-WEIXIN
console.log('我希望在微信小程序中打印')
//#endif
4.在样式中
/* #ifdef MP-WEIXIN */
.box{
    color:red
}
/* #endif */
```

```JS
//实例
<!-- #ifdef H5 -->
<view>我要在H5中页面显示</view>
<!-- #endif -->
//实力
methods{
    getdata(){
        // #ifdef MP-WEIXIN
        console.log('我希望在微信小程序中打印')
        //#endif
    }
}
```

## 导航跳转

```JS
1.主要分为两种 一种是声明式跳转 一种是编程时跳转
2.声明式跳转 主要就是利用navigator 标签取跳转
3.编程式跳转 主要应用api去跳转 uni.navigateTo({url:'页面路径'})
```

```JS
//声明式跳转 
<navigator url="/pages/index/index">跳转去index页面</navigator>
//跳转到tabbar的页面 需要加上 open-type="switchTab"
<navigator url="/pages/index/index" open-type="switchTab">跳转去tabbar页面</navigator>
//redirect 属性的跳转 会把上一个页面关闭(销毁)也就式没有回退按钮
//跳转到tabbar的页面 需要加上 open-type="switchTab"
<navigator url="/pages/index/index" open-type="redirect">跳转去tabbar页面</navigator>
```

```JS
//编程式跳转
methods:{
    goPage(){
        uni.navigateTo({
            //页面路径
            url:'/page/index/index'
        })
    }
}
//跳转到tabbar页面
methods:{
    goPage(){
        uni.switchTab({
            //页面路径
            url:'/page/index/index'
        })
    }
}
```

## 跳转页面传参

```JS
1.参数用查询字符串的方式去传递
2.参数取值在onLoad的钩子函数里的参数了去取
```

```JS
//示例
uni.navigateTo({
    url: 'test?id=1&name=uniapp'
});
//取参
export default {
    onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
        console.log(option.id); //打印出上个页面传递的参数。
        console.log(option.name); //打印出上个页面传递的参数。
    }
}
```

## 组件的创建和传值

```JS
1.在编辑器里右键就会有新建组件按钮
2.组件的生命周期和vue中的一致
3.组件的传值 和vue一直 这里就不在演示了
```

```JS
//这里我们写跨组件传值
核心API 就是uni.$emit('自定义事件',你要传的值) uni.$on('自定义事件名称',function(res){'这里的res就是传过来的值'})
```























