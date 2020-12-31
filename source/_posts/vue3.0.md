---
title: Vue 3.0
date: 2020-04-26
updated: 2019-06-03
tags: Vue
categories: Vue
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

# VUE3.0

## 简单描述

```JS
1.这里我们的项目 还是用vue-cli去创建 版本在4.xx以上 创建出来的项目可以兼容2.x
2.相比vue2.0来说从optionsAPI 配置 变成了 composition-api 
3.基本来上说 vue2.0是在配置好的地方写固定的代码比如你的数据要声明在data里 方法写在methods里 而vue3.0 是你要用什么你就引用什么 说白了就是hook钩子 采用这种纯函数的形式 
```

## 创建

```JS
1.用vue-cli 4.xx版本以上去创建 
2.创建的方式和以前一样在选择vue里选择vue3.0 这样创建的项目是可以兼容vue2.0的项目的
3.如果需要纯vue3.0的项目 需要使用vue@next
```

## setup函数

```JS
1.我们所有的逻辑 和函数可能都会在这里执行
2.会接收两个默认的参数 一个是props(父组件传过来的值) 一个是 context 执行期上下文 (可以理解为this attr slot emit)  
```

## 响应式  reactive

```JS
1.我们现在所有的 数据和方法 都要定义在setup函数里 然后返回一个对象
2.如果要想实现数据响应式 需要我们把数据定义为响应式即可
```

```JS
//都要定义在setup函数里 然后返回一个对象
<script>
export default {
    //现在所有的数据和方法都要定义在setup函数里 然后返回一个对象
    setup(){
        return{
 			//这里注意 一定要返回一个对象 这里是你响应式的数据
        }
    }
}
</script>
```

```JS
//定义响应式数据 
<script>
//需要引入对应的响应式的函数  然后定义响应是数据 
import {reactive} from 'vue'
export default {
  name: 'Home',
  setup(){
    //定义响应式数据 这里接收一个普通对象 然后返回一个影响对象
    const state = reactive({
      cont:0
    })
    return{
      state
    }
  }
}
</script>
```

```html
<!-- 使用方法 -->
<template>
  <div class="home">
    我是home
    <div>
      <span>响应式数据</span>
      <br>
      <!-- 这里就要写state的对象-->  
      <span>{{state.cont}}</span>
    </div>
    <div>
      <button @click="plus">点击</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {reactive} from 'vue'
export default {
  name: 'Home',
  setup(){
    //定义响应式数据
    const state = reactive({
      cont:0
    })
    //让我们的响应式数据自增
    const plus  = () => {
      state.cont++
    }
    //记得要返回你定义的响应式数据 和方法
    return{
      state,
      plus
    }
  }
}
</script>
```

```JS
//reactive 创建出来的响应式数据 如果 你直接return 出去 他是响应式的 我们在页面也可以直接用访问值的形式访问
setup(){
    const state = reactive({count:0,name:'zs'})
    return state
}
//然后在页面访问 这样这个数据是访问时的
<div>count</<div>
//那么问题来了 如果我这里面还有add函数 也需要使用的话 所以上面的操作return 只能写一个 所以这里我们就要return 一个对象出去 然后把state 使用...解构出来 才能在页面中 使用{{count}}访问 但是解构出来的属性 就不再是响应式的 所以我们就使用到了toRefs 他可以把reactive里面的所有属性都变成响应式
setup(){
    const state = reactive({count:0,name:'zs'})
    const add = () => {state.count ++}
    return {
        ...toRefs(state)
        add
    }
}
//这样我们技能在页面上使用 count 直接拿到值 也可以保证 reactive的每个数据都是响应式的
```



## 响应式  ref

```JS
1.主要用来创建 单个变量的 响应式是数据
2.创建出来的响应式数据 如果需要对值进行操作 需要用.value 这种方式去取值
3.如果你传进来的是个对象 那么将会调用reactive 继续创建响应式数据
```

```html
<template>
  <div class="home">
    我是home
    <div>
      <span>响应式数据</span>
      <br>
      <span>{{count}}</span>
    </div>
    <div>
      <button @click="plus">点击</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {ref} from 'vue'
export default {
  name: 'Home',
  setup(){
    //定义响应式数据 值式0 
    const count = ref(0) 
    //如果需要对响应式数据进行操作 那么需要用.value这种方式去操作
    const plus  = () => {
      count.value++
    }
    return{
      count,
      plus
    }
  }
}
</script>
```

