---
title: webAPP 美食项目
date: 2019-03-24
updated: 2019-06-03
tags: React
categories: 项目实战 
keywords: React webAPP
description: React
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

## 项目概述

```js
1.主要是用react 一系列技术栈 搭建的webAPP 美食项目
2.主要技术栈 有react react-redux react-router-dom redux redux-saga ui 是 手机的 antd
3.数据模拟 使用的json-server 数据是后写的 
3.主要功能演示如下
```

![](7.gif)

## 项目功能

```js
1.底部的tab 菜单 使用配置文件的方式去写的
2.头部 公共的header 我们点击tab的每一项目的时候 头部的标题都会跟着改变 但是点击到分类的时候 这个头部又和其他菜单的不一样
3.页面的请求有些事公共数据 异步请求这里 使用的redux-saga 和 redux 去实现的
4.当点击分类的时候 头部的是显示分类和食材 并且点击之后 显示不同的页面 这个是用路由去写的
5.当点击更多的时候 是否显示地图 点击切换之后 可以看见 tab的美食地图菜单不见了 实现了动态的切换
```

## 功能逻辑极代码

### 底部tab菜单

```js
1.我们使用的ant的UI组件库 它题库了tab的使用
2.这我们采用配置文件的形式 去我们的底部菜单 这样也方便我们更改
3.每次点击的时候 我们都会想reducer里发送action状态 并把当前点击的那一项传送过去 
4.然后我们公共的头部 去reducer里 取出来 从而做到 你切换的时候 我们的头部显示对应的功能
```

```js
//tabItme.js 配置菜单的文件 在 tab组件中使用
//底部对应的而选中 和没有选中的图片
import meishi from '../../../asset/meishi.png'
import meishi_1 from '../../../asset/meishi_1.png'
import category from '../../../asset/category.png'
import class1 from '../../../asset/class.png'
import map from '../../../asset/map.png'
import map1 from '../../../asset/map1.png'
import gengduo from '../../../asset/gengduo.png'
import gengduo_1 from '../../../asset/gengduo_1.png'
//对应四个点击的页面组件
import Home from '../../pages/home/Home.jsx'
import Fication from '@/views/pages/classPage/fication'
import FoodMap from '@/views/pages/map/map'
import More from '@/views/pages/more/More'
export const icon = () => {
   return [
      {	  //底部菜单的中文显示 每次点击的时候需要把它传送给reducer 然后在公共的头部在从reducer中获取
          title:"菜谱大全",
          //默认显示的图标
          default:meishi,
          //选中情况下选中的突变
          active:meishi_1,
          content:"菜谱大全页面",
          //当点击的时候对应要渲染的组件
          renderContent: () => {
          return (<Home/>)
      }},
      {title:"分类",default:category,active:class1,content:"分类页面",renderContent: () => {
         return (<Fication/>)
      }},
      {title:"美食地图",default:map,active:map1,content:"美食地图",renderContent: () => {
         return (<FoodMap/>)
      }},
      {title:"更多",default:gengduo,active:gengduo_1,content:"更多",renderContent: () => {
         return (<More/>)
      }},
   ]
}
```

