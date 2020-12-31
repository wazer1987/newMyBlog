---
title: 虚拟Dom
date: 2020-04-18
updated: 2019-06-03
tags: 虚拟Dom
categories: 虚拟Dom
keywords: 虚拟Dom
description: 虚拟Dom
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

# 虚拟DOM  Vdom

## 虚拟DOM(VDom)是什么

```JS
1.简单来说就是用js对象的形式来描述真实的DOM
2.因为真实的DOM对象有很多的属性 所以我们每次操作真实的DOM的时候 都会伴随着这些属性的 性能会十分的低效
```

```JS
//我们现在把真实的DOM属性都打印看了一下
<script>
    const div = document.createElement('div')
    let res = ''
    for (var key in div){
        res +=  key + ' '
    }
    console.log(res)
</script>
//这里我们只是新建了一个div 还没有建立子元素 就看到如此多的属性 只要我们稍微操作一下DOM 浏览器的性能就会下降
```

![](1.png)

```HTML
<!--下面是一个我们真实的DOM元素-->
    <div id="app">
        <p class="item">节点1</p>
    </div>

<script>
//然后我们采用js的形式去描述他 这样就是一个轻量级的虚拟DOM 
//最外层元素是标签是DIV 属性都放在data里 子元素都放在children里 然后在依次去描述子元素
//这样我们在更新的时候 只需要找打新老两个虚拟DOM最小的修改去渲染页面 而不是像模板那样 统统重新渲染
    createElment(){
        return{
            tag:'div',
            data:{id:app},
            children:[{tag:'p',data:{class:'item'},children:['节点1']}]
        }
    }
</script>
```

## 如何新建虚拟DOM

```JS
1.在react 和 Vue中 虚拟的DOM 的创建都是模板 和jsx 完成
2.模板到编译器 到render函数的转移 都是由webpack去工程化完成
3.下面我们要写一个最原始的虚拟DOM
```

```JS
1.首先我们要做标记 就是当你传进来我这个函数的每个标签或者文本 还有字节点 我都给他标记一下 它是什么类型
2.通过它的类型我们在去做额外的逻辑
```

```JS

//新建虚拟DOM
//我们最后要生成的结果也就是我们的虚拟DOM
// {
//     tag:'div',
//     data:{id:app},
//     children:[{tag:'p',data:{class:'item'},children:['节点1']}]
// }
//定义下标记 比如元素的类型
const vnodeType ={ 
    HTML:'HTML', //如果是元素 我就把你标记为HTML
    TEXT:'TEXT', //如果是文本 我就把你标记为TEXT
    COMPONENT:'COMPONENT', //如果是组件 我就把你标记为COMPONENT
    CLASS_COMPONENT:'CLASS_COMPONENT' //如果是函数类型的组件 就标记为 CLASS_COMPONENT 
}
//定义一下 你传进来的子元素 都是什么类型 比如一个 没有 多个
const childrenType = {
    EMPTY:'EMPTY', //空的  你没有传子元素
    SINGLE:'SINGLE', //只有一个子元素
    MULTIPLE: 'MULTIPLE' //多个子元素
}
function createElement(tag,data,children = null){
    let flag 
    //如果你给我传进来的是个字符串 那么我把你标记为HTML元素
    if(typeof tag === 'string'){
        //我就把你标记为元素
        flag = vnodeType.HTML
    }else if(typeof tag === 'function'){
        //如果你传进来的是个 函数 我就认为你是组件
        flag = vnodeType.COMPONENT
    }else{
        //如果什么都没有 我就认为你是一个文本
        flag = vnodeType.TEXT
    }
    //标记子元素 分几种情况  第一种 没有子元素 第二种 有单个子元素 第三个 有多个子元素
    let childrenFlag
    //然后去标记我们的子元素 是哪种情况
    if(children == null){
        //如果你没传子元素 我就认为 你的children是空的
        childrenFlag = childrenType.EMPTY
    }else if(Array.isArray(children)){
        //如果我你是个数组 我就看你的长度 有可能 你给我传个空数组过来 这时候我们也要标记是空的
        let length = children.length
        if(length === 0){
            childrenFlag = childrenType.EMPTY
        } else {
            childrenFlag = childrenType.MULTIPLE
        }
    }else {
        //如果你不是null 我就认为 你这里就是传进来了一个文本 
        childrenFlag = childrenType.SINGLE
        //然后创建文本的vnode
        children = createTextVnode(children + '')

    }
    //返回Vnode
    return {
        flag, // 这个们用来标记 你是元素 还是 文本 还是 组件函数 之类的类型
        tag,  //标签 就是 div 和html5标签 如果是文本就没有tag 还由组件之类的
        data, // 属性
        children, // 子元素
        childrenFlag //标记子元素
    }
}

//创建文本类型的Vnode
function createTextVnode (text){
    return {
        flag:vnodeType.TEXT, //文本类型
        tag:null, //因为是文本所以没有标签
        data:null, //也没有属性
        children:text, //子节点可能还是文本
        childrenFlag: childrenType.EMPTY //子节点文本类型是空
    }
}
```

