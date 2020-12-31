---
title: Vue 组件通信
date: 2019-03-06
updated: 2019-06-03
tags: Vue
categories: Vue
keywords: Vue
description: Vue 组件通信
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
# Vue组件通信

## Vue父子组件传值 

```JS
1.父组件想要传递的值 用动态绑定的方式在子组件的标签上指定一个自定义属性 然后值是你要传递的值 给子组件
2.在子组件内部文件里用props注册一下 这里注册的名字 是你绑在子组件标签上自定义属性的名字 然后就可以使用了
3.子组件想要给父组件传值 首先你需要在子组件的标签上绑定一个自定义事件 指向父组件文件的一个函数 这个函数的参数就是子组件传递过来的值
4.子组件文件内部需要有一个方法 去触发你在自己标签身上绑定的这个自定义事件 this.$emit
5.以上接是单向数据流
```

```JS
//父组件文件
<template>
<el-card class="box-card">
  <div style="margin-bottom:20px;">我是父组件 最外层的页面 在我文件里有个值叫fatherdata 我现在要传给子组件</div>
  <div style="margin-bottom:20px;">{{receivesond}}</div>
  //1.在子组件的标签上 动态绑定了一个属性 值指向想要传递的值 2步骤查看子组件文件
  //3.子组件给父组件传值 需要绑定一个自定义事件 指向自己的一个方法 这个方法的参数就是传递过来的值 4步骤查看子组件
  <son :sondata="fatherdata" @updatafather="receiveson"></son>
</el-card>
</template>

<script>
import son from '@/views/component/son'
export default {
  components: {
    son
  },
  data () {
    return {
      fatherdata: '我是父组件faterdata的值',
      receivesond: '我在父组件里 我等着接收son组件给我传过来的值 只要son组件一点击按钮我就接收'
    }
  },
  methods: {
    receiveson (res) {
      this.receivesond = res
    }
  }
}
```

```JS
//子组件文件
<template>
  <div>
      我是son组件 也就是在father文件里的son标签 我在自己的文件接收了father给我传过来的值 fatherdata
      <div>
          {{sondata}}
      </div>
	  //4.子组件需要触发这个方法 所以需要绑定这个自定义事件 	
      <el-button type="primary" @click="updatafather">我是son组件的按钮 我现在想把值传给父组件</el-button>
  </div>
</template>

<script>
export default {
  //2.子组件用props属性注册一下 名字是在子组件身上绑定的自定义属性 这里就可以直接使用了 注意只能是使用不能更改
  props: {
    sondata: {
      type: String,
      default: () => {
        return 11
      }
    }
  },
  data () {
    return {
      sonselfdata: '我是子组件本身的值'
    }
  },
  methods: {
    updatafather () {
      //在自定义事件里用这种方式 把值传递给父组件  
      this.$emit('updatafather', this.sonselfdata)
    }
  }
}
</script>
```

```JS
//子组件传递父组件值原理
<son :sondata="fatherdata" @updatafather="receiveson"></son>
当我们绑定自定义事件的时候 在Vue模板解析的时候 会解析出来一个对象
{updatafather:receiveson}
子组件拿到这个对象之后会循环 然后挂到自己的实例上this.$on('updatafather',receiveson) 这种形式 
所以我们在自己子组件用this.$eimt触发
```

## Vue子传父的简化写法

```JS
1.上面我们已经说了子组件给父组件传值的原理 其实就是传递过去了一个事件和对应的函数过去
2.那么我们就可以写成行内函数
3.子组件在触发的时候 用this.$emit 触发这个行内函数即可
4. .sync 适合父子组件值 同步的时候
```

```JS
//父组件
<template>
<el-card class="box-card">
  <div style="margin-bottom:20px;">我是父组件 最外层的页面 在我文件里有个值叫fatherdata 我现在要传给子组件</div>
  <div style="margin-bottom:20px;">{{receivesond}}</div>
  //这里就是写成了行内函数 我要传给子组件一个事件 函数是receiveson
  <son :sondata="fatherdata" @updatafather:receiveson="(value) => this.receivesond=vaue"></son>
</el-card>
</template>

<script>
import son from '@/views/component/son'
export default {
  components: {
    son
  },
  data () {
    return {
      fatherdata: '我是父组件faterdata的值',
      receivesond: '我在父组件里 我等着接收son组件给我传过来的值 只要son组件一点击按钮我就接收'
    }
  },
  methods: {
  }
}
</script>

<style>
.box-card{
    margin: 50px;
}
</style>

```

