---
title: React高阶应用
date: 2019-03-23
updated: 2019-06-03
tags: React
categories: React
keywords: React
description: React高阶应用
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
# React组件

## 组件的优化

### 场景一

```jsx
1. 现在我们就两个页面 一个是home页面 访问 路径是'/' 一个是demo页面 访问路径是 '/demo'
2. demo 页面里 我们会有一个计数器的功能 当页面一跳转到 这里的时候 开始起一个定时器 然后累加数目
3. 这个时候 我们离开demo页面 去 home页面  就会报错 
4. 报错原因 是因为我们离开demo的时候 没有停止定时器 他还在走 
5. 所以我们需要在 componentWillUnmount 的时候 停止这个定时器
6. 其实不光定时器 比如网络请求 和 事件监听 在组件销毁的时候我们都必须移除
```

```jsx
import React from 'react'
let timerID 
class Demo extends React.Component{
    state = {
        count:0 
    }
    //这里我们开启了定时器 但当我们离开这个页面的时候 他还在运行 就会报错
    componentDidMount(){
        let count1 = 0
        timerID = setInterval(() => {
            count1++
            this.setState({
                count:count1
            })
        }, 1000);
    }
	//所以 这里 我们在组件卸载的时候 就要清除这个定时 其他的还有 请求 事件监听
    componentWillUnmount(){
        clearInterval(timerID)
    }
    render(){
        return(
            <div>
                {this.state.count}
            </div>
        )
    }
}
export default Demo
```

### 场景二

```jsx
1. 通过刚刚计时器我们知道 由于state的改变  我们视图每次都会重新渲染 而重新渲染就会调用 render函数
2. 如果这个时候 我们当前文件里还有子组件 那么由于state的改变 子组件也会重新渲染 render 也会被执行
3. 但是我们的子组件 是静态的数据 不会改变的时候 这个时候 就有一些不太合理
```

![](9.gif)

```jsx
//这个时候 我们组要在子组件的 shouldComponentUpdate return false 就是不更新
import React from 'react'
export default class Parent extends React.Component{
    //在这个生命周期函数里 选择 子组件不更新
    shouldComponentUpdate(){
        return false
    }
    render(){
        console.log('子组件的render')
        return (
            <div>
                我是子组件
            </div>
        )
    }
} 
```

![](10.gif)

### 场景三

```jsx
1. class Child extend React.Component 和 class Child extend React.PureComponent 的区别
2. Component 不会对数据进行比较 PureComponent 会对数据进行浅比较 
3. 就是 使用了 PureComponent 的组件 你如果这次跟给我上次传过来的值 相同 我就不会 更新
```

### Context  的使用

```jsx
1. 比如我们现在 A 组件里 有B组件  B组件里有C组件 
2. 我们现在 有一个参数 从A 传到 B 了 但是B组件中没有使用 只有在C组件中使用
3. 以前的做法 我们就是 从A传到B  然后 B在传给C
4. 这个时候 我们就可以用 Context去完成
```

```jsx
import React from 'react'
import PropTypes from 'prop-types'
function Bcom (props){
    return(
        <>
        <div>我是在demo1组件里的B组件</div>
        <Ccom />
        </>
    )
}

function Ccom (props,context){
    3.这样我就可以拿到 context里面的东西了
    console.log(context,'---context')
    return(
        <div>我是在B组件里的C组件
            我是context:{context.color}
        </div>
    )
}
export default class Demo extends React.Component{
    1.我们要把这个传递的属性 挂到 context 上
    getChildContext(){
        return{
            color:'red'
        }
    }
    render(){
        return (
            <div>
                我是demo1
                <Bcom />
            </div>
        )
    }
}
2.对 挂载到context 上的 属性的值 进行类型的类型的生命
Ccom.contextTypes = {
    color:PropTypes.string
}
Demo.childContextTypes = {
    color:PropTypes.string
}
```

## 高阶组件

```jsx
1. 高阶组件简称叫HOC  是一个函数 参数是一个组件  返回值是一个组件
2. 高阶组件 做了什么事情 比如 我们的react-router-dom 里的 withRouter 把我们的组件 包裹了起来 然后返回了一个组件 这个组件的属性上 就有了 路由的那些API 比如 push  location之类的
https://pan.baidu.com/s/1bNhFxu2MgnGC_YKnpuP-Cg dhi8
```

```jsx

import React from 'react';

//1.定义一个高阶组件 他是一个函数 参数 是一个组件 返回值 是一个组件

const withfetch = (ComposeComponent) => {
    //返回值 是一个组件 里面渲染我们的传进来的组件
    //5.由于 我们给我们的高阶组件传递了参数 所以在这里 我们就能做一些事情  比如withRouter就把push方法挂载到这上面了
    //然后通过下面的形式把参数继续传递下去
    return class extends React.Component{
        render(){
            return(
                <ComposeComponent {...this.props}/>
            )
        }
    }
}
// 2.我们现在有定义了一个组件 现在里面有个data参数 是从父组件传进来的 现在用我们上面的高阶组件包装一下
class Mydata extends React.Component{
    render(){
        return(
            <div>
                {/* 6. 这里我们就可以拿到父组件传递给高阶组件的数据  */}
                mydata:{this.props.data}
            </div>
        )
    }
}

// 3. 那么现在 Withfetch 就是一个高阶组件了
const Withfetch = withfetch(Mydata)

class Child extends React.Component{
    render(){
        return(
            <div>
                <div>高阶组件</div>
                {/* 4.我们现在渲染这个高阶组件了 并给他传入了参数 */}
                <Withfetch data={'我是外层传进来的数据'} />
            </div>
        )
    }
}

export default Child
```

### 应用

```jsx
1. 比如我们现在有这样么一个场景 都是去请求数据 然后去渲染列表 
2. 唯一的区别 只不过 渲染列表的结构 不一样 请求的URL地址不一样
3. 这里 我们就可以写一个高阶组件 公共的方法就是 去统一的去发送请求 然后处理loading 然后 渲染列表
```

```jsx
import React from 'react'
//假装这是一个请求
const fetch = () => {}

//1.写一个高阶组件函数 第一个是传进去url地址
const withFetch = (url) => {
    //2.第二个参数 是 传进去的组件 或者结构
    return (ComseComponent) => {
        return class extends React.Component{
            constructor(props){
                super(props)
                this.state = {
                    loading:true,
                    data:''
                }
            }
            async componentDidMount(){
                // const data = await fetch(url)
                console.log(url)
                setTimeout(() => {
                    this.setState({
                        loading:false,
                        data:'我是传进来的数据'
                    })
                },2000)
            }
            render(){
            return(
            {/*  这里 我们ComseComponent 就是我们的chengpin里传进来的 函数式组件 */}
            this.state.loading?<div>正在请求数据...</div>:<ComseComponent data={this.state.data}/>
            )
        }
    }
  }
}
//调用 传进去一个函数式组件 这里我们就可以根据不同的情况 传进去不同的组件结构 然后去渲染列表了
const Chengpin = withFetch('htt://www.baidu.com')((props) => {
    return(
        <div>{props.data}</div>
    )
})
//导出 即用即可
export default Chengpin
// 如果 我们还有 更多的 这样的方法 用这一个高阶组件包装一下 就特别好用
```