```jsx
//tab.jsx tab的组件  使用ant 我们开始循环上面的列表
import React from 'react'
import {connect} from 'react-redux'
import { TabBar } from 'antd-mobile';
//引入我们菜单配置列表
import {icon} from './tabItem.js'
//当我们点击的时候需要发送状态
import {ACTIONS} from '@/store/actionsType.js'
//获取到菜单列表
let icondata = icon()
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //默认显示
      selectedTab: '菜谱大全',
      //是否隐藏  
      hidden: false,
      //是否全屏  
      fullScreen: true,
    };
  }
  render() {
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          style={{zIndex:-1}}
        >
            {
             //开始循环我们的菜单列表
            icondata.map(item => 
                <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${item.default}) center center /  21px 21px no-repeat` }}
                />
                }
                selectedIcon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${item.active}) center center /  21px 21px no-repeat` }}
                />
                }
                selected={this.state.selectedTab === `${item.title}`}
                onPress={() => {
                  this.setState({
                    selectedTab: `${item.title}`
                  });
                  //三、然后我们就可以使用this.props 触发这个函数 传入我们 需要的值 也就是TAB的每一项
                  this.props.setHeader(item.title)
                }}
              >
                {/*当点击菜单每项的时候 对应的调取我们循环中的renderContent函数 返回对应要显示的组件*/}       
                {item.renderContent()}
              </TabBar.Item>
            )}
        </TabBar>
      </div>
    );
  }
}
//二、这是我们传入的第二个函数 首先它必须要返回一个对象 默认形参会有dipatch 
//这样就把我们返回的对象 挂载到了我们当前实例上 props 上 
const setHeader = (dispatch) => {
  return {
    setHeader:(data) => {
      dispatch({type:ACTIONS.SETHEADER,data})
    }
  }
}
//一、首先要引入我们的 conect 从react-redux中 
//然后把我们的组件包装一下 从而 让我们传入的函数 能挂载到props上
//由于我们这里是 点击tab 改变公共数据 所以这里我们之传入第二个参数
const showmap = state => {
  return {
    ...state
  }
}
export default connect(showmap,setHeader)(Tab)
```

### 公共的头部

```js
1.这里主要就是从我们tab里取出对应的title 然后显示在我们的头部上
2.当我们是分类的之后 头部的渲染 就要不一样
3.分类的头部 由于上面还有页面的切换 所以我们要单独设置在分类里
```

```jsx
//header.jsx
import React from 'react'
import header from './header.css'
import {connect} from 'react-redux'
class Header extends React.Component{
    render(){
        return(
        {/*如果我从reducer里取出来的时候分类的时候 我就什么也不显示 反之我就显示我应该显示的*/}    
        this.props.header === '分类'?'':<div className='title'>{this.props.header}</div>
        )  
    }
}
//二 在connect传入的第第一个函数 这个默认的形参 就是 你的状态数据 如果有改变 就是你改变之后的状态数据  
//并且 把这个函数的返回值 挂载到了我们的props上 我们就可以通过this.props去使用了
const getTitle = (state)  => {
    return {
        ...state
    }
}
//一、我们的header需要使用这个公共数据 所以传入一个对象进去
export default connect(getTitle)(Header)
```

### Layout布局

```jsx
1.主要就是存放了 tab 和 header组件 
2.因为 头部是公共的 所以单独拿出来写了
```

```jsx
import React from 'react'
// import {Route} from 'react-router-dom'
import Header from './header/Header'
import Tap from './Tab/Tab.jsx'
class Layout extends React.Component{
    render(){
        return(
            <div>
                <Header></Header>
                <Tap/>
            </div>
        )
    }
}
export default Layout
```

### 首页的轮播图 及 精品好菜

```JSX
1.我们首页的轮播是发送请求 获取到的数据 数据在mock文件夹下 需要用json-server启动
2.然后我们的精品好菜使用的数据 和轮播图的数据是一样的 
3.所以我们在home组件一加载的时候 就要去发请求
4.我们这里是通过redux-saga 去完成异步请求的时候 然后存放在对应我们轮播图的rreducer里
```

```jsx
//home.jsx 里面我们把各个模块都封装成了组件
import React from 'react'
import home from './home.css'
//轮播图的组件
import Swiper from './swiper/Swiper.jsx'
//搜索的组件
import Search from './search/Search.jsx'
//热门菜系的组件
import HotCate from '@/views/pages/home/hotcate/Hotcate.jsx'
//精品好菜的组件
import Good from '@/views/pages/home/goodfood/Good.jsx'
class Home extends React.Component{
    render(){
        return(
            <div className='home_container'>
                <Swiper></Swiper>
                <Search></Search>
                <HotCate></HotCate>
                <Good/>
                {/* <div className="home_content"></div> */}
            </div>
        )
    }
}
export default Home
```

