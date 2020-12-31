---
title: React 登录注册逻辑
date: 2019-03-23
updated: 2019-06-03
tags: React 实战
categories: 项目实战
keywords: React
description: React 登录注册逻辑
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
# React 登录注册逻辑

## 创建项目

```jsx
1. create-react-app login-react-project
2. 删除了一些无用的文件如 app.css index.css等
3. 安装依赖 logger-redux(用来打印redux流程日志) redux-thunk(用来在redux中发送异步请求) redux(公共数据管理) react-reudx(redux便捷工具)
```

## redux 和 reducer的配置 

```jsx
1. 创建一个reducer的文件夹 里面有 auth.js(管理权限的reducer)  和 index.js(所有reducer的汇总)
```

```jsx
//auth.js 用来存放 权限的公共数据 比如 登录
export function auth(state = {},action) {
    switch(action.type){
        default:
        return state
    }
}
```

```jsx
//index.js 用来 合并所有的reducer的文件
import {combineReducers} from 'redux'
import {auth} from './auth'
const root = combineReducers({
    auth
})

export default root
```

```jsx
2.最后 在启动文件里 也就是 src/index.jsx  配置 各种插件 配置 redux
```

```jsx
//src/index.js文件
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import reportWebVitals from './reportWebVitals';

import logger from 'redux-logger'

import thunk from 'redux-thunk'

import {composeWithDevTools} from 'redux-devtools-extension'
//配置redux
import{createStore,applyMiddleware} from 'redux'
//引入reducer
import rootRducer from './reducers'
// 挂载到 react-redux
import {Provider} from 'react-redux'

//配置redux
const store = createStore(rootRducer,composeWithDevTools(applyMiddleware(logger,thunk)))

//把我们配置好的 redux 和 我们的组件做关联
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
  
);
reportWebVitals();
```

## 路由的配置 & 导航配置

```jsx
1. 我们单独创建了一个routes.js文件 用来存放我们的路由文件
2. 这里引入了我们的注册页面 和 app 页面
```

```jsx
import React from 'react'
//引入路由组件
import {Route} from 'react-router-dom'
//引入app 组件页面
import App from './components/App'
//引入 SignupPage(注册) 页面
import SignupPage from './components/signup/SignupPage'
//导出
export default (
    <div>
        <Route path="/" exact component={App}></Route>   
        <Route path="/signup" exact component={SignupPage}></Route>   
    </div>
)
```

```jsx
3. 配置我们的 导航 新建一个 NavigationBar.jsx  使用link 来配置我们的导航 这里我们使用了bootstrap样式
```

```jsx
import React from 'react'
import {Link} from 'react-router-dom'
class Navigator extends React.Component{
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
                <div className="container">
                    {/*点击的login的时候 去 Login组件*/}
                    <Link className="navbar-brand" to="/">Login功能</Link>
                    <button className='navbar-toggler' type="button" data-toggle="collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExample05">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">注册</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
export default  Navigator
```

```jsx
4. 在index.jsx(启动文件里) 引入我们的导航(Navigator) 和 我们路由(routes.js)
```

```jsx
//引入路由模式文件
import{BrowserRouter as Router} from 'react-router-dom'
//引入routes文件
import routes from './routes'
//引入菜单
import NavigationBar from './components/NavigationBar'

const store = createStore(rootRducer,composeWithDevTools(applyMiddleware(logger,thunk)))
ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes}>
      <NavigationBar/>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
  
);
reportWebVitals();
```

```jsx
5. 效果如下 如切换如下
```

![](1.gif)

## 注册页面

```jsx
1. 我们的注册页面是 signup/signupPage
2. signupPage.jsx 引入了 我们的表单组件 Signupform
```

```jsx
// signupPage.jsx
import React from 'react'
// 表单的组件 
import Signupform from './Signupform'
class SignupPage extends React.Component {
    render(){
        return (
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                {/* 引入了表单的组件 */}   
                <Signupform/>
                </div>
                <div className="col-md-3"></div>
            </div>
        )
    }
}
export default SignupPage
```

