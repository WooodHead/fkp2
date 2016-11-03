require('babel-core/register')
require("babel-polyfill")

let D = require('debug')
global.Debug = D

try {
  process.env.env = 'default'
  var args = process.argv.splice(2); //取得命令行参数
  if (args.length){
    if (args[1]){
      if (['dev', 'pro'].indexOf(args[0])>-1) process.env.whichMode = args[0]
      else throw new Error('启动模式错误')
      if (args[1].indexOf('env_')>-1) process.env.env = args[1]
      else throw new Error('启用了非法配置文件，配置文件必须以"env_"开头')
    }
    else {
      if (['dev', 'pro'].indexOf(args[0])>-1) process.env.whichMode = args[0]
      else {
        if (args[0].indexOf('env_')>-1){
          process.env.NODE_ENV = 'production'
          process.env.whichMode = 'pro'
          process.env.env = args[0]
        }
        else throw new Error('启用了非法配置文件，配置文件必须以"env_"开头')
      }
    }
  } else {
    process.env.whichMode = 'pro'
  }
  require('app-module-path').addPath(__dirname)
  global.CONFIG = require('./config')(process.env.env)   // 全局config
  require("./server/app")
} catch (e) {
  console.error('Error:'+e)
}
