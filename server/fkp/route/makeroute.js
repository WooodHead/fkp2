import Path from 'path'
import libs from 'libs'

/**
 * 生成路由标签
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {string} route tag, like 'index' , 'h5/lazypage'
**/
export default function(ctx){
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
    console.log('createTempPath2: '+e)
  }
}
