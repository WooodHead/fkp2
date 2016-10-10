require('babel-core/register');
require("babel-polyfill");


// var args = process.argv.splice(2); //取得命令行参数
// if( args[0] && (args[0] === 'test' ||
// 	args[0].indexOf('env_')>-1 ) ) {
// 		process.env.whereIs = 'pro'
// 		process.env.env = args[0]
// }
// else if( args[1] && (args[1] === 'test' ||
// 	args[1].indexOf('env_')>-1) ) {
// 		process.env.whereIs = args[0]
// 		process.env.env = args[1]
// }
//
// if(process.env.whereIs.indexOf('dev')>-1) {
//     let webpackDevMiddleware = require('koa-webpack-dev-middleware')
//     let webpack = require('webpack')
//     let webpackConf = require('../configs/webpack-dev.config')
//     let compiler = webpack(webpackConf)
//
//     // 为使用Koa做服务器配置koa-webpack-dev-middleware
//     app.use(webpackDevMiddleware(compiler, webpackConf.devServer))
//
//     // 为实现HMR配置webpack-hot-middleware
//     let hotMiddleware = require("webpack-hot-middleware")(compiler);
//     // Koa对webpack-hot-middleware做适配
//     app.use(function* (next) {
//       yield hotMiddleware.bind(null, this.req, this.res);
//       yield next;
//     })
// }

require("./server/app.js")
