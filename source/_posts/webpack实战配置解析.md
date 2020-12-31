---
title: Webpack实战配置解析
date: 2019-03-05
updated: 2019-06-03
tags: Webpack
categories: webpack
keywords: Webpack
description: Webpack实战配置解析
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
# webpack实战配置解析

```JS
1.首先我们要有一个webpack.base.conf.js的文件 这个文件主要用来存放我们的基础配置 比如你开发环境和生产环境还有测试环境都会用到webpack配置 (build文件夹下的webpack.base.conf.js)
2.其次我们会有一个index.js文件 里面主要用于写一些不同环境的配置变量 比如你dev开发环境下的跨域配置啊 静态资源存放的路径啊 还有你请求的不同环境的变量啊 等等(config文件夹下的index.js)
3.然后我们会针对于不同的环境 比如生产环境啊 开发环境啊 测试环境啊 准上线环境啊 写不同的测试文件 然后把我们的webpack.base.conf.js 合并过来 (这些文件都在build文件夹下)
4.然后我们还会针对于不同的环境变量 写不同的URL请求 文件 比如你的生产环境 和开发环境的请求路径肯定不是一个 所以我们要写几个文件 方便我们自己配置 (这些文件 都在config文件夹下)
5.参考文档 https://blog.csdn.net/hongchh/article/details/55113751/
```

## build \ webpack.base.conf.js

```JS
//webpack.conf.js文件
//引入路径模块
var path = require('path')
//引入工具函数 主要是为了配置css之类的loader 为了把他们单独达成一个css文件  详见util.js文件
var utils = require('./utils')
//引入webpack
var webpack = require('webpack')
//引入config文件夹下的index文件 这个文件主要存放这一些不同环境的配置变量 详细如下
var config = require('../config')
//vue-loader 后期自己集成了 我们之间可以npm包可以直接使用
var vueLoaderConfig = require('./vue-loader.conf')
//工具函数 编写绝对路径
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}
//导出
module.exports = {
    //入口文件 这里的 babel-polyfill 主要是为了兼容低版本的IE
	entry: {
		app: ['babel-polyfill', './src/main.js']
	},
    //出口文件 
	output: {
        //存放打包后的文件路径 这里用了config文件夹中的index文件 
		path: config.online.assetsRoot,
        //名称
		filename: '[name].js',
        //主要涉及到一些静态资源
		publicPath: process.env.NODE_ENV === 'production' ?
			config.online.assetsPublicPath : config.dev.assetsPublicPath
	},
    //详细见webpack.resolve解析
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		modules: [
			resolve('src'),
			resolve('node_modules')
		],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'src': resolve('src'),
			'assets': resolve('src/assets'),
			'components': resolve('src/components'),
			'styles': resolve('src/assets/styles')
		}
	},
    //Loader的解析了 详细见文档
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
                 //只有在如下文件目录里的js文件我们才用babel-loader去解析
				include: [
				resolve('src'), 
				resolve('test'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/packages'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src/mixins/emitter.js'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src/utils/merge.js'),
				resolve('/node_modules/_element-ui@2.4.8@element-ui/src/utils/util.js')
			]
				
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
	plugins: [
        //不需要在impot引入了 直接使用即可
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'windows.jQuery': 'jquery'
		})
	]
}
```

## webpack.resolve

```JS
resolve.alias 把特定引入的路径设置成一个别名
resolve:{
  alias:{
    components: './src/components/'
  }
}
当你通过  import Button from 'components/button' 导入时，实际上被 alias 等价替换成了  import Button from './src/components/button'
```

```JS
resolve.extensions 只要是这些后缀的文件 都不需要在写后缀了
resolve: {
	extensions: ['.js', '.vue', '.json'],
},
当你通过 import wzButton from './component/treeNode.vue' 的时候 可以写成 import wzButton from './component/treeNode.vue' 
```

```JS
resolve.modules 去哪些目录下寻找第三方模块，默认是只会去  node_modules  目录下寻找
resolve: {
    modules: [
        resolve('src'),
        resolve('node_modules')
    ],
},
```

## build \ util.js

```JS
//util.js文件 主要是写入了一些功能的函数 让我们加载loader的时候代码写的更简单一些
var path = require('path')
var config = require('../config')
//我们的css在打包的时候也会被打包到js文件中 但是我们一般都是通过link标签引入的 所以这个插件是用来把css代码抽离的
//详细见如下文档 https://blog.csdn.net/weixin_41134409/article/details/88416356
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.online.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: sourceLoader,
        fallback: 'vue-style-loader',
        publicPath: '../../'
      })
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

```

## config \ index.js

