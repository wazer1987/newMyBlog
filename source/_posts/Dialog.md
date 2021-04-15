---
title: 弹框组件
date: 2020-03-29
updated: 2019-06-04
tags: JavaScript
categories: 项目实战
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

# 弹框组件封装

## 思想

```js
1. 这里我们封装的是一个插件组件 也就是 这里面有样式 和 html 结构
2. 不同于我们的方法 直接调用即可 这里可能还支持我们的自定义样式
```

## 需要考虑的事情

```js
1. 实现一个插件组件(UI) 这就可能存在处理样式的问题
2. 在插件内部 创建元素的时候 把样式 基于行内的样式 写入进去 所有的HTML结构 都要基于 JS 创建 这种方式 调用很方便  但是不能提取公共样式的提取 以及 后期的修改 如果用户自定义样式的处理 是不能实现的
3. 第二种方案。就是 把我们的方案写如到样式表中 如果不期望用户自己导入样式 我们在JS中动态创建LIKN标签 不过这种方式 必须要联网 并且导入的样式资源最好部署到CDN上(否则导入速度慢)
4. 样式中 尽量不要出现图片 因为会导致别人在用你的插件的时候 出现样式错乱 如果一定要用 那么尽量用base64
5. JS的处理 这里我们基本上都是用基于变向对象思想 去封装 这种好处 插件可以创建实例 调用一次 就相当于创建一个实例 实例和实例之间 既存在私有的属性方法 也能调用共公共的方法 并且还可以把类当作对象 
6. 需要考虑的DOM处理 页面中有原始结构 我只是控制显示隐藏(性能会好一些 但是不能弹出多个框) 
所有的结构 都是基于JS 动态创建(性能会有所消耗 但是可以根据需求自己创建N个)
7. 封装插件组件的目的 就是为了复用 也是为了构建敏捷化开发平台的一个重要环节
```

## 插件支持的配置信息

```js
1. 调用一次插件 创建一套 新的插件结构 关闭的时候 把这套结构移除掉
+title[string]  插件的标题 可以撇值
+template[string] 内容不确定(template) 自定义内容 或者模版字符串 拼接更丰富的内容	
+buttons[array] 弹框底部的 自定义 按钮(组)「array」 [{text:'确定',click:callback}] 按钮点击的时候 做什么的 回调函数
+modal[boolean] 遮罩层 显示于隐藏 默认是true 显示的
+drag[boolean] 按住头部的时候 是否允许拖拽 默认是false
+opened[boolean] 方法一执行 弹出框 是打开还是隐藏 默认 true
2. 配置生命周期函数 当前某个阶段 要额外做的事情 允许用户自定义处理的事情
+ 打开的时候 onopen
+ 关闭的时候 onclose
+ 拖拽开始 ondragstart
+ 拖拽中 ondraging
+ 拖拽结束 ondragend
```

## 创建的方式

```js
1. 我们分两种
2. 第一种就是 直接 new ModelPlugin 执行
3. 第二种就是 可以直接当函数执行 ModelPlugin 但是也返回他的实例
```

```js
// 第一种
(function() {
    function ModalPlugin(){}
  	 //挂在到window上
     window.ModalPlugin = ModalPlugin
})()
// 用的时候
new ModalPlugin()
```

```js
// 第二种 把原型中转一下 可以代理一下 直接使用函数调用的方式 就可以 创建实例
(function () {
    function ModalPlugin(options){
        return new Factory(options)
    }
    function Factory(options){
        
    }
    ModalPlugin.prototype = {
        constructor:ModalPlugin,
        version:'1.0.0'
    }
  	// 重写Factory原型指向
    Factory.prototype = ModalPlugin.prototype
    //支持commonjs 和 ES6 moudel 规范
    if(typeof window !== 'undefined'){
        window.M = window.ModalPlugin  = ModalPlugin
    }
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = ModalPlugin
    }
})()

//以后在用的的时候 直接当作函数调用
M()
```

```js
// 另外一种写法
(function () {
    function ModalPlugin(){
    }
    ModalPlugin.prototype = {
        constructor:ModalPlugin,
        version:'1.0.0'
    }
    //为了既可以像函数一样调用  也可以创造实例
    function proxy(){
        return new ModalPlugin()
    }
    if(typeof window !== 'undefined'){
      //在导出的时候 我们直接到处proxy
        window.M = window.ModalPlugin  = proxy
    }
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = proxy
    }
})()

//以后在用的的时候 直接当作函数调用
M()
```

## 参数传递