```JS
//调用
<script>
    //这里我们在Vue中 也是这么调用了 只不过那个是h的函数
    let div = createElement('div',{id:'test'},[createElement('p',{},['节点1'])])
    console.log(JSON.stringify(div,null,2))
</script>
//下面是我们自己处理完毕 生成的虚拟DOM
```

![](2.png)

## 如何渲染虚拟DOM 

```JS
1.首先我们会写一个render函数 
2.接收两个参数 第一个就是你的虚拟DOM 第二个就是要渲染在哪个容器里
3.我们在渲染的时候 可能每个节点 都会有自己的样式 或者点击事件 这些都在data里 所以我们在写render函数的时候也要考虑这些
4.在渲染的时候 我们需要区分一下 首次渲染 首次挂载元素 
5.在更新的时候 我们需要diff算法 比对新老虚拟DOM 在去挂载到页面
```

```JS
//刚才我们已经通过createElement函数生成了虚拟DOM
    //这些虚拟DOM 的节点上可能还有一些属性 
    let vnode = createElement('div',{id:'test'},[
        createElement('p',{key:'a',sytle:{color:'blue'}},['节点1']),
        createElement('p',{key:'b','@click':() => {alert('xx')}},['节点2']),
        createElement('p',{key:'c','class':'item-header'},['节点3']),
        createElement('p',{key:'d'},['节点4'])
    ])
    //在这里我们需要用render函数 把他们 都渲染到页面上
    render(vnode,document.querySelector('#app'))
```

```JS
//render函数 我们要做的就是把虚拟DOM 渲染到页面上 这个时候 需要区分一下首次渲染 和更新之后的渲染
//渲染函数
function render (vnode,container) {
//挂载函数mount
    mount()
}
```

```JS
// mount函数 要区分一下 你的vode元素还事文本 然后分别调用不同的挂载方法
//首次挂载 把我们的真实DOM挂载到容器上
function mount (vnode,container){
    //先区分flag的类型 这样就知道 你每个节点到底是什么东西
    let {flg} = vnode
    if(flag === vnodeType.HTML) {
        //如果你是元素 我们就用元素的挂载方法
        mountElement(vnode,container)
    }else if(flag === vnodeType.TEXT){
        //如果你是文本 我们就用文本的挂载方法
        mountText(vnode,container)
    }
}
```

```JS
//mountElement函数 挂载元素
//如果标记的是元素的挂载方法
function mountElement(vnode,container){
    //创建你虚拟DOM 的标签元素
    let dom = document.createElement(vnode.tag)
    //存储真实DOM 为挂载用
    vnode.el = dom
    //把它上面的属性读解析出来
    // let data = vnode.data
    //把虚拟DOM 的属性解构出来
    let {data,children,childrenFlag} = vnode
    //开始处理节点的属性
    for(var key in data){
        //这里我们分辨把当前的dom 和 绑定的key 还有新的节点 和你的值传入进去 这里要做对比
        patchData(dom,key,null,data[key])
    }
    //开始挂载子元素
    //首先判断你的子元素是什么类型
    if(childrenFlag != childrenType.EMPTY){
        //需要判断一下你的子节点类型如果不是空的我才能挂载
        if(childrenFlag == childrenType.SINGLE){
            //如果你是文本节点 我们就直接使用mount方法去挂载 到我们的父元素上 这里就不是容器了
            mount(children,dom)
        }else if(childrenFlag == childrenType.MULTIPLE){
            //如果你的子元素是多个 也就是传进来是个数组 那我们就开始循环
            for(var i = 0; i < children.length;i++){
                //一次去挂载
                mount(children[i],dom)
            }
        }
    }
    //最后挂载我们的父元素
    container.appendChild(dom)
}
```

