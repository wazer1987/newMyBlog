---
title: Gin-Vue-Admin
date: 2021-04-16
updated: 2021-04-16
tags: Vue
top: 90
categories: Gin-Vue-Admin
keywords: Gin-Vue-Admin
description: Gin-Vue-Admin
top_img: 
comments: false
cover: /img/gin-vue-admin.jpg
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

<div align=center>
<img src="http://qmplusimg.henrongyi.top/gvalogo.jpg" width=300" height="300" />
</div>
<div align=center>
<img src="https://img.shields.io/badge/golang-1.12-blue"/>
<img src="https://img.shields.io/badge/gin-1.4.0-lightBlue"/>
<img src="https://img.shields.io/badge/vue-2.6.10-brightgreen"/>
<img src="https://img.shields.io/badge/element--ui-2.12.0-green"/>
<img src="https://img.shields.io/badge/gorm-1.9.12-red"/>
</div>



# 项目介绍

Gin-vue-admin是一个基于vue和gin开发的全栈前后端分离的后台管理系统，集成jwt鉴权，动态路由，动态菜单，casbin鉴权，表单生成器，代码生成器等功能，提供多种示例文件，让您把更多时间专注在业务开发上。

# 作者简介

Mr.奇淼,本名蒋吉兆，目前工作于北京某创业公司。

个人本职为公司前端技术负责人，业余时间会做一些开源的小东西，gin-vue-admin就是疫情期间的无心插柳。 

个人技术栈为前端VUE React UNI weex RN 等，后端golang python node  

期待更多小伙伴加入Gin-Vue-Admin的大家庭

# Gin-vue-admin特点

## 简单易用

大幅度降低应用层代码难度，让每一个刚开始学习`gin`和`vue`的新手都能快速上手.这将会是你上手学习`gin+vue`的最佳代码。

## 自动化代码

系统提供自动化代码功能，对于简单业务逻辑，只需配置结构体或者导入数据库即可一键创建对应前后端简单业务逻辑代码。

## 标准化目录

项目目录分层清晰，项目模式结构清晰，包名语义化，让你更加容易理解目录结构，读懂代码更加方便！

## 开箱即用

已集成各类鉴权功能，对各类基础服务提供支持，安装依赖完成即可轻松使用

## 自由拓展

系统底层代码和业务逻辑代码分层清晰，不会发生相互干扰，便于根据自己业务方向进行拓展。

## 更新迅速

专业的开发团队，更新及时，bug响应迅速，交流社群活跃，让你有了问题，有迹可循。

# 技术选型

- 前端：用基于`vue`的`Element-UI`构建基础页面。
- 后端：用`Gin`快速搭建基础restful风格API，`Gin`是一个go语言编写的Web框架。
- 数据库：采用`MySql`(5.6.44)版本，使用`gorm`实现对数据库的基本操作,已添加对sqlite数据库的支持。
- 缓存：使用`Redis`实现记录当前活跃用户的`jwt`令牌并实现多点登录限制。
- API文档：使用`Swagger`构建自动化文档。
- 配置文件：使用`fsnotify`和`viper`实现`yaml`格式的配置文件。
- 日志：使用`go-logging`实现日志记录。

# 你能学习到什么

- 权限管理：基于`jwt`和`casbin`实现的权限管理 

- 文件上传下载：实现基于七牛云的文件上传操作（为了方便大家测试，我公开了自己的七牛测试号的各种重要token，恳请大家不要乱传东西）

- 分页封装：前端使用mixins封装分页，分页方法调用mixins即可 

- 用户管理：系统管理员分配用户角色和角色权限。

- 角色管理：创建权限控制的主要对象，可以给角色分配不同api权限和菜单权限。

- 菜单管理：实现用户动态菜单配置，实现不同角色不同菜单。

- api管理：不同用户可调用的api接口的权限不同。

- 配置管理：配置文件可前台修改（测试环境不开放此功能）。

- 富文本编辑器：MarkDown编辑器功能嵌入。

- 条件搜索：增加条件搜索示例。

- restful示例：可以参考用户管理模块中的示例API。

- ```
  前端文件参考: src\view\superAdmin\api\api.vue 
  后台文件参考: model\dnModel\api.go 
  ```

- 多点登录限制：需要在`config.yaml`中把`system`中的`useMultipoint`修改为true(需要自行配置Redis和Config中的Redis参数，测试阶段，有bug请及时反馈)。

- 分片长传：提供文件分片上传和大文件分片上传功能示例。

- 表单生成器：表单生成器借助 [@form-generator](https://github.com/JakHuang/form-generator)。

- 代码生成器：后台基础逻辑以及简单curd的代码生成器。 

# 社区交流

### QQ交流群：622360840

|                            QQ 群                             |
| :----------------------------------------------------------: |
| <img src="http://qmplusimg.henrongyi.top/qq.jpg" width="180"/> |

### 微信交流群

| 微信 |
|  :---:  | 
| <img width="150" src="http://qmplusimg.henrongyi.top/qrjjz.png"> 

添加微信，备注"加入gin-vue-admin交流群"

# 地址

https://github.com/flipped-aurora/gin-vue-admin