```js
1. 在需要传递很多实参的情况下(一般两个以上就认为多了) 如果是基于设定行参的方式来处理 就要存在严格的传递顺序 以及很难给参数设定默认是
2. 所以如果参数比较多。我们一般 都是基于对象 去传递 这样也比较好管理
```

```js
    function proxy( options = {} ){
        //1. 参数 我们现在基于对象传递 我们需要的参数有 title template buttons modal drag opened 这些字段
        if(Object.prototype.toString.call(options) !== '[object Object]') throw new TypeError('类型不对,需要一个对象',)
        //2. 参数处理 格式 校验 初始化默认值
        options = Object.assign({
            title:'系统温馨提示',
            template:'',
            buttons:[],
            modal:true,
            drag:true,
            opened:true
        },options)
        return new ModalPlugin()
    }
```

```js
//1. 校验参数类型 参数是传了 但是不是我们的要的类型 我们就要校验一下
    const toType = function (value){
        let class2type = {}
        //这里就是验证了你传进来的是什么类型 比如是 10 那么type 就是 [object Number]
            type = class2type.toString.call(value)
        // 使用正则捕获到  把我们 [object Number] 中的 Number 截取出来 在转换成小写 
        // 这里是为了 跟我们的参数映射表 做匹配
        return  /^\[object ([a-z-A-Z]+)\]$/.exec(type)[1].toLowerCase()
    }
    //2.为了更严格的参数校验 我们就要建立参数映射表 为每一个参数严格校验
    const props = {
        title:{
            type:'string',
            default:'系统温馨提示'
        },
        template:{
            type:'string',
            required:true
        },
        buttons:{
            type:'array',
            default:[]
        },
        modal:{
            type:'boolean',
            default:true
        },
        drag:{
            type:'boolean',
            default:true
        },
        opened:{
            type:'boolean',
            default:true
        }
    }
```

```js

    function proxy( options = {} ){
        //3. 参数 我们现在基于对象传递 我们需要的参数有 title template buttons modal drag opened 这些字段
        if(Object.prototype.toString.call(options) !== '[object Object]') throw new TypeError('类型不对,需要一个对象',)
        //4. 根据我们的参数映射规则表 校验参数
        let params = {}
        Object.keys(props).forEach( key => {
            //5.拿到每项的验证规则
            let {
                type,default:defaultVal,required = false
            } = props[key]
            //拿到 你传过来的参数 看看 你有没有传
            let val =  options[key]
            // 规则校验 这个是必须传的 但是 你没传 就报错
            if(required && val == undefined) throw new TypeError(`${key} 必须传递`)
            // 如果传了  但是不是我们要的类型 我们就需要类型校验
            if(val !== undefined){
                if(toType(val) !== type) throw new TypeError(`${key} 不是 ${type}`)
                //如果参数类型也正确 那么我们就赋值
                params[key] = val
                return
            }
            // 如果没传 也不需要 类型校验 就用我们的默认值
            params[key] = defaultVal
        })

        return new ModalPlugin()
    }
```

## 初始DOM结构

```js
1. 首先 我们需要一个init 方法 这个方法 是初始化我们的 实例的
2. 需要一个创建DOM结构的方法
3. 这里 会根据传进来的参数 去决定 创建不创建遮罩层 中间的内容 怎么显示
4. 为了减少回流 这里使用文档碎片的方式
5. 而且这里为了方便使用 把我们的创建好的元素 都挂在我们实例本身上了
```

```js
// 初始化 我们的实例 并且  并且初始一下 我们自己实例身上的属性
function ModalPlugin(options){
        this.options = options
        //1 需要用的东西都初始化一下
        this.$drag_modal = null
        this.$drag_content = null
        // 初始化结构  也就是创建 html结构
        this.init()
    }
```

```js
// 初始化我们的 DOM 结构 方法
    ModalPlugin.prototype = {
        constructor:ModalPlugin,
        version:'1.0.0',
        //2.创建DOM结构
        createDOM:function(){
            // 把我们的参数结构出来 用来 判断 你的哪些结构需要根据参数显示和隐藏
            let {modal,title,template,buttons} = this.options
            // 这里我们注意 因为我们创建了两次元素 并且往body里插入了两次 就会产生两次回流 所以我们使用文档碎片
            // 先都插入到文档碎片里  然后 在想body里插入文档碎片
            let frag = document.createDocumentFragment()
            // 判断用户传进来的 是否需要遮罩层
            if(modal){
                // 创建好遮罩层 因为可能这个遮罩层 需要显示和隐藏 所以我们要挂在到我们的实例上
                this.$drag_modal = document.createElement('div')
                this.$drag_modal.className = 'drag_modal'
                // 把创建好的遮罩层 插入到我们的body中
                frag.appendChild(this.$drag_modal)
            }

            // 创建内容结构
            this.$drag_content = document.createElement('div')
            this.$drag_content.className = 'drag_content'
            this.$drag_content.innerHTML = `
            <div class="drag_head">
                ${title}
                <a href="javascript:;" class="drag_close"></a>
            </div>
            <div class="drag_main">
                ${template}
            </div>
            ${buttons.length > 0? `<div class="drag_foot">
                ${buttons.map((item,index) => {
                    return `<a href="javascript:;" class="drag_button">
                                ${item.text}
                            </a>`
                }).join('')}
            </div>`:''}
            `
            //使用文档碎片 减少回流
            frag.appendChild(this.$drag_content)
            document.body.appendChild(frag)
        },
        //7.1 入口 命令模式 主要初始化我们的结构
        init:function(){
            this.createDOM()
        }
    }
```

