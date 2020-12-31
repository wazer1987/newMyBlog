---
title: Vue + Ts 实战
date: 2020-04-24
updated: 2019-06-03
tags: TypeScript
categories: 项目实战
keywords: TS
description: TS
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

# Vue + TypeScript实战

## 基础

```js
1.初始化命令 还是使用vue-cli脚手架去搭建 vue create vue-typescript-demo
2.选择的话我们这里就选择了 typescript
```

```js
1.创建出来的项目 现在都是.ts后缀解为的文件了
2. 多了 shims-tsx.d.ts文件  这里主要用于我们可以些tsx结尾的文件 里面可以写jsx的代码
3. 多了 shims-vue.d.ts文件 用ts可以.vue的文件 
```

## 组文件文件里的写法

```html
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>
这里要是使用了lang="ts"
<script lang="ts">
    
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
//这里就是一个装饰器的写法 注册了自定义组件
@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
```

```js
1.所以这里再写的话 我们在些script标签的时候 要指定 script标签中的lang="ts"
2.import { Component, Vue } from 'vue-property-decorator';  引入了很多装饰器
3.我们所有的组件都是class的形式 要继承vue 如下写法
export default class Home extends Vue {}
```

```js
vue-property-decorator //装饰器
@Component //用来修饰组件
@Watch //监听
@Prop //自定义组件的时候接收参数
@Model // 传参 v-model
@Emit //向父组件传递回调函数
```

## @Component装饰器

```js
1.用来写组件 或者注册自定义组件
2.下面我们用about.vue页面为例
```

```js
@Component({
  name: 'About', //这里就是自己的当前组件的名字 等同于我们原来的 export default { name:'About' }
  components:{
	//这里如果还有别的组件 就在这里里面写 如果没有自定义组件 这里也可以不写
  }
})
```

## 数据的定义

```js
1.我们以前的数据是定义在data函数里面 
2.ts的项目 数据直接定义到 类里面即可
```

```html
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'About',
})
export default class About extends Vue {
    //数据直接写在类里即可
	firstName:string = '张三'
}
</script>
```

## 计算属性的写法

```js
1.直接定义一个get 修饰符 然后跟着你计算属性的函数即可
```

```html
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{firstName}}</h2>
    <h2>{{lastName}}</h2>
    <h2>{{FullName}}</h2>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'About',
})
export default class About extends Vue {
  firstName = '张'

  lastName = '三'
  //计算属性这里直接用get修饰符 后面跟着你计算属性的函数逻辑即可
  get FullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
</script>
```

## 计算属性的set

```js
1.我们在原来的语法中 计算属性 在获取的时候可以用set 
computed:{
    fullName:{
        get(){ return `${this.firstName} ${this.lastName}`}
        set(vale) {//这里的value 就是 当你改变计算属性的值的时候 拿到的值}
    }
}
```

```html
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{firstName}}</h2>
    <h2>{{lastName}}</h2>
    <h2>{{FullName}}</h2>
    <button @click="modifyFullname">修改值</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'About',
})
export default class About extends Vue {
  firstName = '张'

  lastName = '三'

  get FullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  //这由于 我们在点击按钮的时候 对我们的计算出行重新赋值了 而这个set的回调函数里 就是我们重新赋值的值 我们就可以做对应的逻辑
  set FullName(val) {
    console.log(val);
    const arr = val.split('');
    console.log(arr);
    // eslint-disable-next-line prefer-destructuring
    this.firstName = arr[0];
    // eslint-disable-next-line prefer-destructuring
    this.lastName = arr[1];
  }
  //点击按钮的时候 把我们的计算属性 重新赋值了  所以就可以触发set 函数 从而在里面做出对应的逻辑
  //这里 方法 直接写在在类里面即可 不用向我们以前一样要写在 methods里面
  modifyFullname() {
    this.FullName = '李四';
  }
}
</script>
```

## @Watch的写法

````js
1.我们还是要引入watch 装饰器
2.装饰器下面写你要监听的 比如这里我们监听计算属性 如果改变了 
````

```html
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{firstName}}</h2>
    <h2>{{lastName}}</h2>
    <h2>{{FullName}}</h2>
    <button @click="modifyFullname">修改值</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'About',
})
export default class About extends Vue {
  firstName = '张'

  lastName = '三'

  get FullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set FullName(val) {
    console.log(val);
    const arr = val.split('');
    console.log(arr);
    // eslint-disable-next-line prefer-destructuring
    this.firstName = arr[0];
    // eslint-disable-next-line prefer-destructuring
    this.lastName = arr[1];
  }

  modifyFullname() {
    this.FullName = '李四';
  }

  // 还是要写在类里面 装饰下面 写你要监听的数据
  //这 装饰器里面传入 我们要监听的数据字段 然后就执行我们下面的那段函数 函数名称可以随意
  //当我们监听 firstName 字段的数据改变的时候 我们就执行 firstNamechange 这段函数里面的逻辑
  @Watch('firstName')
  firstNamechange(newval, oldval) {
    console.log(newval, oldval, '====watch');
  }
}
</script>
```