```JS
//主要功能就是编写了 不同开发环境的 环境变量
// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    online: {
        //这里主要是引用了不同的环境变量 详细见 config文件夹下的配置文件 主要设置了不同的环境变量 和请求基准地址
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        host: '0.0.0.0',
        port: 8081,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api':{
                target:'http://gw-dev.jiangtai.com/safety-man',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        },
        cssSourceMap: false
    },
    test:{
        env: require('./test.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report

    },
    pre:{
        env: require('./pre.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report

    },
    start: {
        env: require('./devBuild.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
}

```

## config \ dev.env.js 、devBuild.env.js 、pre.env.js 、prod.env.js 、test.env.js

```JS
//这些文件 主要是设置了不同的环境变量 和 不同的请求 当我们运行不同的命令的时候 可以通过这些去设置不同的变量 来读取不同的配置文件 我们在node里有个一个全局变量 process.env 但是你往里面添加不了不同的变量属性 可以cross-env包去设置 这里我们使用的别的方法 所以没有安装cross-env
```

```JS
// dev.env.js 
var merge = require('webpack-merge')
//引入了生产模式下的环境变量文件
var prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"http://gw-dev.jiangtai.com/safety-man"',
})
//prod.env.js 下面是生产环境下的环境变量
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT:'"http://gw.jiangtai.com/safety-man"',
}
//其余的都是这个模式
```

## build \ webpack.dev.conf.js

```JS
//开发环境时的配置文件
//css文件 其中里面又一个 插件可以让你的js和css代码分离出两个模块 这样css代码就不会被打包到js里
var utils = require('./utils')
var webpack = require('webpack')
//不同环境的变量 参考如上
var config = require('../config')
var path = require('path')
//合并的插件 可以把你的webpack.base.conf.js的代码合并过来
var merge = require('webpack-merge')
//引入了你的webpack.base.conf.js 基本配置
var baseWebpackConfig = require('./webpack.base.conf')
//html模板文件 存放在内存中 可以热更新
var HtmlWebpackPlugin = require('html-webpack-plugin')
//友好的错误提示文件 比如当代码出错的时候可以映射到浏览器上
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
// build/dev-client 这个文件 主要里面是一些热更新的方法 这个功能主要是处理了热更新
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  //这个意思就是我们原本的webpack.base.conf.js的entry 是 app:{['babel-polyfill', './src/main.js']}
  //处理完之后  webpack.base.conf.js就变成了 app:{['./build/dev-client','babel-polyfill', './src/main.js']} 这样 入口文件解析的时候就会先去./build/dev-client.js文件执行里面的代码
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  //调试的 如果代码出错了 可以快速定位到错误
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    //这个就是让你不同的环境的变量可以加载到node的 process.env 这个全局变量上 当我们用json的脚本启动的时候可以做判断 他去执行哪个文件 
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    //热更新模块
    new webpack.HotModuleReplacementPlugin(),
    //在编译的时候 如果出现错误 可以跳过 最后在提示
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: path.resolve('./favicon.ico'),
      inject: true
    }),
    //友好的错误提示文件 比如当代码出错的时候可以映射到浏览器上
    new FriendlyErrorsPlugin()
  ]
})
```

## build \ dev-client.js

```JS
/* eslint-disable */
require('eventsource-polyfill')
//主要是用来处理热更新方面的
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})

```



## build \ webpack.prod.conf.js

```JS
//生产环境时配置文件
var path = require('path')
//css文件 其中里面又一个 插件可以让你的js和css代码分离出两个模块 这样css代码就不会被打包到js里
var utils = require('./utils')
var webpack = require('webpack')
//不同环境的变量 参考如上
var config = require('../config')
var merge = require('webpack-merge')
//我们的基础配置
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
//抽离css文件的插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var env = config.online.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.online.productionSourceMap,
      extract: true
    })
  },
  devtool: config.online.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.online.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    //主要用于压缩代码  
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.online.index,
      template: 'index.html',
      favicon: path.resolve('./favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    //主要是用来提取第三方库和公共模块，避免首屏加载的bundle文件或者按需加载的bundle文件体积过大，从而导致加载时     间过长。
    //详见文档 https://segmentfault.com/a/1190000012828879  
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})

if (config.online.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.online.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.online.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
//这里导出很重要  我们一会在编写启动文件的时候 会用到
module.exports = webpackConfig
```

## build \ webpack.pre.conf.js

```JS
//webpack.pre.conf.js文件 准上线 详细注解参考如上
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var env = config.pre.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.pre.productionSourceMap,
      extract: true
    })
  },
  devtool: config.pre.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.pre.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.pre.index,
      template: 'index.html',
      favicon: path.resolve('./favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})

if (config.pre.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      pre: new RegExp(
        '\\.(' +
        config.pre.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.pre.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
//这里导出很重要  我们一会在编写启动文件的时候 会用到
module.exports = webpackConfig
```

## build \ webpack.test.conf.js

