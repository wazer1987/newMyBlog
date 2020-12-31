---
title: TypeScript
date: 2020-04-23
updated: 2019-06-03
tags: TypeScript
categories: TS
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

# TypeScript

## 安装

```JS
1. 这里采用的全局安装 yarn global add typescript 
2. 查看安装是否成功 tsc -v
```

## 编译

```JS
1.typescript的创建的文件是.ts后缀的文件
2.手动编译
3.配置文件编译
```

```JS
//手动编译
index.ts文件  使用 tsc + 文件名称 进行编译 编译之后就会自动生成 index.js文件
```

```JS
//自动编译
1.在项目目录里 用tsc --init生成 tsconfig.json的文件
2.更改生成的tsconfig.json 配置文件里的  "outDir": "./" 修改为  "outDir": "./js" 就是把编译好的文件生成当前目录下的js文件夹里
3.在vscode编译器 打开终端 选择 运行任务 选择typescript 监视文件 即可
4.也可以执行命令 tsc --watch index.ts
```

## ts中的数据类型

```JS
1.TS中提供类型校验
2.其中提供了以下一些数据类型
布尔类型(boolean)
数组类型(Number)
字符串类型(string)
数组类型(array)
元组类型(tuple)
任意类型(any)
null 和 undefined
void 类型 
never 类型
3.我们在定义变量的时候 就必须要指定类型
```

### 布尔类型

```JS
var flag:boolean = true //定义的时候就把类型也定义了
flag = '你好' //如果赋值于别的类型了 就会报错
```

### 数字类型

```JS
var a:number = 123 //定义就数字类型
a = '你好' //如果赋值于别的类型 就会报错
```

## 字符串类型

```JS
var str:string = '你好' //定义为字符串类型
a = 234 //如果赋值为别的类型 就会报错
```

### 数组类型

```JS
1.定义的时候就指定类型的数组
let arr:number[] = [1,2,3,4] //定义只是number类型的数组
定义string类型的数组
let arr:string[] = ['1','2','3']
2.定义数组的第二种方式 泛型定义
let arr:Array<number> = [1,2,3,4]
let arr:Array<Object> = [{name:'zs'}]
//定义数组里面的任何元素
let arr:any[] = [123,'4324',false]
```

### 元组类型

```JS
1.元组类型(tuple) 属于数组的一种 可以指定数组里面的每一个元素的类型
let arr:[string,number,boolean] = ['你好',3.14,false]
```

### 枚举类型(enum)

```JS
1.随着计算机的不断普及 程序不仅仅用于数值计算 还更广泛地用于处理非数值数据 比如性别 月份 星期几 颜色 单位名 学历 职业等 这些都不是数值数据 在计算机程序中用自然语言中有相应含义的单词 来代表某一状态 则程序就很容易阅读和理解 尽量用自然语言中含义清楚的单词来表示它的每一个值 这种方法称为枚举方法 用这种方式定义的类型称枚举类型
2.如果其中有一个枚举类型被赋值了那么它的下一个就会自增
//定义一个枚举类型
enum Flag {success=1,err=-1} //定义一个枚举类型 1就是成功 -1就是失败
//然后赋值给某一个变量 f变量是枚举类型 他的值成功也就是1
let f:Flag = Flag.success
//例子
enum Color{red,blue,green} //定义枚举类型但是没有赋值
var c:Color = Color.red //在没赋值的情况下 输出的索引 也就是0
```

### 任意类型

```JS
1.可以定义任意类型
2.一般用于原生JS获取DOM对象
var n:any = 'Nihao'
n = 133 //赋值了数字类型 不会报错
```

### null 和 undefined

```JS
1.当我们声明了一个变量没有赋值的时候 就会报undefined
2.所以我们需要指定类型
let num:undefined 
//可以指定它是哪种类型
let num:number | undefined | null
num = 123 //不会报错
```

### void

```JS
1.void表示没有任何类型 一般用于方法没有返回值的时候
function run () {
    console.log('run')
}
//如果一个方法没有返回值 就用void去定义
function run:void(){
    console.log('run')
}
//函数要指定返回的值的 不会报错
function run:number(){
    return 123
}
```

### never类型

