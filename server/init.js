
let debug = Debug('init')

import Koa from 'koa'
import mount from 'koa-mount'
import convert from 'koa-convert'
import Bodyparser from 'koa-bodyparser'
// import session from 'koa-generic-session'
import session from 'koa-session-minimal'
import logger from 'koa-logger'
import cors from 'kcors'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import SQLite3Store from 'koa-sqlite3-session'

import fkp from './fkp'
import statics from './modules/static'
import route from './modules/route'
import mapper from './modules/mapper'
import render from './modules/render'
import router from './modules/route'


global._ = require('lodash')
global.SAX = require('fkp-sax')
global.React = require('react')
global.ReactDomServer = require('react-dom/server')
global.Cache = require('./modules/cache')
global.Fetch = require('./modules/fetch').default
global.Errors = require('libs/errors')
global.Promise2 = require('bluebird')


const cwd = process.cwd()
const day5 = 5 * 24 * 60 * 60 * 1000
const staticOption = () => ({
  maxage: 1000 * 60 * 60 * 24 * 365
})

const app = new Koa()

export default function init() {

  app.use(async (ctx, next) => {
    Fetch.init(ctx)   //初始化Fetch API
    await next()
  })

  // global middlewares
  app.keys = ['agzgz gogogo']

  // app.use(fkp())
  fkp(app)

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
	  store: new SQLite3Store('../forsession1.db', {}),
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

  //路由处理
  if (_.isArray(CONFIG.route.prefix)) {  //koa-router prefix，任何prefix均带有resful三层结构 :cat:title:id
    let prefix = CONFIG.route.prefix
    prefix.map((item)=>{
      if (item.indexOf('/')==0) router(app, mapper, item)
    })
  }
  router(app, mapper)

	app.on('error', async (err, ctx) => {
		logger.error('server error', err, ctx)
    debug(err.stack)
	})

  return app
}
