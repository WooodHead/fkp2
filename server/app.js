// require('coffee-script/register');
import init from './init'
import request from 'request'
const refreshUrl = 'http://localhost:3000/__browser_sync__?method=reload'

Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}


async function startServer(){
  try {
    const server = await init()
    server.listen(CONFIG.port, function(){
      if (process.env.whichMode!='pro') {
        request(refreshUrl, function (error, response, body) {
          if (error) console.log('server will be start');
        })
      }
    })
  } catch (e) {
    console.error(e.stack)
  }
}
startServer()
