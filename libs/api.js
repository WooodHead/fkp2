import {objtypeof, tips, doc} from 'libs'
var src = "/";

function objtypeof(object){
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
};

function req( api, param, cb, method ){
  var url = api;
  if (!method) method = 'POST'
  if (url.indexOf('http://')===0){
    if (objtypeof(param) === 'Object') param._redirect = url
    else if (typeof param === 'function'){ cb = param; param = {_redirect: url} }
    else param = {_redirect: url}
    url = '/redirect'
  }

  if( objtypeof(param)==='Function' ) cb = param

  if( objtypeof(param)!=='Object' ) param = {test: '123'}

  if( !Object.keys(param).length ) param = {test: '123'}

  // 有些环境不是根目录，需要添加前缀，前缀根据location来自动添加
  // 如 http://www.xxx.com/yyy/ccc/app.html
  let uri = doc.urlparse(location.href);
  if (!uri.port){
    let _src = '/' + uri.segments.splice(0, (uri.segments.length-1)).join('/')
    url = (_src+url).replace('//', '/')
  }

  let dtd = $.Deferred();

  function ccb(data, status, xhr){
    if( status === 'success' ) {
      if (data && typeof data === 'string') data = JSON.parse(data)
      if( cb && typeof cb==='function' ) cb( data, status, xhr )
      else{
        dtd.resolve(data, status, xhr)
        return dtd.promise()
      }
    }
  }
  if (method==='GET') param._stat_ = 'DATA'
  return $.ajax({
    url: url,
    type: method,
    data: param,
    timeout: 3000,
    dataType: "json",
  })
  .done(ccb)
  .fail(function(xhr,status,statusText){
    tips('网络不给力','center')
    console.log('错误状态码：'+xhr.status+"<br>时间："+xhr.getResponseHeader('Date'))
    dtd.reject()
  })
}
function get( api, param, cb ){
  return req( api, param, cb, 'GET')
}
function post( api, param, cb ){
  return req( api, param, cb, 'POST')
}



module.exports = {
  get: get,
  post: post
}