## @Prop的写法

```js
1.主要用来 接收父组件穿过来的值  一个值我们就要写一个装饰器
2.下面主要通过一个列表的组件 来掩饰 一些用法
```

### 父组件的写法

```js
1.定义了接口 和 传参的类型
```

```html
//首先父组件 我们要定义数据 就是一个数组 数组的每一项有姓名 年龄 性别 
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{firstName}}</h2>
    <h2>{{lastName}}</h2>
    <h2>{{FullName}}</h2>
    <button @click="modifyFullname">修改值</button>
    <hr>
     <!--这里我们开始循环并把每一项都传入我们的User组件里 这里直接是用v-bind 就不用一个一个去写了-->
    <User v-for="item  in userList" :key="item.id" v-bind="item"/>
  </div>
</template>
<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
//引入我们写好的User组件 里面就是单纯的展示姓名性别的
import User from '@/components/User.vue';
//定义接口
interface Iuser{
  id: number;
  name: string;
  age: number | string;
  //这里性别可传可不传
  sex?: number | string;
}
@Component({
  name: 'About',
  //在装饰器里注册一下我们的自定义组件
  components:{
      User
  }
})
export default class About extends Vue {
  //使用接口
  userList: Array<Iuser> = [
    {
      name: '张三', age: 18, sex: 0, id: 1,
    },
    {
      name: '李四', age: 28, sex: 1, id: 2,
    },
    {
      name: '王五', age: 30, sex: 0, id: 3,
    },
  ]
</script>

```

### User组件的写法

```js
1.这个组件我们主要用于接收并展示父组件穿过来的数据
```

```html
<template>
    <div>
        姓名：{{name}},
        年龄：{{age}},
        <!--使用枚举 把我们的性别翻译出来-->
        性别：{{Sex[sex]}}
    </div>
</template>
<script lang="ts">
//定义一个枚举
enum SEX {
  '男' = 1,
  '女' = 0
}
import { Prop, Vue, Component } from 'vue-property-decorator';
//这里记得一定要加上名字 否则有的时候会报错
@Component({
  name: 'User',
})
export default class User extends Vue {
//在定义一个数据 让它等于我们的枚举 这样上面我们性别在翻译的时候 即可使用枚举了
Sex:any = SEX
// 这里就是要告诉装饰器你给我穿过来的是什么类型 类似我们以前的写法 prop:{id:{type:Number}}
@Prop(Number)
// 加个！就是非空断言 必须要传
id!: number

@Prop(String)
name!: string

@Prop({ type: Number })
age!: number
//这里也可以设置默认值
@Prop({ type: Number, default: 1 })
sex!: number
}

</script>
```

## @Emit的写法

```js
1.当我们需要子组件向父组件抛事件的时候 要引入Emit
2.默认的参数 就是你@Emit装饰器装饰的方法 里 你传递的参数
```

```html
<template>
    <div>
        姓名：{{name}},
        年龄：{{age}},
        性别：{{Sex[sex]}}
        <button @click="remove(id)">删除</button>
    </div>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit,
} from 'vue-property-decorator';

enum SEX {
    '男' = 1,
    '女' = 0
}
@Component({
  name: 'User',
})
export default class User extends Vue {
// 这里就是要告诉装饰器你给我穿过来的是什么类型 类似我们以前的写法 prop:{id:{type:Number}}
@Prop(Number)
// 加个！就是非空断言 必须要传
id!: number

@Prop(String)
name!: string

@Prop({ type: Number })
age!: number

@Prop({ type: Number, default: 1 })
sex!: number

Sex: any = SEX
//这就是我用Emit装饰器 装饰的remove函数在触发的时候向上抛了一个 on-remove 事件 其中默认参数就是你函数里的参数
@Emit('on-remove')
remove(id: number): void {
  return id;
}
}

</script>
```

```html
//然后父组件 还是用@on-remove 来接收 并且指定 函数
<User v-for="item  in userList" :key="item.id" v-bind="item" @on-remove="remove"/>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import User from '../components/User.vue';

interface Iuser{
  id: number;
  name: string;
  age: number;
  sex?: number;
}
@Component({
  name: 'About',
  components: {
    User,
  },
})
export default class About extends Vue {
  userList: Array<Iuser> = [
    {
      name: '张三', age: 18, sex: 0, id: 1,
    },
    {
      name: '李四', age: 28, sex: 1, id: 2,
    },
    {
      name: '王五', age: 30, id: 3,
    },
  ]
  //这里还是跟以前的写法一样
  remove(id: number) {
    console.log(id, '----父组件');
  }
}
</script>
```

