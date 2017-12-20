'use strict';
require('./check-versions')();// 检查npm和node的版本

process.env.NODE_ENV = 'production';

const ora = require('ora');
// 实现node.js 命令行环境的 loading效果， 和显示各种状态的图标等
const rm = require('rimraf');// 用来删除文件的模块
const path = require('path');
const chalk = require('chalk');// 引入显示终端颜色模块
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
// 引入webpack在production环境下的配置文件

const spinner = ora('building for production...');
spinner.start();
// 删除打包目标目录下的文件
//rm这个模块是用来清除之前的打包文件，因为在vue-cli中每次打包会生成不同的hash,每次打包
// 都会生成新的文件，那就不对了，我们要复盖原先的文件，因为hash不同复盖不了，所以要清除
//rm()里面的路径一定要是绝对路径。相对路径不会删除成功的
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err; // 进行打包
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({//打包成功信息格式化
      colors: true,//让打包的时候有颜色
      modules: false,//去掉内置模块信息
      children: false, //去掉子模块
      chunks: false,//增加包信息
      chunkModules: false//去除包里内置模块的信息
    }) + '\n\n');
    // 如果打包出现错误
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1)
    }
    // 打包完成
    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
});