```JS
1.其他类型 表示从不会出现的值 子类型是null undefined
var a:never;
a =123 //报错
//一般用在 抛出错误方面
a = (() => {throw new Error('错误')})
```

## 函数

```JS
1.声明函数
//定义函数返回的类型是字符串
function run():string{
    return '123'
}
2.函数表达式
const fun = ():string => {
    return '111' //返回值必须是字符串
}
3.传参也可以指定类型
const fun = (age:string,name:number):string => {
    return age+name
}
const n = fun('11',11)
4.可选参数 就是实参可传可不传
//需要可传可不传的参数加个问好即可 可选参数必须配置形参的最后面
const fun = (name:string,age?:string):string => {
    return name + age
}
fun('zs')
5.默认参数 在类型后面写等于号加赋值
const fun = (name:string='张灿',age?:string):string => {
    return name + age
}
fun('zs')
```

## 重载函数

```JS
1.重载函数 指的是两个或者两个以上的同名函数 但是他们的参数不一样 这是会出现函数重载的情况
2.ts中的函数重载 通过为一个函数提供多个函数类型的定义来实现多种功能的方式
//ts中重载
定义两个没有函数体的函数 只不过形参传入不一样
function getInfo(name:string):string
function getInfo(age:number):number
function getInfo(str:any):any{
    if(typeof str === 'string'){
        return str
    }else{
        return number
    }
}
```

## TS定义类

```JS
1.用class关键字去定义类
class Person {
    //构造函数 实力化类的时候 触发的方法
    constructor(name:string){
        this.name = name
    }
    run():string{
        console.log(this.name)
        return this.name
    }
}
```

## TS 类里的修饰符

```JS
1.TS 里面定义属性的时候给我们提供了 三种修饰符
public 公有 在里面 子类 类外部 都可以访问
protected  保护类型 在类里面 子类里都可以访问 在类外部没办法访问
private 私有 在当前类里面可以访问 字类 和外部都没有办法访问
2.属性不加以上那些修饰符 就是公有
```

```JS
//public
class Preson {
    //定义了类里面的name属性 是公有 子类和外部都可以访问
    public name:string
    constructor(name:string){
        this.name = name
    }
}
var p = new Preson('哈哈')
//在外部也可以访问
console.log(p.name)
```

```JS
//protected 当前类和子类都可以访问 外部访问不了
class Preson {
    //定义了类里面的name属性 是公有 子类和外部都可以访问
    protected name:string
    constructor(name:string){
        this.name = name
    }
}
var p = new Preson('哈哈')
//在外部也可以访问
console.log(p.name)
```

## TS多态 继承的一种

```JS
1.父类里面写了一个方法 但是没有写逻辑 
2.让子类去实现 这个方法里的逻辑
3.主要是定义一个类的标准 我抽象类里面的方法 你必须在子类也有要写
```

```JS
//动物都有吃的方法 但是具体吃什么不知道 完全是由字类决定 这种就叫多态
class Ainemall {
    name:string
    constructor(name:string){
        this.name = name
    }
    //父类有吃的方法但是具体吃什么不知道 完全有子类去实现
    eat(){
        console.log('具体吃什么不知道')
    }
}
class Dog extends Ainemall{
    constructor(name:string){
        super(name)
    }
    //子类去实现父类里吃的方法 叫多态
    eat(){
        //比如小狗吃骨头
        return this.name + '吃骨头'
    }
}
class Cat extends Ainemall{
    constructor(name:string){
        super(name)
    }
    eat(){
        //小猫吃老鼠
        return this.name + '吃老鼠'
    }
}
```

## TS 抽象类

```JS
1.抽象类是提供其他类继承的基类 不能被实力化
2.用abstract 关键字 定义抽象类和抽象方法 抽象类中的抽象方法不包含举例的实现 并且 只能在派生类中实现
```

```JS
//定义的抽象类 必须有抽象方法 但是也可以有非抽象的方法 而且定义的抽象类不能被实力化 
abstract class Animall {
    public name:string
    constructor(name:string) {
        this.name = name
    }   
    //必须包含抽象方法
    abstract eat():any
    //也可以有非抽象的方法
    say(){
        return '我的名字叫'  + this.name
    }
}
//抽象类的子类 必须要去实现 抽象类里的抽象方法
class Cat extends Animall{
    constructor(name:string) {
        super(name)
    }
    //抽象类的子类 必须实现抽象类中的抽象方法
    eat(){
        console.log(this.name+'吃老鼠')
    }
}
const cat = new Cat('jerrey')
cat.eat()
```

