'use strict';
const path = require('path');//路径模块
const utils = require('./utils');//对vue-loader进行css预编译一些提取的工具模块
const config = require('../config');
//config是对开发环境和生产环境的一系列不同参数的，路径等配置
const vueLoaderConfig = require('./vue-loader.conf');
//对vue-loader进行的配置:基础生产环境和开发环境

function resolve (dir) {
  return path.join(__dirname, '..', dir);
  //__dirname是build文件路径
  // ..代表再出去一层，就是文件的根路径
  // dir是文件夹名
}//生成相对于根目录的绝对路径，import时引入地址时方便填写
//eslint的规则
const createLintingRule = () => ({
  // 对.js和.vue结尾的文件进行eslint检查
  test: /\.(js|vue)$/,
  // 使用eslint-loader
  loader: 'eslint-loader',
  //在调用其他loader之前需要先调用这个规则进行代码风格的检查
  enforce: 'pre',
  // 需要进行eslint检查的文件的目录存在的地方
  include: [resolve('src'), resolve('test')],
  // eslint-loader配置过程中需要指定的选项
  options: {
    // 文件风格的检查的格式化程序，这里使用的是第三方的eslint-friendly-formatter
    formatter: require('eslint-friendly-formatter'),
    // 是否需要eslint输出警告信息
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  //context表示执行上下文，代表根目录
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'//入口文件
  },
  output: {
    path: config.build.assetsRoot,//把打包出来的文件路径放在根目录下的dist目录下
    filename: '[name].js',
    /*这个是用来打包名出的文件名
    会打包出来三个文件，1:自己的原代码文件，2:runtime文件，3:ventor文件
    每个文件打包出来的名字，就跟定义的chunkname一致*/
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
    //静态文件引用的根目录(生产环境or开发环境)
  },
  //resolve是用来对模块进行解析
  resolve: {
    extensions: ['.js', '.vue', '.json'],//对模块的后缀进行解析
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }//配置别名,定义一个入口位置(根目录下的src文件夹)
  },
  //加载器模块配置
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      //是否添加es规范检查,可在index.js里配置
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]//es6→es5:翻译哪些文件夹里的js文件
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,//小于1000kb的文件我们则可以转面base64
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        //对输出的内容地行地址转换，publicpath+/static/img/图片名+hash+图片后缀来进行返回
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // 这些选项用于配置polyfill或mock某些node.js全局变量和模块。
    // 这可以使最初为nodejs编写的代码可以在浏览器端运行
    //每个属性都是nodejs全局变量或模块的名称
    setImmediate: false,
    // false表示什么都不提供。如果获取此对象的代码，可能会因为获取不到此对象而触发ReferenceError错误
    // 设置成empty则表示提供一个空对象
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