```JS
//mountText 方法 挂载文本
//如果标记是文本挂载方法
function mountText (vnode,container){
    let dom = document.createTextNode(vnode.children)
    vnode.el = dom
    //把文本节点挂载到你的父亲节点上
    container.appendChild(dom)
}   
```

```JS
如下所见 我们已经把文本都生成的虚拟DOM 都挂载到了真实的DOM上
//刚才我们已经通过createElement函数生成了虚拟DOM
    //这些虚拟DOM 的节点上可能还有一些属性 
    let vnode = createElement('div',{id:'test'},[
        createElement('p',{key:'a',sytle:{color:'blue'}},'节点1'),
        createElement('p',{key:'b','@click':() => {alert('xx')}},'节点2'),
        createElement('p',{key:'c','class':'item-header'},'节点3'),
        createElement('p',{key:'d'},'节点4')
    ])
    
    //在这里我们需要用render函数 把他们 都渲染到页面上
    setTimeout(() => {
        render(vnode,document.querySelector('#app'))
    },1000)
```

![](1.gif)

## 处理节点的属性 

```JS
1.我们的虚拟DOM上 还有一些属性
2.比如样式 事件
3.这些属性的处理 我们也是在 render下的 mountElment函数里完成的
```

```JS
//patchData 函数
//处理节点上的属性
function patchData (el,key,prv,next) {
    //这里就是用switch 一次去比对了
    switch(key){
        case 'style':
            for(let k in next){
                console.log(next)
                //因为你虚拟DOM传进来的 {style:{color:blue}} 处理之后 <div style="color:blue">
                el.style[k]= next[k]
            }
            break;
        case 'class':
            el.className = next 
        break;
         //如果默认的就是那些有事件的
        default:
            //我们的key循环出来可能是这样的@click字符串 取它的0位 就是@
            if(key[0] === '@'){
                //给我们的当前DOM添加事件 
                el.addEventListener(key.slice(1),next)
            }else {
                //如果不是你自己定义的 我们就添加自定义属性 
                el.setAttribute(key,next)
            }
        break
    }
}
```

## render函数的渲染逻辑

```JS
1.首先我们在创建虚拟DOM的时候 就已经把每个节点的类型取标记好了
2.然后我们根据你的节点类型 去判断你是标签 还是 文本 如果是标签就执行标签的挂载逻辑 如果是文本就执行文本的挂载逻辑
3.如果是标签 我们这里还需要把你的属性都做下挂载 挂载逻辑就是把你当前的DOM传进去 然后 你属性里所有的key 和对应的值 还有 你变化后的都是什么传进去 然后开始执行判断之类的语句
4.如果你有事节点 我们就直接把你当前的文本节点的值传进去直接挂载就可以
5.如果还有子元素 我们需要在挂载元素的函数里在去判断你子元素的类型 然后在一次的去使用mount函数挂载
```