## TS 接口

```JS
1.在面向对象编程中 接口是一种规范的定义 它定义了行为和动作的规范 在程序设计里面 接口起到一种限制和规范的作用 接口定义了某一批类所需要遵守的规范 接口不关心这些类内部的状态数据 它只规定这批类里面必须提供某些方法 提供的这些方法的类就可以满足实际需要 ts中的接口 类似于java 同时还增加了更灵活的接口类型 包括属性 函数 索引 和 类等
2.属性类接口
  函数类型接口
  可索引接口
  类类型接口
  接口扩展
```

### 属性接口

```JS
// 对json对象 的 约束
//定义了一个方法 形参传入一个对象 对象里必须有label的这个属性 而且值是字符串 传入别的就会报错
const pritObj = (labelinfo:{label:string}) => {
    console.log(labelinfo.label)
}
pritObj({label:"111"})
//上面是基本的概念 但是如我我们要批量处理的就会很麻烦 所以我们定义一个接口 用 interface 来定义 你要传入函数里的对象必须要有onename twoname两个字段
interface FullName {
    onename:string; //这里要以分号为结尾
    twoname:string;
}
//当你在传入obj这个参数的时候 要按照我们定义的FullName的接口去写
const print = (obj:FullName) => {
    console.log()
}
//这样在写数据的时候 要按照我们定义的FullName这个接口去写数据 
const obj ={
    //用这种字面量的方法传入 如果有多余的属性比如age也不会报错
    age:111
    onename:'111',
    twoname:'222'
}
print(obj)
//-----------------------------------------//
//如果用这种方式去传入参数 有多余的age 就会报错
print({age:111,onename:'111', twoname:'222'})
```

### 接口可选属性

```JS
//刚刚上面 我们的接口属性 必须按照我们规定的去传 如果你多传入一个的话 你在函数里面使用了就会报错
interface FullName {
    onename:string; 
    twoname:string;
}
const print = (obj:FullName) => {
    //obj.age 就会报错
    console.log(obj.onename+obj.twoname+obj.age)
}
const obj ={
//这里多传了一个age
    age:111
    onename:'111',
    twoname:'222'
}
print(obj)
//但是 在print的这个函数里面我用不到age 可是别的会用到 这样报错就不太合适 所以就有了可选属性
interface FullName {
    onename:string; 
    twoname:string;
    age?:number; //这样加个问好 就是你可传可不传
}
```

### 函数类型接口

```JS
1.主要是对方法传入的参数 以及返回值 进行约束
```

```JS
//约定函数的传参
interface entry{
    //约定函数里你必须给我传入一个key 是字符串 value 也是字符串 返回值也是字符串
    (key:string,value:string):string
}
//这里就是你这个函数的传参 必须按照我上面的那个接口规定的方式去传参
const md5:entry = (key:string,value:string):string => {
    return key + value
}
```

### 可索引接口

```JS
1.主要是对数组和对象的约束
```

```JS
//数组
interface UserArr{
    //索引是数字 元素是字符串
    [index:number]:string
}
//定义的数据要按照我们UserArr接口去写
const arr:UserArr=['aaa','bbb']
```

```JS
//对象
interface UserObj{
    [index:string]:string
}
const obj = {
    name:'zs',
    age:14
}
```

### 类类型接口

```JS
1.对类的约束 和 和abstract 抽象类有点类似
2.我们定义类的标准 比如你这个类里面必须有那个属性 必须有哪些方法
```

```JS
//定义一个类的标准 使用 implements 关键字 去使用这个接口的标准 以后定义的类都要有我这些属性和方法
interface Animall{
    //定义了类的接口 你新建的类的只要使用我这个接口就必须有name属性 和eat方法
    name:string;
    eat(str:string):void
}
//使用 implements 去使用 当然也可以使用别的属性
class Dog implements Animall {
    //使用了这个接口的类 必须有name的这个属性
    name:string
    constructor(name:string){
        this.name = name
    }
    //还要有eat的这个方法
    eat(){
        console.log(this.name)
    }
}
```

