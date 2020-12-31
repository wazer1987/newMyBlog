---
title: 手写一个low碧版Vue
date: 2019-03-16
updated: 2019-06-03
tags: Vue 
categories: 源码
keywords: Vue 源码
description: 手写一个low碧版Vue
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
# 手写一个low碧版Vue

## Vue工作机制

```JS
1.new Vue()之后 Vue会调用初始化也就是_init()函数 初始化了生命周期、事件、props、data、computed、与watch等
2.其中最重要的是通过 Object.definProperty设置setter 于 getter 用来实现 响应式 以及 依赖收集
3.初始化之后 调用$mount 挂载组件 到视图
```

![](1.png)

```JS
1.我们上面的图示 是以浏览器为例 是你script src方式引入 Vue.js
2.compile的作用 主要是 把你的html 编译成一个render函数 
3.compile的三个阶段 parse 把我们的写的html模板编译成一个ast抽象语法树 比如解析的你的指令 V-xxx等
  optimize 标记一些静态的节点 比如 某个元素里的文本就是这样没有变过 用作后面的性能优化 
  generate 把parse 解析的ast 转换为字符串渲染函数  在用 render function 把他变成一个真正的函数
4.然后便利我们的数据data 做数据劫持 getter 和 setter 
5.左右的数据都会通过一个观察者watcher 去更新 也就是说 当我们访问某个data里的某个数值的时候 会触发我们的getter 然后会设置一个wather观察者(new watcher())去盯着这个你访问的这个数值 当我们更改了你这个访问的数值的时候 也就是触发了setter 然后我们会通知我们在getter的是时候设置的watcher 告诉他我改变了 然后watcher 就去update更新
6.更新的时候 我们最终会比对新旧两个值 然后去打补丁 也是就patch()
7.然后就更改DOM
```

## 我们实现的简化版Vue流程

![](2.png)

## Vue的响应式原理

```JS
1.Vue的响应式原理 Object.definProperty
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app">
        <p>你好,<span id="name"></span></p>
    </div>
   <script>
       var obj = {}
       //当我访问 或者设置 obj对象里的属性时 会先走我这个劫持 然后 根据你是访问 还是设置 去做不同的逻辑
       Object.defineProperty(obj,'name',{
           get(){
            console.log('我获取了obj.name')
            return document.querySelector('#name').innerHTML
           },
           set(nick){
            console.log('我设置了obj.name')
            document.querySelector('#name').innerHTML = nick
           }
       })
    //当我设置这个对象的属性的时候  会触发 set函数 参数 就是你设置的值
    obj.name = 'lilei'
    //当我访问这个对象的属性的时候  会触发get 函数 这里就能劫持到 去做额外的逻辑 比如上面 我们就把#name元素的里的内容返回了 
    console.log(obj.name)
   </script>
</body>
</html>
```

## 实现响应式

```JS
1.observe 递归你传进来的options的data 数据  
2.defineReactive 分别给你的data 做数据劫持
```

```js
//使用的时候
// const vm = new Wvue({
//     data:{
//         msg:'你好'
//     }
// })
class Wvue {
    constructor(options){
        //把你传进来的配置项 
        this.$options = options
        //把要响应式的数据也保存一下
        this.$data = options.data
        //开始把数据变成响应式
        this.observe(this.$data)
    }
    //观察data 递归便利data 是传递进来的对象 响应式
    observe(value){
        if( !value || typeof value !== 'object'){
            return
        }
        //便利了你data里的所有key 变成成一个数组 然后对key做响应式处理
        Object.keys(value).forEach( key => {
            //给每个key做响应式的处理 这里面的value 就是你的data对象 key 是你的data对象里的键 value[key] 是你data对象里的 键值
            this.defineReactive(value,key,value[key])
        })
    }
    defineReactive(obj,key,value){
        //当你当问 vm.$data.msg的时候 就触发了get 把你的值给你返回了
        Object.defineProperty(obj,key,{
            get(){
                return value
            },
            //当你设置 vm.$data.msg的时候 就触发了set 会先比较 你的值跟你原来的值一样不一样 如果不一样我就赋值 这里形成了闭包
            set(newval){
                if(newval !== value){
                    value = newval
                    console.log(`${key}属性更新了`)
                }
            }
        })
    }
}
```