```JS
//子组件触发
<template>
  <div>
      我是son1组件 也就是在father文件里的son标签 我在自己的文件接收了father给我传过来的值 fatherdata
      <div>
          {{sondata}}
      </div>
      <el-button type="primary" @click="gofather">我是son组件的按钮 我现在想把值传给父组件</el-button>
  </div>
</template>

<script>
export default {
  props: {
    sondata: {
      type: String,
      default: () => {
        return 11
      }
    }
  },
  data () {
    return {
      sonselfdata: '我是子组件本身的值'
    }
  },
  methods: {
    gofather () {
	 //这里触发行内函数的即可
      this.$emit('updatafather:receiveson', this.sonselfdata)
    }
  }
}
</script>

<style>

</style>

```

## Vue .sync 同步值

```JS
1.上面已经分析了父传子 子传父 以上都是父传子 自己的值 子传父改的不是父传过来的值
2.当 你子组件要修改父组件传过来的值的时候 就可以用.sync 
3.这里在子组件触发的事件一定是update:值 才可以  这个是写死的
```

```JS
//父组件的值
<template>
<el-card class="box-card">
    <div style="margin-bottom:30px;">我是父组件</div>
    <div style="margin-bottom:30px;">{{fatherdata}}</div>
	//这样就是点.sync 
    <son2 :sondata.sync="fatherdata"></son2>
</el-card>
</template>

<script>
import son2 from '@/views/component/son2'
export default {
  components: {
    son2
  },
  data () {
    return {
      fatherdata: '我是父组件fatherdata的值'
    }
  },
  methods: {

  }
}
</script>

<style>
.box-card{
    margin: 50px;
}
</style>

```

```JS
//子组件
<template>
    <div>
        <div style="margin-bottom:30px;">我是son2组件</div>
        <div style="margin-bottom:30px;">我是son2组件我接收了父组件传过来的值------{{sondata}}</div>
        <div style="margin-bottom:30px;">我是son2组件自己本身值------{{sontofatherdata}}</div>
        <el-button type="primary" @click="goFahter">son2组件的按钮要修改父组件给我传过来的值</el-button>
    </div>
</template>

<script>
export default {
  props: {
    sondata: {
      type: String
    }
  },
  data () {
    return {
      sontofatherdata: '我是son子组件的值'
    }
  },
  methods: {
    goFahter () {
      //这里是固定写法 一定要写updata 加上你传过来的值  
      this.$emit('update:sondata', this.sontofatherdata)
    }
  }
}
</script>

<style>

</style>

```

```JS
.sync 和 v-model的区别
.sync的 值你可以自己随意的去定 而v-model只能用value
```

## Vue子孙通信(传统方式)

```JS
1.传统方式就是用动态绑定的方式一层一层往下传
2.然后孙子组件向父亲传值的时候 只要触发父亲身上绑定的方法即可
```

```JS
//父亲
<template>
  <el-card class="box-card">
    <div style="margin-bottom:30px;">我是爷爷组件</div>
    <div style="margin-bottom:30px;">我是爷爷组件的值----{{grendeFather}}</div>
    //首先向儿子组件传送了值 并且在自己身上绑定了事件
    <son :fatherwoson="grendeFather" @fatherto="change"></son>
  </el-card>
</template>

<script>
import son from '@/views/page/threecomponents/son'
export default {
  components: {
    son
  },
  data () {
    return {
      grendeFather: '我是爷爷的数据'
    }
  },
  methods: {
    change (res) {
      this.grendeFather = res
    }
  }
}
</script>
```

```JS
//儿子组件
<template>
    <div>
        <div style="margin-bottom:30px;">我是儿子</div>
        <div style="margin-bottom:30px;">我是儿子组件 我接收了 父组件传过来的值------ {{fatherwoson}}</div>
        //孙子组件 又接着往下传了值
        <grendeson :fathertoson="fatherwoson"></grendeson>
    </div>
</template>

<script>
import grendeson from '@/views/page/threecomponents/grendeson'
export default {
  components: {
    grendeson
  },
  props: {
    //这里儿子从父亲哪里注册了父亲传过来的值 并且向孙子传了下去
    fatherwoson: {
      type: String
    }
  },
  data () {
    return {}
  }
}
</script>

<style>

</style>

```

