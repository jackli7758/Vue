'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');// 用于生成html文件的插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// 这个插件能够更好的在终端看到webpack运行时的错误和警告等信息。可以提升开发体验。
const portfinder = require('portfinder');// 查找一个未使用的端口

const HOST = process.env.HOST;// 获取host环境变量，用于配置开发环境域名
const PORT = process.env.PORT && Number(process.env.PORT);
// 获取post环境变量，用于配置开发环境时候的端口号
const devWebpackConfig = merge(baseWebpackConfig, {
  module: { // 为那些独立的css类型文件添加loader配置（没有写在vue文件的style标签中的样式）
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // 开发环境使用'eval-source-map'模式的source map,速度快
  devtool: config.dev.devtool,

  // 下面是对webpack-dev-server选项的基本配置
  // 我们可以在/config/index.js文件中进行自定义配置。
  devServer: {
    clientLogLevel: 'warning', // 用于配置在开发工具的控制台中显示的日志级别
    historyApiFallback: true,
    // 表示当使用html5的history api的时候，任意的404响应都需要被替代为index.html
    hot: true,// 启用webpack的热更新
    compress: true,// 使用gzip压缩
    host: HOST || config.dev.host,
    // 指定使用一个 host。默认是 localhost
    // 如果希望服务器外部可以访问(通过我们电脑的ip地址和端口号访问我们的应用)
    // 可以指定0.0.0.0
    port: PORT || config.dev.port,// 指定要监听请求的端口号
    open: config.dev.autoOpenBrowser,// 是否自动打开浏览器
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 当编译出现错误的时候，是否希望在浏览器中展示一个全屏的蒙层来展示错误信息
    publicPath: config.dev.assetsPublicPath,
    // 指定webpack-dev-server的根目录，这个目录下的所有的文件都是能直接通过浏览器访问的
    // 推荐和output.publicPath设置为一致(index.js)
    proxy: config.dev.proxyTable,
    // 配置代理，这样我们就可以跨域访问某些接口
    // 我们访问的接口，如果符合这个选项的配置，就会通过代理服务器转发我们的请求
    quiet: true,
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。
    // 来自 webpack 的错误或警告在控制台不可见。
      watchOptions: {// 与监视文件相关的控制选项。
      poll: config.dev.poll,// 如果这个选项为true，会以轮询的方式检查我们的文件的变动，效率不好
    }
  },
  plugins: [
    // 定义当前node环境为开发环境
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 启用热更新模块,记住，我们永远不要在生产环境中使用hmr
    new webpack.HotModuleReplacementPlugin(),
    // 这个插件的主要作用就是在热加载的时候直接返回更新文件的名称，而不是文件的id
    new webpack.NamedModulesPlugin(),
    // 使用这个插件可以在编译出错的时候来跳过输出阶段，这样可以确保输出资源不会包含错误。
    new webpack.NoEmitOnErrorsPlugin(),
    // 这个插件主要是生成一个html文件
    new HtmlWebpackPlugin({
      filename: 'index.html',// 生成的html文件的名称
      template: 'index.html', // 使用的模板的名称
      inject: true// 将所有的静态文件都插入到body文件的末尾
    }),
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 把获取到的端口号设置为环境变量PORT的值
      process.env.PORT = port;
      // 重新设置webpack-dev-server的端口的值
      devWebpackConfig.devServer.port = port;

      // 将FriendlyErrorsPlugin添加到webpack的配置文件中
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        // 编译成功时候的输出信息
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        // 当编译出错的时候，根据config.dev.notifyOnErrors(index.js)来确定是否需要在桌面右上角显示错误通知框
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }));
      // resolve我们的配置文件
      resolve(devWebpackConfig)
    }
  })
});