## 递归去响应式

```JS
1.刚刚我们已经写好了一个基本的响应式
2.但是 是无法给我们的对象套对象的数据做响应式的
3.比如 new Wvue({
    data:{
        msg:'你好',
        err:{
            one:'错误以'
        }
    }
})
4.所以这我们还需要去递归
```

```JS
class Wvue {
    constructor(options){
        this.$options = options
        this.$data = options.data
        this.observe(this.$data)
    }
    observe(value){
        if( !value || typeof value !== 'object'){
            return
        }
        Object.keys(value).forEach( key => {
            this.defineReactive(value,key,value[key])
        })
    }
    defineReactive(obj,key,value){
        //如果你的对象还有对象 我就去递归 我们上面还有个判断  if( !value && typeof value !== 'object')
        this.observe(value)
        Object.defineProperty(obj,key,{
            get(){
                return value
            },
            set(newval){
                if(newval !== value){
                    value = newval
                    console.log(`${key}属性更新了`)
                }
            }
        })
    }
}
```

## 实现无中间访问

```JS
1.我们在使用Vue的时候 平时 都只直接 this.msg   中间是没有data的 
2.这里的实现 其实主要就 在data中有做了数据劫持 把我们的this也就是你的实例 直接 添加了 属性 值是你data里的每一个键值
```

```JS
//使用的时候
//vm.msg 省去了中间的$data
class Wvue {
    constructor(options){
        this.$options = options
        this.$data = options.data
        this.observe(this.$data)
    }
    observe(value){
        if( !value || typeof value !== 'object'){
            return
        }
        Object.keys(value).forEach( key => {
            this.defineReactive(value,key,value[key])
            //在这里 我们实现对this的一个劫持 把我们data里的数据 直接 在this中  这样 访问的时候就可以省略 中间的data
            this.proxyData(key)
        })
    }
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key]
            },
            set(newval){
                this.$data[key] = newval
            }
        })
    }
    defineReactive(obj,key,value){
        this.observe(value)
        Object.defineProperty(obj,key,{
            get(){
                return value
            },
            set(newval){
                if(newval !== value){
                    value = newval
                    console.log(`${key}属性更新了`)
                }
            }
        })
    }
}
```

## 依赖收集与追踪

```JS
new Vue({
    template:
    `<div>
		<span>{{name1}}</span>
		<span>{{name2}}</span>
		<span>{{name1}}</span>
	 </div>`,
    data:{
        name1:'name1',
        name2:'name2',
        name3:'name3'
    },
    created(){
        this.name1 = '我改变了name1',
        this.name2 = '我改变了name2'
    }
})
```

```JS
1.上面可以看到 我们的template里的 双花括号里面的name1 是依赖我们data 里的name1 这个时候 就说明我们现在有依赖关系
2.name1 被修改 视图更新 且要更新两处
3.name2 被修改 视图更新
4.name3 没用到 不需要更新
5.所以这个时候 我们就要扫描视图 收集依赖 知道视图中到底那些地方对数据有依赖 这样数据变化的时候就可以做很多操作
```

## 实现数据依赖与追踪 

```JS
1. 我们每个依赖 都对应一个watcher(也就是我们上面所说的观察者)
2. 比如我们上面的name1 出现了两次 所以就会对应两个watcher
3. 这个时候 我们需要一个dep 去收集存储我们的依赖和watcher  然后去管理我们的这些watcher 当依赖发生变化的时候 就通知我们的watcher去对数据更新 更新视图
```

## Dep类的作用