```jsx
3. 我们表单里的每一个input 都写了name属性 这样 我们在获取表单值的时候 就可以使用同一个onChange事件
4. 在设置我们state的时候 就可以使用 e.target.name : e.target.value 这种方式 赋值 就不需要写多个onChange事件
```

```jsx
import React from 'react'

class Signupform extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username:"",
            email:'',
            password:'',
            passwordConfirmation:''
        }
    }
    //每一个输入框都用同一个onchange事件
    onChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    onSubmit = (e) => {
        e.preventDefault()
        console.log(this.state,'---')
    }
    render(){
        return(
            <form onSubmit={this.onSubmit}>
                <h1>Join our community</h1>
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <input
                     type="text" 
                     {/* 这里注意 要使用name属性去设置 方便我们才设置state的时候 使用同一个onChange事件 */} 
                     name="username" 
                     value={this.state.username}
                     onChange={this.onChange}
                     className="form-control"
                     />
                    <label className="control-label">Email</label>
                    <input
                     type="text" 
                     name="email" 
                     value={this.state.email}
                     onChange={this.onChange}
                     className="form-control"
                     />
                    <label className="control-label">Password</label>
                    <input
                     type="password" 
                     name="password" 
                     value={this.state.password}
                     onChange={this.onChange}
                     className="form-control"
                     />
                    <label className="control-label">PasswordConfirmation</label>
                    <input
                     type="password" 
                     name="passwordConfirmation" 
                     value={this.state.passwordConfirmation}
                     onChange={this.onChange}
                     className="form-control"
                     />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-lg">注册</button>
                </div>
            </form>
        )
    }
}
export default Signupform
```

### 注册的action配置

```jsx
1. 首先我们这里 和我们的 注册页面建立连接 是在父页面完成的 也就是 SignupPage 
2. 然后把握们发送的action的函数 传递到了我们的 Signupform 页面里
```

```jsx
// actions文件夹下signupActions.js 这个文件里主要存放了我们各种格样的action   由于我们之前通过redux-thunk建立连接 所以 可以直接在里面写异步的操作比如发送请求 
import request from '../utils/request'
export const userSignupRquest = (userInfo) => {
    return dispath => {
      return request({
            url:'/api/users',
            method:'post',
            data:userInfo
        })
    }
}
```

```jsx
import React from 'react'
import Signupform from './Signupform'
//引入我们注册时候发送的action
import * as signupActions from '../../actions/signupActions'
//和redux 建立 连接
import {connect}from 'react-redux'
// 把我们要发送的action 合并到一个 对象里
import { bindActionCreators} from 'redux'
class SignupPage extends React.Component {
    render(){
        return (
            <div className="row" >
                <div className="col-md-3"></div>
                <div className="col-md-6">
                {/* 把我们写好的action 传递给我们的form组件 这里由于我们的signuppage是被路由管理的 
                	当我们点击注册并且成功的时候 应该跳转到首页 这里我们直接把histoty传递下去 就可以
                	不在用路由组件包裹了
                */}
                <Signupform history={this.props.history} signupActions={this.props.signupActions}/>
                </div>
                <div className="col-md-3"></div>
            </div>
        )
    }
}
//把我们的action 挂载到 我们的porps上
const mapDispathToProps = (dispath) => {
    return {
        signupActions:bindActionCreators(signupActions,dispath)
    }
}
//和我们的redux 建立连接
export default connect(null,mapDispathToProps)(SignupPage)
```

### 注册流程

```jsx
1. 点击注册按钮的时候 我们去向后台数据发送请求 
2. 由于我们input框绑定了相同的change事件 所以 直接 就可以把state的值发送过去
3. 后台 如果验证失败 就会给我们返回错误信息 这个时候我们需要这些错误信息去显示在input框下面
4. 然后利用classnames的库 让文本框变红
```

