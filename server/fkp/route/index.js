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
    let rjson = Path.parse(_url)
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

    else{
      route = CONFIG.root||'index'
    }

    if (ctxurl && route !== ctxurl) route = ctxurl
    return route

  } catch (e) {
    debug('createTempPath2: '+e)
  }
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
  if (options && _.isPlainObject(options)) {
    _.map(options, (item, key) => {
      if (typeof item == 'string') item = [item]
      if (!Array.isArray(item)) return
      if (_.includes(['get', 'post', 'put', 'del'], key)) {
        item.map((rt)=>{
          if (key!='get' && rt != '/' && rt.indexOf('p1')==-1) {
            router[key](rt, forBetter)
          } else {
            router[key](rt, forBetter)
          }
        })
        _.map(item, (rt)=>{
          if (key!='get') {
            if (rt != '/') {
              router[key](rt, forBetter)
            }
          } else {
            router[key](rt, forBetter)
          }
        })
      }
    })
  } else {
    let routeParam = [
      '/',
      '/:cat',
      '/:cat/:title',
      '/:cat/:title/:id'
    ]
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
    let route = isRender ? createTempPath2(ctx) : false
    if (!isRender || !route) return ctx.redirect('404')
    ctx.fkproute = route
    let pageData = createMapper(ctx, _mapper, route, this)
    if (!_mapper || !pageData) return ctx.redirect('404')
    return distribute.call(ctx, route, pageData, ctrlPages, this)

  } catch (e) {
    debug('createRoute: '+ e)
  }
}

function createMapper(ctx, mapper, route, routerInstance){
  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/')==0) routerPrefix = routerPrefix.replace('/','')
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
  let _route = route
  if (routerPrefix) _route = routerPrefix
  if (mapper.pageCss[_route]) pageData.pagecss = mapper.pageCss[_route]
  if (mapper.pageJs[_route]) pageData.pagejs = mapper.pageJs[_route]
  return pageData
}

async function distribute(route, pageData, ctrlPages, routerInstance){
  debug('start distribute');
  let pdata = await controler(this, route, pageData, ctrlPages, routerInstance)
  return await dealWithPageData(this, pdata[0], pdata[1], pdata[2])
}

async function controler(ctx, route, pageData, ctrlPages, routerInstance){
  debug('start controler');
  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/')==0) routerPrefix = routerPrefix.replace('/','')

  try {
    // match的control文件，并返回数据
    async function getctrlData(_path, route, ctx, _pageData){
      let ctrl = control(route, ctx, _pageData)
      if (ctrl.initStat){
        _pageData = await ctrl.run(ctx)
      } else {
        let _names = []
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
        }
      }
      return _pageData
    }

    // 根据route匹配到control文件+三层路由
    let passAccess = false
    if (ctrlPages.indexOf(route+'.js')>-1){
      pageData = await getctrlData(['../../pages/'+route], route, ctx, pageData)
      // if (routerPrefix) route = routerPrefix
    }
    // 根据prefix匹配到control文件+三层路由
    else if (routerPrefix) {
      route = routerPrefix
      let prefixIndexFile =  Path.join('../../pages', routerPrefix, '/index')
      let prefixCatFile =  Path.join('../../pages', routerPrefix, ctx.params.cat||'')
      pageData = await getctrlData([prefixIndexFile,prefixCatFile], route, ctx, pageData)
    }
    // pages根目录+三层路由
    else if (!routerPrefix){
      let paramsCatFile =  Path.join('../../pages', ctx.params.cat)
      route = ctx.params.cat
      pageData = await getctrlData([paramsCatFile], route, ctx, pageData)
    }
    // 根据 Fetch.apilist 匹配到api接口，从远程借口拿去数据
    else{
      debug('pages/'+route+' 配置文件不存在');
      passAccess = true
      let apilist = Fetch.apilist
      if( apilist.list[route] || apilist.weixin[route] || route === 'redirect' ){
        pageData = {}
        pageData = await getctrlData(['./passaccess'], route, ctx, pageData)
      }
    }
    return [pageData, route, passAccess]
  } catch (e) {
    console.log(e.stack);
    debug(e.stack)
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