```JS
//测试环境时的配置
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var env = config.test.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.test.productionSourceMap,
      extract: true
    })
  },
  devtool: config.test.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.test.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.test.index,
      template: 'index.html',
      favicon: path.resolve('./favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})

if (config.test.productionGzip) {
  //主要是减少打包后的体积
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.test.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.test.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}
//这里导出很重要  我们一会在编写启动文件的时候 会用到
module.exports = webpackConfig
```

## build \ webpack.devBuild.conf

```JS
//开发环境打包时的配置
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var env = config.start.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.start.productionSourceMap,
      extract: true
    })
  },
  devtool: config.start.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.start.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.start.index,
      template: 'index.html',
      favicon: path.resolve('./favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})

if (config.start.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.start.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.start.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```

## build \ webpack.dll.conf.js

```JS
//动态链接库 详细见 官方文档 比如们每次要打包的时候都要打包第三方的文件 如果我使用了动态链接库 就可以不用打包了
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['vue/dist/vue.common.js','vue-router', 'babel-polyfill','axios']
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
};
//具体的还要参考相关文档
```

# 启动文件

```JS
1.以上的配置文件我们都已经写好了 接下来我们就要用脚本启动文件
2.但是当我们启动的时候 希望在控制台上会有一些样式 以及提示 所以我们需要编写单独的启动文件 然后把我们的配置文件塞到我们的启动文件里
3.我们的不同环境的启动文件 都会执行一个check-versions.js 主要是来判断一下我们的当前版本和JSON版本符合不符合
```

## build \ check-versions.js

```js
检查node和npm的版本、引入相关插件和配置
webpack对源码进行编译打包并返回compiler对象
创建express服务器
配置开发中间件（webpack-dev-middleware）和热重载中间件（webpack-hot-middleware）
挂载代理服务和中间件
配置静态资源
启动服务器监听特定端口（8080）
自动打开浏览器并打开特定网址（localhost:8080）
————————————————
版权声明：本文为CSDN博主「去门口罚站」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/hongchh/article/details/55113751/
```



```JS
//在我们的每个启动文件之前 都会先执行这个文件里面的代码 主要是用来检查node + npm 版本
//控制台输出的时候不同颜色的文字的模块
var chalk = require('chalk')
//用来控制npm的版本
var semver = require('semver')
//把你的json文件引入进来 因为这里有你需要的版本信息
var packageConfig = require('../package.json')
//不太熟悉 可能主要是用js代码同步执行一个cmd的命令，并且对返回的结果执行toString（）和trim()方法
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}
//一下就是一些判断代码了 主要是就是判断 你当前的版本 和你的json中的版本 符合不符合 然后会出现各种提示
var versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
  },
  {
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  }
]

module.exports = function () {
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}

```

## build \ dev-server.js

```JS
//dev环境下的启动文件 
//检查版本信息
require('./check-versions')()
//引入不同环境变量 的index.js文件
var config = require('../config')
//如果我没有环境变量 我就赋值一下
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
// 打开像网站、文件、可执行文件之类的功能  指定网站打开的模块
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
//配置代理的 主要是用于跨域
var proxyMiddleware = require('http-proxy-middleware')
//读取了dev的打包配置
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
//设置了端口号 
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
//师傅自动打开浏览器
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
//dev下跨域代理的设置
var proxyTable = config.dev.proxyTable
//启动后台
var app = express()
var compiler = webpack(webpackConfig)
//webpack-dev-middleware,作用就是，生成一个与webpack的compiler绑定的中间件，然后在express启动的服务app中调用这个中间件。
//详见 https://www.jianshu.com/p/1a7653ced053
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})

```

## build \ build.js

```JS
1.打包文件生产模式
2.loading动画
3.删除目标文件夹
4.执行webpack构建
5.输出信息
```

```JS
// https://github.com/shelljs/shelljs
require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for online...')
spinner.start()

var assetsPath = path.join(config.online.assetsRoot, config.online.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.config.silent = false

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})

```

```JS
//如上还有一些测试 都跟上面雷同 具体这里不在编写
```

# package.json文件

```JS
1.主要定义了我们执行命令所需要进行的脚本 执行哪个打包文件
```

```JS
{
  "name": "manage-system",
  "version": "2.1.0",
  "description": "基于Vue.js 2.x系列 + element-ui 大平台后台管理",
  "author": "quweina",
  "private": true,
   //这就是我们执行命令需要启动的脚本   
  "scripts": {
    "dev": "node build/dev-server.js",
    "start": "node build/devBuild.js",
    "test": "node build/testBuild.js",
    "pre": "node build/preBuild.js",
    "online": "node build/build.js"
  },
  "dependencies": {
    //略
  },
  "devDependencies": {
  	//略
  },
  "engines": {
    "node": ">= 4.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}

```