```JS
//孙子组件
<template>
  <div>
      <div style="margin-bottom:30px;" >我是孙子组件 我在儿子组件里</div>
      <div style="margin-bottom:30px;">我是孙子组件 我接收了爷爷传过来的值-----{{fathertoson}}</div>
      <el-button type="primary" @click="tofather">向爷爷发送值</el-button>
  </div>
</template>

<script>
export default {
  props: {
    //这里孙子从父亲那里接收来的值   
    fathertoson: {
      type: String
    }
  },
  data () {
    return {
      grendson: '我是孙子的数据'
    }
  },
  methods: {
    tofather () {
      //开始向爷爷传值 用this.$parent.$emit 触发了父亲身上的方法  
      this.$parent.$emit('fatherto', this.grendson)
    }
  }
}
</script>
```

## Vue子孙通信(向上派发)

```JS
1.上面我们展示了传统的方式 这样只是嵌套了三层 如果我们上面还有组件怎么办
2.所以就要写向上派发
3.跟eventBus不同的  他是局部 而eventBus 是全局 所有组件都可以触发
4.如果 事件都绑定了相同的条件  就要 在写一些条件了
```

```JS
//首先我们需要把方法挂在到Vue的全局上 或者自己写个工具函数也可以 这里我们就写在main.js初始化的时候 就挂在上
Vue.prototype.$dispatch = function (eventName, value) {
  // 当前的组件触发自己的父亲
  let parent = this.$parent
  while (parent) {
    // 如果我的父亲存在 我就去触发事件
    parent.$emit(eventName, value)
    parent = parent.$parent
  }
}
```

```JS
//然后孙子组件直接调用即可
<template>
  <div>
      <div style="margin-bottom:30px;" >我是孙子组件 我在儿子组件里</div>
      <div style="margin-bottom:30px;">我是孙子组件 我接收了爷爷传过来的值-----{{fathertoson}}</div>
      <el-button type="primary" @click="tofather">向爷爷发送值</el-button>
  </div>
</template>

<script>
export default {
  props: {
    fathertoson: {
      type: String
    }
  },
  data () {
    return {
      grendson: '我是孙子的数据'
    }
  },
  methods: {
    tofather () {
    //   this.$parent.$emit('fatherto', this.grendson)
      //他就会不停的向上查找  
      this.$dispatch('fatherto', this.grendson)
    }
  }
}
</script>
```

## Vue子孙通信(向下广播)

```JS
1.解决的问题 就是触发 儿子或者儿子的儿子身上绑定的方法
2.这里和向上派发的原理差不多 用于爷爷级的组件 向下传值
```

```JS
//main.js里 写在原型链上
Vue.prototype.$broadcast = function (eventName, value) {
  const broadcast = (children) => {
    children.forEach(child => {
      console.log(child)
      child.$emit(eventName, value)
      if (child.$children) {
        broadcast(child.$children)
      }
    })
  }
  broadcast(this.$children)
}
//然后我们随意在某个组件里调用一下 这里必须是触发方法的前面
mounted () {
    this.$broadcast('say', '我在爷爷组件里向下传递了值')
 },
//只要组件帮了自定义say的标签上都可以触发
<grendeson :fathertoson="fatherwoson" @say="sayhi"></grendeson>     
```

## Vue组件通信  v-bind="$attrs " /  v-on="$listeners"

```JS
1.我们从父级组件传过的数据都在$attrs身上 他们以对象的形式展示出来
2.只要你用了$attrs来接收值或者显示 这些值会被挂在到DOM节点上 在标签上就可以看到
3.如果你用props注册了某个值 那么$attrs对应的那个值也不会显示
4.如果不希望值在标签上显示  可以加上 inheritAttrs: false,
5.如果你希望这些值接着向下传递 就可以用v-bind=$attrs 绑定在接收值的组件标签上
6.如果要传递方法就可以使用v-on="$listeners" 这里的回调可以用来传值
```