```jsx
//轮播图 swiper.jsx 
import React from 'react'
import {connect} from 'react-redux'
import { Carousel } from 'antd-mobile';
//我们把对应要发送的action都封装到一个常量里 到时候要发送的action的时候 type 状态我们直接调用即可
import {ACTIONS} from '@/store/actionsType.js'
class Swiper extends React.Component{
    state = {
        imgHeight: 176,
      }
      componentDidMount() {
       //在组件被加载的时候我们就需要获去发送 状态
        this.props.setSwiperList()
      }
      render() {
        return (
            <Carousel
              autoplay={true}
              infinite
            >
              {/*拿到数据后 遍历我们的轮播图*/}
              {this.props.swiper.map(val => (
                <a
                  key={val}
                  href="http://www.alipay.com"
                  style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                >
                  <img
                    src={val.img}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                      // fire window resize event to change height
                      window.dispatchEvent(new Event('resize'));
                      this.setState({ imgHeight: 'auto' });
                    }}
                  />
                </a>
              ))}
            </Carousel>
        );
      }
}
const setList = (dispatch) => {
  return{
    setSwiperList:() => {
      dispatch({
        type:ACTIONS.GETSWIPER
      })
    }
  }
}
const getList = (state) => {
  return {
    ...state
  }
}
//connect的第一个参数 是一个函数 用来获取我们reducer里的状态 第二个函数 是用来发送ation
export default connect(getList,setList)(Swiper)
```

```jsx
1.轮播图组件被加载 我们就去发送action到reducer 这个时候只是告诉我们的reducer我要获取轮播图的数据了什么也不做
2.当我们发送action之后 redux-saga 中的takeEvery也会监听到你发送的这个aciton 然后我们去发送请求 
3.请求回来以后 我们在用put在去发送action 并传入我们请求回来的轮播图数据
4.然后我们的swiper 就去取我们的数据 第一次取是空的然后 由于reducer的数据有了 状态发生改变 就会在取
```

```js
//saga 的配置  store index.js文件 用来创建store 合并 reducer 运行saga中间件
import { createStore,combineReducers,applyMiddleware} from 'redux'
//saga的中间件
import createSagaMiddleware from 'redux-saga'
//hader的 reudcer 里面是 header的一些公共数据
import {header} from './header.js'
//轮播的reducer 里面是 轮播图的一些公共数据
import {swiper} from './swiper.js'
//分类的reducer 里面是 分类的一些公共数据
import {facation} from './facation.js'
//控制地图的reducer 里面是 是地图的一些 公共数据
import {showMap} from './showmap.js'
//总控制saga 里面汇总了 轮播图的saga 或者 header的saga 如果还有其他的话
import {defsaga} from './sagas.js'
//  创建saga中间件
const sagaMiddleware  = createSagaMiddleware()
export const store = createStore(
    //合并了我们的reducer
    combineReducers({
        header,
        swiper,
        facation,
        showMap
    }),
    //这里一定是个空对象 第二个参数是用来初始数据的
    {},
    //注册我们的saga中间件 也就是让我们所有的saga 和reducer然后关联
    applyMiddleware(sagaMiddleware)
)
//然后 要运行我们的saga
sagaMiddleware.run(defsaga)
```

```js
//defsaga.js 里面 是我们所有对应的saga文件的汇总 是一个生成器函数 使用all api 运行了我们的所有对应的saga文件
//all api 只要运行我们所有的saga文件 比如你轮播图对应的是一个saga 分类对应的又是一个saga 使用all就可以全部运行
import { all } from 'redux-saga/effects'
//轮播图对应的saga文件
import {getSwiper} from './sagas/swiperSaga.js'
//分类对应的saga文件
import {facationSaga} from './sagas/facationSaga.js'
//然后导出生成器函数 里面使用yield语法 并且all 运行了我们所有的saga文件
export function * defsaga(){
    yield all([getSwiper(),facationSaga()])
}
```

