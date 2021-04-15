---
title: Vue源码开发-模版解析02
date: 2021-01-02
updated: 2021-01-02
tags: Vue
categories: 源码
keywords: Vue
description: Vue 
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
# Vue源码开发-模版解析

## 渲染流程

```js
1. 首先会看看 我们有没有传render方法 如果传了 就会渲染render方法里面的内容
2. 如果没有render方法 就会看看 你有没有template模版 然后会把template模版替换成你的根标签进行渲染
3. 如果上面两个都没有 就会找你的el 并把el 里面的内容渲染 
```

```html
<body>
    <div id="app"></div>
    <script src="./dist/umd/vue.js"></script>
    <script>
        let vm = new Vue({
           	// 3. 如果都没有 就渲染我们el 获取的内容
            el:'#app',
            data:function(){
                return {
                    arr:[{name:'zs'}]
                }
            },
          	// 1. 会看看 你又没有传render 如果传了就渲染 render 里面的内容
            render(h){
                h('div',{id:'app'})
            },
          	//2. 如果没有 就会看 你有没有 template  并把template 替换成我们的上面  <div id="app"></div> 渲染 
            template:`<div>hallow</div>`,
            methods:{}
        })
        
        console.log(vm.arr,'---arr')
    </script>
</body>
```

## ast解析

```js
1. 那么问题来了 你直接获取的html标签还好 那么template 和 render函数怎么变成html标签渲染
2. 所以这里就有了我们的ast 解析 template 变成我们的render函数进行渲染
```

## 初始化渲染

```js
1. 我们在初始化了状态 比如 data props methods computed等
2. 然后就开始初始化渲染了
3. 这里 如果看见你传了el属性 那么就会调用$mount方法去渲染
4. 如果没传el属性也是调用$mount去渲染
```

```js
1. 如果 我们没有传render方法 他就会看看 你有没有tempalte
2. 如果template 也没有 就会看看 你有没有传el属性
3. 如果传了el属性 就会 获取到你整个el的HTML字符串报错最外层 并且赋值template
4. 然后开始调用 compileToFunctions函数 把我们的template 传进去
5. compileToFunctions函数 开始编译成我们的ast语法
```

```js
// init.js

import { initState } from "./state"
export function initMixin(Vue){
    Vue.prototype._init = function (options){
        // 因为 vue 会把我们的传进来的参数都挂在到我们的实例上的$options
        const vm = this
        vm.$options = options
        initState(vm)
        //8. 我们初始化了 State以后就要开始 首次渲染
        //8.1 如果当前有el属性 我才渲染
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function(el){
        //8.2开始挂在操作 
        // 先看看你传的el是否存在的
        const vm = this
        const options = vm.$options
        let ele = document.querySelector(el)
        //8.3 这里的渲染逻辑是 先看看你有没有render方法 如果没有   
        // 就将你的 template 转换成render方法  
        if(!options.render){
            // 先看看 你有没有 render 如果没有 我在看看 你有没有 template
            let template = options.template
            if(!template && ele){
                // 如果你没有template 但是你有 el 所以我就拿到你el的html结构 变成render方法渲染
                template = ele.outerHTML
                //这里我们得到的是一大堆的html字符串
                console.log(template)
            }
            const render = compileToFunctions(template)
            options.render = render
        } 
    }
}
```

## compileToFunctions方法

```js
1. compileToFunctions 方法 主要是 把我们的上面获取到template 的HTML字符串 编译成render函数
2. 那么如果把HTML字符串 变成render函数呢
3. 这里就需要把 HTML字符串 变成 AST语法树
4. AST语法树 主要作用就是描述语言本身的
```

```js
// AST 语法树
AST 语法树 可以用来描述 语法本身
<div id="a">hellow</div>
// AST 描述 HTML
{
  tagName:'div', //标签名
  type:1 //类型 是个元素
  attrs:[{id:'a'}], //属性
  children:[] //字节点
}

// AST 描述 JS
const a = 1
{
  indentifier:const,
  name:a,
  value:1
}
// 虚拟DOM 是用 js对象 来描述 DOM的 所以跟AST语法还是有区别的
```

## 正则

```js
// 匹配 aaa-123aa <aa-aa></aa-aa>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// ?: 匹配不捕获 命名空间标签 my:xx <my:xx></my:xx>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 标签开头的正则 < 
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 标签闭合标签的 </ </div> 
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配属性的 id="xx" <div id="xx"></div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 匹配标签结束的 > /> 比如单标签 <br/>
const startTagClose = /^\s*(\/?)>/
// 匹配 {{}} 的
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
```

