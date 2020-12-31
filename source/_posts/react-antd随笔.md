---
title: Ant Design 组件使用随笔
date: 2019-03-21
updated: 2019-06-03
tags: Ant Design
categories: React
keywords: React
description: React UI组件
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

# Ant Design 组件使用随笔

## 后台管理的路由

```JS
1.我们在vue的时候 登录 和 首页 公用的是一个 router-view 然后首页里面还有一个router-view 是放置二级路由的
2.而在react中我们是没有 router-view 这个组件的 只能通过拿到路由表 通过遍历去 渲染所有Route标签 然后通过路由访问去 决定 显示哪个Route 标签 
```

### index.jsx 文件

```jsx
// react 路由表 routes 文件夹下 index.js文件
//这里我们要写我们的路由配置文件 主要不需要验证(登录)就可以访问的页面 比如 登录 404等 还有需要登录才可以访问的页面
import Login from "../pages/Login";
import Index from "../pages/admin/dashboard/Index";
import List from "../pages/admin/products/List";
import Edit from "../pages/admin/products/Edit";
import PageNotFound from "../pages/PageNotFound";
//写入配置文件  mainRoutes 是不需要 登录就可以访问的页面
export const mainRoutes = [
    {path:'/login',component:Login},
    {path:'/404',component:PageNotFound}
]
//adminRoute是需要登录才可以访问的页面
export const adminRoutes = [
    {path:'/admin/dashboard',component:Index,isShow:true,title:'看板'},
    //这里我们的路由路径 都又相同的路路径 所以我们配置以下exact精准匹配
    {path:'/admin/products',component:List,exact:true,isShow:true,title:'商品管理'},
    {path:'/admin/products/edit/:id?',exact:false, component:Edit,isShow:false,title:'编辑'}
]
//isShow 我们需要根据路由表配置菜单  而这个菜单是否显示 就用isShow去判断
```

```jsx
// 以上我们配置好了路由表 就需要在启动文件 也就是index.jsx里拿到我们的路由文件 去渲染 
//这里需要注意 我们的登录页面的显示  和 首页的显示 一共是分为两个文件 index.jsx主要是用来访问 登录页面 和我们的404  而app.jsx 文件  主要是放置了我们的一个布局页面 然后 通过遍历的方式把这些显示出来 使用类似插槽的方式在插入到我们的布局页面中

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css'
import './mock/index.js'
import {mainRoutes} from './routes'
import App from './App'
import reportWebVitals from './reportWebVitals';
import {HashRouter as Router, Switch,Route,Redirect} from 'react-router-dom'
ReactDOM.render(
  <Router>
    <Switch>
      {/* 这里就是 当我们访问以/admin 开头的时候 都走我们的App组件 然后我们配置的 adminRoutes都在App组件里配置 */}
      {/* render={(props) => <App {...props}/>}  props 就是把我们的路由属性也传给我们的App组件 */}
      <Route path="/admin" render={(props) => <App {...props}/>} />
      {mainRoutes.map(route => {
        return <Route key={route.path} {...route} />
      })}
      {/* 这里就是当我们从/来的时候 先让让去admin 然后我们在APP.js里在设置当你是从/来的时候我就让你去路由的看板页面 */}
      <Redirect to="/admin" from="/" ></Redirect>
      {/* 这里的Redirect用法就是 当我们访问上面没有的路径的时候 就走到404页面 */}
      <Redirect to="/404"></Redirect>
    </Switch>
  </Router>
  ,
  document.getElementById('root')
);
```

### App.jsx 文件

```jsx
1.app.jsx文件 主要是我们的首页  通过刚刚上面的路由重定向逻辑 我们知道 只要是从 '/' 来的都让他去 '/admin' 的路由去渲染的组件 而 '/admin' 又去渲染了我们的App.jsx 文件 
2.App.jsx文件 主要是两个组成部分 第一个是 你的布局文件 Frame 这里主要是由header 和 sidebar 右侧需要渲染的内容 
3.第二个就是 你的组件 就是 右侧渲染内容 渲染的组件 我们通过类似插槽的形式 把这些需要渲染的组件 插入到我们的Frame组件中去 
4.在这里 我们还需要 判断 有没有登录 如果有登录的时候 我才去渲染我们的主页 如果没有 我就 让你去登陆页面
```