## 默认打开弹框

```js
1. 我们 的弹框 组件 默认是不是 直接就打开的
2. 根据我们传进去的变量 opened 来控制
```

```js
 let m1 = M({
    template:'今天我完成了插件组件的封装',
    model:true,
    buttons:[
        {text:'确定'},
        {text:'取消'}
    ],
    opened:true
})

init:function(){
            this.createDOM()
            // 默认就打开弹框和遮罩层 通过你传进来的opened去控制
            if(this.options.opened){
                this.$drag_modal ? this.$drag_modal.style.display = 'block' : null
                this.$drag_content ? this.$drag_content.style.display = 'block' : null
            }
        }
```

## 控制弹框显示隐藏的方法

```js
1. 另外 我们还需要一个方法 去打开弹框 一个方法去关闭弹框
2. 比如我们页面上有个按钮 我们已打开的时候 就来控制他的显示 关闭的时候 就让他隐藏
3. 这里我们还需要写一个销毁的方法 用来把我们创建的结构 从页面中移除
```

```html
<!--打开方式的调用-->
<button id="btn">按钮</button>
    <script src="./Dialog.js"></script>
    <script>
        let m1 = M({
            template:'今天我完成了插件组件的封装',
            model:true,
            buttons:[
                {text:'确定'},
                {text:'取消'}
            ],
            opened:false
        })
        document.getElementById('btn').onclick = open
        function open() {
            console.log(111)
            m1.open()
        }
    </script>
```

```js
// 此时我们的元素都是挂在到我们自己实例上自定义属性 所以  因为元素已经创建出来了 我们只需要 控制他的display 属性即可

ModalPlugin.prototype = {
        constructor:ModalPlugin,
        version:'1.0.0',
        createDOM:function(){...},
        // 打开弹框的方法
        open(){
            this.$drag_modal ? this.$drag_modal.style.display = 'block' : null
            this.$drag_content ? this.$drag_content.style.display = 'block' : null
        },
        // 关闭弹框(隐藏)
        close(){
            this.$drag_modal ? this.$drag_modal.style.display = 'none' : null
            this.$drag_content ? this.$drag_content.style.display = 'none' : null
        },
        // 销毁
        destroy(){
            this.$drag_modal ? document.body.removeChild( this.$drag_modal ):null
            this.$drag_content ? document.body.removeChild( this.$drag_content ):null
        },
        init:function(){
            this.createDOM()
            this.options.opened ? this.open() : null
        }
    }
```

## 点击处理

```js
1. 我们点击x 的关闭弹框 点击取消和确定分别有自己要处理的事情
2. 这里我们要用事件委托的方式 去写 
3. 这几个按钮都是在我们content 里面的  所以我们委托给我们的content的
```

```js
// 点击 X 的时候 关闭弹框 这里我们基于事件委托的方式 去判断点击源
init:function(){
    this.createDOM()
    this.options.opened ? this.open() : null
    // 1. 基于事件委托 去实现不同的点击事件
    if(this.$drag_content){
        let  _this = this
        this.$drag_content.addEventListener('click',function(ev){
            // 看看 你点击的是哪个 是X 还是取消 还是 确定
            let target = ev.target
                targetTag = target.tagName
                targetClass = target.className
            // 如果点击的是x 说明就应该关闭弹框 函数不在向下执行
            if(targetTag === 'A' && targetClass === 'drag_close'){
                //由于这里我们this的指向 已经改变成我们的 drag_content 所以需要 缓存一下this
                _this.close()
                return
            }
            }
        })
    }
}
```