### 接口扩展

```JS
1.就是接口可以继承别的接口
```

```JS
interfase Animall {
    eat():void
}
// Preson的接口 继承了 Animall的接口
interface Preson extends Animall{
    work():void
}
//如果此时我们实力化了Preson 就必须要有eat 和work 两个方法
class Web implements Preson{
    public name:string
    constructor(name){
        this.name = name
    }
    //必须要有约束中的work方法
    work(){
        console.log('我在工作')
    }
    //而且也要有 Preson继承的Animall接口中的eat方法
    eat(){
        console.log('我是吃东西')
    }
}
```

```JS
//上面的接口不但可以继承 使用implements关键字 使用接口的类 也可以继承自己的父类

interfase Animall {
    eat():void
}

interface Preson extends Animall{
    work():void
}
class Promisee {
    name:string
    constructor(name){
        this.name = name
    }
    code(){
        console.log('我去写代码')
    }
}
//这里继承父类
class Web extends Promisee implements Preson{
    public name:string
    constructor(name){
       super(name)
    }
    //必须要有约束中的work方法
    work(){
        console.log('我在工作')
    }
    //而且也要有 Preson继承的Animall接口中的eat方法
    eat(){
        console.log('我是吃东西')
    }
}
```

## TS中的泛型

```JS
1.主要是用来解决 类 方法的复用性 以及对不特定数据类型的支持
2.对于固定的传参输入 返回固定的输出
```

```JS
// 这里不使用any 是因为 你用了any之后就放弃了类型检查 而我们需要的是 比如你传入number 我就给你返回number 传入string 就返回 string
function getdata<T>(value:T):T{
    //大T 就是泛型 具体是什么类型就是方法调用的时候 决定的
    return value
}
getdata<number>(123) //这里 就是传入的是number 那么返回的就是number
getdata<string>("123") //这里 就是传入的是string 那么返回的就是string

//当然这里也可以指定返回的类型
function getdata<T>(value:T):string{
    //大T 就是泛型 具体是什么类型就是方法调用的时候 决定的
    return '1234'
}
```

```JS
//泛型类 比如有个最小堆的算法 需要同时支持返回数字和字符串两种类型 通过泛型类来实现
class Mymin{
    arr:number[] = []
    constructor(){
        this.arr = []
    }
    add(num:number){
        this.arr.push(num)
    }
    min(){
        let one = this.arr[0]
        for(let i = 0; i < this.arr.length; i++){
            if(one > this.arr[i]){
                one = this.arr[i]
            }
        }
        return one
    }
}
const n = new Mymin
n.add(2)
n.add(1)
n.add(6)
n.add(9)
n.add(0)
console.log(n.min()) //输入0
//通过上面的例子 我们知道 这里就值能返回数字 而返回不了字符串之类的 如果还有别的类型我们就支持不了 这个问题就可以用泛型去解决 
```

```JS
//定义泛型类 和我们上面的方法一样
//定义一个泛型类 也就是你的new的时候 需要指定我是什么类型的类
class Mymin<T>{
    //定义了泛型数组 
    public list:T[] = []
	//在使用add方法的时候 你必须要遵循你你实力化的时候传入的类型
	add(value:T):void{
        this.list.push(value)
    }
    min():T{
        let one = this.arr[0]
        for(let i = 0; i < this.arr.length; i++){
            if(one > this.arr[i]){
                one = this.arr[i]
            }
        }
        return one
    }
}
//开始实力化类
const p = new Mymin<number> //这里就是指定泛型最终接收的number类型 
p.add('aaa') //会报错
p.add(123) //因为你上面指定我在实例类的时候给你传入的是数字类型 这个就不会报错
const p = new Mymin<string> //这样指定了实例的时候传入的是泛型 string 
```

## TS 泛型接口

```JS
interface Config{
    //这样就是定义了一个泛型的接口
    <T>(value:T):T
}
//然后定义个函数使用这个接口
const getdata:Config = <T>(value:T):T =>{
    return value
} 
//调用 你调用的时候传给泛型的类型是number 所以传参也要写number
getdata<number>(123)
getdata<string>("123") //这里在调用的时候传入的是 string的 所以传参的时候也要传入string
```