```JS
//完成的render函数
//渲染函数
function render (vnode,container) {
    console.log(container)
    mount(vnode,container)
}
//首次挂载 把我们的真实DOM挂载到容器上
function mount (vnode,container){
    //先区分flag的类型 这样就知道 你每个节点到底是什么东西
    let {flag} = vnode
    if(flag === vnodeType.HTML) {
        //如果你是元素 我们就用元素的挂载方法
        mountElement(vnode,container)
    }else if(flag === vnodeType.TEXT){
        //如果你是文本 我们就用文本的挂载方法
        mountText(vnode,container)
    }
}
//如果标记的是元素的挂载方法
function mountElement(vnode,container){
    //创建你虚拟DOM 的标签元素
    let dom = document.createElement(vnode.tag)
    //存储真实DOM 为挂载用
    vnode.el = dom
    //把它上面的属性读解析出来
    // let data = vnode.data
    //把虚拟DOM 的属性解构出来
    let {data,children,childrenFlag} = vnode
    //开始处理节点的属性
    for(var key in data){
        //这里我们分辨把当前的dom 和 绑定的key 还有新的节点 和你的值传入进去 这里要做对比
        patchData(dom,key,null,data[key])
    }
    //开始挂载子元素
    //首先判断你的子元素是什么类型
    if(childrenFlag != childrenType.EMPTY){
        //需要判断一下你的子节点类型如果不是空的我才能挂载
        if(childrenFlag == childrenType.SINGLE){
            //如果你是文本节点 我们就直接使用mount方法去挂载 到我们的父元素上 这里就不是容器了
            mount(children,dom)
        }else if(childrenFlag == childrenType.MULTIPLE){
            //如果你的子元素是多个 也就是传进来是个数组 那我们就开始循环
            for(var i = 0; i < children.length;i++){
                //一次去挂载
                mount(children[i],dom)
            }
        }
    }
    //最后挂载我们的父元素
    container.appendChild(dom)
}
//如果标记是文本挂载方法
function mountText (vnode,container){
    let dom = document.createTextNode(vnode.children)
    vnode.el = dom
    container.appendChild(dom)
}   
//处理节点上的属性
function patchData (el,key,prv,next) {    
    //这里就是用switch 一次去比对了
    // console.log(next)
    // console.log(next[key])
    switch(key){
        case 'style':
            for(let k in next){
                console.log(next)
                //因为你虚拟DOM传进来的 {style:{color:blue}} 处理之后 <div style="color:blue">
                el.style[k]= next[k]
            }
            break;
        case 'class':
            el.className = next 
        break;
         //如果默认的就是那些有事件的
        default:
            //我们的key循环出来可能是这样的@click字符串 取它的0位 就是@
            if(key[0] === '@'){
                //给我们的当前DOM添加事件 
                el.addEventListener(key.slice(1),next)
            }else {
                //如果不是你自己定义的 我们就添加自定义属性 
                el.setAttribute(key,next)
            }
        break
    }
}
```

## 更新patch diff

```JS
1.当我们的虚拟DOM发生变化的时候 我们需要重新的去生成虚拟DOM 然后去挂载在视图上
2.更新的过程分为很多中情况 比如你的节点 有的是删除操作  有的是 移动操作 有的是增加操作
3.所以我们需要根据这些不同的情况去做不同的操作 
```

```JS
//我们首次渲染是执行mount方法 在你的真实的DOM里也就是根 是根本没有vnode 所以这里我们要跟据 你是首次渲染 还是更新 在render函数里去做判断
//渲染函数
function render (vnode,container) { 
    if(container.vnode){
        //如果你的vnode存在你的DOM里就说明 你首次挂载过
        //参数是 老的vnode 新的vnode 你的容器
        patch(container.vnode,vnode,container)
    }else{
        //如果没有 我们就说明你是首次渲染
        mount(vnode,container)
    }
    container.vnode = vnode
}

```

## patch方法 

```JS
1.主要是用来做更新用的
2.我们首次进来的时候只有一个vnode 会把它存在容器中
3.当产生新的vnode的时候 我们就开始patch更新
4.patch的方法分三种情况 第一种是你老的vnode的节点类型 和新的不相等 也就老的是标签 新的是文本 那就直接替换掉
如果老的是元素新的也是元素那么就开始比对 第三种 如果老的直接就是个文本 就直接的把原来的删除掉 把文本重新挂载上
```

```JS
//更新 patch
function patch (prev,next,container){
    //参数是 老的vnode 新的vnode 和同期
    //把我们新老的标记 解构出来
    let nextFlag = next.flag
    let prevFlag = prev.flag
    //如果你新的vnode和老的vnode 标记的类型不一样 就说明没什么而更新操作 
    //比如 你老的是标签 你新的是文本 就直接干掉 然后重新渲染即可
    if(nextFlag !== prevFlag){
        replaceVnode(prev,next,container)
    }else if(nextFlag == vnodeType.HTML){
        //如果你新节点传进来是个标签 我们就做下面的操作
        patchElement(prev,next,container)
    }else if(nextFlag == vnodeType.TEXT){
        //如果你新的虚拟DOM 是个文本
        patchText(prev,next,container)
    }
}
```

## replaceVnode方法