```js
1. 点击我们的传来的buttons 按钮组 
2. 由于我们使用的是 事件委托的方式 方式 样式 和 标签样式 都是一样的 所以我们不知道点击的是哪个按钮
3. 所以我们创建 按钮的时候 直接就给我们的按钮设置一个自定义属性 赋值是我们的索引 这样 我们能拿到按钮组 在options上 就可以通过索引去选择了哪个按钮 
4. 点击按钮的时候 我们按钮组 传递过来了函数 我们需要让这个函数执行 另外 为了方便 我们还需要把我们的this传递进去 让buttons里的函数里的this 是我们的弹框的实例 如果不使用箭头函数的话 我们也以使用call 的方式 改变我们的this指向
```

```js
// 传递的按钮组
let m1 = M({
    template:'今天我完成了插件组件的封装',
    model:true,
    buttons:[
        {text:'确定',click:function(m){
            console.log(this)
        }},
        {text:'取消',click:(m) => {
          console.log(m)
        }}
    ],
    opened:false
})
```

```js
//创建DOM的时候 设置自定索引
this.$drag_content.innerHTML = 
  `
  <div class="drag_head">
      ${title}
      <a href="javascript:;" class="drag_close"></a>
  </div>
  <div class="drag_main">
      ${template}
  </div>
  ${buttons.length > 0? `<div class="drag_foot">
      ${buttons.map((item,index) =>	
  																			//这里设置了自定义索引
          return `<a href="javascript:;" index="${index}" class="drag_button">
                      ${item.text}
                  </a>`
      }).join('')}
  </div>`:''}
  `
```

```js
// 事件委托的时候 点击我们穿进来的按钮组

 init:function(){
            this.createDOM()
            this.options.opened ? this.open() : null
            //  基于事件委托 去实现不同的点击事件
            if(this.$drag_content){
                let  _this = this
                this.$drag_content.addEventListener('click',function(ev){
                    let target = ev.target
                        targetTag = target.tagName
                        targetClass = target.className
                    if(targetTag === 'A' && targetClass === 'drag_close'){
                        _this.close()
                        return
                    }

// 如果点击是我们的按钮 也就是我们的自定义按钮 这里如果确定 点击的是哪个按钮
// 我们在创建元素的时候 就给每个按钮设定自定义属性(这里我们设置的是索引) 然后 我们点击的时候 获取他的自定义属性
// 然后 根据索引 我们去buttons里找到这个按钮就可以确定是哪个按钮了
                    if(targetTag === 'A' && targetClass === 'drag_button'){
                        // 获取我们创建的时候 设置的自定义索引
                        let index = target.getAttribute('index')
                        // 根据取到的索引 我们去查找我们的自定义按钮
                            obj = _this.options.buttons[index]
                        // 做判断 如果你不存在 我就什么也不干
                        if(!obj || (typeof obj.click !== 'function')) return
                        // 这里 我们需要把函数调用 并且把this传进去
                        // 这里为了防止你在传 buttons 参数的时候 里面click 写的箭头函数 所以 我们把this也传进去
                        obj.click.call(_this,_this)
                        return
                    }
                })
            }
        }
```

## 修改

```js
1. 这里 我们在创建的时候 应该是点击按钮 创建实例 所以 这里我们暂时先吧opened去掉
2. 关闭的时候 直接就销毁
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./reset.min.css">
    <link rel="stylesheet" href="./Dialog.css">
</head>
<body>
    <button id="btn">按钮</button>
    <script src="./Dialog.js"></script>
    <script>
        document.getElementById('btn').onclick = open
        function open() {
            M({
            template:'今天我完成了插件组件的封装',
            model:true,
            buttons:[
                {text:'确定',click:function(m){
                    console.log(this)
                }},
                {text:'取消',click:function(){
                    this.close()

                }}
            ],
        })
        }
    </script>
</body>
</html>
```