```js
// 轮播图对应的reducer
//引入了我们对用要发送action type的常量
import {ACTIONS} from '@/store/actionsType.js'
//默认显示值
const swiperList = [{
    id:1,
    img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604765080706&di=672462f0d791a79b644f62063dfa65cd&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw640h425%2F20171202%2F7828-fypikwt3113517.jpg'
}]
//轮播图的reducer
export const swiper = (state = swiperList,action ) => {
    //刚刚在我们轮播图组件 发送的action就是ACTIONS.GETSWIPER 这个时候我们可以什么也不干或者默认返回 这个action在到reducer之后 同时也会被我们的swiper的saga文件 监听到
    switch (action.type){
        case ACTIONS.GETSWIPER:
        return state
        //这里就是对应我们swiper saga文件 使用put 又发送的action 然后返回了我们请求回来的数据    
        case ACTIONS.SETSWIPER:
        return  action.data
        break
        default:
        return state
    }
}
```

```js
// 对应的swiper saga文件
//引入我们对应的action
import {ACTIONS} from '@/store/actionsType.js'
//引入我们的副作用
import {takeEvery,call,put} from 'redux-saga/effects'
//引入我们要发送的请求 这里就是去请求后台数据封装的函数
import {getSwiper as swiper} from '@/api/swiper.js'
//然后导入我们的swiper saga 
export function * getSwiper(){
    //当我们的轮播图 第一次发送action到reducer 的时候 我们使用 takeEvery 也监听到这个action
    yield takeEvery(ACTIONS.GETSWIPER,function*(){
        	//然后我们使用call 副作用 去发送了我们封装好的请求函数 并且拿到了结果	
            const {data}  = yield call(swiper)
            //然后我们使用put副作用 又发送了一次action 到reducer 并且把我们请求回来的数据也发过去了
            yield put({
                type:ACTIONS.SETSWIPER,
                data:data.swiper
            })
    })
}
```

```js
1.以上 我们的 组件发送action 到 对应的 reducer 然后我们的saga 监听到 你发送的action 又对应发起请求后台数据 然后使用put 再次发送action 这个流程完毕以后 我们就有了轮播图的数据
2.我们的精品好菜模块 通过reducer 就可以拿到轮播图的数据
```

### 分类页面

```js
1.我们的分类页面 头部 是单独在分类页面中的 上面又两个按钮 分类和食材 当我们点击切换的时候 就可以改变页面
2.这里没有用组件去做 而是用路由的方式去做的 组件用的都是一个 是不过 我们当点击按钮切换不同的路由组件的时候 传入的数据不同
3.分类 和 食材的数据 都在一个数据对象里面 只不过是我们的键名不一样
4.所以当我们切换分类和食材的时候 需要传入对应的数据来显示不同的页面
```

```jsx
//分类的主页面
import React from 'react'
//引入了 分类的头部
import Fheader from './classheader/fheader'
//search组件 
import Search from '@/views/pages/home/search/Search.jsx'
//我们主页面 就是 列表页面
import Classify from './classify/classify'
import Material from './classify/classify'
//配置路由
import { BrowserRouter as Router,Route,Redirect,Switch } from 'react-router-dom'
class Fication extends React.Component{
    render(){
        return (
            <Router>
            <div className="fication_container">
               <Fheader></Fheader>
               <Search></Search>
               <Switch>
            	{/*通过给我们的列表传入不同的参数 来渲染不同的数据*/}
               <Route path="/categoryfacation" render={() => <Classify type={'category'} defaultItem={'热门'}/>} />
               <Route path="/materialfacation" render={() => <Material type={'material'} defaultItem={'肉类'}/>} />
                {/*配置重定向 访问我们分类主页面*/}   
               <Redirect from="/" to="/categoryfacation"/>
               </Switch>   
            </div>
            </Router>
        )
    }
}

export default Fication
```