```JS
//如果ref响应式数据作为一个reactive的响应式对象的值 那么ref.value 就会自动解套 也就是说 无论你改变了ref创建的响应式数据的值 还是 reactive 创建出来的响应式数据的值 两边都会改变
const count = ref(0)
const state = reactive({
  count,
})

console.log(state.count) // 0
state.count = 1
console.log(count.value) // 1
//以上我们的代码 reactive里的响应式数据count 是ref响应式数据 如果我们在赋值一个新的ref那么他将会替换成旧的
//定义响应式数据
const count = ref(0) 
const state = reactive({
  count
})
state.count = ref(3)
console.log(count,'-----ref')  //输出0
console.log(state.count,'-----reactive')    //输出3
```

```JS
//如果我们在创建reactive响应式书数据的时候 如果是数组 或者map等原生的集合类时 当问的时候需要要加上.value
const arr = reactive([ref(0)])
// 这里需要 .value
console.log(arr[0].value)

const map = reactive(new Map([['foo', ref(0)]]))
// 这里需要 .value
console.log(map.get('foo').value)
```

## 响应式 computed

```JS
1.跟我们以往的计算属性相同
2.使用的时候 需要引入对应的API
```

```JS
//还是要引入对应的computed API 然后传入一个对应的getter 函数  这里只是只读的属性
<script>
// @ is an alias to /src
import {reactive,ref,computed} from 'vue'
export default {
  name: 'Home',
  setup(){

   const count = ref(0)
   //这里computedcount 的值不可以手动修改
   const computedcount = computed(() => count.value * 2)
   const plus = () => {
     count.value++
   }
   console.log(plusOne.value) // 2
   plusOne.value++ //报错
    return{
      count,
      computedcount,
      plus
    }
  }
}
</script>
```

```JS
//或者可以直接传入get函数 和 set函数 值就可以手动修改
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  },
})
//传入一个对象 里面是get函数 和set函数 plusOne.value 就可以触发set函数 既可以手动修改响应式数据的值
plusOne.value = 1
console.log(count.value) // 0
```

## 响应式 readonly

```JS
1.传入一个对象（响应式或普通）或 ref，返回一个原始对象的只读代理。一个只读的代理是“深层的”，对象内部任何嵌套的属性也都是只读的。
2.无法改变值 会传出来警告
```

```JS
<script>
// @ is an alias to /src
import {reactive,ref,computed,readonly,watchEffect} from 'vue'
export default {
  name: 'Home',
  setup(){
    const original = reactive({ count: 1 })
    //这里就是 你创建的值就不能改变了 会报警告
    const copy = readonly(original)
    const plus = () => {
      // original.count ++
      copy.count++
    }
    watchEffect(() => {
      // 依赖追踪
      console.log(copy.count)
    })
    // original 上的修改会触发 copy 上的侦听
    // original.count++
    // 无法修改 copy 并会被警告
    copy.count++ // warning!
    return{
      original,
      copy,
      plus
    }
  }
}
</script>
```

## 响应式 watchEffect

```JS
1.立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。
2.就是当你的值发生改变的时候 就会执行 watchEffect的函数
3.跟watch的却别 就是你的值发生了改变 但是跟原来的值还是一样的 他函数里面的动作是不执行的
```

```JS
<script>
// @ is an alias to /src
import {reactive,ref,computed,readonly,watchEffect} from 'vue'
export default {
  name: 'Home',
  setup(){
    const count = ref(0)
    const count1 = ref(1)
    //页面初始化的时候 会执行watchEffect里面的函数 
    watchEffect(() => {
      //这里要把你的追踪的依赖写进去才可以触发里面的立即执行函数  
      console.log(count.value,'---count.value')
      console.log(count1.value,'---count1.value')
    })
    
    // -> 打印出 0
	//如果值变了 还会执行watchEffect里面的函数
    setTimeout(() => {
      count.value++
      // -> 打印出 1
    }, 1000)
    //如果值变了 还会执行watchEffect里面的函数
    setTimeout(() => {
      count1.value++
      // -> 打印出 1
    }, 3000)
    const plus = () => {
      count.value++
    }
    return{
      count,
      count1,
      plus
    }
  }
}
</script>
```