```js
(function () {
    function ModalPlugin(options){
        this.options = options
        this.$drag_modal = null
        this.$drag_content = null
        this.init()
    }
    ModalPlugin.prototype = {
        constructor:ModalPlugin,
        version:'1.0.0',
        //8.创建DOM结构
        createDOM:function(){
            // 把我们的参数结构出来 用来 判断 你的哪些结构需要根据参数显示和隐藏
            let {modal,title,template,buttons} = this.options
            // 这里我们注意 因为我们创建了两次元素 并且往body里插入了两次 就会产生两次回流 所以我们使用文档碎片
            let frag = document.createDocumentFragment()
            if(modal){
                this.$drag_modal = document.createElement('div')
                this.$drag_modal.className = 'drag_modal'
                frag.appendChild(this.$drag_modal)
            }

            this.$drag_content = document.createElement('div')
            this.$drag_content.className = 'drag_content'
            this.$drag_content.innerHTML = `
            <div class="drag_head">
                ${title}
                <a href="javascript:;" class="drag_close"></a>
            </div>
            <div class="drag_main">
                ${template}
            </div>
            ${buttons.length > 0? `<div class="drag_foot">
                ${buttons.map((item,index) => {
                    return `<a href="javascript:;" index="${index}" class="drag_button">
                                ${item.text}
                            </a>`
                }).join('')}
            </div>`:''}
            `
            frag.appendChild(this.$drag_content)
            document.body.appendChild(frag)
        },
        close(){
            this.$drag_modal ? document.body.removeChild( this.$drag_modal ):null
            this.$drag_content ? document.body.removeChild( this.$drag_content ):null
        },
        init:function(){
            this.createDOM()
            if(this.$drag_content){
                let  _this = this
                this.$drag_content.addEventListener('click',function(ev){
                    let target = ev.target
                        targetTag = target.tagName
                        targetClass = target.className
                    if(targetTag === 'A' && targetClass === 'drag_close'){
                        _this.close()
                        return
                    }

                    if(targetTag === 'A' && targetClass === 'drag_button'){
                        let index = target.getAttribute('index')
                            obj = _this.options.buttons[index]
                        if(!obj || (typeof obj.click !== 'function')) return
                        obj.click.call(_this,_this)
                        return
                    }
                })
            }
        }
    }
    const isObject = function (value){
        let class2type = {}
            type = class2type.toString.call(value)
        return /Object/.test(type)
    }
    const toType = function (value){
        let class2type = {}
            type = class2type.toString.call(value)
        return  /^\[object ([a-z-A-Z]+)\]$/.exec(type)[1].toLowerCase()
    }
    ModalPlugin.isObject = isObject
    ModalPlugin.toType = toType
    const props = {
        title:{
            type:'string',
            default:'系统温馨提示'
        },
        template:{
            type:'string',
            required:true
        },
        buttons:{
            type:'array',
            default:[]
        },
        modal:{
            type:'boolean',
            default:true
        },
        drag:{
            type:'boolean',
            default:true
        }
    }
    function proxy( options = {} ){
        if(Object.prototype.toString.call(options) !== '[object Object]') throw new TypeError('类型不对,需要一个对象',)
        let params = {}
        Object.keys(props).forEach( key => {
            let {
                type,default:defaultVal,required = false
            } = props[key]
            let val =  options[key]
            if(required && val == undefined) throw new TypeError(`${key} 必须传递`)
            if(val !== undefined){
                if(toType(val) !== type) throw new TypeError(`${key} 不是 ${type}`)
                params[key] = val
                return
            }
            params[key] = defaultVal
        })

        return new ModalPlugin(params)
    }
    if(typeof window !== 'undefined'){
        window.M = window.ModalPlugin  = proxy
    }
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = proxy
    }
})()
```

## 动画

```js
1. 这里我们用过度去写动画 这里写个简单的 就是透明度的动画设置 那么初始我们的透明度设置为 0  设置transition属性 等到 我们的元素插入到了body中 我们就把动画设置为1
2. 当关闭的时候 正好和打开相反
```

```js
// 我们在DOM插入在body中以后 在修改透明度 为1。这个时候 动画并没有出现 因为 你初始时0 然后后来改成1 修改样式的操作 统一在我们的渲染队列里 直到在没有修改样式的操作之后 才会同意回流  这个时候指已最后的为准 所以这里 我们要获取一下 样式 刷新渲染队列 然后在设置他的透明度 为1

init:function(){
            this.createDOM()
            // 如果不获取一下样式 我们初始的时候样式 透明度 是0 然后插入到DOM后直接就改成1了
            // 这种在修改 是一瞬间的时候 因为 获取从你的渲染队列里去拿修改的样式 所以这里 我们要获取一下 让渲染队列刷新
            this.$drag_modal.offsetLeft
            this.$drag_modal.style.opacity = 1
            this.$drag_content.style.opacity = 1
            if(this.$drag_content){
                let  _this = this
                this.$drag_content.addEventListener('click',function(ev){
                    let target = ev.target
                        targetTag = target.tagName
                        targetClass = target.className
                    if(targetTag === 'A' && targetClass === 'drag_close'){
                        _this.close()
                        return
                    }

                    if(targetTag === 'A' && targetClass === 'drag_button'){
                        let index = target.getAttribute('index')
                            obj = _this.options.buttons[index]
                        if(!obj || (typeof obj.click !== 'function')) return
                        obj.click.call(_this,_this)
                        return
                    }
                })
            }
        }
```