```JS
//第二种定义泛型的接口
interface Config<T>{
    (vale:T):T
}
//定义一个泛型的函数 
const getdata<T> = (valueL:T):T => {return value}
// 然后让我们的泛型接口 等于我们的这个泛型函数 给泛型传入数据类型
const mygetdata:Config<string> = getdata
//调用
mygetdata('aaaa')
```

## TS中类作为参数

```JS
1.我们可以定义一个类 对这个类做校验
2.当我们把这个类传入到某一个方法 或者 函数里的时候 要按照这个类的的校验去写
```

```JS
// 把类作为参数来约束传入的类型
//这里就是 你可以是string 也有可能什么都没有
class User {
    username:string | undefined;
    password:string | undefined
}
//定义方法类
class MysqlDb{
    //当给我的add方法传入参数的时候 必须是这个user类的数据格式
    add(user:User):boolean{
        return true
    }
}
const u = new User()
u.username = '张三'
u.password = '123456'
const db = new MysqlDb()
//如果你传入别的就会报错
db.add(u)
//报错的情况
const obj = {
    username:'zhangsa',
    userpassword:'1111'
}
const db = new MysqlDb()
db.add(obj) //报错
```

```JS
//上面的问题是 如果我们同一个MysqlDb的类的add方法 除了User类还需要传入 别的不同的类 就会变得不是那么方便 所以我们需要指定MysqlDb是一个泛型类 然后传入User类即可
//还是先定义泛型类
class MysqlDb<T>{
    add(info:T){
        return true
    }
}
class User{
    username: string | undefined
    password: string | undefined
}
const u = new User()
u.username = '张三' u.password = '李四'
//在实力化MysqlDb类的时候 就指定User是他泛型的数据类型
const db = new MysqlDb<User>()
db.user(u)
//如果我们还有一个info类 这样就会方便很多
class Info{
    age:number|undefined,
    sex:string| undefined   
}
const in = new Info()
in.age = 12
in.sex = '男'
//在实力化MysqlDb类的时候 就指定Info是他泛型的数据类型
const db =  new MysqlDb<Info>()
```

## 综合使用

```JS
//使用类型 接口 类 泛型 封装统一操作Mysql Mongodb Mssql的底层封装库
1.约束统一的规范 以及代码重用
2. 以上数据库功能都一样 有 add update delete get 方法 
```

```JS
//首先我们还是要定义泛型接口 
interface Config<T>{
    add(info:T):boolean;
    updated (info:T,id:number):void ;
    delete(id:number):void;
    get(id:number):any[];
}
//然后我们定义的类使用这个泛型接口 注意 使用泛型接口的类也一定是泛型类 这个类一定要有以上那些方法
//小技巧 可以点快速修复之后 就会弹出创建菜单 快速创建
class Mysql<T> implements Config<T>{
    add(info: T): boolean {
        throw new Error("Method not implemented.");
    }
    updated(info: T, id: number): void {
        throw new Error("Method not implemented.");
    }
    delete(id: number): void {
        throw new Error("Method not implemented.");
    }
    get(id: number): any[] {
        throw new Error("Method not implemented.");
    } 
}
//使用这个泛型类 首先定义我们要传入的泛型类的数据
class User{
    username: string | undefined
	password :string | undefined
}
const u = new User()
u.username = '张三'
u.password = '123456'
//把User类型作为参数传入到泛型类里
const db = new Mysql<User>()
db.add(u) //这样就不会报错
db.add('1234')//报错
//当然我们还可以 写一个mongodb的数据库操作类
class Mymongo<T> implements Config<T>{
    add(info: T): boolean {
        throw new Error("Method not implemented.");
    }
    updated(info: T, id: number): void {
        throw new Error("Method not implemented.");
    }
    delete(id: number): void {
        throw new Error("Method not implemented.");
    }
    get(id: number): any[] {
        throw new Error("Method not implemented.");
    }
}
//在使用的时候  还是先定义传入泛型类的 数据类
class info {
    age:number | undefined
	sex:string | undefined
}
const in = new info() in.age = 18 info.sex = '你好'
const db = new Mymongo<info>()
db.update(in,12) //不会报错
db.update(u,12) //报错
```

## TS 中的命名空间

```JS
1.在一个ts文件里 可以使用namespace a{} 这种关键字去给一段代码片段命名
2.在使用的时候 也需要 向外暴露出去
3.原理就是函数的自调用  
```