```jsx
//APP.jsx
import React from 'react'
import { Route,Redirect,Switch} from 'react-router-dom'
import {adminRoutes} from './routes'
import {isLogin} from '@/utils/auth'
//这里的Frame组件  就是我们的整个头部菜单 导航的组件 然乎右侧显示的内容 使用类似插槽的方式插入了进去
import Frame from './components/Frame/Index'
function App() {
  return (
    isLogin()?
    <Frame>
      <Switch>
        {/* 循环我们需要通过登录才可以访问页面 首先当我们都用/admin开头的路径 他走的就是我们的这个APP组件
        然后我们在这个APP组件里 又循环了 我们必须要登录才能访问的页面 然后通过不同的路径再去访问我们不同的页面 */}
        {adminRoutes.map(route => {
          return <Route 
          key={route.path} 
          path={route.path} 
          exact={route.exact} 
          render={ routeProps => {
            return < route.component {...routeProps}/>
          } }/>
        })}
        {/* 如果以上都没有的话 就去404页面 */}
        <Redirect to={adminRoutes[0].path} from='/admin'></Redirect>
        <Redirect to="/404"></Redirect>
      </Switch>
    </Frame>
    :
    <Redirect to="/login"></Redirect>
  );
}
export default App;
```

### Frame.jsx

```jsx
1.主要用来布局 有header sidebar 
2. 其中content 可以里放置 我们在上面 的App.jsx里插入到 Frame 里的需要渲染的组件
3. 通过this.props.children 可以拿到 我们插入进来的 组件 
```

```jsx
import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import {withRouter } from 'react-router-dom'
import {adminRoutes } from '../../routes'
//这里就是先过滤了一下 哪些是需要在菜单栏里面显示的菜单
const routes = adminRoutes.filter( item => item.isShow)
const { Header, Content, Sider } = Layout;
class Index extends Component {
    componentDidMount(){
    }
    render() {
        return (
            <Layout>
            <Header className="header">
            <div className="logo" style={{color:'#fff'}}>我是logo</div>
            </Header>
            <Layout>
            <Sider width={200} className="site-layout-background">
                <Menu
                mode="inline"
                //用来控制 是否选中 
                defaultSelectedKeys={[this.props.location.pathname]}
                defaultOpenKeys={['sub1']}
                // selectedKeys={[this.props.match.path]}
                style={{ height: '100%', borderRight: 0 }}
                >
                    {/* 遍历我们的路由生成菜单 及其点击的时候 右侧的内容跳转到对应的路由文件 */}
                    {routes.map(item => {
                        return(
                            <Menu.Item key={item.path} onClick={() => {this.props.history.push(`${item.path}`)}}>{item.title}</Menu.Item>
                        )
                    })}
                </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
                >
                {/* 这里就是就是我们上面对应的路由组件 插入了进来 */}
                {this.props.children}
                </Content>
            </Layout>
            </Layout>
        </Layout>
        )
    }
}
//这里为了让我们的菜单有具备编程式导航的功能 组要用我们的路由组件包裹一下
export default withRouter(Index)
```

## 列表页

```jsx
1.主要是通过andt 的 <Table> 标签 去渲染的
2.表格的配置 数据的渲染 分页的显示 表头的拖拽
3.动作按钮 比如删除 编辑 等 当前行的数据
```

### 配置

```jsx
1.andt的Table 组件 通过 columns 关键字 来指定你需要渲染的内容 也就是表头的显示 比如里的序号 每一列的内容等
2.dataSource 关键字 主要用来渲染表格的内容 比如你后台返回来的数据
3.默认我们需要在 <Table /> 标签上给定一个key 指定的数据的唯一值 否则会报错
4.在columns 的每一项里 我们还可以配置每一列的宽度 文字对齐方式 等一些列动作 具体参照官方文档
```

```jsx
//用来指定需要渲染的数据
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];
//用来指定要渲染的内容 比如表头
const columns = [
  {
    title: '姓名',
    //表格需要渲染数据的字段 和我们的elementUI中的prop 一样
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];
//通过 jsx语法绑定到你的Table组件
<Table dataSource={dataSource} columns={columns} />;
```

![](E:\笔记\Ant Design\1.png)

### 动作按钮

```jsx
1.在elementUi里 我们的的东走按钮 比如删除 编辑等 是通过作用域插槽 插入进去的
2.而在 ant里 我们需要通过 columns的 render函数 直接把我们的动作按钮渲染到 我们的表格对应的列中
3. 这个render函数的 会有参数 对应就是我们当前列的值 当前行的数据 索引等
```

![](E:\笔记\Ant Design\2.png)

```jsx
import React, { Component } from 'react'
import { Table, Tag, Space } from 'antd';
const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
      //我们可以在render函数里面做判断     
        <>
          {tags.map(tag => {
              console.log(tag)
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
export default class Test extends Component {
    render(){
        return <Table columns={columns} dataSource={data} />
    }
}
```