```js
// 关闭的动画 

close(){
    if(this.$drag_modal ){
      	//这样动画会没有效果 因为此时你动画还没结束 元素就被移除了
        this.$drag_modal.style.opacity = 0
        document.body.removeChild( this.$drag_modal )
    }
    if(this.$drag_content){
        this.$drag_content.style.opacity = 0
        document.body.removeChild( this.$drag_content )
    }
},
// 这样动画才会有效果
close(){
    if(this.$drag_modal ){
        this.$drag_modal.style.opacity = 0
        //这里需要加入动画结束事件 如果不加的话 你动画还没结束的时候 
        //你就移除了元素 动画会导致没效果
        this.$drag_modal.ontransitionend = () => {
            document.body.removeChild( this.$drag_modal )
        }
    }
    if(this.$drag_content){
        this.$drag_content.style.opacity = 0
        this.$drag_content.ontransitionend = () => {
            document.body.removeChild( this.$drag_content )
        }
    }
},
```

## 拖拽

```js
1. 首先 传递参数的时候 传递drag 的时候 我们才可以去多拽
2. 我们首先要鼠标按下 我们的头部 然后给头部绑定鼠标按下事件
3. 这个时候 由于我们的事件源是 我们的头部 所以为了 保证this指向正确 我们要用bind
4. 鼠标按下的时候 我们要记录 我们鼠标按下的位置 还有 content的初始位置 这样我们要挂在到我们的实例上 
5. 鼠标在移动的时候 我们要拿到 我们鼠标移动的位置 然后 计算出来我们的 要拖拽的距离 用鼠标移动的距离 - 鼠标按下的距离 + content的初始位置 
6. 这里我们还有一个边界的问题 首先我们要拿到我们一屏的高度 和 宽度 如果你移动的距离小于我们的最小距离 那么就等于 我们的最小距离  最大距离 = 一屏的宽度 - 我们盒子自身的宽 就是最大安全距离 如果超过了 就等于 我们的最大安全距离
7. 这里为了 解决光标丢失的问题 我们使用windown绑定 因为使用DOM 0级 绑定 所以 解绑的时候 不用找哪个函数 直接 等于 null 就行了
```

```js
function ModalPlugin(options){
        this.options = options
        //8.1 需要用的东西都初始化一下
        this.$drag_modal = null
        this.$drag_content = null
        //15.把鼠标的开始位置 和我们的盒子的位置 记录一下
        this.startX = 0
        this.startY = 0
        this.contentL = 0
        this.contentT = 0
        //正平的宽度
        this.HTML = document.documentElement
        //7.1 初始化结构  也就是创建 html结构
        this.init()
    }
```

```js
// 原型上的方法
init:function(){
    this.createDOM()
    this.$drag_modal.offsetLeft
    this.$drag_modal.style.opacity = 1
    this.$drag_content.style.opacity = 1
    if(this.$drag_content){
        let  _this = this
        this.$drag_content.addEventListener('click',function(ev){
            let target = ev.target
                targetTag = target.tagName
                targetClass = target.className
            if(targetTag === 'A' && targetClass === 'drag_close'){
                _this.close()
                return
            }
            if(targetTag === 'A' && targetClass === 'drag_button'){
                let index = target.getAttribute('index')
                    obj = _this.options.buttons[index]
                if(!obj || (typeof obj.click !== 'function')) return
                obj.click.call(_this,_this)
                return
            }
        })
    }
    //开启拖拽
    if(this.options.drag){
        // 我们需要他的头部有移动 所以要设置移动的样式 然后按下点击事件
        this.$drag_head = this.$drag_content? this.$drag_content.querySelector('.drag_head') : null
        if(this.$drag_head){
            this.$drag_head.style.cursor = 'move'
            // 因为我们要在鼠标按下的事件处理函数里 拿到我们的this.$drat_content 所以为了保证this指向正确我们用bind
            this.$drag_head.onmousedown = this.down.bind(this)
        }
    }
}
```