```jsx
//分类头部组件
import React from 'react'
import fheader from './fheader.css'
import { withRouter } from 'react-router-dom'
class Fheader extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentItem :'left'
        }
    }
    componentDidMount(){
        //这里需要判断以下 获取我们当前的路由路径 来决定 我们的默认选中状态
        if(this.props.location.pathname === '/categoryfacation'){
            this.setState({
                currentItem:'left'
            })
        }else{
            this.setState({
                currentItem:'right'
            })
        }
    }
    handler(currentItem){
        //当点击的时候 跳转不同的组件 然后切换不同的选中状态 主要是分类 还是食材
        this.setState({
            currentItem
        })
       switch (currentItem) {
           case 'left':
               this.props.history.push('/categoryfacation')
               break;
            case 'right':
                this.props.history.push('/materialfacation')
                break;
           default:
            this.props.history.push('/categoryfacation')
               break;
       }
    }
    render(){
        return (
            <header className='fheader_title'>
                <ul className="fheader_content">
                    {/* 这里就是根据看看我们的路由路径来 决定 默认选中 */}
                    <li className={this.state.currentItem === 'left'?'last_li':'last_li anitate'} ></li>
                    <li className={this.state.currentItem === 'left'?'active':''} onClick={() => {this.handler('left')}}>分类</li>
                    <li className={this.state.currentItem === 'right'?'active':''} onClick={() => {this.handler('right')}}>食材</li>
                </ul>
            </header>
        )
    }
}
export default withRouter(Fheader)
```



```js
//分类页面的数据格式
{
    "ret": true,
    "data": {
      //当时分类的时候 我们需要使用   category的数据
      "category": {
        "热门": ["饮品", "清淡", "夏季菜谱", "下饭菜", "面食", "粥", "晚餐", "汤", "面条", "汤羹", "烤箱", "中餐", "西餐", "孕妇", "蛋糕", "东北菜", "凉拌", "煲汤", "布丁", "寿司", "糕点", "糖水", "湘菜", "甜点"],
        "菜式": ["家常菜", "素菜", "凉菜", "下饭菜", "面食", "小吃", "粥", "汤", "煲汤", "私房菜", "汤羹", "糕点", "甜点", "饮品", "创意菜", "腌制", "自制蘸料", "冰品", "热菜", "农家菜", "荤菜", "主食", "宴客菜", "开胃菜", "海鲜", "下酒菜", "懒人食谱", "卤菜"],
        "菜系": ["川菜", "东北菜", "粤菜", "湘菜", "西餐", "鲁菜", "韩式料理", "日式料理", "淮扬菜", "闽菜", "浙菜", "徽菜", "清真", "苏菜", "东南亚", "贵州菜", "本帮菜", "法国菜", "新疆菜", "潮州菜", "客家菜", "意大利菜", "泰国菜", "英国菜", "台湾美食", "香港美食", "豫菜", "印度菜", "云南菜", "西班牙菜", "赣菜", "京菜", "澳大利亚菜", "晋菜", "鄂菜"],
        "特色": ["泡菜", "冰淇淋", "粽子", "沙拉", "油条", "豆浆", "零食", "布丁", "糖水", "自制食材", "果汁", "果冻", "糖果", "果茶", "酸菜", "青团", "香锅", "饮料"],
        "烘焙": ["蛋糕", "披萨", "面包", "月饼", "吐司", "饼干", "杯子蛋糕", "蛋挞", "曲奇", "派", "泡芙", "慕斯", "小蛋糕", "马卡龙", "戚风蛋糕", "提拉米苏", "海绵蛋糕", "奶油蛋糕", "挞", "翻糖蛋糕", "磅蛋糕"],
        "主食": ["寿司", "饼", "炒饭", "馒头", "饺子", "炒面"],
        "器具": ["烤箱", "炒锅", "微波炉"],
        "烹饪方式": ["烘焙", "拌", "火锅", "蒸", "煮", "卤"],
        "口味": ["清淡", "咖喱", "麻辣", "香辣"],
        "场合": ["早餐", "晚餐", "中餐", "下午茶", "宵夜", "熬夜餐", "春季菜谱", "早茶", "夏季菜谱", "秋季菜谱", "冬季菜谱", "朋友聚餐", "二人世界", "户外野炊", "深夜食堂", "单身食谱", "早午餐"],
        "节日": ["春节", "年夜饭", "中秋节", "元旦"]
      },
       //当时食材的时候 我们需要使用    material 数据
      "material": {
        "肉类": ["猪肉", "排骨", "猪蹄", "牛肉"],
        "蛋/奶": ["鸡蛋", "鸭蛋", "鹌鹑蛋", "咸鸭蛋", "松花蛋"],
        "鱼类": ["草鱼", "鲤鱼", "鲫鱼"],
        "水产": ["虾", "虾米", "龙虾", "河虾"],
        "蔬菜": ["白菜", "油菜", "芹菜", "菠菜", "茼蒿"],
        "豆类": ["绿豆芽", "黄豆芽", "黄豆"],
        "果品类": ["苹果", "香蕉"],
        "五谷杂粮": ["荞麦面", "麦芽", "小米"],
        "药食": ["燕窝", "人参"],
        "调味品": ["榨菜", "冬菜"],
        "其他": ["巧克力"]
      }
    }
  }
```