### 分页

```JS
1.在ant 里 分页可以单独拿出来一个组件 也可以在表格上使用配置项的方式去显示
```

```jsx
//通过 pagination来指定 分页 position分页按钮的 位置 size 分页组件的大小 total的总数 defaultPageSize 一页显示多少条 加了这个选项 分页才会有效果 onChange当改变分页的时候触发的回到 参数是当前页码 具体的其他API查看分页组件
<Table pagination={{position:['bottomRight'],size:'small',total:this.state.pageTotle,defaultPageSize: this.state.page.pageSize,onChange:this.pageonChange}} rowKey='id' bordered components={this.components} columns={columns} dataSource={this.state.data} /> 
```

### 表头的拖拽

```jsx
1.这里 如果想要拖拽表头 就要 指定 columns 每一页的宽度
2.需要引入比的组件 然后来配置
```

```jsx
import React, { Component } from 'react'
import { Card , Table,Button,Pagination,Popconfirm} from 'antd'
import { Radio } from 'antd' 
import { Resizable } from 'react-resizable'
import {getTable,delItem} from '@/api/table'

//1.需要重新包装一下我们的 Resizable 组件
const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props 

  if (!width) {
    return <th {...restProps} /> 
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation() 
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
} 
class List extends React.Component {
  //用来把   Resizable 组件注入到我们的表格中去 
  components = {
    header: {
      cell: ResizableTitle,
    },
  } 
  //3.当我们拖拽的时候改变宽度时 需要使用这个函数 来重新计算我们的宽度	
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns] 
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      } 
      return { columns: nextColumns } 
    }) 
  } 
  render() {
    //4.最后需要 把我们的表格项 重新 写一下   
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    })) 

    return <Card
    <Table rowKey='id' bordered components={this.components} columns={columns} dataSource={data} /> 
    </Card>
  }
}
export default List
```

## 表单页

```jsx
1.表单的配置 比如 行的显示 宽度 尺寸
2.表单的验证 验证时机 自定义验证
3.表单的取值 和 赋值 这里 主要是 函数式组件 和 类组件 
```

### 表单的配置

```jsx
1.labelCol 主要有两个选项 span 用来控制 label项所占的分数  offset 用来控制向左边的偏移量
2.wrapperCol 主要有两个选项  span 用来控制 label所对应的 内容区域的 所占的分数 offset 用来控制向左的便宜量
```

![](E:\笔记\Ant Design\3.png)

### 表单的验证

```jsx
1.我们可以在Form.Item 上通过 rules 属性 配置 表单的验证 
2.也可以在 rules 里增加 {validator:this.validUsername} 来写自定义校验
3.表单的验证时机 我们可以在 Form.Item 里添加 validateTrigger="onBlur" 来改变校验的触发时机
```

```jsx
import { Form, Input, Button, Checkbox } from 'antd';
//提交按钮这里 我们会在按钮标签上  htmlType="submit" 属性 这样就不用在自己写函数 当验证成功的时候 它就会走 onFinish函数 回调里的参数 是 表单输入的值 当验证失败的时候 就会走onFinishFailed参数 
const Demo = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
 //  验证不同的时候 走此函数
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //自定义的验证规则
  const validUsername=(rule, value, callback)=>{
    //形参 第一个是验证规则 第二个是 当前验证的值 第三个 是验证通过之后的回调  
    if(!/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)){
        callback('用户名必须是英文加数字')
        return
    }
    callback()
  }
  
  return (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        //表单的 label  
        label="Username"
        //控制表单的字段  
        name="username"
        //表单的验证的时机  
        validateTrigger="onBlur"
        //表单的验证规则  
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
          {
              validator:this.validUsername
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Demo
```

### 表单的取值 和动态表单项

```jsx
1.这里我们分为 函数式组件的取值  和 类组件的取值
2.函数式组件的取值 我们用到了hook  类组件的取值我们用到 ref
3.如果有动态表单项 我们可以通过 shouldUpdate 这个属性 来确定 此表单项在什么时候需要显示和隐藏
```