```jsx
// signupform.jsx
import React from 'react'
import classnames from 'classnames'
class Signupform extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username:"",
            email:'',
            password:'',
            passwordConfirmation:'',
            //注册错误的时候 接收后台返回来的错误
            errors:{},
            //控制注册按钮置灰状态 防止多重点击
            isLoading:false,
        }
    }
    //每一个输入框都用同一个onchange事件
    onChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    onSubmit = async (e) => {
        e.preventDefault()
        //控制按钮置灰
        this.setState({
            isLoading:true
        })
         const {data} = await this.props.signupActions.userSignupRquest(this.state)
         if(data.code !== 200){
             //判断是否验证不通过 然后 设置错误信息 用于页面的显示
             this.setState({
                errors:data.errors,
                isLoading:false
             })
            return
         }

         
    }
    render(){
        const {username,email,password,passwordConfirmation} = this.state.errors
        return(
            <form onSubmit={this.onSubmit}>
                <h1>Join our community</h1>
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <input
                     type="text" 
                     name="username" 
                     value={this.state.username}
                     onChange={this.onChange}
                     {/* 这里用 classnames的库 来判断 如果返回的错误信息有 username 我们就在添加个类
                     is-invalid 这个类 可以是文本框变红
                     */}   
                     className={classnames('form-control',{'is-invalid':username})}
                     />
                    {/* 在把错误信息显示出来 */} 
                     {username && <span className="form-text text-muted">{username}</span>}
                    <label className="control-label">Email</label>
                    <input
                     type="text" 
                     name="email" 
                     value={this.state.email}
                     onChange={this.onChange}
                     className={classnames('form-control',{'is-invalid':email})}
                     />
                     {email && <span className="form-text text-muted">{email}</span>}
                    <label className="control-label">Password</label>
                    <input
                     type="password" 
                     name="password" 
                     value={this.state.password}
                     onChange={this.onChange}
                     className={classnames('form-control',{'is-invalid':password})}
                     />
                     {password && <span className="form-text text-muted">{password}</span>}
                    <label className="control-label">PasswordConfirmation</label>
                    <input
                     type="password" 
                     name="passwordConfirmation" 
                     value={this.state.passwordConfirmation}
                     onChange={this.onChange}
                     className={classnames('form-control',{'is-invalid':passwordConfirmation})}
                     />
                     {passwordConfirmation && <span className="form-text text-muted">{passwordConfirmation}</span>}
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-lg" disabled={this.state.isLoading}>注册</button>
                </div>
            </form>
        )
    }
}
export default Signupform
```

![](2.gif)

## 注册成功或失败的提示

```jsx
1. 首先 我们会有一个消息的列表 这个消息列表的数据 是从reducer里取的
2. 消息列表中的数据 是我们在点击注册之后 服务器返回成功或者失败 的消息之后 我们发送action 然后把消息存放在reducer中
3. 由于我们的注册页面 表单 和 注册页面是相分离的 所以 我们的action方法 是传递到form组件中的
```

```jsx
4. 首先我们创建reducer 用去存放我们的消息列表
```

```jsx
// reducers 文件夹下 flashMessages.js 
import { ADD_FLASH_MESSAGE} from '../constants'
let num = 0
export const flashMessages = (state = [],action = {}) => {
    switch(action.type){
        case ADD_FLASH_MESSAGE:
            return [
                ...state,
                {
                    {/* 用于删除使用 */}
                    id:num++,
                    type:action.message.type,
                    text:action.message.text
                }
            ]
            default:
            return state
    }
}
// 合并我们的reducer reducers文件下的 index.js
import {combineReducers} from 'redux'
import {auth} from './auth'
import {flashMessages} from './flashMessages'
const root = combineReducers({
    auth,
    flashMessages
})

export default root
```

```jsx
5. 创建发送action的文件 
```

```jsx
// actions 文件夹下 flashMessages.js 用来发送action
import { ADD_FLASH_MESSAGE } from '../constants'
export const addFlshMessage = (message) => {
    return {
        type:ADD_FLASH_MESSAGE,
        message
    }
}
```

```jsx
6. 把我们的action文件 引入我们的signupPage.jsx 在把这个发射action的方法 传递给我们的signupform.jsx 
```