```js
//头部按下的事件
        down(ev){
            // 鼠标按下的时候 要记录 鼠标的位置 和你 content的位置 我们把他挂在到实例上
            this.startX = ev.clientX
            this.startY = ev.clientY
            // 拿到我们的content的离上面 和 左边的距离
            let{top,left} = this.$drag_content.getBoundingClientRect()
            this.contentL = left
            this.contentT = top
            // 然后开始移动
            window.onmousemove = this.move.bind(this)
            window.onmouseup = this.up.bind(this)
        },
        //鼠标移动的事件
        move(ev){
            // 边界处理 向左的时候 如果小于我们的最小边界了 就等于 0 
            // 最大边界 是向右移动 最大边界 等于 我们整屏的宽度 减去 我么content的宽度
            let minL = 0
                minT = 0
                maxL = this.HTML.clientWidth - this.$drag_content.offsetWidth
                maxT = this.HTML.clientHeight - this.$drag_content.offsetHeight
            // 计算移动的距离 鼠标移动的位置 - 鼠标开始的位置 + 我们盒子的距离边界的距离
            let curL = ev.clientX - this.startX + this.contentL
                curT = ev.clientY - this.startY + this.contentT
            // 移动中 看看边界距离 如果向左边移动的时候 看看小于我们的安全距离不 如果小于了就等我我们的最小安全距离
            // 向右移动 看看 大于我们的最大安全距离不 如果大于 就等于我们的最大安全距离
            curL = curL < minL ? minL : curL > maxL ? maxL : curL
            curT = curT < minT ? minT : curT > maxT ? maxT : curT
            // 这里由于 我们盒子居中 用的是transform 设置的 起初就偏移了了所以我们要设置一下
            this.$drag_content.style.transform = 'translate(0, 0)'
            this.$drag_content.style.left = curL + 'px'
            this.$drag_content.style.top = curT + 'px'
            
        },
        //鼠标抬起的事件
        up(){
            // 由于这里我们采用的DOM 0级别 绑定 所以直接把事件给null 就可以了
            window.onmousemove = null
            window.onmouseup = null
        },
```

## 生命周期函数

```js
1. 我们这里主要想实现的生命周期函数有 
+ 打开的时候 onopen
+ 关闭的时候 onclose
+ 拖拽开始 ondragstart
+ 拖拽中 ondraging
+ 拖拽结束 ondragend
2. 这里实现的方式 有 回到函数的形式 就在在某个阶段 调用你传进来的函数 另外一种是事件发布订阅的形式
3. 这里我们 onopen 和 onclose 用回调函数的形式实现 其余的用发布订阅的形式实现
```

```js
// 打开的时候 我们直接 在创建元素阶段 然后调用你你传进来的函数即可 由于这两个函数是我们 后加入的 所以 我们可以直接在我的 校验的映射表添加即可 这也是 我们校验映射表的好处

const props = {
title:{
    type:'string',
    default:'系统温馨提示'
},
template:{
    type:'string',
    required:true
},
buttons:{
    type:'array',
    default:[]
},
modal:{
    type:'boolean',
    default:true
},
drag:{
    type:'boolean',
    default:true
},
onopen:{
    type:'function',
    // 如果没传我们就给个默认匿名函数
    default: Function.prototype
},
onclose:{
    type:'function',
    // 如果没传我们就给个默认匿名函数
    default: function(){}
}
```

```js
// 我们在创建DOM 和销毁的时候 直接调用这两个函数即可
createDOM:function(){
    .......很多代码
    // DOM 创建的时候 我们就调用这个open的函数 
    this.options.onopen.call(this,this)
},
// 11.关闭弹框(隐藏)
close(){
  	.......很多代码
    //DOM 销毁的时候 我们就调用这个close的函数 
    this.options.onclose.call(this,this)
},
```

## 发布订阅模式实现生命周期函数

```js
1. 发布订阅模式 首先我们需要一个线程池 然后on 的时候 往里边 进函数 fire的时候循环调用函数
2. 我们以前写过一个 这里 我们只需要把他继承过来
3. 这里记住 我们可以直接 把我们写的发布订阅类的 当作一个实例 挂在到我们的 弹框实例的一个属性上
4. 这里也可以使用即成的方式 这里我们需要使用寄生组合即成 但是我们在继承实例的线程池的时候 要把发布订阅的类 当作普通函数执行。这里 如果都是class 写的 直接可以使用 super + extends 继承 这里要记住 class    的类不能当作普通函数执行
```

```js
//发布订阅 类
(function () {
  function Sub() {
      this.pond = {};
  }
  Sub.prototype = {
      constructor: Sub,
      on(type, func) {
          let pond = this.pond;
          !pond.hasOwnProperty(type) ? pond[type] = [] : null;
          let arr = pond[type];
          for (let i = 0; i < arr.length; i++) {
              if (arr[i] === func) {
                  return;
              }
          }
          arr.push(func);
      },
      off(type, func) {
          let arr = this.pond[type] || [];
          for (let i = 0; i < arr.length; i++) {
              if (arr[i] === func) {
                  arr[i] = null;
                  break;
              }
          }
      },
      fire(type, ...params) {
          let arr = this.pond[type] || [];
          for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              if (typeof item === "function") {
                  item.call(this, ...params);
                  continue;
              }
              arr.splice(i, 1);
              i--;
          }
      }
  };
  window.Sub = Sub;
})();
```