```JS
//可以手动停止监听
<script>
// @ is an alias to /src
import {reactive,ref,computed,readonly,watchEffect} from 'vue'
export default {
  name: 'Home',
  setup(){
    const count = ref(0)
    const count1 = ref(1)
    //返回一个函数 用来 如果你想在什么操作之后停止监听调用即可
    const stop = watchEffect(() => {
      console.log(count.value,'---count.value')
      console.log(count1.value,'---count1.value')
    })
    setTimeout(() => {
      count.value++
      //在conut值加加之后 我不希望监听就停止了 即使下面的count1 在++的时候就不会在调用  watchEffect
      stop()
      // -> 打印出 1
    }, 1000)
    setTimeout(() => {
      count1.value++
      // -> 打印出 1
    }, 3000)
    const plus = () => {
      count.value++
    }
    return{
      count,
      count1,
      plus
    }
  }
}
</script>
```

## 响应式 watch

```JS
1.和vue2.x的使用方式一致 
2.可以监听多个数据源 
3.watch 第一次被创建的时候就会被执行一次
4.可以清除哪些无效的异步请求 比如 我们在页面的时候 去请求数据了 但是用户突然就切换到别的页面了 但是你这个请求也发出去了 返回的数据 也没什么作用 所以这个时候 就可以清除这些无效的请求
```

```JS
//立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。
import {watch} from 'vue'
export default {
  name: 'Home',
  setup(){
    const count = ref(0)
    //这里也会随着组件的最开始挂载的时候运行一次
    watch(() => {
      console.log(count.value)
    })
    const plus = () => {
      count.value++
    }
    return{
      count,
      plus
    }
  }
}
</script>
//使用方式
watch(() => {//监听的值 return count.value},(newvlau) => {当值改变的时候 要做的事情},{immediate:true 第一次就执行})
```

```JS
//可以采用数组的形式去监听多个数据源 也可以创建多个watch 去监听多个数据
<script>
// @ is an alias to /src
import {reactive,ref,computed,readonly,watchEffect,watch} from 'vue'
export default {
  name: 'Home',
  setup(){
    const count = ref(0)
    const count1 = ref(2)
	//这里同时监听了 count 和count1 在函数里 新值和老值也是用这种数组的形式传递的
    watch([count,count1],([countvalue, count1value], [prevFoo, prevBar]) => {
      console.log(count1.value)
      console.log(count.value)
    })
    const plus = () => {
      // count.value++
      count1.value ++
      count.value ++
    }
    return{
      count1,
      count,
      plus
    }
  }
}
</script>
```

## 生命周期函数

```JS
1.使用的时候还是要导入
```

```JS
import { onMounted, onUpdated, onUnmounted } from 'vue'
//在setup函数里引入
const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  },
}
```

```JS
//与2.x的对比
beforeCreate -> 使用 setup()
created -> 使用 setup()
beforeMount -> onBeforeMount
mounted -> onMounted
beforeUpdate -> onBeforeUpdate
updated -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed -> onUnmounted
errorCaptured -> onErrorCaptured
```

```JS
//vue3.0新增了两个生命周期钩子 具体还不知道怎么使用
onRenderTracked
onRenderTriggered
```

## 依赖注入  provide 和 inject 

```JS
1.功能类似与vue2.0的依赖和注入
2.基本使用就是使用provide 把自己组件内的属性和方法暴漏出去 然后别的组件使用inject 注册使用
```

```JS
//Home.vue 父组件
<script>
import {reactive,ref,computed,readonly,watchEffect,watch,provide} from 'vue'
import componentA from './componentA'
export default {
  name: 'Home',
  components: {
    componentA
  },

  setup(){
    const count = ref(3)
    const plus = () => {
      count.value++
    }
    //把plus方法命名为form 暴漏了出去
    provide('form',plus)
    return{
      count,
      plus
    }
  }
}
</script>
//componentA.vue 子组件
<script>
import {inject} from 'vue'
export default {
    setup(){
        //在子组件接收一下 就可以使用了 还是会改变原有count的值
        const them = inject('form')
        return{
            them
        }
    }
}
</script>
//如果要暴露多个 就要写多个provide 和 inject 如果你的provide没有传入值的时候 inject 可以自己拟定默认值
provide('form') //这里暴露的时候就没有传默认值
inject('form','这里可以写默认值') //在使用inject注入的时候 可以使用默认值
```

## 模板Refs

```JS
1.主要是用来操作DOM 类似vue2.0中的ref
```