```jsx
import React from 'react'
import Signupform from './Signupform'
// 我们注册的时候 发送的网路请求 action
import * as signupActions from '../../actions/signupActions'
// 注册成功 或者 错误的 消息列表action
import * as flashActions from '../../actions/flashMessages'
import {connect}from 'react-redux'
import { bindActionCreators} from 'redux'
class SignupPage extends React.Component {
    render(){
        return (
            <div className="row" >
                <div className="col-md-3"></div>
                <div className="col-md-6">
                {/* 这里就把这两个action都传递给我们的 Signupform 组件 当点击注册时候会触发这两个*/}    
                <Signupform history={this.props.history} signupActions={this.props.signupActions} flashActions={this.props.flashActions}/>
                </div>
                <div className="col-md-3"></div>
            </div>
        )
    }
}
const mapDispathToProps = (dispath) => {
    return {
        signupActions:bindActionCreators(signupActions,dispath),
        flashActions:bindActionCreators(flashActions,dispath)
    }
}
export default connect(null,mapDispathToProps)(SignupPage)
```

```jsx
7. 我们注册成功或者失败的消息列表 组件 一开始就要去reducer里去取 消息列表 所以我们创建了 flashMessagesList 组件 他其中 有 flashMessages组件 就是我们的消息列表
8. flashMessagesList去reducer里面取出消息列表 然后在 传递给我们的 flashMessages 去显示
```

```jsx
//flashMessagesList.jsx 组件
import React from 'react'
//消息列表单个组件 由于我们的消息列表是个数组 所以需要循环出来 然后传递给我们的列表组件的每一项
import FlashMessage from'./FlashMessage'
// 和我们的redux 建立连接
import {connect} from 'react-redux'
class FlashMessagesList extends React.Component{
    render(){
        //由于我们的注册成功或者失败的消息 是个列表 所以我们要循环出来
        const messages = this.props.messages.map(message => 
            <FlashMessage key={message.id} message={ message}/>
        )
        return(
            <div className="container">
                {messages}
            </div>
        )
    }
}
//去reducer里取我们循环列表 
const mapStateToProps = (state) => {
    return{
        messages:state.flashMessages
    }
}
export default connect(mapStateToProps)(FlashMessagesList)
```

```jsx
9. 最后把我们的 FlashMessagesList 组件挂载到我们的index.jsx文件夹上 
```

```jsx
//引入路由模式文件
import{BrowserRouter as Router} from 'react-router-dom'
//引入router文件
import routes from './routes'
//引入菜单
import NavigationBar from './components/NavigationBar'
//引入消息提示列表
import FlashMessagesList from './components/flash/FlashMessagesList'
const store = createStore(rootRducer,composeWithDevTools(applyMiddleware(logger,thunk)))
ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes}>
      <NavigationBar/>
      <FlashMessagesList />
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
  
);
```

### 删除提示

```jsx
1. 因为我们的成功或者失败的消息列表 是 在reducer里存放 所以我们需要发送action
2. 这里 我们还是需要把我们的 action 传入到我们的 FlashMessage 组件里面去 
3. 当reducer 接收到我们发送的删除action 然后去我们的state里做删除操作
```

```jsx
// action 
import { ADD_FLASH_MESSAGE,DEL_FLASH_MESSAGE } from '../constants'

export const addFlshMessage = (message) => {
    return {
        type:ADD_FLASH_MESSAGE,
        message
    }
}
//删除的操作
export const delFlshMessage = (id) => {
    //这里不用些dispath直接
    return {
        type:DEL_FLASH_MESSAGE,
        id
    }
}
```

```jsx
// FlashMessagesList 文件 把我们的引入进来 然后 写入我们的connect 函数里面
import React from 'react'
import FlashMessage from'./FlashMessage'
//这里是我们删除的action
import {delFlshMessage} from '../../actions/flashMessages'
import {connect} from 'react-redux'
class FlashMessagesList extends React.Component{
    render(){
        const messages = this.props.messages.map(message => 
            //把删除的action传入到了我们的 FlashMessage 点击X的时候 去发送
            <FlashMessage key={message.id} message={ message} delFlshMessage={this.props.delFlshMessage}/>
        )
        return(
            <div className="container">
                {messages}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return{
        messages:state.flashMessages
    }
}
//这里直接解构出来就可以使用
export default connect(mapStateToProps,{delFlshMessage})(FlashMessagesList)
```

