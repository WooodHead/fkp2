/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path')
var url = require('url')
var Router = require('koa-router')
var libs = require('libs')
var md5 = require('blueimp-md5')
import control from '../control'
let debug = Debug('modules:route')


/**
 * 过滤渲染文件
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {boleean}
**/
function filterRendeFile(pms, url){
    let rjson = path.parse(url)
    let rtn = false;
    let ext = rjson.ext;
    let cat = pms.cat;

    let exts = ['.css','.js','.swf','.jpg','.jpeg','.png','.bmp','.ico'];
    let tempExts = ['.html','.shtml'];
    let noPassCat = ['css','js','img','imgs','image','images'];

    if(!ext) rtn = true;

    if(_.indexOf(tempExts, ext) > -1) rtn = true;
    if(_.indexOf(noPassCat, cat) > -1) rtn = false;

    return rtn;
}


/**
 * 生成路由标签
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {string} route tag, like 'index' , 'h5/lazypage'
**/
function createTempPath2(ctx){
  try {
    let params = ctx.params
    let _url = ctx.url
    let ctxurl = ctx.route_url

    if (_url.indexOf('?')>-1){
      _url = _url.slice(0, _url.indexOf('?'))
      ctxurl = ctxurl.slice(0, ctxurl.indexOf('?'))
    }
    let rjson = path.parse(_url)
    let route = false
    let cat = params.cat||'', title = params.title||'', id = params.id||'';
    let gtpy = libs.objtypeof;

    if(id){
      gtpy(id)==='number'
      ? route = title
      ? cat+'/'+title
      : cat
      : route = cat+'/'+title +'/' + id
    }

    else if(title){
      title = title.replace(rjson.ext,'');
      route = gtpy(title)==='number' ? cat : cat+'/'+title
    }

    else if(cat){
      cat = cat.replace(rjson.ext,'');
      route = gtpy(cat)==='number' ? CONFIG.root||'index' : cat
    }

    route = CONFIG.root||'index'
    if (ctxurl && route !== ctxurl) route = ctxurl
    return route

  } catch (e) {
    debug('createTempPath2: '+e)
  }
}

function controlPages() {
  const controlPagePath = path.join('server/pages/')
  const _id = controlPagePath
  let ctrlFiles = []
  return Cache.ifid( _id, ()=> new Promise((res,rej)=>{
      return function getCtrlFiles(dir){
        fs.readdir(dir, (err, data) => {
          if(err) throw err
          data.map( file => {
            const _path = path.join(dir, file)
            const stat = fs.statSync(_path)
            if (stat && stat.isDirectory()) return getCtrlFiles(_path)
            const okPath = _path.replace(controlPagePath, '')
            ctrlFiles.push(path.join(okPath))
          }) // end map
          Cache.set(_id, ctrlFiles)
          res(ctrlFiles)
        })
      }(controlPagePath)
    })
  )
}

/**
 * 路由分配
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function init(app, mapper, prefix='') {
  let _controlPages = await controlPages(prefix)
  const router = new Router({prefix: prefix})
  router
  .get('/', forBetter)
  .get('/:cat', forBetter)
  .get('/:cat/:title', forBetter)
  .get('/:cat/:title/:id', forBetter)
  .post('/:cat', forBetter)
  .post('/:cat/:title', forBetter)
  .post('/:cat/:title/:id', forBetter)

  app.use(router.routes())
  app.use(router.allowedMethods())

  async function forBetter(ctx, next) {
    try {
      if (ctx.params.cat === 'js' || ctx.params.cat === 'css' || ctx.params.cat === 'images') return
      ctx.local = url.parse(ctx.url, true)
      let _ext = path.extname(ctx.url)
      ctx.route_url = ctx.url.slice(1).replace(_ext, '')
      if (!ctx.route_url) ctx.route_url = ''
      return await createRoute(ctx, mapper, _controlPages)
    } catch (e) {
      debug('forBetter: '+e)
    }
  }
}

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function createRoute(ctx, _mapper, ctrlPages){
  debug('start createRoute');
  try {
    let isRender = filterRendeFile(ctx.params, ctx.url)
    let route = isRender ? createTempPath2(ctx) : false
    if (!isRender || !route) return ctx.redirect('404')
    ctx.fkproute = route
    let pageData = createMapper(ctx, _mapper, route)
    if (!_mapper || !pageData) return ctx.redirect('404')
    return distribute.call(ctx, route, pageData, ctrlPages)

  } catch (e) {
    debug('createRoute: '+ e)
  }
}

function createMapper(ctx, mapper, route){
  if (!mapper) return false
  let pageData = {
    //静态资源
    commonjs: mapper.commonJs.common||'common.js',   //公共css
    commoncss: mapper.commonCss.common||'common.css', //公共js
    pagejs: '',
    pagecss: '',
    pagedata: {}
  }
  //静态资源初始化
  if (mapper.pageCss[route]) pageData.pagecss = mapper.pageCss[route]
  if (mapper.pageJs[route]) pageData.pagejs = mapper.pageJs[route]
  return pageData
}

async function distribute(route, pageData, ctrlPages){
  debug('start distribute');
  let pdata = await controler(this, route, pageData, ctrlPages)
  return await dealWithPageData(this, pdata[0], route, pdata[1])
}

async function controler(ctx, route, pageData, ctrlPages){
  debug('start controler');
  try {
    let passAccess = false
    if (ctrlPages.indexOf(route+'.js')>-1){
      let ctrl = control(route, ctx, pageData)
      if (ctrl.initStat){
        pageData = await ctrl.run(ctx)
      } else {
        let controlConfig = require('../../pages/'+route).getData.call(ctx, pageData)
        pageData = await ctrl.run(ctx, controlConfig)
      }
    } else{
      debug('pages/'+route+' 配置文件不存在');
      passAccess = true
      let apilist = Fetch.apilist
      if( apilist.list[route] || apilist.weixin[route] || route === 'redirect' ){
        pageData = {}
        let ctrl = control(route, ctx, pageData)
        if (ctrl.initStat){
          pageData = await ctrl.run(ctx)
        } else {
          let controlConfig = require('./passaccess').getData.call(ctx, pageData)
          pageData = await ctrl.run(ctx, controlConfig)
        }
      }
    }
    return [pageData, passAccess]
  } catch (e) {
    console.log(e);
    debug('controler: '+e)
  }

}

// dealwith the data from controlPage
async function dealWithPageData(ctx, data, route, passAccess){
  debug('start dealWithPageData -- render');
  try {
    switch (ctx.method) {
      case 'GET':
        try {
          let getStat = ctx.local.query._stat_
          if (getStat && getStat === 'DATA' ) return ctx.body = data
          return await ctx.render(route, data)
        } catch (e) {
          return await ctx.render('404')
        }
      break;
      case 'POST':
        return ctx.body = data
      break;
    }
  } catch (e) {
    debug('dealWithPageData: '+e)
  }
}

module.exports = init