```JS
<template>
  <div ref="root"></div>
</template>
<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // 在渲染完成后, 这个 div DOM 会被赋值给 root ref 对象
        console.log(root.value) // <div/>
      })
      return {
        root,
      }
    },
  }
</script>
```

```js
//配合 render 函数 / JSX 的用法
export default {
  setup() {
    const root = ref(null)
	//配合render h 使用
    return () =>
      h('div', {
        ref: root,
      })

    // 使用 JSX
    return () => <div ref={root} />
  },
}
```

```JS
//在循环中 绑定不同的ref
<template>
  <div v-for="(item, i) in list" :ref="el => { divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // 确保在每次变更之前重置引用
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs,
      }
    },
  }
</script>
```

## 响应式工具系统集

### unref

```JS
1.如果参数是一个 ref 则返回它的 value，否则返回参数本身。它是 val = isRef(val) ? val.value : val 的语法糖
2.因我们的在使用ref定义响应式数据的时候 要想拿到他的值 就需要使用.value 
```

```JS
 const count = ref(1) // 这里如果我们要使用的话 就要以count.value的形式 去使用
 const count1 = unref(count) //这里是只读数据
```

### toref

```JS
1.toRef 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。
```

```js

const state = reactive({
foo: 1,
bar: 2,
})
// 给里面的foo 又创建了响应式 
const fooRef = toRef(state, 'foo')
//这样你无论改那个的值  state里面的foo都会改变
fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

```JS
//当您要将一个 prop 中的属性作为 ref 传给组合逻辑函数时，toRef 就派上了用场：
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  },
}
```

### toRefs

```JS
1.把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。
2.我们尝使用reactive创建响应式对象的时候 需要在返回 而在模板中使用的时候 需要.里面的值 可以用torefs解构
```

```JS
const state = reactive({
  foo: 1,
  bar: 2,
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型如下:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 对象 与 原属性的引用是 "链接" 上的
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

```JS
//解构
setup() {
  const state = reactive({
    age:18
  })

  const puls = () => {
    state.age.value++
  }
  console.log(state)
  return {
	//这里就可以解构出来 在页面上直接就可以使用age了
    ...toRef(state),
    puls
  }
```

## route 和 router 的使用

```JS
1.还是需要import 从vue-router 引入进去  
2.引入的方式为 useRoute useRouter
```

```JS
import {useRoute,useRouter} from 'vue-router'
setup(props,context) {
  //这样引用一下 即可在别的函数里使用  
  const route = useRoute()
  const router = useRouter()
  console.log(useRoute().name,'----useRoute') 
},
```

## vuex的使用

```JS
1.还是要用import引用进来 import{useStore} from 'vuex'
2.使用的时候还是要用变量取接收一下 const store = useStore()
```

```JS
//用getter来举例
import { createStore } from 'vuex'
//在vuex的配置文件里 写入如下
export default createStore({
  state: {
    count:'vuex'
  },
  mutations: {
    setState(state,playload){
      state.count = playload
    }
  },
  actions: {
  },
  getters: {
    storedata(state){
      console.log(state.count,'---vuex')
      return state.count
    }
  },
  modules: {
  }
})
//在使用的文件里 我们还是要使用computed 去去值 这样 你的vuex里文件改变的时候 页面也会相应的变化
const count =  computed(() => store.getters.storedata)
const useVuex = () => {
store.commit('setState','我要改变')
console.log(count)
}
```

```JS
//我们也可以直接把state 或者getters里的数据使用toRefs的形式 展开出去
import { createStore } from 'vuex'
//vuex里定义
export default createStore({
  state: {
    count:'vuex'
  },
  mutations: {
    setState(state,playload){
      state.count = playload
    }
  },
  getters: {
    storedata(state){
      console.log(state.count,'---vuex')
      return state.count
    }
  },
  modules: {
  }
})
//页面文件
setup(){
    const store = useStore()
    return{
        ...toRefs(store.getters)
    }
}
//在template中使用
<div>
  {{storedata}}
</div>
```

## Suspense 组件

```JS
1.在异步操作结果没有返回之前 我们希望展示别的内容
2.Suspense 可以做一个类似loading的效果
```

```html
<Suspense>
    <tempalte #default>
        <User></User>
    </tempalte>
    <tempalte #fallback>
        <div>
            Loading...
        </div>
    </tempalte>
</Suspense>
<!--User组件 是我们一个异步请求结果 在结果没有回来之前我们就展示  #fallback 的模板-->
```