```JS
1.我们创建了一个Dep的类 用来收集Watcher对象 读数据的时候 会触发getter函数 把当前的watcher对象存放在Dep类中去
2.写数据的时候 会触发setter方法 通知Dep类调用 notify 来触发 所有的watcher 对应的update方法更新视图
```

```JS
//Dep:管理若干个watcher实例 它和key 是一对一的关系
class Dep {
    constructor(){ 
        this.deps = []
    }
    //每收集一个依赖 我们就在这里添加一个watcher
    addDep(watcher){
        this.deps.push(watcher)
    }
    //当数据更新时候 通知我们对应的watcher去做更新
    notify(){
        this.deps.forEach(dep => dep.update())
    }
}
```

## Watcher类的作用

```JS
1.用于观察依赖 每个依赖会对应一个watcher
2.什么时候创建watcher 我们会在编译器里的时候 去扫描 标签 发现双花括号 或 这起来依赖的 语法的时候就会创建watcher 这里为了方便测试 我们只有手动去写一下
```

```JS
//保存UI中的依赖 和自己一一对应 当dep通知我更新的时候 我去更新
class Watche {
    constructor(vm,key){
        this.vm = vm
        this.key = key
        //将当前实例指向Dep.target
        Dep.target = this
    }

    //dep通知我更新的时候 我去更新
    update(){
        console.log(`${this.key}属性更新`)
    }
}
```

![](3.png)

## 实现

```JS
class Wvue {
    constructor(options){
        this.$options = options
        this.$data = options.data
        this.observe(this.$data)
        //手动测试 当然 这里的watcher创建 是在我们的编译器里执行的 扫描视图上的语法{{}}等时候创建watcher
        new Watcher(this,'msg')
        this.msg
    }
    observe(value){
        if( !value || typeof value !== 'object'){
            return
        }
        Object.keys(value).forEach( key => {
            this.defineReactive(value,key,value[key])
            this.proxyData(key)
        })
    }
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key]
            },
            set(newval){
                this.$data[key] = newval
            }
        })
    }
    defineReactive(obj,key,value){
        this.observe(value)
        //创建Dep实例 让我们的依赖和我们的Dep 也就是你key 一对一 对应
        const dep = new Dep()
        Object.defineProperty(obj,key,{
            get(){
                //将Dep.target 指向的Wacher 实例加入到Dep中 这样就是为什么 key会和我们的watcher有关联 对应上
                Dep.target && dep.addDep(Dep.target) //当我们的每个依赖都会产生一个watcher
                return value
            },
            set(newval){
                if(newval !== value){
                    value = newval
                    //通知 watcher 去更新
                    dep.notify()
                    console.log(`${key}属性更新了`)
                }
            }
        })
    }
}

//Dep:管理若干个watcher实例 它和key 是一对一的关系
class Dep {
    constructor(){ 
        this.deps = []
    }
    //每收集一个依赖 我们就在这里添加一个watcher
    addDep(watcher){
        this.deps.push(watcher)
    }

    //当数据更新时候 通知我们对应的watcher去做更新 
    notify(){
        this.deps.forEach(watcher => watcher.update())
    }
}


//保存UI中的依赖 和自己一一对应 当dep通知我更新的时候 我去更新
class Watcher {
    constructor(vm,key){
        this.vm = vm
        this.key = key
        //将当前实例指向Dep.target 为了保证dep里的watcher和依赖一一对应
        Dep.target = this
    }

    //dep通知我更新的时候 我去更新 这里如果是DOM操作的化 视图就更新了
    update(){
        console.log(`${this.key}属性更新`)
    }
}
```

## 编译 compile

```JS
1.以上 是我们 手动实现的 收集依赖 添加watcher 
2.真正的 watcher创建 是在编译的时候去创建的
3.这里我们只写一个简易版的compile 只操作DOM Vue真正的compile 是要做虚拟DOM的 
```