```JS
// 如果你新的vnode 和老的vnode的节点标记类型都不一样 那么没有什么算法 我们就直接替换
//如果你新的vnode和老的vnode 标记的类型不一样 就说明没什么而更新操作 
//比如 你老的是标签 你新的是文本 就直接干掉 然后重新渲染即可
function replaceVnode (prev,next,container){
    //就直接删除 然后在挂载新的 这里的prev.el 是我们最开始存放的就是根的真实的DOM
    container.removeChild(prev.el)
    //然后在挂载新的
    mount(next,container)
}
```

## patchElement方法

```JS
1.如果你新的标签 老的也是标签 那么我就看看是不是统一标签 如果不是 就直接调用 replaceVnode 
2.如果老的vnode 和 新的vnode 都是标签元素而且相同 那么们就开始执行属性的操作 该更新更新该删除删除
3.然后开始对比子元素
```

```JS
//如果你新的传进来的也是个标签
function patchElement(prev,next,container) {
    //我们就看看 你新的vnode 和老的vnode 标签是不是一样的 如果不是一样的就直接干点
    if(prev.tag !== next.tag){
        //不是一样的标签 就直接干调才重新挂载
        replaceVnode(next,container)
        return
    }
    //如果不是那种情况我们就开始处理一下属性
    let el = (next.el = prev.el) //更新一下el
    let prevData = prev.data //把老的vnode属性解构出来
    let nextData = next.data //把新的vnode属性解构出来
    if(nextData){
        //如果新的vnode 有属性 我们就开始遍历更新
        for(let key in nextData){
            //这里就是获取到如果你的新的vnode里也有这个key 老的vnode也有这个key之不是value不一样所以我们要获取出来
            //新{key:a} //老{key:b}都存在相同的key 只不过值不一样 我们要取出来做对比
            let prevVal = prevData[key]
            let nextVal = nextData[key]
            //开始更新 根节点 然后key 老的属性值 新的属性值
            patchData(el,key,prevVal,nextVal)
        }
    }
    if(prevData){
        //如果老的vnode存在 
        for(let key in prevData){
            //把值搞出来
            let prevVal = prevData[key]
            if(prevVal && !nextData.hasOwnProperty(key)){
                //如果你老的vnode属性值存在 并且 在新的vnode没有这个属性 那么我们就该做删除操作 
                patchData(el,key,prevVal,null)
            }
        }
    }
    //上面的属性更新完毕了 
    //下面开始更新子元素
    //需要传进去的参数 老vnode的子元素的节点类型 和 子元素 新vnode的子元素类型和子元素 还有真实dom
    patchChildren(prev.childrenFlag,next.childrenFlag,prev.children,next.children,el)
}
```

## patchChildren方法