```JS
//使用namespace 开启命名空间
namespace A {
    interface Animal{
        name:string;
        eat():void
    }
    export class Dog implements Animal{
        name:string
        constructor(theName:string){
            this.name = theName
        }
        eat(){
            console.log('吃东西')
        }
    }
}
//使用
const d = new A.Dog('狼狗')
```

## TS装饰器

```JS
1.是一种特殊的声明 能够附加到类声明 方法上 属性 或者参数上 可以修改类的行为
2.通俗来讲 装饰器就是一个方法 可以注入到类 方法 属性 参数上 来扩展类 属性 方法 参数的功能
3.常见的装饰器 有 类装饰器 属性装饰器 方法装饰器 参数装饰器
4.装饰器的写法 普通装饰器(无法传参) 装饰器工厂(可以传参)
5.装饰器 是过去几年js最大的成就之一 也是ES7的标准特性之一
```

### 类装饰

```JS
//类装饰器 在类声明之前就被声明 类装饰器应用于类构造的函数 可以用来监视 修改或者替换类的定义
//装饰器就是一个函数 形参 就是当前使用装饰器的类
//写一个普通装饰器
function logClass(params:any){
    console.log(params:any) //这里打印出来的就是你装饰器下面的类 
    //我们就可以动态的扩展属性和方法
    params.prototype.apiUrl = '动态扩展的属性'
    //也可以扩展方法
    params.prototype.run = function(){
        console.log('快跑')
    }
}
//使用装饰器 用@关键字 + 装饰器函数的名称 写在你要装饰的类上面
@logClass
class Http{
    constructor(){

    }
    getdata(){
        
    }
}
//上面我们用装饰的函数动态扩展了一个 apiUrl的属性 而这个属性在我们类里面是没有的 所以我们实例的时候也可以拿到
const h:any = new Http()
console.log(h.apiUrl) //打印出来了 动态扩展的属性
h.run() //快跑
```

```JS
//装饰器 工厂 可以传参
//首先还是按照函数那么但是函数里里面要返回一个函数 最外层的函数的形参是你在调用函数的时候 传入的那个参数 返回的函数的形参 是传入的类
function fun(params:any){ //这个参数 是你装起装入的的参数
    return function(target:any){ //这个是装饰器传入的类
        console.log(params,'---我是装饰器传入')
        console.log(target,'我是类本身')
    }
}
@fun('我是参数') //给装饰器传入参数
class Preson {
    name:string
    constructor(thename:string){
        this.name = thename
    }
}
const p:any = new Preson('夏明')
```

```JS
//装饰器重载类里面的属性 比如我们一个类 里面的一些属性已经有值了 我想在装饰器里面重写
function fun(params:any){

}
@fun
class Http{
    public apiUrl:string
    constructor(){
        this.apiUrl = '我是类里面里面生成的url'
    }
    getdata():void{
        console.log(this.apiUrl)
    }
}
const h = new Http()
h.getdata() //这里输出是 '我是类里面里面生成的url'
//下面我们开始在装饰器里面重些apiUrl
function fun(params:any){
    //首先我们需要继承这个类 并且返回这个类 就可以在里面重写 你类的属性和方法了
    return class extends params{
        apiUrl:any = '我是在装饰器里面重写的数据'
        getdata(){
            console.log(this.apiUrl+'-----')
        }
    }
}
@fun
class Http{
    public apiUrl:string
    constructor(){
        this.apiUrl = '我是类里面里面生成的url'
    }
    getdata():void{
        console.log(this.apiUrl)
    }
}
const h = new Http()
h.getdata() //这里面输出 ‘我是在装饰器里面重写的数据-------
```

### 属性装饰器

