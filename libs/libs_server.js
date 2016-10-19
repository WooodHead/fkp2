var path = require('path')
var lodash = require('lodash');
var qs = require('querystring');
var timer = require('./_component/time')
var base = require('./_component/base')


function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

var clog = function(msg){
    console.log('====================='+msg);
    console.log('-');
    console.log('-');
    console.log('-');
}

var elog = function(msg){
    console.log('============'+msg);
}

var wlog = function(msg){
    console.log('+++++++++++');
    console.log('+++++++++++');
    console.log(msg);
}

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
    objtypeof: base.objtype,
    inherits: base.inherits,
    clog: clog,
    elog: elog,
    wlog: wlog,
    uri: parseQuery,
    guid: guid,
    errors: require('./errors'),
    timeAgo:   timer.timeAgo      //时间过去了多久
}