```JS
//更新patch子元素 比较复杂 需要多种的情况
//开始更新子元素节点
function patchChildren(prevChilFlag,nextChildFlag,prevChildren,nextChildren,container){
    //这里面会针对新老几种状况取做对比 和操作
    // 1.老的vnode的子元素 是单独的 比如就是一个文本
    // 2.老的vnode的子元素 是空的 没有
    // 3.老的vnode子元素 是多个的 
    //然后上面的每一个种情况都要对比下面新的哪三种情况
    // 1.新的vnode子元素是单独的
    // 2.新的vnode子元素是空的
    // 3.新的vnode子元素是多个
    switch(prevChilFlag){
        //老的虚拟DOM 是单个的 然后分别取对比新的vnode那三种情况
        case childrenType.SINGLE:
            //这里我们嵌套了一层switch  对应 新的vnode 三种情况
            switch(nextChildFlag){
                // 老的vnode是单独的 对应新的vnode 是拿单独的
                case childrenType.SINGLE:
                    //老的vnode子元素值文本 新的也是 就直接把老的文本删除 然后从新mount挂载新的
                    patch(prevChildren,nextChildren,container)
                 break
                case childrenType.EMPTY:
                    //如果是老的vnode是单独的 新的是空的 就直接移除
                    container.removeChild(prevChildren.el)
                 break
                case childrenType.MULTIPLE:
                    //如果老的vnode 是单个 新的 是多个 先把老的干掉在 把新的循环挂载
                    container.removeChild(prevChildren.el)
                    for(let i = 0; i < nextChildren.length; i++){
                        mount(nextChildren[i],container)
                    }
                 break
            }
         break
        //老的虚拟DOM 是空的 然后分别取对比新的vnode那三种情况
        case childrenType.EMPTY:
            switch(nextChildFlag){
                case childrenType.SINGLE:
                    //如果老的vnode是空的 新的是单个 我们直接挂载就好
                    mount(nextChildren,container)
                 break
                case childrenType.EMPTY:
                    //如果老的vnode是空的 新的也是 那就啥也不干
                 break
                case childrenType.MULTIPLE:
                    //如果新的vnode是空的 老的是多个 就循环的取挂载新的
                    for(let i = 0 ; i< nextChildren.length;i++){
                        mount(nextChildren[i],container)
                    }
                 break
            }
         break
        //老的虚拟DOM 是多个的 然后分别取对比新的vnode那三种情况
        case childrenType.MULTIPLE:
            switch(nextChildFlag){
                case childrenType.SINGLE:
                    //如果老的是多个 新的是单个 那就循环的去把老的vnode删掉 把新的挂载
                    for(let i=0;i<prevChildren.length;i++){
                        container.removeChild(prevChildren[i].el)
                    }
                    mount(nextChildren,container)
                 break
                case childrenType.EMPTY:
                    //如果新的vnode是多个 老的是空的 我们直接把老的删除掉即可
                    for(let i=0;i<prevChildren.length;i++){
                        container.removeChild(prevChildren[i].el)
                    }
                 break
                case childrenType.MULTIPLE:
                    //如果老的vnode是多个 新的也就 就要重新对比了 老的vnode是数组 新的也是数组
                    //这里就设计到一些情况了
                    //这里抽象举例 老的是[a,b,c] 新的是[a,1,b,2,c,3] 这种情况
                    //因为新的abc 索引是递增的  而老的也是递增的 所以我们不需要做修改 只是新增它中间对应的元素 因为相对位置是不变的
                    //这我们所计算的都是相对位置 那么相对位置变和不变 我怎么辨别的 这里只要新的索引大于老的索引 我们就认为它的相对位置没有改变
                    let lastIndex = 0
                    
                    for(let i= 0; i< nextChildren.length;i++){
                        //把新的vnode都拿出来
                        let nextVnode = nextChildren[i]
                        let j = 0;
                        let find = false
                        for(j;j<prevChildren.length;j++){
                            let preVnode = prevChildren[j]
                            if(preVnode.key === nextVnode.key){
                                //如果找到了
                                find = true
                                //key相同 是同一个元素
                                 patch(preVnode,nextVnode,container)
                                
                                 if(j<lastIndex){
                                    //需要移动节点 abc a移动到b之后 所以们要找到abc的父元素 insert一下
                                    let flagNode = nextChildren[i - 1].el.nextSibling
                                    container.insertBefore(preVnode.el,flagNode)
                                }else{
                                    lastIndex = j
                                }
                            }   
                        }
                        if(!find){ 
                                //如果老的vnode里没有找到这个节点 就说明是新增 
                                let flagNode = i == 0 ? prevChildren[0].el:nextChildren[i-1].el.nextSibling
                                mount(nextVnode,container,flagNode)
                             }
                    }
                    //移除不需要的元素 老的vnode里有 新的里面没有了 就要删除
                    for(let i = 0; i< prevChildren.length; i++){
                        const prevVnode = prevChildren[i]
                        const has = nextChildren.find(next => next.key == prevVnode.key)
                        if(!has){
                            container.removeChild(prevVnode.el)
                        }
                    }
                 break
            }
         break
    }

}
```

## patchText方法

```JS
//如果你新的vnode直接就是个文本 那么我们就直接删除老的 在把文本挂载进去
//如果新的vnode 是个节点 
function patchText(prev,next,container) {
    //这里已经可以确认 你新的vnode 就是个文本节点了
    let el = (next.el = prev.el)
    //所以我们这里在判断如果你们的子节点都不一样 那么我就可以直接 把你新的DOM的文本直接复制即可
    //这里为什么要做判断 因为有可能 你的新的节点是这样 你好<span>啦啦啦</span>是的我好
    if(next.children !== prev.children){
        //我们就直接让DOM的值等于你这个文本
        el.nodeValue = next.children
    }
}
```

