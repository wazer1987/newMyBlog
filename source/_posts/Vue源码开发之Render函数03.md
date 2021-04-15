---
title: Vue源码开发-Render函数03
date: 2021-01-03
updated: 2021-01-03
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

```js
1. 前面 我们已经 把我们的 HTML 解析成我们的 AST 语法树了
2. 接下来我们 把我们生成好的 AST语法树 编译成我们的 render函数
```

## 如何变成我们的render函数

```js
1. 核心思路就是字符串拼接 
2. 因为上面我们已经把我们的 HTML结构 解析成了AST语法树
3. 我们会根据AST语法树中的东西 做函数的字符串拼接
4. 最后render函数会把我们的创建好的变成虚拟DOM
```

```html
<div id="app" a="1">
    <span style="color:red;">
        {{name}
        <a> hello</a>
    }</span>
</div> 
```

```js
//1.1 我们就要把上面的东西 生成如下的代码
//_c 函数 就是创建DOM的 第一个参数 是你要创建的 元素名称
// 第二个参数 是你的属性集合
// 第二个参数以后 就是 你的孩子参数
// 如果你的孩子还是是个元素 那么就接着用_c函数继续创建
// _s函数 用来解析你的{{}}括号里面的东西
render(){
    return _c(
        'div',{id:'app',a:1},
        _c('span',{style:{color:'red'}},
            _s(name),
            _c(a,{},_v('hello'))
          )
        )
}
```

## 解析

```js
1. _c 就是用来创建DOM元素的
2. _v 是用来创建 文本元素的
3. _s 是用来创建 你{{produc}}这中元素的
4. 基本规则就是 我们用_c函数 去创建元素 第一个参数 是你要创建的元素 第二个参数 就是你的属性集合 第二个参数至最后 就是你的孩子列表
5. 所以这里 如果你的孩子其中有Dom元素 我们就在用 _c 函数去创建
6. 以上都创建好了 我们会生成一个 函数的字符串代码
7. 最后在把这些函数的字符串代码 编程函数执行 去生成我们的虚拟DOM
```

```js
// 以下是我们的创建的ast语法树
attrs: (3) [{…}, {…}, {…}]
children: (3) [{…}, {…}, {…}]
parent: null
tag: "div"
type: 1
// 然后我们就要把这个语法书 变成我们上面的中 字符串拼接的函数
```

## generate方法

```js
1. 主要是把我们的AST语法树 生成我们的上面的那种 函数字符串的代码
2. 其核心思想 还是要做字符串做拼接
```

```js
export function generate(el){
   //3. 这里面有孩子有可能是还是标签元素 所以我们要调用_c函数重复上面的操作 如果是文本 我就要调用_v函数
   //3.1 最后 需要把我们所生成的孩子 用,连接 放在_c函数的 第二个参数后面 
   let children = genChildren(el.children)
   //1. 这里我们第一次肯定是从根开始 那么以根肯定是个元素 所以我们就调用 写歌函数_c的字符串代码
   // 把我们的标签名传进去 
   let code = `_c('${el.tag}',
	 //2. 然后_c函数的第二个参数 就是我们的属性 我们AST语法树传进来的属性 attrs是数组 我们要把他便利成
	 // {id="app",a='1',style={color:'red'}}这种格式 所以我们单写一个函数genProps 用来生成以上的格式
   ${el.attrs.length?genProps(el.attrs):'undefined'}
   ${children?(','+children):''} 
   )`
   return code
}
```

## genProps方法

```js
1. 格式化我们的属性的方法 因为我们属性 attrs 是个数组 里面每一个元素 都是我们需要把他变成我们需要的格式
2. attrs 是以下格式
{name: "id", value: "app"}
{name: "class", value: "init"}
{name: "style", value: {…}}
3. 我们要生成的格式 {id:'app',class:'init',style:{color:'red'}} 这种放入进我们的_c函数的第二个参数
```