```js
// 开始继承。 首先要把Sub当作 普通函数 在我们的 Dialog 类里用call 执行
function ModalPlugin(options){
        //开始我们的继承组合继承 首先继承我们的线程池 当作一个实例
        Sub.call(this)
        this.options = options
        this.$drag_modal = null
        this.$drag_content = null
        this.startX = 0
        this.startY = 0
        this.contentL = 0
        this.contentT = 0
        this.HTML = document.documentElement
        this.init()
    }
```

```js
// 继承Sub 原型上的方法首先我们让我们 Dialog 类的 原型prototype = 空对象 在让这个空对象的 原型链__proto__ 指向我们的 Sub 类的 原型 prototype  当然我们可以是用 Obejct.create()
// 然后 在把我们Dialog的类prototype 方法 合并一下

ModalPlugin.prototype = Object.create(Sub.prototype)
ModalPlugin.prototype = Object.assign(ModalPlugin.prototype,
{
constructor:ModalPlugin,
version:'1.0.0',
createDOM:function(){
    let {modal,title,template,buttons} = this.options
    let frag = document.createDocumentFragment()
    if(modal){
        this.$drag_modal = document.createElement('div')
        this.$drag_modal.className = 'drag_modal'
        frag.appendChild(this.$drag_modal)
    }

    this.$drag_content = document.createElement('div')
    this.$drag_content.className = 'drag_content'
    this.$drag_content.innerHTML = `
    <div class="drag_head">
        ${title}
        <a href="javascript:;" class="drag_close"></a>
    </div>
    <div class="drag_main">
        ${template}
    </div>
    ${buttons.length > 0? `<div class="drag_foot">
        ${buttons.map((item,index) => {
            return `<a href="javascript:;" index="${index}" class="drag_button">
                        ${item.text}
                    </a>`
        }).join('')}
    </div>`:''}
    `
    frag.appendChild(this.$drag_content)
    document.body.appendChild(frag)
    this.options.onopen.call(this,this)
},
close(){
    if(this.$drag_modal ){
        this.$drag_modal.style.opacity = 0
        this.$drag_modal.ontransitionend = () => {
            document.body.removeChild( this.$drag_modal )
            this.$drag_modal.ontransitionend = null
        }
    }
    if(this.$drag_content){
        this.$drag_content.style.opacity = 0
        this.$drag_content.ontransitionend = () => {
            document.body.removeChild( this.$drag_content )
            this.$drag_content.ontransitionend = null
        }
    }
  
    this.options.onclose.call(this,this)
},
down(ev){
    this.startX = ev.clientX
    this.startY = ev.clientY
    let{top,left} = this.$drag_content.getBoundingClientRect()
    this.contentL = left
    this.contentT = top
    window.onmousemove = this.move.bind(this)
    window.onmouseup = this.up.bind(this)
		 // 22. 通知 我们拖拽开始 可以执行的函数 把this传入进去
    this.fire('ondragstart', this);
},
move(ev){
    let minL = 0
        minT = 0
        maxL = this.HTML.clientWidth - this.$drag_content.offsetWidth
        maxT = this.HTML.clientHeight - this.$drag_content.offsetHeight
    let curL = ev.clientX - this.startX + this.contentL
        curT = ev.clientY - this.startY + this.contentT
    curL = curL < minL ? minL : curL > maxL ? maxL : curL
    curT = curT < minT ? minT : curT > maxT ? maxT : curT
    this.$drag_content.style.transform = 'translate(0, 0)'
    this.$drag_content.style.left = curL + 'px'
    this.$drag_content.style.top = curT + 'px'

    // 22. 通知 我们拖拽中 可以执行的函数
    this.fire('ondraging', this);
},
up(){
    window.onmousemove = null
    window.onmouseup = null

    // 22. 拖拽结束的时候通知执行的函数
    this.fire('ondragend', this);
},
```

```js
// 调用

document.getElementById('btn').onclick = open
function open() {
 let m1 =  M({
    template:'今天我完成了插件组件的封装',
    model:true,
    buttons:[
        {text:'确定',click:function(m){
            console.log(this)
        }},
        {text:'取消',click:function(){
            this.close()

        }}
    ],
    drag:true,
    onopen:function (m) {
        console.log(this,m)
    },
    onclose:function(m){
        console.log(this,m)
    }
})

m1.on('ondragstart',function(){
    console.log('拖拽开始')
})

m1.on('ondraging',function(m){
    console.log('拖拽中执行的函数')
})

m1.on('ondragend',function(m){
    console.log('拖拽结束')
})
}
```

```js
地址
https://github.com/wazer1987/Dialog
```



