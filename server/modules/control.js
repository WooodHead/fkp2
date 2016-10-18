"use strict";

function Control(ctx, oridata){
    this.ctx = ctx || null
    this._get_ = false
    this._post_ = false
    this.data = oridata || {},
    this.help = {
        api: 'Control.api，参考javaapi.js',
        libs: 'Control.libs，参考libs/libs.js',
        parseJsx: '解析JSX',
        parseMd: '解析markdown文档'
    }
}

Control.prototype = {
    run: function(opts){
        var dft = {
            get: this._get_,
            post: this._post_
        }

        if (_.isObject(opts)){
            dft = _.extend(dft, opts)
        }

        var mtd = this.ctx.method;
        var ctx = this.ctx;
        var _data;

        if (mtd === 'GET' && _.isFunction(dft.get)){
            _data = dft.get.call(this.ctx)
            return _data
        }

        if (mtd === 'POST' && _.isFunction(dft.post)){
            _data = dft.post.call(this.ctx)
            return _data
        }
    }
}


function control(ctx, odata){
    return new Control(ctx, odata)
}

// control.api = require('apis/javaapi')
// control.libs = require('libs/libs')
// control.parseJsx = require('./parseReact')
// control.parseMd = require('./markdown')

export default control