```jsx
// FlashMessage 组件 当我们点击X的时候 去发送action
import React from 'react'
import classnames from 'classnames'
class FlashMessage extends React.Component{
    onClick = () => {
        //点击X的时候去发送action 这里的id就是我们传入进来的
        this.props.delFlshMessage(this.props.message.id)
    }
    render(){
        const {type,text} = this.props.message
        return(
            <div className={classnames('alert',{
                'alert-success': type === 'success',
                'alert-danger': type === 'danger'
            })}>
                <button onClick={this.onClick} className="close">&times;</button>
                {text}
            </div>
        )
    }
}
export default FlashMessage
```

```jsx
// flashMessages.js reducer 监视到我们发送的删除的action 然后做对应的删除操作
import { ADD_FLASH_MESSAGE,DEL_FLASH_MESSAGE} from '../constants'
let num = 1
export const flashMessages = (state = [],action = {}) => {
    switch(action.type){
        case ADD_FLASH_MESSAGE:
            return [
                ...state,
                {
                    id:num++,
                    type:action.message.type,
                    text:action.message.text
                }
            ]
         //找到ID 然后 做删除 在返回给我们的视图   
         case  DEL_FLASH_MESSAGE: 
         state = state.filter(item => action.id !== item.id)
         return  [...state]
            default:
            return state
    }
}
//以上的整个删除流程就完毕了
```

## 输入用户名失去焦点的时候验证

```jsx
1. 当我们在注册页面的时候  我们当输入完用户名之后 回去验证 看看 此用户名有没有被注册
2. 这个动作也是在action里完成的
3. 我们这里还是需要在signform 页面里面 把我们action 传入给我们的 signLogin 
```

```jsx
// action / signupActions 文件 
import request from '../utils/request'
export const userSignupRquest = (userInfo) => {
    return dispath => {
      return request({
            url:'/api/users',
            method:'post',
            data:userInfo
        })
    }
}
//当失去焦点的时候 要触发这个action
export const isUserExists = (username) => {
    return dispath => {
      return request({
            url:`/api/users/${username}`,
            method:'get',
        })
    }
}
```

```jsx
// SignupPage 组件 通过react-redux把我们的action 与 redux做连接 然后传入到我们的 signForm组件
import React from 'react'
import Signupform from './Signupform'
//引入了我们的失去焦点验证的action
import * as signupActions from '../../actions/signupActions'
import * as flashActions from '../../actions/flashMessages'
import {connect}from 'react-redux'
import { bindActionCreators} from 'redux'
class SignupPage extends React.Component {
    render(){
        return (
            <div className="row" >
                <div className="col-md-3"></div>
                <div className="col-md-6">
                {/*这里把失去焦点的请求传入到了我们的 singForm文件里*/}   
                <Signupform history={this.props.history} signupActions={this.props.signupActions} flashActions={this.props.flashActions}/>
                </div>
                <div className="col-md-3"></div>
            </div>
        )
    }
}
const mapDispathToProps = (dispath) => {
    return {
        //把我们的失去焦点验证的请求挂载到了 props 上 
        signupActions:bindActionCreators(signupActions,dispath),
        flashActions:bindActionCreators(flashActions,dispath)
    }
}
export default connect(null,mapDispathToProps)(SignupPage)
```

