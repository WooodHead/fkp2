
let debug = Debug('init')

import Koa from 'koa'
import mount from 'koa-mount'
import convert from 'koa-convert'
import Bodyparser from 'koa-bodyparser'
// import session from 'koa-generic-session'
import session from 'koa-session-minimal'
// import SQLite3Store from 'koa-sqlite3-session'
// const redisStore = require('koa-redis')
import logger from 'koa-logger'
import cors from 'kcors'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import Hooker from './modules/hook'

global._ = require('lodash')
global.SAX = require('fkp-sax')
global.React = require('react')
global.ReactDomServer = require('react-dom/server')
global.Cache = require('./modules/cache')
global.Errors = require('libs/errors')
global.Hook = function(name){
  let cacheId = 'Hook_'+name
  return Cache.ifid(cacheId, ()=>{
    const hooker = new Hooker(name)
    Cache.set(cacheId, hooker)
    return hooker
  })
}
import localDB from './db/diskdb'
global.LocalDB = localDB


import ddbStore from './modules/diskdb-session'
import fkp from './fkp'
import socketio from './modules/wsocket'   //websocket
import statics from './modules/static'
import render from './modules/render'

const cwd = process.cwd()
const day5 = 5 * 24 * 60 * 60 * 1000
const staticOption = () => ({
  maxage: 1000 * 60 * 60 * 24 * 365
})

const app = new Koa()

export default async function init() {

  // global middlewares
  app.keys = ['agzgz gogogo']


  //get
  app.use(conditional())
  // add etags
  app.use(etag())

  //静态资源目录
	statics(app)

	// 渲染
	app.use(render())

  // app.use(mount('/_bc', serve(cwd + '/node_modules', staticOption())))

	// app.use(convert(session({
	// 	key: 'agzgz-',
	//   store: new SQLite3Store('../forsession1.db', {}),
  //   cookie: {
  //     maxage: null
  //   }
	// })))

	app.use(session({
		key: 'agzgz-',
	  // store: redisStore(),
    store: new ddbStore(),
    cookie: {
      maxage: null
    }
	}))

  // body解析
  app.use(Bodyparser())

  // 记录所用方式与时间
  app.use(logger())

  // 设置跨域
  app.use(cors())


  // fkp/router模块
  let server = socketio.init(app)  //global SIO = {on, emit, use}
  await fkp(app)
  socketio.run()

	app.on('error', async (err, ctx) => {
		logger.error('server error', err, ctx)
    debug(err.stack)
	})

  return server
}
