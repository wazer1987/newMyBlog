---
title: jQuery解析
date: 2019-03-31
updated: 2019-06-03
tags: jQuery 
categories: JavaScript
keywords: JavaScript
description: JavaScript
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

# jQuery 解析

## jQuery 常用方法

```js
// 函数传单技巧 比如我有一个函数 规定可以传一个参数 或者 两个参数  传两个参数的时候 必须是数字、函数 传第一个参数的时候必须是函数
function fn(){
    var x = 0
        y = arguments[0]
    if(typeof y === 'number'){
        x = y
        y = arguments[1]
    }
}
fn(0,function(){})
fn(function(){})
```

```js
//each 方法  jquery 在掉each的时候 其实也是调取的原型上的方法 
//extend 就是在原型上 增加方法 each 可以遍历数组/伪数组/对象
$.each([10,20,30],function(i,item){
    //这里就相当于控制循环结束了
    if(i < 2){
        return false
    }
})
jQuery.extend({
    each:function(obj,callback){
        var lengt,i = 0
        //判断你是数组还是对象
        if(aiArrayLike(obj)){
            length = obj.length
            for(;i < length ; i++){
                var item = obj[i]
                //这里保证我们的函数种的this 是我们数组的每一项 
                var res = callback.call(item,i,item)
                //可以控制循环结束
                if(res === false){
                    break
                }
            }
        } else {
            for(i in obj){
                if(callback.call(obj[i],i,obj[i]) === false){
                    break
                }
            }
        }
        return obj
    }
})
```

## JQ种的数据类型检测

```js
var class2type = {}
var toString = class2type.toString //调取的是Object.prototype.toString 用来数据类型检测
var hasOwn = class2type.hasOwnProperty //调取的是Object.prototype.hasOwnProperty 判断是不是私有属性
var fnToString = hasOwn.toString // 调取的是 Function.prototype.toString 用来转换字符串
var ObjectFunctionString = fnToString.call(Object) //可以是对象转换成字符串 

// 然后建立数据类型的映射表
$.each(['Boolean','Number','String','Function','Array','Date','RegExp','Object','Error','Symbol'],function(i,name) {
    class2type[`[object ${name}]`] = name.toLowerCase()
})
//循环之后 class2type 上面就增加了很多属性 
{
    '[object Boolean]' : 'boolean'
    //类似上面那样
}
// 数据类型检测的公共方法
function toType(obj){
    if(obj == null){
        return obj + ''
    }
    //这里就是看看 你传进来的obj 是哪个 如果是obj 就去我们上面的映射表里去找到对应的值 如果不是就基于基本数据类型检测
    return typeof obj === 'object' || typeof obj === 'function'?
        class2type[toString.call(obj)] || 'object' : typeof obj
}
```

## 检测是否为数组或者类数组

```js
// 检测是否为数组或者类数组
function isArrayLike(obj) {
    // length:对象的length属性值或者是false
    // type:获取检测值的数据类型
    var length = !!obj && "length" in obj && obj.length,
        type = toType(obj);

    // 函数和window一定不是数据或者类数组（但是他们确实有length属性）
    if (isFunction(obj) || isWindow(obj)) {
        return false;
    }

    // type === "array"：数组
    // length === 0：我们认为其是一空的类数组集合
    // (length - 1) in obj：对于非空集合，我们认为只要最大索引在对象中，则证明索引是逐级递增的（不准确）
    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj;
}
```

## 检测是否为空对象

```js
// 验证是否为空对象：主要是看当前对象中是否存在私有属性
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        if (!obj.hasOwnProperty(name)) break;
        return false;
    }
    return true;
}
```

## 检测是否为纯粹的对象