```jsx
// signForm 页面 
import React from 'react'
import classnames from 'classnames'
class Signupform extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username:"",
            email:'',
            password:'',
            passwordConfirmation:'',
            //注册错误的时候 接收后台返回来的错误
            errors:{},
            //控制注册按钮置灰状态 防止多重点击
            isLoading:false,
        }
    }
    //每一个输入框都用同一个onchange事件
    onChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    checkUser = async (e) => {
        //拿到我的表单的key 也就是username
        const field = e.target.name
        const val = e.target.value
        if(val !== ''){
           //去发送了请求  
           const {data} = await this.props.signupActions.isUserExists(val)
           let errors = this.state.errors
           let isLoading = this.state.isLoading
           //如果后台有数据返回来 就说明有人注册了 给与对应的提示和错误提示
           if(data[0]){
                errors[field] = `用户名存在:${field}`
                isLoading = true
            }else{
                errors[field] = ''
                isLoading = false
            }
            this.setState({
                errors,
                isLoading
            })
        }
    }
    onSubmit = async (e) => {
        e.preventDefault()
        this.setState({
            isLoading:true
        })
         const {data} = await this.props.signupActions.userSignupRquest(this.state)
         if(data.code !== 200){
             this.setState({
                errors:data.errors,
                isLoading:false
             })
             this.props.flashActions.addFlshMessage({
                 type:'danger',
                 text:'注册失败,请重新注册!'
             })
            return
         }
         this.props.flashActions.addFlshMessage({
            type:'success',
            text:'注册成功!'
        })
         this.props.history.push('/')
    }
    render(){
        const {username,email,password,passwordConfirmation} = this.state.errors
        return(
            <form onSubmit={this.onSubmit}>
                <h1>Join our community</h1>
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <input
                     type="text" 
                     name="username" 
                     value={this.state.username}
                     onChange={this.onChange}
                     {/*失去焦点的时候去触发请求*/}   
                     onBlur={this.checkUser}
                     className={classnames('form-control',{'is-invalid':username})}
                     />
                     {username && <span className="form-text text-muted">{username}</span>}
                    <label className="control-label">Email</label>
                    <input
                     type="text" 
                     name="email" 
                     value={this.state.email}
                     onChange={this.onChange}
                     className={classnames('form-control',{'is-invalid':email})}
                     />
                     {email && <span className="form-text text-muted">{email}</span>}
                    <label className="control-label">Password</label>
                    <input
                     type="password" 
                     name="password" 
                     value={this.state.password}
                     onChange={this.onChange}
                     className={classnames('form-control',{'is-invalid':password})}
                     />
                     {password && <span className="form-text text-muted">{password}</span>}
                    <label className="control-label">PasswordConfirmation</label>
                    <input
                     type="password" 
                     name="passwordConfirmation" 
                     value={this.state.passwordConfirmation}
                     onChange={this.onChange}
                     className={classnames('form-control',{'is-invalid':passwordConfirmation})}
                     />
                     {passwordConfirmation && <span className="form-text text-muted">{passwordConfirmation}</span>}
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-lg" disabled={this.state.isLoading}>注册</button>
                </div>
            </form>
        )
    }
}
export default Signupform
```

## 登录

```js
1. 登录的时候 后台会返回给我们token 
2. 这个token 我们需要存放在 本地存储一个 还有reducer里一个 
3. 这个token 我们需要用 jwt-token插件 去解密出来 生成我们的用户信息
```

```js
import { SET_CURRENT_USER } from '../constants'
import request from '../utils/request'
//请求token的action
export const login = (data) => {
    return (dispatch) => {
        return request({
            url:'/api/auth',
            method:'post',
            data
        })
    }
}
//存放token的action
export const serCurrentuser = (user) => {
    return{
        type:SET_CURRENT_USER,
        user
    }
}
//点击退出的时候需要移除的token
export const logout = () => {
    return dispath => {
        //然后还需要再次发送我们的action 去把我们的登录信息设置为false 这里就直接传个空对象就好了
        localStorage.removeItem('jwtToken')
        dispath(serCurrentuser({}))
    }
}

```

```js
// loginPage 把我们上面写好的action传入到我们的loginForm文件里
import React from 'react'
import LoginForm from './LoginForm'
import {connect} from 'react-redux'
//引入了我们的action
import {login}from '../../actions/login'
class LoginPage extends React.Component{
    render(){
        return (
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">
            		{/*把我们的传入到我们的login组件里*/}
                    <LoginForm login={this.props.login}/>
                </div>
                <div className="col-sm-3"></div>
            </div>
        )
    }
}
//和redux 做连接
export default connect(null,{login})(LoginPage)
```

