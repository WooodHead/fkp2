/**
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path')
var url = require('url')
var Router = require('koa-router')
var libs = require('libs/libs')
var md5 = require('md5')

import control from './control'


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

    if(!ext)
        rtn = true;

    if(_.indexOf(tempExts, ext) > -1)
        rtn = true;

    if(_.indexOf(noPassCat, cat) > -1)
        rtn = false;

    return rtn;
}


/**
 * 生成路由标签
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {string} route tag, like 'index' , 'h5/lazypage'
**/
function createTempPath2(pms, url, ctxurl){
    let rjson = path.parse(url)
    var params = pms;
    var route = false;

    var cat = params.cat||'', title = params.title||'', id = params.id||'';
    var gtpy = libs.getObjType;

    if(id){
        gtpy(id)==='Number'
        ? route = title
            ? cat+'/'+title
            : cat
        : route = cat+'/'+title +'/' + id
    }

    else if(title){
        title = title.replace(rjson.ext,'');
        route = gtpy(title)==='Number'
        ? cat
        : cat+'/'+title;
    }

    else if(cat){
        cat = cat.replace(rjson.ext,'');
        route = gtpy(cat)==='Number'
        ? CONFIG.root||'index'
        : cat;
    }

    else{
        route = CONFIG.root||'index'
    }
    if (ctxurl && route !== ctxurl) route = ctxurl
    return route;
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
    ctx.local = url.parse(ctx.url, true)
    let _ext = path.extname(ctx.url)
    ctx.route_url = ctx.url.slice(1).replace(_ext, '')
    if (!ctx.route_url) ctx.route_url = ''
    return distribute.call(ctx, mapper, _controlPages, prefix)
  }
}

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function distribute(_mapper={}, ctrlPages, prefix){
    libs.clog('route.js/distribute');
    if(_mapper){
      let isRender = filterRendeFile(this.params, this.url)
      let pageData = {
          //静态资源
          commonjs: _mapper.commonJs.common||'common.js',   //公共css
          commoncss: _mapper.commonCss.common||'common.css', //公共js
          pagejs: '',
          pagecss: '',
          pagedata: {}
      }
      let route = isRender ? createTempPath2(this.params, this.url, this.route_url) : false
      if ( isRender && route){
        //静态资源初始化
        if (_mapper.pageCss[route]) pageData.pagecss = _mapper.pageCss[route];
        if (_mapper.pageJs[route]) pageData.pagejs = _mapper.pageJs[route];

        let pdata = await controler(this, route, pageData, ctrlPages)
        return await dealWithPageData(this, pdata[0], route, pdata[1])
      }
      else {
        return this.redirect('/404')
      }
    }
}

async function controler(ctx, route, pageData, ctrlPages){
  let passAcess = false
  let ctrl = control(ctx, pageData)
  if (ctrlPages.indexOf(ctx.route_url+'.js')>-1){
    pageData = await require('../pages/'+ctx.route_url).getData.call(ctx, pageData, ctrl);
  } else{
    libs.elog('pages/'+route+' 配置文件不存在');
    passAcess = true
  }
  return [pageData, passAcess]
}

// dealwith the data from controlPage
async function dealWithPageData(ctx, data, route, passAcess){
  switch (ctx.method) {
    case 'GET':
      return await ctx.render(route, data)
      break;
    case 'POST':
      // if( passAcess ){
      //   if( api.apiPath.dirs[route] || api.apiPath.weixin[route] || route === 'redirect' )
      //     data = yield require('../pages/common/nopage').getData.call(that, data, control);
      // }
      ctx.body = data
      break;
  }
}

module.exports = init