```jsx
//分类 和 食材 显示页面  classify.jsx
import React from 'react'
import { connect } from 'react-redux'
import classify from './classify.css'
import {ACTIONS} from '@/store/actionsType.js'
class Classify extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            leftList:{},
            currentIndex:0,
            //接收从外部传过来的数据 主要用来当我们点击的时候切换显示的数据
            currentItem:this.props.defaultItem,
            //接收从外部传过来的类型 
            currentType:this.props.type
        }
    }
    //这里存在一个问题 我们每次切换 分类和食材的时候 你state数据不会改变 但是你组件传过来的数据是改变的 所以我们需要下面的生命周期函数来 判断看看新传进来的数据和我们的上一次的state数据相同不 如果不相同 就说明你切换了 但是我们的state数据还没有变换过来 所以 需要重新设置以下数据 然后会再次调用render函数渲染
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.type !== prevState.currentType){
            return {
               ...prevState,
               currentType:nextProps.type,
               currentItem:nextProps.defaultItem 
            }
        }
        return null
      }
    //在组件刚开的时候去发送action到redcer 然后对应的saga 监听到了之后 在去使用takeEvery监听以下 在发送请求再次是用put发送action
    componentDidMount(){
        this.props.getList()
    }
    //点击列表每项的时候 设置默认显示类
    handler(index,item){
        this.setState({
            currentIndex:index,
            currentItem:item
        })
    }
    render(){
        //看看 我们请求回来的数据 在组件中是哪个对象 然后 显示左侧对应的数据
        const leftContent = this.props.facation[this.state.currentType]? Object.keys(this.props.facation[this.state.currentType]) : []
        //根据 默认选中的左侧数据 来 显示右侧中的数据是哪一项
        const rightContent =leftContent.length !== 0? this.props.facation[this.state.currentType][this.state.currentItem] : []
        return(
            <div className="classify_container">
               <div className="classify_left">
                    <ul>
                        {
                           leftContent.map((item,index) => {
                            return <li key={item} className={this.state.currentItem === item?'classify_active':''} onClick={() => {this.handler(index,item)}}>{item}</li>
                           })
                        }
                    </ul>
                    
               </div>
               <div className="classify_right">
                    <ul>
                       {rightContent && rightContent.map( (item,index) => 
                        <li key={index}>{item}</li>
                        )}
                    </ul>
               </div>
            </div>
        )
    }
}
const mapState = (state) => {
    return {
        ...state
    }
}
const getList = (dispatch) => {
    return {
        getList:() => {
            dispatch({
                type:ACTIONS.GETFACATION
            })
        }
    }
}
export default connect(mapState,getList)(Classify)
```

### 美食地图

```js
1.这里我们使用的百度地图的API 
2.在组件中我们使用的iframe页面指向了一个html
3.由于我们是打包在 public 文件夹里面的 所以这里的路径我们直接引入就好
```

```JSX
import React from 'react'
import mapcss from './map.css'
class FoodMap extends React.Component{
    render(){
        return (
            <div className="map_container">
                <iframe src="/map.html"  frameBorder="0" style={{width:'100%',height:'100%'}}></iframe>
            </div>
        )
    }
}
export default FoodMap
```