```jsx
// loginform组件 登录的时候 触发action 这里还有一些验证的函数 不在写逻辑了
import React from 'react'
import classnames from 'classnames'
import validateInput from '../../utils/validators/login'
import{withRouter} from 'react-router-dom'
//因为这里发送了登录的请求之后 我们还需要发送一个action 这里相当于写了两次 以后在改吧
import {connect} from 'react-redux'
import jwtDecode from 'jwt-decode'
//这个是我们存放token的action
import {serCurrentuser} from '../../actions/login'
class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: '',
            //注册错误的时候 接收后台返回来的错误
            errors: {},
            //控制注册按钮置灰状态 防止多重点击
            isLoading: false,
        }
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    //验证逻辑
    validate = () => {
        const { errors, isvalid } = validateInput(this.state)
        if (!isvalid) {
            this.setState({
                errors
            })
        }
        return isvalid
    }
    onSubmit = async (e) => {
        e.preventDefault()
        this.setState({
            isLoading: true
        })
        if (this.validate()) {
            //我们触发第一个这里会拿回来token
            const { data } = await this.props.login(this.state)
            console.log(data)
            if (data.token) {
                this.setState({
                    isLoading: false
                })
                //首先 把它存放在 本地存储
                localStorage.setItem('jwtToken',data.token)
                //然后在发送action 存放我们请求回来的token 存放之前需要把token转换称我们的用户信息
                this.props.serCurrentuser(jwtDecode(data.token))
                this.props.history.push('/')
            } else {
                this.setState({
                    isLoading: false,
                    errors: {errors:data.errors}
                })
            }
        }
    }
    render() {
        const { errors } = this.state
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login</h1>
                {errors.errors && <div className="alert alert-danger">{errors.errors}</div>}
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.onChange}
                        className={classnames('form-control', { 'is-invalid': errors.username })}
                    />
                    {errors.username && <span className="form-text text-muted">{errors.username}</span>}
                    <label className="control-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.onChange}
                        className={classnames('form-control', { 'is-invalid': errors.password })}
                    />
                    {errors.password && <span className="form-text text-muted">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-lg" disabled={this.state.isLoading}>Login</button>
                </div>
            </form>
        )
    }
}

export default withRouter(connect(null,{serCurrentuser})(LoginForm))
```

```jsx
// 对应login的reducer
import {SET_CURRENT_USER} from '../constants/index'
import isEmpty from 'lodash/isEmpty'
import jwtDecode from 'jwt-decode'
//这里因为
const initalState = {
    //判断你是否登录 一会用来控制 导航的动态显示
    isAuth:false,
    //如果刷新了 我们的reducer就没有了 所以我们需要在去本地存储去token 使用 jwtDecode 转换为我们的用户信息
    user:localStorage.getItem('jwtToken')?jwtDecode(localStorage.getItem('jwtToken')):{}
}
export function auth(state = initalState,action) {
    //当我们点击登录的时候 serCurrentuser这个action方法 就对应走到了下面的
    switch(action.type){
        case SET_CURRENT_USER:
        return {
            isAuth: !isEmpty(action.user),
            user:action.user
        }
        default:
        return state
    }
}
```

```js
// 这里在刷新的的时候 reducer里的数据就没有了 所以我们在启动文件里 也需要触发一下我们存放token的action
import React from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

import logger from 'redux-logger'

import thunk from 'redux-thunk'

import {composeWithDevTools} from 'redux-devtools-extension'

import{createStore,applyMiddleware} from 'redux'

import rootRducer from './reducers'

import {Provider} from 'react-redux'
//引入存放token的action
import{ serCurrentuser} from './actions/login'
//把token 转换成我们的用户信息 比如username之类的
import jwtDecode from 'jwt-decode'

//引入路由模式文件
import{BrowserRouter as Router} from 'react-router-dom'
//引入router文件
import routes from './routes'
//引入菜单
import NavigationBar from './components/NavigationBar'
//引入消息提示列表
import FlashMessagesList from './components/flash/FlashMessagesList'
const store = createStore(rootRducer,composeWithDevTools(applyMiddleware(logger,thunk)))
//先看看 能不能取出来如果取出来了 就说明你登录过了 我们就去 发射存放token的action 
if(localStorage.getItem('jwtToken')){
  store.dispatch(serCurrentuser(jwtDecode(localStorage.getItem('jwtToken'))))
}
ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes}>
      <NavigationBar/>
      <FlashMessagesList />
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
  
);
```

