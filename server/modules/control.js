"use strict";

function Control(ctx, oridata){
  this.ctx = ctx || null
  this.get = function(){}
  this.post = function(){}
  this.data = oridata || {}
}

Control.prototype = {
  run: function(opts){
    var dft = {
        get: this.get,
        post: this.post
    }

    if (_.isPlainObject(opts)) dft = _.extend(dft, opts)
    let mtd = this.ctx.method;
    let ctx = this.ctx;
    let _data;

    if (mtd === 'GET' && _.isFunction(dft.get)) _data = dft.get.call(this.ctx)
    if (mtd === 'POST' && _.isFunction(dft.post)) _data = dft.post.call(this.ctx)

    return _data
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