```JS
//父亲页面
<template>
  <el-card class="box-card">
    <div style="margin-bottom:30px;">我是爷爷组件</div>
    <div style="margin-bottom:30px;">我是爷爷组件的值----{{grendeFather}}</div>
    //传给了儿子值 这里在我们的html标签上可以看到你传递的值都被写在标签上了 这里绑定了一个事件传递给儿子组件
    //但是儿子组件不接收
    <son :one="grendeFather" :two="testdataone" :three="testdatatwo"  @say="fathersay"></son>
  </el-card>
</template>

<script>
import son from '@/views/page/five/son'
export default {
  components: {
    son
  },
  methods:{
    fathersay(res){
        console.log('我是父亲的方法我被打印了')
        console.log(res)
    }
  }  
  data () {
    return {
      grendeFather: '我是爷爷文件里的数据',
      testdataone: '我是测试数据一',
      testdatatwo: '我是测试数据二'
    }
  }
}
</script>
```

```JS
//儿子接收
<template>
  <div>
      <div style="margin-bottom:30px;">我是儿子</div>
      //这里$attr获取的是一个对象里面就是你传过来的所有的值的键值对
      <div style="margin-bottom:30px;">我是爸爸传过来的数据----{{$attrs}}</div>
	 //这样就接着下向传给了孙子组件	儿子没有触发 我就传给了孙子
      <grandeson v-bind="$attrs" v-on="$listeners"></grandeson>
  </div>
</template>

<script>
import grandeson from '@/views/page/five/grandeson'
export default {
  //加上这个属性 就不会显示了  
  //inheritAttrs: false,  
  components: {
    grandeson
  },
  porps: {
    //如果这里我注册了 标签上就不会显示了 而且$attrs里也没有值了  
    one: {
      type: String
    },
    two: {
      type: String
    },
    three: {
      type: String
    }
  }
}
</script>
```

```JS
//孙子组件
<template>
  <div>
      <div style="margin-bottom:30px;">我是孙子</div>
      <div>{{$attrs}}</div>
	  <el-button type="primary" @click="btn">我要触发listenter</el-button>
  </div>
</template>

<script>
export default {
	methods: {
        btn () {
          //这里就触发了爷爷刚才的那个方法 也可以把值传过去  
          this.$listeners.say('我是孙子传过来的值')
        }
  }
}
</script>
```

## Vue 组件通信 provide inject

```JS
1.provide 把当前组件暴露出去 可以是整个组件 也可以组件里的某个值
2.inject 要使用暴露的值 就要用inject注册
3.任何注册了的组件都可以调用父亲的方法和数据 也可以修改
```

```JS
//爷爷组件
<template>
  <el-card class="box-card">
    <div style="margin-bottom:30px;">我是爷爷组件</div>
    <div style="margin-bottom:30px;">我是爷爷组件的值----{{issomke}}</div>
    <son></son>
  </el-card>
</template>

<script>
import son from '@/views/page/six/son'

export default {
  components: {
    son
  },
  data () {
    return {
      issomke: '我是爷爷的值'
    }
  },
  methods: {
    say () {
      console.log('我是父亲的方法')
    }
  },
  //这就是把自己本身暴露出去了  当然你也可以暴露某一个属性和  方法
  provide () {
    return {
      parent: this
    }
  }
}
</script>
```

```JS
//儿子组件
<template>
  <div>
      <div style="margin-bottom:30px;">我是儿子</div>
      //这里就拿到了父亲的值
      <div style="margin-bottom:30px;">暴露爸爸了拿到里面了的东西了-----{{this.parent.issomke}}</div>
      <el-button type="primary" @click="update">我要修改值了</el-button>
      <grandeson></grandeson>
  </div>
</template>

<script>
import grandeson from '@/views/page/six/grandeson'
export default {
//   inheritAttrs: false,
  components: {
    grandeson
  },
  methods: {
    //也可以调用暴露组件的方法  
    update () {
      this.parent.issomke = '1111'
      this.parent.say()
    }
  },
  //注册了父亲的组件  
  inject: ['parent']
}
</script>
```

```JS
//孙子组件
<template>
  <div>
      <div style="margin-bottom:30px;">我是孙子</div>
      <div>我是孙子我也调用爷爷的值------{{this.parent.issomke}}</div>
  </div>
</template>

<script>
export default {
  //这里也注入了
  inject: ['parent'],
  methods: {

  }
}
</script>
```

