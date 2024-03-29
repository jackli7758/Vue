'use strict';
const utils = require('./utils');
const config = require('../config');
const isProduction = process.env.NODE_ENV === 'production';//判断是否为生产环境
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;
//根据不同的环境，引入不同的source map配置文件
module.exports = {
  // vue文件中的css loader配置
  loaders: utils.cssLoaders({
    // 生产环境下就会把css文件抽取到一个独立的文件中
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  // css source map文件的配置
  cssSourceMap: sourceMapEnabled,
  // css source map文件缓存控制变量
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