## 测试调用

```JS
<script>
    //刚才我们已经通过createElement函数生成了虚拟DOM
    //这些虚拟DOM 的节点上可能还有一些属性 
    let vnode = createElement('div',{id:'test'},[
        createElement('p',{key:'a',style:{color:'red'}},'节点1'),
        createElement('p',{key:'b','@click':() => {alert('xx')}},'节点2'),
        createElement('p',{key:'c','class':'item-header'},'节点3'),
        createElement('p',{key:'d'},'节点4')
    ])
    let vnode1 = createElement('div',{id:'test'},[
        createElement('p',{key:'d'},'节点4'),
        createElement('p',{key:'a',style:{color:'blue'}},'节点1'),
        createElement('p',{key:'b'},'节点2'),
        createElement('p',{key:'c','class':'item-header'},'节点5'),
        createElement('p',{key:'e',style:{color:'#bbb'}},'节点6')
    ])
    
    //在这里我们需要用render函数 把他们 都渲染到页面上
    render(vnode,document.querySelector('#app'))
   
        setTimeout(() => {
            render(vnode1,document.querySelector('#app'))
        },3000)

</script>
```

![](2.gif)

## 总结

```JS
1.首先就是我们的生成虚拟DOM的函数 createElement 然后会把你的父节点和子节点的类型都标记一下 比如是元素还是文本还是组件之类的
2.然后我们开始render函数 render函数有两种情况 一种是你首次要把你生成的虚拟DOM挂载到真实DOM上 一种是你原来有虚拟DOM 发生了更新 我们就要从新patch计算一下 然后在挂载
3.无论那种情况我们都要先把我们生成的虚拟DOM 存放一下
4.我们先说首次挂载 在render函数里调用的mount函数 需要把你的虚拟DOM 和你的容器传入进去
5.mount函数 接收三个参数 一个是你的虚拟DOM 一个是你的容器另外一个是 你新的虚拟DOM 需要改变位置的元素
6.这里我们挂载也是分为几种情况  我们先会判断你传进来的虚拟节点的类型 然后根据类型是标签还是文本 去执行不同的挂载方法
7.如果是标签 我们就mountElement 方法去挂载 首先你的标签名字在tag里面 我们根据这个去创建元素 然后把你的属性 子元素 和子元素节点都解构出来 然后在去判断你的子元素标记 在根据不同的标记情况 使用mount方法去挂载 
7.最后这里我们涉及到 如果你有更新的操作 比如 你有新的vnode位置发生改变 就要重新插入 或者 把你的元素挂载到容器上
8.第二种挂载就是你的元素是个文本 我们就调用 mountText 方法 然后直接创建你的文本直接挂载到DOM上
9.以上就是首次render函数里的挂载 然后 就是有新的vnode传进来 之后我们就需要patch 把新老的vnode对比一下 开始发生计算
10.render函数进来之后 我们会先判断 你的container.vnode在不在 如果在 就说名你是更新操作 我们就开调用patch函数 把你的新的vnode 和老的vnode 还有容器都传入进去
11.这个时候我们的patch函数对比 也分三种情况 首先会把你新老的vnode的标记搞出来 然后根据标记去判断 如果你老的vnode标记不等于新的vnode标记 就说明 你老的vnode 可能是个标签 新的vnode可是能是文本 这个时候我们就调用 replaceVnode 函数 把新老vnode都传入进去 因为你连标记类型都不一样了 我们这里在replaceVnode函数里 直接就把老的vnode移除 然后使用mount方法 挂载新的vnode
12.如果你新的vnode是个元素 老的也是 那么我们就调用 patchElement方法 去对比你的新老vnode 
13.patchElement方法 因为都是标签都一样 我们这里只要对比一下属性即可 把属性替换一下 然后开始调 patchChildren 对比子元素的改变
14.patchChildren 方法涉及到三种情况 需要一次此的去对比 详见代码
15.最后的情况是如果你新传进来的是个文本 那么们就让你的老vnode 直接等于新的vnode文本即可
```

## 代码地址

```JS
代码地址:https://github.com/wazer1987/vDom
```