## compile 的核心任务(简易版)

```JS
1.获取并且遍历DOM树
2.文本节点:获取{{}}格式的内容并解析
3.元素节点:访问节点的特性 解析 w-开头 和 @ 开头的内容
```

![](4.png)

##  前置知识  fragment

```JS
1.DOM 的文档篇 可以包含和控制节点 但不会像完整的文档那样占用额外的资源 是一种轻量级的文档
2.可以理解为 解释为你所有DOM元素和节点 打了一个压缩包 可以来当一个仓库使用 可以在里面保存将来可能会添加到文档中的节点
```

```JS
HTML 中 有如下代码
<ol id="ol1"></ol>
现在我们想为ol这个元素 添加3个列表项 如果逐个追加列表 将会导致浏览器反复渲染 为了避免 这个问题我们每创建的一个里表象 可以保存到我们的 fragment 里 然后一次性添加到ol中(将当于打包)
```

```JS

//文档片段
var ol1 = document.getElementById("ol1"), li = null;
var fragment = document.createDocumentFragment();    //创建文档片段
for(var i=0; i < 5; i++){    //循环创建列表项
	li = document.createElement("li");
	li.appendChild(document.createTextNode("Item" + i));
    //以前这里的写法是 我们每创建好了一个Li 就插入到ol中 这样会导致浏览器反复渲染 现在我们使用fragment
	fragment.appendChild(li);    //列表项添加到文档片段中
}
ol1.appendChild(fragment);    //将文档片段添加到文档中

```

## 逻辑

```JS
//遍历模板 将里面的插值表达式解析 (双{{}})
//如果有w-开头 @开头 做特别的处理
class Compile {
    constructor(el,vm){
        this.$vm = vm
        this.$el = document.querySelector(el)
        if(this.$el){
            // 将$el中的内容搬到一个fragment() 
            this.$fragment = this.node2Fragment(this.$el)
            
            //编译fragment 也就是开始递归遍历 解析我们的指令和插值表达式
            this.compile(this.$fragment)

            //将编译的结果(也就是我们处理完的那些DOM节点和元素 插入到宿主中 也就是$el)
            this.$el.appendChild(this.$fragment)
        }
    }
}
```

## this.node2Fragment方法

```JS
1.将我们所有的el中的第一个元素 搬家到 我们创建的 fragment
2.这里可以理解为 抽出来 然后放进去的操作 原有的el中的第一个元素 被抽出来放在了 fragment中 原有的el中的第二个元素 经过这样的操作 总会是第一个
```

```JS
node2Fragment(el){
        const fragment = document.createDocumentFragment()
        let child 
        //这里就相当于搬家
        while (child = el.firstChild) {
            //这个while循环 一直能够进行 可以理解我 我们这是搬家的操作 每次把el中第一个
            //元素抽出来 放到 fragment 然后el中的第二个元素 又变成了第一个
            fragment.appendChild(child)   
        }
        return fragment
    }
```

## this.compile方法

```JS
1.遍历我们的移动好的fragment文档碎片
2.判断如果是文本节点 解析{{}} 如果有w-开头 或者 @的 就解析 指令或者事件
```

```JS
compile(el){
        //这里拿到了 el下面的所有节点 又的是 文本节点 有的是元素节点  这里获取到的是一个伪数组
        const childNodes = el.childNodes
        //把获取到的节点伪数组 进行遍历 根据他的类型分别去判断
        Array.from(childNodes).forEach( node => {
            if(this.isElement(node)){
                //如果是元素节点 就解析 他身上的以w-开头 或者 @开头的指令
                this.compileElement(node)
            }else if (this.isInterpolation(node)){
                //如果是文本节点就解析 看看有每有{{xxx}}的然后 把值替换成我们Wvue里的变量 创建watcher
                //把插值表达式 替换为实际的内容
                this.compileText(node)
            }

            //如果每个元素身上还有节点 就递归遍历
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node)
            }
        })
    }
```