```html
<!--这个html页面里面我们就引入了百度地图的 详细的请见官网的API-->
<!DOCTYPE html> 
<html>
<head> 
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" /> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<title>Hello, World</title> 
<style type="text/css"> 
html{height:100%} 
body{height:100%;margin:0px;padding:0px} 
#container{height:100%} 
</style> 
<script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak=yZRIe3h6FHiMGsdAzExNGpsIuPKGNhrE">
</script>
</head> 
  
<body> 
<div id="container"></div>
<script type="text/javascript">
var map = new BMapGL.Map("container");
// 创建地图实例 
var point = new BMapGL.Point(116.404, 39.915);
// 创建点坐标 
map.centerAndZoom(point, 15);
// 初始化地图，设置中心点坐标和地图级别 
</script> 
</body> 
</html>
```

### 更过菜单 切换tab地图的显隐

```js
1.这里的路由就是当我们切换 滑块的时候 去发送action 把我们的状态 存放在reducer里
2.然后我们的tab组件菜单 根据拿到的这个状态 来重新循环我们的tab配置项 在来重新渲染
```

```jsx
//更多组件 more.jsx
import React from 'react'
import {  Switch } from 'antd-mobile';
import {connect} from 'react-redux'
import {ACTIONS} from '@/store/actionsType'
class More extends React.Component{
    state = {
        //开始的时候 我们先去reducer里取状态
        checked:this.props.showMap
    }
    showMap(){
        //滑动按钮的时候 我们切换我们的reducer里的状态
        this.props.shocheck(this.state.checked)
    }
    render(){
        return(
            <div style={{paddingTop:'1.8rem'}}>
                是否显示地图
                <Switch
                    checked={this.state.checked}
                    onChange={() => {
                    this.setState({
                        checked: !this.state.checked,
                    },() => {
                        this.showMap()
                    });                   
                    }}
                />
            </div>
        )
    }
}
const shocheck = (dispatch) => {
    return {
        shocheck : (data) => {
            dispatch({
                type:ACTIONS.SHOWMAP,
                data
            })
        }
    }
}
const showmap = state => {
    return {
        ...state
    }
}
export default connect(showmap,shocheck)(More)
```

```jsx
//对应的tab组件 我们在拿到是否显示地图的状态后 重新渲染 由于我们的数据 是配置列表文件 所以我们这里的逻辑是在调用render之前 先要判断一下按钮的状态 然后在取过滤菜单列表即可
import React from 'react'
import {connect} from 'react-redux'
import { TabBar } from 'antd-mobile';
import {icon} from './tabItem.js'
import Home from '../../pages/home/Home.jsx'
import {ACTIONS} from '@/store/actionsType.js'
import {withRouter} from 'react-router-dom'
let icondata = icon()
class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: '菜谱大全',
      hidden: false,
      fullScreen: true,
      showmap:this.propsshowMap,
    };
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          Click to show/hide tab-bar
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              fullScreen: !this.state.fullScreen,
            });
          }}
        >
          Click to switch fullscreen
        </a>
      </div>
    );
  }
  render() {
   //在渲染之前判断以下我们reducer里的状态  然后决定 渲染的菜单配置列表   
    if(!this.props.showMap){
      icondata = icondata.filter(item => {
        return item.title!== '美食地图'
      })
    }else{
      icondata = icon()
    }
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          style={{zIndex:-1}}
        >
            {
            icondata.map(item => 
                <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${item.default}) center center /  21px 21px no-repeat` }}
                />
                }
                selectedIcon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${item.active}) center center /  21px 21px no-repeat` }}
                />
                }
                selected={this.state.selectedTab === `${item.title}`}
                onPress={() => {
                  this.setState({
                    selectedTab: `${item.title}`
                  });
                  this.props.setHeader(item.title)
                }}
              >
                {item.renderContent()}
              </TabBar.Item>
            )}
        </TabBar>
      </div>
    );
  }
}
const setHeader = (dispatch) => {
  return {
    setHeader:(data) => {
      dispatch({type:ACTIONS.SETHEADER,data})
    }
  }
}
const showmap = state => {
  return {
    ...state
  }
}
export default connect(showmap,setHeader)(Tab)
```