## Vue组件通信 ref $refs

```JS
1. ref $refs 主要用来调子组件中的方法 在这些方法里你就可以些逻辑 比如改变子组件上大data
```

```JS
//父文件
<template>
  <el-card class="box-card">
    <div style="margin-bottom:30px;">我是爷爷组件</div>
    <div style="margin-bottom:30px;">我是爷爷组件的值----{{issomke}}</div>

    <div style="margin-bottom:30px;">
      <el-button type="primary" @click="getson">我想调用子组件中的方法</el-button>
    </div>
	//这里绑定了ref
    <son ref="sondom"></son>
  </el-card>
</template>

<script>
import son from '@/views/page/seven/son'

export default {
  components: {
    son
  },
  data () {
    return {
      issomke: '我是爷爷的值'
    }
  },
  methods: {
    getson () {
      //这里我们就可以通过refs调用sondom中的方法 也就是调用子组件中的方法  
       this.$refs.sondom._sonsay(this.issomke)
    },
    fathersay () {
      console.log('我是父亲的方法')
    }
  }
}
</script>
```

```JS
<template>
  <div>
      <div style="margin-bottom:30px;">我是儿子------{{son}}</div>
      <el-button type="primary" @click="update">我要修改值了</el-button>
      <grandeson></grandeson>
  </div>
</template>

<script>
import grandeson from '@/views/page/seven/grandeson'
export default {
//   inheritAttrs: false,
  components: {
    grandeson
  },
  data () {
    return {
      son: '爸爸快来修改我'
    }
  },
  methods: {
    update () {
      // console.log('我也是子组件中的方法')
    },
    _sonsay (res) {
      //这样就把爷爷的值传过去了 也可以对自己组件的值修改  
      this.son = res
      console.log('我是son中的方法')
    }
  }

}
</script>
```

## Vue组件通信 eventBus

```JS
1.这是个全局的 使用的时候 需用用this.$on('事件名称',() => {}) 来注册
2.触发的时候 要使用this.$emit('事件名称','要传递的值')
```

```JS
//我们在全局 Vue的原型上 挂在了bus
Vue.prototype.$bus = new Vue() //这样随时用即可
```

```JS
//父亲组件  挂在了2个儿子
<template>
  <el-card class="box-card">
    <div style="margin-bottom:10px">父亲组件</div>
    <son1 style="margin-bottom:10px"></son1>
    <son2 style="margin-bottom:10px"></son2>
  </el-card>
</template>

<script>
import son1 from '@/views/page/eight/son1'
import son2 from '@/views/page/eight/son2'
export default {
  components: {
    son1,
    son2
  }

}
</script>
```

```JS
//son1组件挂在了一个孙子
<template>
  <div>
      <div>我是儿子一</div>
      <grandeson1></grandeson1>
  </div>
</template>

<script>
import grandeson1 from '@/views/page/eight/grandeson1'
export default {
  components: {
    grandeson1
  }

}
</script>
```

```JS
//grandeson1
<template>
  <div>
      我是孙子一 在我的mouted里 调用son2中的方法
  </div>
</template>

<script>
export default {
  mounted () {
    this.$nextTick(() => {
      //这里触发  
      this.$bus.$emit('xxxx')
    })
  }
}
</script>
```

```JS
//son2
<template>
  <div>
      我是儿子二
  </div>
</template>

<script>
export default {
  mounted () {
    //这里注册
    this.$bus.$on('xxxx', function () {
      console.log(111)
    })
  }
}
</script>
```

```JS
//this.$nextTick 作用
我们有子孙组件嵌套的时候 会有加载的顺序
从上面的实例我们看出来 我们是先挂在 grandeson1 这里触发了方法 但是那个时候 我们的son2组件还没有开始初始化出来
而 this.$nextTick 作用 就是延迟执行
```

## Vue组件挂在顺序

```JS
1.加载渲染过程
父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
```

```JS
2.子组件更新过程
父beforeUpdate->子beforeUpdate->子updated->父updated
```

```js
3.父组件更新过程
父beforeUpdate->父updated
```

```JS
4.销毁过程
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
```

```js
如果有个多个同级别的组件 一定是从上向下去加载的 由外到内 在油外到内 详细见下面
https://blog.csdn.net/michael8512/article/details/79031656?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-3.nonecase
```