## this.compile 下的 this.isElement方法

```JS
1.判断你是不是元素 
2.解析 指令 比如w-开头 和 @开头
```

```JS
//如果是元素节点 就解析 他身上的以w-开头 或者 @开头的指令
    isElement(node){
        return node.nodeType === 1
    }
```

## this.compileElement方法

```JS
1.用来获取元素上的属性
2.判断 如果你有w-开头 我就截取出来 通过动态的形式 去调不同的执行函数
3.比如 你是w-text开头 我就 截取来text 去调 text对应的函数 替换界面
```

```JS
compileElement(node){
        //查看node的属性 是否有w-开头 或者@
        const nodeAttrs = node.attributes // 这里nodeAttrs获取到的是一个对象
        Array.from(nodeAttrs).forEach(attr => {
            //这里的attr 就是w-text="xxx" 或者w-html @之类的
            const attrName = attr.name //这里获取到的是你的执行 比如w-text w-html
            const exp = attr.value //这里是你获取到的那个w-text="xxx" 里的xxx也就是你data中的变量
            console.log(attrName,'----attrName',exp,'-----exp')
            //开始截取指令
            if(attrName.indexOf('w-') === 0){
                const dir = attrName.substring(2) //把w-text 的 text截取出来 做动态参数 好动态调取我们的方法
                //调取通用函数 执行我们的把文本内容替换 这调用了 text方法 然后text方法有执行了updated 在updated里
                //执行了 textUpdator 方法  把 内容替换调了
                this[dir] && this[dir](node,this.$vm,exp)
            }else if(attrName.indexOf('@') === 0){
                //开始截取事件名 然后编写执行的函数
                 const eventName = attrName.substring(1)
                 this.eventHandler(node,this.$vm,exp,eventName)
            }
        })      
    }
```

## model方法(w-model 双向绑定)

```js
1.首先 我们的Vue上的值变了 需要更改界面
2.如果 界面上的值变了 需要更改 vue实例上的值
```

```JS
//v-model指令执行的方法
    model(node,vm,exp){
        //值变了改界面 node是当前的节点 vm是Vue的实例 exp是data里的键
        this.updated(node,vm,exp,'model')
        //页面变了 改值 这里可能还有chage之类 
        node.addEventListener('input',e => {
            vm[exp] = e.target.value
        })
    }
    //值变了改页面 这的node多半的input框
    modelUpdator(node,value){
        node.value = value
    }
```

## html方法

```JS
//html方法
    html(node,vm,exp){
        this.updated(node,vm,exp,'html')
    }
    htmlUpdator(node,value){
        node.innerHTML = value
    }
```

## @开头的事件处理 this.eventHandler 方法

```JS
1.首先要不按你的@后面的事件名称拿出来
2.然后拿出拿出click后面对应的事件
3.为我们的当前元素添加 事件 然乎执行methods里的回调
```

```JS
 //处理@开头的指令相关
eventHandler(node,vm,exp,eventName){
    //如果你methods里有事件 我就去监听一下 然后执行你的事件回调
    const fn = vm.$options.methods && vm.$options.methods[exp]
    if(eventName && fn){
        //为你绑定的元素添加事件 并且执行methods的方法 为了防止this出问题 这里要bind一下
        node.addEventListener(eventName,fn.bind(vm))
    }
}
```

## this.compile 下的  this.isInterpolation方法

```JS
1.解析{{}}文本
2.把{{}}里面的值 替换成我们this.$data里赋值
3.这里我们用了正则匹配 并且 使用 RegExp.$1来取出{{}}里面的值
```

```JS
//解析文本节点 看看有每有{{xxx}}的然后 把值替换成我们Wvue里的变量 创建watcher
isInterpolation(node){
    //如果你的文本类型 是3 就说明你是文本节点 并且要满足正则匹配 你里面有{{}}的语法 
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
}
```