```js
//如果你的@Emit 不写 你要抛的事件名称 那么 那就默认会传递 你@Emit装饰器 装饰的方法
@Emit()
changAge(){
    
}
//父组件 这里就会默认接收 你装饰器装饰的方法 遵循驼峰
<User v-for="item  in userList" :key="item.id" v-bind="item" @chang-age="remove"/>
```

## @model装饰器

```js
1.主要用于父组件 在子组件的标签上 使用v-model的时候 我们用来接收值
2.这里 我们原来是用value去在props里接收的
```

```js
//父组件使用v-model传递的值的时候 我们需要使用@model来接收下
 <User v-model="firstName" />
//子组件需要用@Model装饰器 来接收一下 并且要把当你在子组件修改这个父组件传递过来的值的事件也要写上
export default class User extends Vue{
@Model('setFullname', { type: String })
firname!: string
}
//然后在标签中显示 这里还是绑定value 然后当你触发input的事件的时候 需要指定一个参数e.target.value就是你修改的值
<input :value="firname" @input="changFullName"/>
//这里需要向上抛 你用@Model接收父组件传递的值的时候 就定义的事件
@Emit('setFullname')
changFullName(e: any): string {
  //然后把把你修改的值 直接就返回回去 你父组件的v-model 自动就鉴定到了你@Model的时候 传递过来的值
  return e.target.value;
}    
```

## VUEX中的TS 模块写法

```js
1.首先我们需要安装 vuex-module-decorators 这个第三方包 才能使用hoock的模式
2.我们的Mutation 和 Action 就可以从这个依赖包离引了
```

```js
1.首先使用 Module 定义模块 这个从 vuex-module-decorators 导入 设置他的名字 并且 把你new 好的store 挂载到这个配置项上
2.然后 我们要继承 VuexModule 这个模块 并且  这里可以使用接口的形式 
3.然后把我们定义好的这个模块 导入到我们的store里文件里面去 
4.这里 也需要 使用 getModule 把这个模块导入 为了能在页面中使用
```

```js
import {Module,VuexModule,Mutation,Action,getModule } from 'vuex-module-decorators'
import store from './index'

//定义模块的类的接口  主要是定义state 定义你这个模块的类型 然后导入 方便我们在vuex里的index.ts文件 在定义泛型接口
export interface IAboutState{
    cont:number,
    list:Array<number>
}
//然后使用装饰器 定义模块 
@Module({
    //模块的名称
    name:'about',
    dynamic:true,  //表示这是一个动态的模块
    store //然后需要把这个模块挂载到store上
})
//使用接口 也就是说你这about模块 
export default class About extends VuexModule implements  IAboutState{
    cont:number = 1
    list:Array<number> = [1,2,3,4]
    //在写个计算属性
    get filterlist(){
        //这里 就以使用this 而不是使用 state.list 去使用这个数组了
        return this.list.filter( item => item % 2 == 0)
    }
    //mutation 写法
    @Mutation
    updateCount(payload:number){
        this.cont += payload
    }
    @Mutation
    updateList(payload:Array<number>){
        this.list = payload
    }
    @Action
    async getList(payload:Array){
        const res = await Ajax() //这里去发送请求 
    	//这里不用在commit在去提交mutation 直接调用mutation装饰的函数就好 
        this.updateList(res)
     }
}

//最后为了可以在页面中使用 这个模块 在通过 getModule 去导出 你定义的这个类
export const about = getModule(About)
```

```js
//然后 在 我们的 vuex 初始文件中导入这个模块的接口 在定义 泛型接口 让我们的vuex 做规范
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
//引入我们的模块的定义的类型
import {IAboutState} from './about'
//如果还有别的模块 我们就在下面的泛型接口接着定义类型
// import {IAinfo} from './info'

//然后在定义泛型接口 让我们的Vuex 遵循我们的接口
interface IRootStore {
  about:IAboutState,
  //这里的about 和 info 都是模块的名称
  // info:IAinfo
}

//我们的vuex要使用我们上面的泛型的接口
export default new Vuex.Store<IRootStore>({

});
```

```js
//上面我们由于使用了 getModule 去导出了 所以 直接在页面文件上使用即可了
import { about } from './store/about'
@component()
export default class User extendx Vue{
    //这样就取到了 about模块里的count 值
    get count(){
        return about.count 
    }
    //方法的执行 直接使用模块里面的方法即可
    add(){
        //这里就直接调取了 你about模块里的经过mutaition装饰的updateCount方法
        about.updateCount('传入的参数')
    }
    //执行action 直接调用就好
    creatd(){
        about.getList()
    }
}
```





## 钩子函数的写法

```js
1.这里还是跟我们以前一样的写法 还是在类里面直接写即可
```