```JS
//主要用来修改 类里面的静态成员 
function fun (params:any){
    return function(target:any,attr:any){
        // console.log(target) //原型 也可以理解为实例对象
        // console.log(attr) //类里面的静态成员
        // console.log(params) //你在调用装饰器的时候 传入的参数
        target[attr] = params //这里就算是给 Preson类里面的 name赋值
    }
}
class Preson{
    @fun('我是传入的参数')
    public name:string | undefined
    constructor(){
        
    }
    getdata(){
        console.log(this.name)
    }
}
const p = new Preson()
console.log(p.name) //这里打印出来的是装饰器传入的参数
//如果要获取多个静态成员 就要多次调用装饰器
function fun (params:any | undefined){
    return function(target:any,attr:any){
        // console.log(target)
        console.log(attr)
        // console.log(attr1)
        console.log(params)
        // target[attr] = params
    }
}
class Preson{
    //这里多次调用装饰器 我们上面的fun函数就会被多次执行
    @fun('我是传入的参数')
    name:string | undefined;
    @fun()
    age:number | undefined
    constructor(){
        
    }
    getdata(){
        console.log(this.name)
    }
}
const p:any = new Preson()
```

### 方法装饰器 

```JS
1.方法装饰器 主要用到方法上 可以用来监视 修改或替换方法
2.在运行时的时候 会传入下列三个参数 对于与静态成员来说是类的构造函数 对于实例成员就是类的原型对象
方法的名字 以及 方法的属性描述(就是调用的那个函数函数体)
```

```JS
//比如我类里面有一个方法 我向在中间改一下或者在增加一段逻辑 就可以用方法装饰器
function fn(params:any){
    return function(target:any,method:any,des:any){
        console.log(target) //类本身
        console.log(method) // 方法的名称 getdata
        console.log(des) //方法的函数
    }
}
class Preson{
    constructor(){

    }
    @fn('我是参数')
    getdata(){
        console.log('我在类里面')
    }   
}
//现在我们需要 把传入getdata里面的参数 在装饰器里 都变成 字符串
function fn(params:any){
    return function(target:any,method:any,des:any){
        console.log(target) //类本身
        console.log(method) // 方法的名称 getdata
        console.log(des) //方法的函数 其中value就是你getdata调用的那个方法
        des.value = function(...arg:any[]){
             //这里打印就你调用getdata方法的时候传入的参数
            arg = arg.map(item => {
                return String(item)
            })
            console.log(arg) //这样就改变了所有的传进来的参数变成了字符串
        }
    }
}
class Preson{
    constructor(){

    }
    @fn('我是参数')
    getdata(){
        console.log('我在类里面')
    }   
}
const p:any = new Preson()
p.getdata(1,2,3)
//但是上面有个问题 我们只是简单的把getdata的方法重新赋值了而已 并不是修改 或者增加信的代码逻辑
function fn(params:any){
    return (target:any,method:any,des:any) =>{
        // console.log(target) //类本身
        // console.log(method) // 方法的名称 getdata
        // console.log(des) //方法的函数 其中value就是你getdata调用的那个方法
        let mymethods = des.value //这里要先保存一下 然后等一下改变this
        // console.log(params)
        des.value = function(...arg:any[] ){
             //这里打印就你调用getdata方法的时候传入的参数
            arg = arg.map(item => {
                return String(item)
            })
            console.log(arg) //这样就改变了所有的传进来的参数变成了字符串
            
            mymethods.apply(this,arg); //改变this指向之后 就可以执行getdata里面原本的逻辑 也可以执行我们这段代码的逻辑
        }
    }
}
class Preson{
    constructor(){

    }
    @fn('我是参数')
    getdata(){
        console.log('我在类里面')
    }   
}
const p:any = new Preson()
p.getdata(1,2,3)
```

### 参数装饰器

```JS
1.装饰器可以被当作参数传入到方法当中去
2.一共有三个参数 第一个是类的原型 第二个 是方法的名称 第三个 是你装饰器在类的方法中的索引位置
3.在方法执行的时候会先执行装饰器里面的函数逻辑 在执行 方法
```

```JS
function fn(params:any|undefined){
    return function(target:any,paramsname:string,paramsindex:number){
        console.log(target) //实例类
        console.log(paramsname) //方法的名称
        console.log(paramsindex) //在参数中的索引
    }
}
class Preson {
    constructor(){

    }
    //参方法中传装饰器 
    getdata(uuid:string,@fn('xxx')){
        console.log(uuid)
    }
}
const p = new Preson()
p.getdata('我是实参传入')
```

## 装饰器执行顺序

```JS
属性装饰器>方法装饰器(执行顺序从后向前)>参数装饰器>类装饰器(先执行离类最近的装饰器)
```