## 思路

```js
1. 我们假设一个我们的标签结构如下
```

```html
<div id="app" class="init">
  hello
  <span>aa</span>
<div>  
```

```js
1. 首先我们是循环解析的 解析一点 就删除点 直到你的html为空 就说明我们全部解析完毕了
2. 所以我们先看 你是不是 以 < 开头的 如果是 那么你一定是 开始标签 
3. 所以我们就要调用 我们的解析开始的标签 来生成AST语法树中的一个节点
```

## parseHTML方法

```js
1. 用来解析我们 HTML 也就是我们上面的结构 然后开始循环解析
2. 首先判断 你传进来的HTML 是不是 < 开头的 如果是 我们就调用 parseStartTag方法来解析 解析完的结果就是 我们的开始标签 是div 然后 属性是attr:[{id:attr},{class:'init'}]  解析完毕之后 把我们解析的结果传入 start方法  调用 createASTElement方法来生成我们的 AST 树中的一个节点数据  而我们解析完毕开始标签之后 就要删除   就变成如下的结构

hello
  <span>aa</span>
<div>  
  
3. 往下走 然后 hello 文本 就调用我们的 chars方法 解析我们的文本 并且生成AST的一个文本节点数据 然后删除解析完毕的文本 变成如下结构

  <span>aa</span>
<div> 

4. 这里由于我们 有碰到 < 开头的了 开会调用我们的 start方法  解析开始标签 生成 AST中树的一个节点数据 然后删除我们的解析完的开始标签 变成如下结构

	aa</span>
<div> 
    
5. 然后一看是aa 同我们的3步骤一样 调用我们的 chars 在删除 结构就如下

	</span>
<div> 
  
6. 走到这里一看 是 </ 开头 
所以就知道是我们结束标签 就调用我们的 end方法 到这个方法里我们就需要确定我们上面 所生成的 AST所有节点的父子关系
```