```jsx
//函数式 表单的取值 使用 const [form] = Form.useForm() 设置值 使用 form.setFieldsValue 去设置
import { Form, Input, Button, Select } from 'antd';
const { Option } = Select;
const Demo = () => {
  //把表单的值 使用hook 搞出来  
  const [form] = Form.useForm();
  //这个表单的下拉框选择的事件 每次对应的选择 我们去 设置文本框不同的值
  const onGenderChange = value => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        return;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        return;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        return;
    }
  };

  const onFinish = values => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="note" label="Note" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select
          placeholder="Select a option and change input text above"
          onChange={onGenderChange}
          allowClear
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      {/*最开始的时候 这个 表单项是隐藏的 只有 我上一次的gender的字段的值 不等于 我现在的gender的字段的值 我才		去显示 我这个表单项 返回了true 和false
      */}    
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => {
            return prevValues.gender !== currentValues.gender
        }}
      >
          {/*这个就是 看看 我gender字段的值等于 other 如果等于 我就渲染这个表单项*/}
        {({ getFieldValue }) => {
          return getFieldValue('gender') === 'other' ? (
            <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        <Button type="link" htmlType="button" onClick={onFill}>
          Fill form
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Demo
```

```jsx
//类组件的 表单 取值 通过 formRef = React.createRef() 去取值 在Form组件上 绑定ref去实现 通过this.formRef.current.setFieldsValue可以设置表单的值 上面还有一些其他的方法 具体可以参考文档
class Demo extends React.Component {
  //通过ref的引用 来获取了 表单的值  
  formRef = React.createRef();
  onGenderChange = (value) => {
    switch (value) {
      case 'male':
        this.formRef.current.setFieldsValue({
          note: 'Hi, man!',
        });
        return;
    }
  };
  render() {
    return (
      <Form ref={this.formRef} >
        <Form.Item
          name="note"
          label="Note"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
        >
          <Select
            placeholder="Select a option and change input text above"
            onChange={this.onGenderChange}
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
        >
          {({ getFieldValue }) => {
            return getFieldValue('gender') === 'other' ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={this.onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
```

## 函数式组件的使用

```jsx
1.这里我们主要是写的一个一个的钩子比如列表的时候 我们如果去初始化数据
2.当编辑跳转到详情的时候 我们怎么去去初始化数据
```

### useEffect的使用

```jsx
1.我们在类组件的时候 每当这个组件加载的时候 就需要去请求列表的数据 这动作是在 componentDidMount生命周期去完成的
2.我们在 函数式组件的时候 要使用 useEffect 让函数式组件一开始调用的时候就要走一次这个useEffect这个函数
3.useEffect 是一个函数 第一个参数 是一个回调函数 你要做的事情 第二个函数 是一个数据的初始状态
```

```jsx
//列表获取数据
import React, { useEffect, useState } from "react";
function List(props) {
  console.log(props);
  // 定义局部状态
  // const [dataSource, setDataSource] = useState([]);
  // const [total, setTotal] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);

  const { list, page, total } = props;
  //一开始的时候 我们就向reducer里发送数据
  useEffect(() => {
    props.dispatch(
      loadProduct({
        page: 1
        // name: "小米"
      })
    );
  }, []);

  const loadData = () => {
    props.dispatch(
      loadProduct({
        page: page
        // name: "小米"
      })
    );
  };
  return (
      <Table
        rowKey="_id"
        rowClassName={record => (record.onSale ? "" : "bg-red")}
        pagination={{
          total,
          defaultPageSize: 2,
          onChange: p => {
            props.dispatch(loadProduct({ page: p }));
          }
        }}
        columns={columns}
        bordered
        dataSource={list}
      />
  );
}
export default connect(state => state.product)(List);
```

### useState 的使用

```jsx
1.可以让 函数式组件 拥有了自己的状态
2.比如 我们 从列表的编辑跳转到 编辑的详情页的时候  需要 从库里去查询ID 然后赋值给我们详情的表单
```

```jsx
import React, { useState, useEffect } from "react";
import { Form, Card, Input, Button, message, Upload, Icon } from "antd";
import { createApi, getOneById, modifyOne } from "../../../services/products";
import { serverUrl } from "../../../utils/config";

function Edit(props) {

  //设置表单的值
  const [currentData, setCurrentData] = useState({});

  // 初始化的时候执行
  useEffect(() => {
    //去查询 当前的详情  
    if (props.match.params.id) {
      getOneById(props.match.params.id).then(res => {
        //把查询结果 通过  setCurrentData(我们useState结构出来的方法) 来设置我们表单的值
        setCurrentData(res);
        setImageUrl(res.coverImg);
        setEditorState(BraftEditor.createEditorState(res.content));
      });
    }
  }, []);

  return (
      <Form onSubmit={e => handleSubmit(e)}>
        <Form.Item label="名字">
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "请输入商品名字"
              }
            ],
            //设立就是这是了默认的初始值    
            initialValue: currentData.name
          })(<Input placeholder="请输入商品名字" />)}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            保存
          </Button>
        </Form.Item>
      </Form>
  );
}
export default Form.create({ name: "productEdit" })(Edit);
```