```JS
function isPlainObject(obj) {
    var proto, Ctor;

    // 基于toString.call返回结果不是[object Object]则一定不是纯粹的对象
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    // 获取当前对象所属类的原型 let obj = {} obj.__proto__ === Object.prototype
    proto = getProto(obj);

    // Object.create(null)：创建一个空对象，但是没有__proto__
    if (!proto) return true;

    // Ctor：获取当前对象所属类的constructor
    // 纯粹对象的特点：直属类的原型一定是Object.prototype（DOM元素对象/自定义的实例对象...都不是）
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}
```

## jquery核心

### 挂载到window的过程

```js
// 入口是一个自调用函数 传送了两个参数   用来判断 你当前jq执行的环境
(function (global, factory) {
	"use strict";
    //第一个参数global 用来判断 你是浏览器执行
	if (typeof module === "object" && typeof module.exports === "object") {
        //如果你是node执行的 那么global就传进来的就是this(node 下的global 一个空对象)
		module.exports = global.document ? factory(global, true) :
			function (w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
                  //最有导出了一个函数 我们用require 去导入然后接收这个函数
				return factory(w);
			};
	} else {
        //如果是浏览器 那么这个global 就是window 
		factory(global);
	}

	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
    ........好多代码.......
    //这里做了$符号转让 比如我们引入了两个类库 一个zepot 他的 符号也是$ 第二个是jquery 符号也是$ 那么第二个引入的jq类库 会把 第一个 引入的zepot 类库的$覆盖掉 所以我们就要执行这个方法 把符号传让出去
    var _jQuery = window.jQuery,
		_$ = window.$;
	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}
		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}
		return jQuery;
	};
    //最后一步 判断我们的第二个参数   就可以把我们上面写的代码 都挂载到window上了
    if (typeof noGlobal === "undefined") {
		window.jQuery = window.$ = jQuery;
	}
}
```

```javascript
// 如下
<script src="zepot.js" > </script>   有$
<script src="jquery.js"> </script>   有$
//那么此时 第二个$ 肯定会把第一个$ 覆盖掉
//所以我们运行 
jQuery.noConflict()
//代码从上向下走  此时已经走完了 但是在走的过程中 我们发现$已经被zepot调用了  所以window.$就是zepot _$也是zepot


var _jQuery = window.jQuery,
    //把zepot的$ 保存到 _$ 上
		_$ = window.$;
	jQuery.noConflict = function (deep) {
        //   已经加载完毕了 此时jquery的$已经挂载到window上了
		if (window.$ === jQuery) {
            //那么此时 我们就让window.$ = _$(zepot)
			window.$ = _$;
		}
		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}
		return jQuery;
	};
    //最后一步 判断我们的第二个参数   就可以把我们上面写的代码 都挂载到window上了
    if (typeof noGlobal === "undefined") {
		window.jQuery = window.$ = jQuery;
	}
```

### 原型

```js
// 入口是一个自调用函数 传送了两个参数   用来判断 你当前jq执行的环境
(function (global, factory) {
	"use strict";
    //第一个参数global 用来判断 你是浏览器执行
	if (typeof module === "object" && typeof module.exports === "object") {
        //如果你是node执行的 那么global就传进来的就是this(node 下的global 一个空对象)
		module.exports = global.document ? factory(global, true) :
			function (w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
                  //最有导出了一个函数 我们用require 去导入然后接收这个函数
				return factory(w);
			};
	} else {
        //如果是浏览器 那么这个global 就是window 
		factory(global);
	}

	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
   //最开始的代码
    var version = "3.5.1",
        jQuery = function (selector, context){
            //当我们执行$的时候 就相当于创造了一个jquery的实例 只不过这个构造函数是 jQuery的上的init 方法  相当于把jQuery当成对象 执行了 他fn 上面的init 方法
            return new jQuery.fn.init(selector, context)
        }
    // 
    jQuery.fn = jQuery.prototype = {
        constructor:jQuery,
        jquery:version,
        length:0
        .......好多代码
    }
    //$()执行是创造了init的这类的一个实例 实例.__proto__ === init.prototype === jQuery.prototype 所以也可以说$()创造出来的是jQuery类的一个实例 => 把jQuery当作普通函数执行 也可以创造它的一个实例 这种模式叫做工厂模式  //主要是 在写的时候 不要在new 了 直接能当方法使用   
    var init = jQuery.fn.init = function (selector, context) { ...好多代码 }
    init.prototype = jQuery.fn
    
    
    
    //这里做了$符号转让 比如我们引入了两个类库 一个zepot 他的 符号也是$ 第二个是jquery 符号也是$ 那么第二个引入的jq类库 会把 第一个 引入的zepot 类库的$覆盖掉 所以我们就要执行这个方法 把符号传让出去
    var _jQuery = window.jQuery,
		_$ = window.$;
	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}
		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}
		return jQuery;
	};
    //最后一步 判断我们的第二个参数   就可以把我们上面写的代码 都挂载到window上了
    if (typeof noGlobal === "undefined") {
		window.jQuery = window.$ = jQuery;
	}
}
```