```js
function genProps(attrs){
 		//1. 这里分为两种情况 第一种就是我们普通的情况 第二种就是 style:{color:'red'}这种 所以我们要单独判断
    let str = ''
    for(let i =0; i < attrs.length; i++){
        let attr = attrs[i]
        if(attr.name === 'style'){
            //2 如果属性是 style 我们要处理成 style={color:red;height:'200px';}
            let obj = {}
            attr.value.split(';').forEach(item => {
                //分割完的每项是  color:red   height:'200px'
                //然后每项在分割 个我们的obj对象添加
                let[key,value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
            //3.这里需要注意 我们最终出来属性 是 {a:'1',b:'zs'} value应该是字符串 所以我们要用JSON.stringify转换一下
            // 由于每个属性之间 是逗号分割的 所以这里我们也要拼接一下逗号
            str += `${attr.name}:${JSON.stringify(attr.value)},`
        
    }
    // console.log(str,'---str')  这里拼接完毕之后 最外层是不带{}
    //最后把逗号截一下
    return `{${str.slice(0,-1)}}`
}
```

## genChildren方法

```js
1. 就是看看你的孩子 里面 是元素还是文本 
2. 孩子的数据格式
{tag: "div", type: 1, children: Array(1), parent: {…}, attrs: Array(1)}
{tag: "span", type: 1, children: Array(1), parent: {…}, attrs: Array(0)}
{type: 3, text: "hello{{product}}"}
3. 所以我们要循环便利每一项 然后根据你不同的情况 是元素 去生成_c函数字符串 是文本 去生成 _v()函数字符串
4. 然后便利完毕之后 用我们的,号连接起来 放到我们_c函数的 第二个参数之后
```

```js
//5.拼接孩子看看 你有没有孩子
function genChildren(children){
    console.log(children,'--children')
    // 5.2 如果有孩子 我就要递归的去生成 判断你是不是元素 或者 文本之类的
    // 孩子的数据格式如下
    // {tag: "div", type: 1, children: Array(1), parent: {…}, attrs: Array(0)}
    // {type: 3, text: "hello"}
    if(children){
        // 这里开始递归处理 去调用gen函数去看看 当前的孩子是元素还是文本 最后是个数组
        // 然后我们用,连接起来
        return children.map(child => gen(child)).join(',')
    }
}
```

## gen函数

```js
1. 用来把你孩子的每一项判断是文本 还是 元素 然后生成_c()函数的代码字符串 还是 _v()函数的代码字符串
2. 如果是元素 我们就执行生成_c的代码字符串 
3. 如果是文本 就分几种情况 第一种就是 hello 这种 纯文本 第二个就是 带花括号的 {{product}} 第三种 就是文本和 花括号 混合的{{product}} hello
```

```js
function gen(node){
    //6.1 如果你穿进来的孩子是元素 那么就调用我们的 generate方法去处理元素
    if(node.type === 1){
        return generate(node)
    }else{
        // 如果你的孩子是文本 我们就调用
        //6.2 这里面我们处理的方式 有三种情况
        // 第一种 hello 就是普通的文本
        // 第二种是 大括号 {{product}}
        // 第三种就是 混合文本 既有文本 又 有大括号 {{product}} hello
        let text = node.text // 拿到了文本 根据我们上面的情况去处理
        if(defaultTagRE.test(text)){
            // 6.3 这里就说明 你的文本里 我匹配到 {{}} 但是也有可能是混合的 {{aa}} aaa {{bbb}} cc
            // 所以我把匹配出来的都放在数组里 然后循环去生成函数的字符串代码
            let tokens = []
            let match
            //匹配到的索引
            let index = 0
            // defaultTagRE.lastIndex 就是 hello {{product}}  所有字符 的长度 也就是这个字符一共多长
            // 因为我们用上面用过一次正则  所以每次批完完毕之后我们要把索引在变成0
            let lastIndex = defaultTagRE.lastIndex = 0
            //不停的把你双花括号里面的文本拿出来 我们此时结构的文本是 hello {{product}}
            while (match = defaultTagRE.exec(text)) {
                //6.4 这里的match 是个数组  ["{{product}}", "product", index: 5, input: "hello{{product}}", groups: undefined]
                // 在这里我们要做函数字符串的代码拼接 _v(_s(name) + 'a' + _s(age) + '哈哈')
                // match.index 就是你匹配到的那段{{}} 是从 hello {{product}} 哪个位置开始的
                index = match.index
                if(index > lastIndex){
                   // 6.5 我们就应该 把我们的{{}} 这段字符截出来 然后放进 tokens里
                   tokens.push(JSON.stringify(text.slice(lastIndex,index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if(lastIndex < text.length){
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }else{
            //这里就是说明 你就是一个纯文本 我就生成拼接文本的函数字符串 因为要带引号所以用JSON处理下
            return `_v(${JSON.stringify(text)})`
        }
    }
}

```

