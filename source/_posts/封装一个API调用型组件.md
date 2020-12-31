---
title: 封装一个API调用行组件
date: 2019-03-07
updated: 2019-06-03
tags: Vue
categories: Vue
keywords: Vue
description: 封装一个API调用行组件
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
# 封装一个API调用类型的组件

## 问题剖析

```js
1.开发的时候遇到了一个问题,elementUI自带的Notification 通知组件 当通知内容过多的时候 会出现错乱
2.于是决定通知组件的时候先把大的内容隐藏 然后上面新加一个展开的按钮
3.翻遍了Notification 通知组件的文档 发现 没有可用的扩展
4.于是决定自己封装一个
```

## 实现思路

```JS
1.首先我们需要有一个基础的组件 也就是 Notification 通知组件的静态版 这里就写我们组件文件.vue自己就可以扩展了
2.我们需要在这个基础的组件上做扩展 新的扩展要继承这个基础的组件
3.然后我们写一个函数 最后导出 每当触发这个函数的时候 就生成一个我们自己写好的静态组件
```

## Notification组件静态版

```JS
<template>
  <transition name="slide-fade">
    //这里我们可以看到 并没有定义 notifyFlag 但是却可以绑定 这我们在继承里在继续定义  
    <div v-if="notifyFlag" class="my-notify">
      <div :class="{'isvible':isvible}" class="notify ">
        <div class="tip">
          <div class="text-left">
            <i class="el-icon-error"/>
            <span>错误</span>
          </div>
          <div class="text-right">
            //这设置了扩展  
            <span @click="show">展开</span>
            <i class="el-icon-close" @click="close"/>
          </div>
        </div>
        <div v-show="isvible" class="content"> {{ content }}</div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    data() {
      return {
        isvible: false
      }
    },
    methods: {
      close() {
        this.notifyFlag = false
      },
      show() {
        this.isvible = !this.isvible
      }
    }
}
</script>
//设置了一些 基本的动画和样式 这里关于动画 有时间的话还是要在多学习一下
<style lang="scss" scoped>
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(300px);
  opacity: 0;
}
.notify-wrap{

  background-color: #fff;
}
.my-notify{
  /* margin: 10px; */
  /* width: 350px; */
}
.notify{
  position: relative;
  right: 10px;
  padding: 0 10px;
  width: 320px;
  height: 40px;
  border-radius: 4px;
  background-color:rgb(255, 255, 255);
  box-shadow: -5px 5px 12px 0 rgba(204, 204, 204, .8);
  animation: show cubic-bezier(.18,.89,.32,1.28) .4s;
}

.notify {
  height: 40px;
  .tip{
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    .text-left{
      .el-icon-error{
        font-size: 20px;
        color: #f56c6c;
        margin-right: 10px;
      }
      span{
        font-size: 17px;
        font-weight: 600;
      }
    }
    .text-right{
      span{
        cursor: pointer;
        font-size: 14px;
      }
      .el-icon-close{
        font-style: 14px;
        cursor: pointer;
      }
    }
  }

}

.notify .content{
  font-size: 15px;
  padding-bottom: 10px;
}
@keyframes show{
  0%{
    right: -350px;
  }
  100%{
    right: 10px;
  }
}
.isvible{
  height: auto;
}
</style>
```

## 继承静态版组件

```JS
//首先声明这是一个js文件 然后我们引入Vue 用Vue的api去继承个组件
import Vue from 'vue'
//引入了刚才我们写好的静态版的 Notification 组件 
import Component from './component/NotificationaBox'
//开启了继承 这里我们就继承了我们上面缩写的组件的属性
const NotificationConstructor = Vue.extend(Component)
//这里我们创建一个新的div 用于存放我们每次新建的那个Notification组件
const notifyWrap = document.createElement('div')
notifyWrap.className = 'notify-wrap'
notifyWrap.style = 'position: fixed; right: 10px; top: 20px; transition-duration: .5s;z-index:99;'
//然后插入到DOM中
document.body.appendChild(notifyWrap)
//这里开始写了api调用方式 就是一个函数 传入一些基本的设置
const notify = ({
    content,
    time = 5000
  }) => {
    //每当我们触发这个函数的时候 就会新建一个Notification的组件
    const notifyDom = new NotificationConstructor({
        //这里还是要获取当前的div 
        el: document.createElement('div'),
        //剩下的就跟我们的Vue里的写法一样了 这里会把那些都覆盖掉
        data() {
            return {
              //这里就是我们静态办组件调用的那个变量  
              notifyFlag: true, // 是否显示
              time: time, // 取消按钮是否显示
              content: content, // 文本内容
              timer: '',
              timeFlag: false
            }
        },
        watch: {
            timeFlag() {
              if (this.timeFlag) {
                this.notifyFlag = false
                window.clearTimeout(this.timer)
              }
            }
          },
          created() {
            this.timer = setTimeout(() => {
              this.timeFlag = true
            }, this.time)
        },
        beforeDestroy() {
            window.clearTimeout(this.timer)
        }
    })
    //最后把他插入到我们刚刚创建好的div中
    notifyWrap.appendChild(notifyDom.$el)
}
//然后导出去
export default notify

```

## 调用

```JS
<template>
  <div>
    <div>
      通知组件111
      <el-button @click="show">通知</el-button>
    </div>
  </div>
</template>

<script>
//引入了我们刚才的写的那个js文件 这个js文件 引入了我们写的静态版的组件
import notify from './function'
export default {
    components: {
    },
    data() {
        return {
            content: '我是通知组件',
            btn: '关闭'
        }
    },
    created() {

    },
    methods: {
        //这里就可以使用api的方式调用了
        show() {
            notify({
                content: '附件是快乐的防守对方角度思考反抗类毒素JFK的时间芬兰空军第三路径赋老师的课积分李达康书记浪费空间的是立刻解放但是立刻解放来看待世界分厘卡电视机分厘卡电视机福建烤老鼠解放立刻大家给大家克里夫冠军费德勒看更加开朗大方是更加开朗大方施工方地理空间给对方数据来看两地分居离开过'
            })
        }
    }
}
</script>

<style>

</style>

```

![](1.gif)

```JS
//效果如上
感谢 
https://blog.csdn.net/gbwine/article/details/96020683
```