```js
function parseHTML(html){

// 9. 通过一下的方法我们就 把我们的标签 匹配出来了 现在需要用我们处理的数据 开始生成AST语法树
    function createASTElement(tagName,attrs){
        return {
            tag:tagName, //标签名
            type:1, // 元素类型
            children:[], // 孩子列表
            parent:null ,// 是否为元素
            attrs //属性集合
        }
    }
    //9.1定义树根 
    let root
    // 定义当前的标签 用来 生成父子关系
    let currentParent

    //10. 定义栈 用来校验我们标签的合法性能 就是你不能出现下面的结构 <div><span></div></span>
    let stack = []
    //5 解析标签的方法
    //5.1 解析开始标签
    function start (tagName,attrs){
        //7.2 走到这里 就说明 我们在开始标签 里面的都已经解析完毕了
        console.log(tagName,attrs,'----start')
        //9.2 start 方法 每次我们都能拿到 你处理的开始标签 和属性 所以在这我们调用 createASTElement生成AST语法树
        let element = createASTElement(tagName,attrs)
        if(!root){
            root = element
            console.log(root,'----root')
        }
        // 把当前的标签赋值一下 用来生成父子关系
        currentParent = element
        //10.1 我没遇到一次开始标签 就向栈里面放
        stack.push(element)
    }
    //5.2 解析结束标签
    function end(tagName){
        console.log(tagName,'-----end')
        //10.2 每次遇到结束标签的时候 我就从栈中去出来
        let element = stack.pop()
        currentParent = stack[stack.length-1]
        if(currentParent){
            element.parent = currentParent
            currentParent.children.push(element)
        }
    }   
    // 5.3 解析文本
    function chars(text){
        console.log(text,'-----chars')
        //9.3 看看 你解析出来的是不是文本 为不为空 如果都为空 我们就把向AST中去添加 如果不为空我们才添加
        //我们假定情况 如果 你的开始标签解析完了 然后就应该是文本 是文本 我们就应该push到你当前元素标签的children属性里
        text = text.replace(/\s/g,'')
        if(text){
            currentParent.children.push({
                type:3,
                text
            })
        }
       
    }
    //4. 这里 解析的逻辑 就是 <div id='xx'>hello</div>
    // 我们解析一点 就删除一点 解析一点就删除一点 解析完 < 就把 < 删除掉 解析完 div 就把 div删除掉
    // 所以我们需要几个方法
    // start 解析开始标签的 方法  end 解析结束标签的方法 chars 解析文本的方法
    // 我们解析的方式 就是解析一点就删除 解析节点就删除 直到html为空
    //6. 因为我们html 是解析一点就删除的 所以只要不为空我们就要一直解析
    while(html){
        //6.1 看看 你是不是开头标签 开头标签 就看看你的html字符串 是不是 < 开头
        let textEnd = html.indexOf('<')
        if(textEnd == 0){
            //6.2 肯定是标签 但是有可能是开始标签 或者 结束标签 因为都一以<开头的
            // 先看看你是不是开始标签
            const startTagMatch =  parseStartTag()
            // console.log(startTagMatch,'---startTagMatch')
            //7.如果我们的 startTagMatch 有值就说明我们开始标签匹配完了
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue
            }
            // 9.我们下面的文本匹配完了 下面就有可能是结束标签 </div> 这种
            const endTagMatch = html.match(endTag)
            if(endTagMatch){
                console.log(endTagMatch,'---')
                advance(endTagMatch[0].length)
                //匹配到了 就调用结end方法
                end(endTagMatch[1])
                continue
            }
        }

        //8.  以上我们处理完了 开始标签 <div id="app" class="init">
        // 下一个 就是开始处理文本了 所以我们需要把我们的文本截取出来 当然这里可能包括空格之类的
        let text
        if(textEnd > 0){
            //8.1 这里我们是while循环的 所以直到再次找到 < 以后 textEnd的值都是 我们 < 之前的哪些字符的索引
            text = html.substring(0,textEnd)
        }
        // 8.2 如果我们匹配到了 文本 就嗲用chars方法
        if(text){
            // 在删除
            advance(text.length)
            chars(text)
        }
    }

    //7. 因为我们要匹配一点 就删除一点 匹配一点就删除一点 所以我们就要有一个删除的方法
    function advance(n){
        //7.1 n 是你要删除多少个 这里 我们使用match 截取来的数组的第0项 就是你删除的长度
        //删除完之后 在改变我们传进来的 html字符串
        html = html.substring(n)
    }

    //6.3 利用我们上面的正则 开始匹配<
    function parseStartTag(){
        const start = html.match(startTagOpen)
        if(start){
            //6.4 捕获的结果 是个数组 ["<div", "div", index: 0, input: "<div id="app">↵        hellow↵    </div>", groups: undefined]
            // console.log(start,'---start')
            //6.5 开始根据匹配出来的数据 进行ast语法树的生成
            const match = {
                tagName:start[1],
                //6.6 这里可能还有很多的属性 我们先不管
                attrs:[]
            }
            //6.7 删除我们解析过的字符串
            advance(start[0].length) 
            //console.log(html)
            // 删除完毕之后 就变成 id="app">hello</div>
            // 6.8 所以下一步 我们就开始解析属性 但是这里如果我们是闭合标签了 也就是遇到了这个 > 就说明没有属性了 
            // 我们就要停止循环
            //end 就是我们的 结束条件 
            let end 
            // attr 就是我们撇配到的属性
            let attr
            // 如果我们匹配到了 > 就应该停止循环
            // 另外我们还要匹配属性  所以 我们只要你不是结尾 我们就要继续匹配属性
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
                //匹配出来的结果 是个数组
                //[" id="app"", "id", "=", "app", undefined, undefined, index: 0, input: " id="app">↵        hellow↵    </div>", groups: undefined]
                // 匹配的结果 就是我们的属性 数组第1为就是我们的属性名 属性值 如果双引号 就是 数组第3 单引号 就是第四位 没写就是第五位
                // 匹配出来的属性方法发我们的ast语法树中
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5]})
                // 匹配完 在删除我们匹配属性
                advance(attr[0].length)
                // break
            }
            //6.9 属性匹配完毕之后 就是我们 > 字符标签 所以 当我们有 > 我们end 就有值了
            if(end){
                // 所以我们就删除掉 > 也说明我们的开始标签里的 标签 和属性就匹配完了
                advance(end[0].length)
                return match
            }
        }
    }
    return root
}
```

## 如何确定父子关系

```js
1. 这里我们利用栈结构 来完成 所以我们定义个stack
2. 首先我们定义一个 根 也就是root 然后在定义我们的 当前的元素 变量 父亲 就是 currentParent
```

```html
<div id="app" class="init">
  hello
  <span>aa</span>
<div> 
```