## compileText方法

```JS
1.用来取出{{xxxx}} 里面的xxxx 替换成我们Wvue实例里面的变量的值
2.此时这里还不是响应式的 需要我们创建watcher   
```

```JS
compileText(node){
        console.log(this.$vm[RegExp.$1])
        //RegExp.$1 就是你 {{xxx}} 里匹配的xxx的部分
        //这里的this.vm就是你的Vue实例 由于我们这里做了无中间的data的this访问 所以可以通过这样的形式 去拿到 你data里的变量的值
        //然后把里面的内容替换成我们Vue实例data里定义的变量的值
        node.textContent = this.$vm[RegExp.$1]
    }
```

## 通用函数

```JS
1.上面我们那已经实现了 把{{xxx}}解析出来 把xxx里面的值替换成我们的Wvue里面的data里面值
2.这里我们将来可能还有v-text v-html 和 @的指令解析 所以这里我们写一个通用的函数 
```

```JS
compileText(node){
        const exp = RegExp.$1 //把变量都取出来
        this.updated(node,this.$vm,exp,'text') //这里我么已经知道了 你是解析{{}}的方法 所以我传进去text
    }
    //这个通用函数 通过动态匹配 就知道调取我们的textUpdator方法 去改变{{}}里面的值
    updated (node,vm,exp,dir) {
        //这里我们可能是解析{{}} 也可能是解析 w-text 或者 w-html 这里我们写一个通用的函数 通过传参去匹配调用
        const fn = this[dir + 'Updator']
        //调用我们的textUpdator 函数 把界面上的{{xxx}}替换为我们的Vue实例中的data里的变量的键值
        fn && fn(node,vm[exp])
        new Watcher(vm,exp,function(){
            fn && fn(node,vm[exp])
        })
    }
    textUpdator(node,value){
        //替换界面中的{{}}里面的内容 为我们Vue里面data里面的键值
        node.textContent = value
    }
```

## 创建watcher

```js
1.我们创建watcher的时机是在 解析{{}}括号的时候创建的 也就是我们的
2.创建的watcher 我们需要手动访问一下Vue里data里的键 手动触发一下 get函数
3.当我们在给我们的Vue中data里的键改变键值的时候 触发set函数 然后dep通知更新 调用了watcher实例里的update函数
4.updata函数里面 是我们在解析{{}}解析双花括号的时候 传进去一个回调函数 这个函数 是我们刚刚上面解析{{}}括号的时候把里面的值替换为我们vue里data键值的textUpdator()函数
```

```JS
//保存UI中的依赖 和自己一一对应 当dep通知我更新的时候 我去更新
class Watcher {
    constructor(vm,key,cb){
        //这里由于我们的watcher创建是在你compile解析双化括号的时候创建的 所以这个
        //vm是Wvue的实例 key 是你通过RegExp.$1 解析出来data里的变量键值 
        this.vm = vm
        this.key = key
        //赋值我们的回调函数
        this.cb = cb
        //将当前实例指向Dep.target 为了保证dep里的watcher
        Dep.target = this
        //访问一下Wvue里的data 触发get函数 让Dep类 把watcher添加进去
        this.vm[this.key]
        //以防万一 在恢复成null
        Dep.target = null
    }
    //dep通知我更新的时候 我去更新
    update(){
        //这里为了防止this指向有问题 所以用了call
        //调取了我们的解析{{}}括号的时候 更新视图中的那个函数
       this.cb.call(this.vm,this.vm[this.key])
    }
}
```

![](Vue 工作机制.jpg)

## 总结

```JS
1.这里我们的compile 做了DOM操作  其实真正的Vue compile就是编辑成render函数 没有DOM的草走
2.这里我们每个变量都添加了一个watcher 属于Vue1.0的写法 这样性能开销很大 所以到了2.0 都是一个组件对应一个watcher
3.代码 https://github.com/wazer1987/VueCode
```

