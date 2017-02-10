var path = require('path')
var qs = require('querystring');
var timer = require('./_component/time')
var base = require('./_component/base')


function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

var parseQuery = function(uri){
    var q = url.parse(uri);
    return qs.parse(q.query);
}

var guid = function(prefix) {
    prefix = prefix || "web-";
    return (prefix + Math.random() + Math.random()).replace(/0\./g, "");
}

var co_parse = function(ctx){
    var opts = { limit: '50k' }
    return parse( ctx, opts )
}

module.exports = {
  objtypeof: base.objtypeof,
  inherits: base.inherits,
  strLen: base.strLen,
  grabString: base.grabString,
  uri: parseQuery,
  guid: guid,
  smd:            require('./_component/simplemd'),   //简单markdown
  timeAgo:   timer.timeAgo,      //时间过去了多久
  validator:     require('./_component/validator')        //校验基础方法
}