## 导航的动态显示

```jsx
1. 我们现在的导航是注册 登录 
2. 如果我们登录了 导航 就应该显示 退出
3. 刚刚我们的auth.js 这个reducer 已经设置了是否登录的标识 所以我们用它判断就好了
4. 当我们点击退出的时候 我们还需要发送的对应的action 去清除我们的本地存储还有我们的reducer 上面已经写过了
```

```jsx
// NavigationBar
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {logout} from '../actions/login'
class Navigator extends React.Component {
    //点击退出的时候 可以 触发我们的logout action 主要是为了清除一下我们的reducer 和本地存储
    logout(e){
        e.preventDefault()
        this.props.logout()
    }
    render() {
        //这里就开始判断 如果你登录 导航就只给你显示退出 如果没有登录 会给你显示 注册 登录的导航
        console.log(this.props.auth,'=---')
        const isAuth = this.props.auth.isAuth
        const userLink = (
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a className="nav-link" onClick={this.logout.bind(this)}>退出</a>
                </li>
            </ul>
        )
        const guestLinks = (
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/signup">注册</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">登录</Link>
                </li>
            </ul>
        )
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
                <div className="container">
                    <Link className="navbar-brand" to="/">Login功能</Link>
                    <button className='navbar-toggler' type="button" data-toggle="collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExample05">
                        {isAuth?userLink:guestLinks}
                    </div>
                </div>
            </nav>
        )
    }
}
//取我们auth 的reducer 看看是否登录
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}
export default connect(mapStateToProps,{logout})(Navigator)
```

![](3.gif)

## 权限

```jsx
1. 这里我们会有一个 商品的页面 如果你登录情况下我们才会让你显示
2. 这里我们用高阶组件去完成
3. 高阶组件 是一个函数 参数是一个组件 返回值是一个组件
```

```jsx
//requireAuth js文件
import React from 'react'
//这里与redux建立连接 主要是要去我们又没又登录
import {connect} from 'react-redux'
//如果没有登录 我们要有消息提示 
import {addFlshMessage } from '../actions/flashMessages'
//当我们去 shop页面的时候 如果没有权限 我们就需要跳转 让它去 登录页
import {withRouter}from 'react-router-dom'
//高阶组件 是一个函数 参数 是一个组件 这里我们要把我们的shopPage组件传进来
export default function (Compost){
    class Authenticate extends React.Component{
        //初始的时候 就看你有么有登录 如果没有登录 就提示 如果你登录了 就让你去首页
        componentDidMount(){
            console.log(this.props.isauth,'---')
            if(!this.props.isauth){
                this.props.addFlshMessage({
                    type:'danger',
                    text:'请先登录'
                })
                this.props.history.push('/')
            }
        }
        //当我们的已经登录了 在shopu页面 这个时候我们点击退出了 状态更新了 所以我们这里还需要判断已经 你的登录是否在不在了 如果不在了 我们就让你去 login页面 效果看下图
        componentWillUpdate(nextProps){
            if(!nextProps.isauth){
                this.props.history.push('/login')
            }
        }
        render(){
            return(
                <Compost {...this.props}/>
            )
        }
    }
    //去我们的reducer里去到登录信息
    const mapStateToProps = (state) => {
        return {
            isauth:state.auth.isAuth
        }
    }
    //最后导出了我们这个组件 
    return withRouter(connect(mapStateToProps,{addFlshMessage})(Authenticate))
}
```

```jsx
//路由文件
import React from 'react'
import {Route} from 'react-router-dom'
import App from './components/App'
import SignupPage from './components/signup/SignupPage'
import LoginPage from './components/login/LoginPage'
import ShopPage from './components/shop/ShopPage'
//引入我们的高阶组件
import requireAuth from './utils/requireAuth'
export default (
    <div>
        <Route path="/" exact component={App}></Route>   
        <Route path="/signup" exact component={SignupPage}></Route> 
        <Route path="/login" exact component={LoginPage}></Route>  
        {/*使用我们的高阶组件包裹一下*/}
        <Route path="/shop" exact component={requireAuth(ShopPage)}></Route>  
    </div>
)
```

![](4.gif)