```js
1. 我们开始解析 当我们解析道 <div id="app" class="init"> 这里的时候 会调用我们的 parseStartTag 方法
2. parseStartTag 方法 把我们的标签解析成 数据 tagName:'div' attrs:[{id:'app'},{class:'init'}]
3. 然后把解析好的数据 传入到我们的 start方法里 这个方法接收了我们上面的数据 调用我们的 createASTElement方法 来生成我们的AST语法树节点的固定数据格式
4. 然后开始判断 你的root 有没有值 如果没有值 说明你是第一次解析开始标签 所以 就让root 等于 我们 createASTElement方法 生成完的 AST数据格式 并且让我们 currentParent 等于我们的当前的AST语法解析树 并且向我们的stack 中 把我们的AST语法树push进去 这里push的是 我们的 createASTElement方法生成的数据节点
5. 此时      //这里是我们调用 createASTElement方法生成的AST语法树的节点格式
root ->   {tag:'div', //标签名
          type:1, // 元素类型
          children:[], // 孩子列表
          parent:null ,// 是否为元素
          attrs} //属性集合

currentParent ->  {tag:'div', //标签名
          				type:1, // 元素类型
          				children:[], // 孩子列表
          				parent:null ,// 是否为元素
          				attrs} //属性集合
stact -> [
  {
    tag:'div', //标签名
    type:1, // 元素类型
    children:[], // 孩子列表
    parent:null ,// 是否为元素
    attrs //属性集合
  }
]
6. 然后删除了我们的解析完毕的开始标签 解析 hello 完毕之后  就向我们的 currentParent.children 里push 了我们的文本 所以 currentParent 就变成如下结构

currentParent ->  {tag:'div', //标签名
          				type:1, // 元素类型
          				children:[{type:3,text:'hello'}], // 孩子列表
          				parent:null ,// 是否为元素
          				attrs} //属性集合
由于我们 root currentParent stact  的值都是一个饮用地址 所以 root 和 stact 也会和他们一样
```

```js
7. 然后解析完毕之后 我们把解析完毕的删除了 所以 剩下如下的结构
```

```html
	<span>aa</span>
<div> 
```

```js
8. 由于我们是循环进行的 一看 又是以 < 开头 所以 调用  parseStartTag 解析完毕之后 就进到我们的 strat方法 createASTElement 方法 来生成我们的 AST节点数据
{
   tag:'span', //标签名
    type:1, // 元素类型
    children:[], // 孩子列表
    parent:null ,// 是否为元素
    attrs:[] //属性集合
}
因为此时我们的根已经有了 所以 不会把生成的数据 赋值给我们的根 root 但是会赋值给我们的 currentParent 而我们的stact 也会 push 进去 此时 如下

currentParent ->  {tag:'span', //标签名
          				type:1, // 元素类型
          				children:[], // 孩子列表
          				parent:null ,// 是否为元素
          				attrs:[]} //属性集合
stact -> [
  {tag:'div', type:1, children:[{type:3,text:'hello'}], parent:null ,attrs},
  {tag:'span', type:1, children:[], parent:null ,attrs}
]

9. 然后删除开始的span 标签 解析aa 还是调用我们的 chars 方法 并且 currentParent.children.push 我们文本 有于这我们 都是 currentParent 和 stact的值 都是引用 我们的 createASTElement方法生成的AST节点数据 所以 aa 解析完毕之后 数据就变成如下

currentParent ->  {tag:'span', //标签名
          				type:1, // 元素类型
          				children:[{type:3,text:'aa'}], // 孩子列表
          				parent:null ,// 是否为元素
          				attrs:[]} //属性集合
stact -> [
  {tag:'div', type:1, children:[{type:3,text:'hello'}], parent:null ,attrs},
  {tag:'span', type:1, children:[{type:3,text:'aa'}], parent:null ,attrs}
]
```

```js
9. 结构变成如下
```

```html
	</span>
<div> 
```

```js
10. 此时是我们的闭合标签 解析完毕之后 就会用我们的end 方法 在这里我们就确定了父子结构
11. 首先我们在 只要遇到开始标签 就向 stact 去存放 ['div','span',]  那我们遇到的第一个结束标签 肯定是 span 因为标签是对称的
<div>
  <span></span>
</div>
12. 这个时候 我们就知道 我span 结束了 而我的 父亲 肯定是我stact中前面的那一个元素 也就是div
13. 所以我就 把栈中的最后一个元素取出来  'span' 而我此时栈中 只剩 ['div']
14. 而我此时 在取出最后一个元素 而我栈中此时最后的一个元素 就是我当前元素的父亲 
15. 所以这里 我给我们去处来的 span.parent = 我们栈中的最后一个元素 也就是div
16. 然后 让我们栈中的最后一个元素的 div.chilren = 我们最开始从栈中取出来的最后一个元素 也就是span
17. 这里 有地址的引用关系 所以我们的根元素 就会随着我们以上的操作而变化
18. 这样我们的AST语法树就生成了
```







