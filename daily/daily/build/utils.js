//主要用于生成css loader和style loader的一些方法
'use strict';
const path = require('path');//路径模块
const config = require('../config');//引入环境配置文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');//提取css的插件
const packageConfig = require('../package.json');//加载package.json文件
//生成编译输出的二级目录
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  //path.posix是path模块跨平台的实现
  return path.posix.join(assetsSubDirectory, _path)
}
//统一处理各种css类型的打包问题
exports.cssLoaders = function (options) {
  options = options || {}
  //打包css模块
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };
  //编译postcss平台模块
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  //创建加载器字符串,根据指定的loader使用extract text plugin
  function generateLoaders (loader, loaderOptions) {
    //通过usePostCSS 来标明是否使用了postcss
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
    //如果指定了具体的loader的参数名称
    if (loader) {
      loaders.push({
        //loader加载器的名称
        loader: loader + '-loader',
        // 对应的加载器的配置对象
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // 如果明确指定了需要提取静态文件，则使用
    // ExtractTextPlugin.extract({})来包裹我们的各种css处理器。
    if (options.extract) {
      return ExtractTextPlugin.extract({
        // fallback这个选项我们可以这样理解
        // webpack默认会按照loaders中的加载器从右向左调用编译各种css类型文件。如果一切顺利，在loaders中的
        // 各个加载器运行结束之后就会把css文件导入到规定的文件中去，如果不顺利，则继续使用vue-style-loader来处理
        // css文件
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      //如果没有提取行为，则最后再使用vue-style-loader处理css
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
};

// 为那些独立的style文件创建加载器配置(.vue文件外的style文件)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
//node-notifier是一个跨平台的包，以类似浏览器的通知的形式展示信息
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    //只展示错误的信息
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();
    // 需要展示的错误信息的内容
    notifier.notify({
      // 通知的标题
      title: packageConfig.name,
      // 通知的主体内容
      message: severity + ': ' + error.name,
      // 副标题
      subtitle: filename || '',
      //通知展示的icon
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
