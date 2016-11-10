/**
 * Module dependencies.
 */
var fs = require('fs');
var Path = require('path')
var Url = require('url')
var Router = require('koa-router')
var libs = require('libs')
var md5 = require('blueimp-md5')
import control from './control'
let debug = Debug('modules:route')
let makeRoute = require('./makeroute').default

/**
 * 过滤渲染文件
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {boleean}
**/
function filterRendeFile(pms, url){
    let rjson = Path.parse(url)
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


function controlPages() {
  const controlPagePath = Path.join('server/pages/')
  const _id = controlPagePath
  let ctrlFiles = []
  return Cache.ifid( _id, ()=> new Promise((res,rej)=>{
      return function getCtrlFiles(dir){
        fs.readdir(dir, (err, data) => {
          if(err) throw err
          data.map( file => {
            const _path = Path.join(dir, file)
            const stat = fs.statSync(_path)
            if (stat && stat.isDirectory()) return getCtrlFiles(_path)
            const okPath = _path.replace(controlPagePath, '')
            ctrlFiles.push(Path.join(okPath))
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
async function init(app, prefix='', options) {
  let _controlPages = await controlPages()
  const router = prefix ? new Router({prefix: prefix}) : new Router()
  const routeParam = [
    '/',
    '/:cat',
    '/:cat/:title',
    '/:cat/:title/:id'
  ]
  if (options && _.isPlainObject(options)) {
    let customControl = false
    if (options.customControl) {
      customControl = options.customControl
    }
    _.map(options, (item, key) => {
      if (_.includes(['get', 'post', 'put', 'del'], key)) {
        if (typeof item == 'string') item = [item]
        if (!Array.isArray(item)) return
        item.map((rt)=>{
          if (key!='get' && rt != '/' && rt.indexOf('p1')==-1) {
            router[key](rt, customControl||forBetter)
          } else {
            router[key](rt, customControl||forBetter)
          }
        })
      } else {
        routeParam.map((_path)=>{
          router.get(_path, customControl||forBetter)
          if (_path!='/') {
            router.post(_path, customControl||forBetter)
          }
        })
      }
    })
  } else {
    routeParam.map((item)=>{
      router.get(item, forBetter)
      if (item!='/') {
        router.post(item, forBetter)
      }
    })
  }

  app.use(router.routes())
  app.use(router.allowedMethods())

  async function forBetter(ctx, next) {
    try {
      let ignoreStacic = ['/css/', '/js/', '/images/', '/img/']
      if (ignoreStacic.indexOf(ctx.url)>-1) return
      ctx.local = Url.parse(ctx.url, true)
      let _ext = Path.extname(ctx.url)
      ctx.route_url = ctx.url.slice(1).replace(_ext, '')
      if (!ctx.route_url) ctx.route_url = ''
      return await createRoute.call(router, ctx, ctx.fkp.staticMapper, _controlPages)
    } catch (e) {
      debug('forBetter: '+e.message)
      console.log(e.stack)
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
    let route = isRender ? makeRoute(ctx) : false
    if (!isRender || !route) throw 'route配置不正确'
    ctx.fkproute = route
    let pageData = createMapper(ctx, _mapper, route, this)
    if (!_mapper || !pageData) throw 'mapper数据不正确'
    return distribute.call(ctx, route, pageData, ctrlPages, this)

  } catch (e) {
    debug('createRoute: '+ e)
    console.log(e);
    return ctx.redirect('404')
  }
}

function createMapper(ctx, mapper, route, routerInstance){
  let tmpletStatic = (src, type) => {
    if (type == 'js') {
      return '<script type="text/javascript" src="/js/'+src+'" ></script>'
    }
    if (type == 'css') {
      return '<link rel="stylesheet" href="/css/'+src+'" />'
    }
  }

  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/')==0) routerPrefix = routerPrefix.replace('/','')
  if (!mapper) return false
  let pageData = {
    //静态资源
    commonjs: tmpletStatic((mapper.commonJs.common||'common.js'), 'js'),   //公共css
    commoncss: tmpletStatic((mapper.commonCss.common||'common.css'), 'css'), //公共js
    pagejs: '',
    pagecss: '',
    pagedata: {}
  }
  //静态资源初始化
  if(mapper.pageCss[route]) pageData.pagecss = tmpletStatic(mapper.pageCss[route], 'css')
  if (mapper.pageJs[route]) pageData.pagejs = tmpletStatic(mapper.pageJs[route], 'js')

  let _route = route
  if (routerPrefix) {
    _route = routerPrefix
    if (mapper.pageCss[_route]) pageData.pagecss = tmpletStatic(mapper.pageCss[_route], 'css')
    if (mapper.pageJs[_route]) pageData.pagejs = tmpletStatic(mapper.pageJs[_route], 'js')
  }

  return pageData
}

async function distribute(route, pageData, ctrlPages, routerInstance){
  debug('start distribute');
  let pdata = await controler(this, route, pageData, ctrlPages, routerInstance)
  return await dealWithPageData(this, pdata[0], pdata[1])
}


// match的control文件，并返回数据
async function getctrlData(_path, route, ctx, _pageData, ctrl){
  let _names = []
  ctrl.set('route', route)
  if (Array.isArray(_path)) {
    for (let _filename of _path) {
      _filename = Path.resolve(__dirname, _filename+'.js')
      let _stat = await ctx.fkp.fileexist(_filename)
      if (_stat && _stat.isFile()) _names.push(_filename)
    }
  }
  if (_names.length) {
    let controlConfig = require(_names[0]).getData.call(ctx, _pageData)
    _pageData = await ctrl.run(ctx, controlConfig)
  } else {
    _pageData = false
  }
  return _pageData
}

async function controler(ctx, route, pageData, ctrlPages, routerInstance){
  debug('start controler');
  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/')==0) routerPrefix = routerPrefix.replace('/','')

  try {
    let ctrl = control(route, ctx, pageData)
    let passAccess = false
    if (ctrl.initStat){
      pageData = await ctrl.run(ctx)
      route = ctrl.store.route || route
    } else {

      let xData = false
      // 根据route匹配到control文件+三层路由
      if (ctrlPages.indexOf(route+'.js')>-1){
        xData = await getctrlData(['../../pages/'+route], route, ctx, pageData, ctrl)
      }
      // 根据prefix匹配到control文件+三层路由
      else if (routerPrefix) {
        route = routerPrefix
        let prefixIndexFile =  Path.join('../../pages', routerPrefix, '/index')
        let prefixCatFile =  Path.join('../../pages', routerPrefix, ctx.params.cat||'')
        xData = await getctrlData([prefixIndexFile,prefixCatFile], route, ctx, pageData, ctrl)
      }
      // pages根目录+三层路由
      else {
        let paramsCatFile =  Path.join('../../pages', ctx.params.cat)
        route = ctx.params.cat
        xData = await getctrlData([paramsCatFile], route, ctx, pageData, ctrl)
      }
      // 根据 Fetch.apilist 匹配到api接口，从远程借口拿去数据
      if (!xData) {
        debug('pages/'+route+' 配置文件不存在')
        let apilist = Fetch.apilist
        if( apilist.list[route] || apilist.weixin[route] || route === 'redirect' ){
          passAccess = true
          xData = await getctrlData(['./passaccess'], route, ctx, pageData, ctrl)
        } else {
          xData = {nomatch: true}
        }
      }
      if (passAccess) pageData = xData
    }
    pageData = SAX.emit('pageData', pageData)
    return [pageData, route]
  } catch (e) {
    console.log(e.stack);
    debug(e.stack)
  }
}

// dealwith the data from controlPage
async function dealWithPageData(ctx, data, route){
  debug('start dealWithPageData -- render');
  try {
    switch (ctx.method) {
      case 'GET':
        try {
          let getStat = ctx.local.query._stat_
          if (getStat && getStat === 'DATA' ) return ctx.body = data
          if (data && data.nomatch) throw new Error('你访问的页面/api不存在')
          return await ctx.render(route, data)
        } catch (e) {
          debug(e)
          return await ctx.render('404')
        }
      case 'POST':
        return ctx.body = data
    }
  } catch (e) {
    debug('dealWithPageData: '+e)
  }
}

module.exports = init