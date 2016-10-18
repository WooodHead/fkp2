/**
 * Module dependencies.
 */
var path = require('path');
var views = require('koa-views')

function setRender(){
    let stat = process.env.whichMode

    console.log('模板渲染')
    console.log('================='+__filename+' setRender');
    console.log('-');
    console.log('-');
    console.log('-');
    var _html = path.resolve(CONFIG.static.dev.html);
    var __html = CONFIG.static.html;

    var _map = {
      map: {
        html: 'handlebars'
      }
    }
    var __map = {
      map: {
        html: 'swig'
      }
    };

    if(stat==='dev'){
      return views(_html, _map);
    }

    else if(stat==='pro'){
      return views(__html, _map);
    }

    else {
      return views(__html, _map);
    }
}


module.exports = setRender