## with语法

```js
1. 主要是能保证我们的this 取值 
2. 因为我们上面已经写好了我们 函数字符串拼接  但是有一些花括号里的变量 我们要去我们的vm里去 也就是在我们的this 上
3. 所以这里 我们首先第一要把我们上面的函数拼接字符串变成一个真正的可执行函数 另外 就是当我们需要去我们的vm 去取data数据 所以就需要使用with
```

```js
function aa(){
  // 这里面的this 是我们的bb 而with 语法 里面的函数体 就相当于去我们的this 上面去到对应的变量 
  with(this){
    console.log(bb)
  }
}

aa.call({bb:'111'})
```

```js
1. 所以 我们要把我们上面的 用字符串拼接好的函数 用with 语法包一下 
2. 这样在调用的时候 我们就直接把我们的Vue的实例传入进去
3. 然后 当我们字符串拼接的函数 里面有花括号变量取值的时候 直接就可以去实例上去 data里面的数据了
```

```js
Vue.prototype.$mount = function(el){
        const vm = this
        const options = vm.$options
        let ele = document.querySelector(el)
        if(!options.render){
            let template = options.template
            if(!template && ele){
                template = ele.outerHTML
            }
            const ast = compileToFunctions(template)
            const code = generate(ast)
            // 使用with语法包一下 方便我们的 写好的字符串拼接代码里面花括号里面的变量 去 实例上去值
            const render = `with(this){return ${code}}`
        }
        
    }
}
```

## render函数

```js
1. 接下来 我们就需要以上我们下好的 字符串的函数 变成一个真正的函数 
2. 这里面没有使用eval 因为 会把 值也直接取出来 而且 eval 也不支持传惨
3. 所以这里我们 new 一个 Function 的实例  这里也会产生一个新的作用域
```

```js
Vue.prototype.$mount = function(el){
        const vm = this
        const options = vm.$options
        let ele = document.querySelector(el)
        if(!options.render){
            let template = options.template
            if(!template && ele){
                template = ele.outerHTML
            }
            const ast = compileToFunctions(template)
            const code = generate(ast)
            //2021 2.15 - 01 使用with语法包一下我们上面拼接好的字符串函数 方便我们里面的变量去实例上取值
            const render = `with(this){return ${code}}`
            // 2021 2.15 - 02 然后我们new 一个Function 把我们写好的字符串函数变成一个真正可以执行的函数
            let fn = new Function(render)
            return fn
        }
    }
```

## 总结

```js
1. 以上就是把我们的 AST语法树的数据 变成我们的函数字符串 
2. 这里无非就是字符传的拼接 根据的你参数的不同 我们去 拼接 不同的函数
3. 比如 元素对应_c函数 文本 对应_v函数 表达式对应_s函数
4. 最后我们把拼接好的函数字符串 变成真正可以调用的函数
```