### 选择器

```js
// 入口是一个自调用函数 传送了两个参数   用来判断 你当前jq执行的环境
(function (global, factory) {
	"use strict";
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ? factory(global, true) :
			function (w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
				return factory(w);
			};
	} else {
		factory(global);
	}

})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
   //最开始的代码
    var version = "3.5.1",
        jQuery = function (selector, context){
            return new jQuery.fn.init(selector, context)
        }
    jQuery.fn = jQuery.prototype = {
        constructor:jQuery,
        jquery:version,
        length:0
         get: function (num) {
            // 把JQ类数组集合变为数组集合(Array的实例)
            if (num == null) {
                return Array.prototype.slice.call(this);
            }
            // 支持负数索引 这里的负数理解为倒数 获取倒数第一个 或者第二个
            return num < 0 ? this[num + this.length] : this[num];
        },
        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        // 传递一个数组，我们把其变为JQ实例
        pushStack: function (elems) {
            // this.constructor()：jQuery()，空集合(JQ实例)
            // 合并后的结果，既是一个JQ实例(集合)，也包含你传递进来的这些项的信息
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
        },
        each: function (callback) {
            // 调用原型上的each方法：核心本质也是调用工具类的each方法
            return jQuery.each(this, callback);
        },
        sort: [].sort
    }
    var rootjQuery = jQuery(document);
    var init = jQuery.fn.init = function (selector, context) { 
    	 var match, elem;
        // ""/null/undefined/false 如果你传的是这样写 那么就返回 jquery.fn.init这个函数(this)
        if (!selector) return this;
        //看看 你有没有传根 如果没传根就是我们的文档
        root = root || rootjQuery;
		//然后支持三种类型 第一个种是传个字符串 $(".box")
        // 第二种 是传一个DOM对象 $(body)
        // 第三种 就是传一个函数 $(function() {} )
        if (typeof selector === "string") {
            // 字符串
            //   + HTML结构字符串  创建一个DOM元素
            //   + 选择器字符串  获取页面中符合条件的元素
            /* if (selector[0] === "<" &&
                selector[selector.length - 1] === ">" &&
                selector.length >= 3) {} else {} */
            //...
        } else if (selector.nodeType) {
            // 原生DOM元素对象(JS内置方法获取的)：把DOM对象变为了一个类数组集合
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (isFunction(selector)) {
            // 函数 $(function(){}) <==> $(document).ready(function(){})
            // 等待页面中DOM结构加载完成(DOMContentLoaded)触发回调函数函数执行，触发点优先于window.onload(DOM结构及页面中所有资源都加载完才会触发执行)
            return root.ready !== undefined ?
                root.ready(selector) :
                selector(jQuery);
        }

        // 创造一个类数组集合
        return jQuery.makeArray(selector, this);
    }
    init.prototype = jQuery.fn
    var _jQuery = window.jQuery,
		_$ = window.$;
	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}
		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}
		return jQuery;
	};
    if (typeof noGlobal === "undefined") {
		window.jQuery = window.$ = jQuery;
	}
}
```

