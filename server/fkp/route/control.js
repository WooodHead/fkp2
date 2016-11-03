"use strict";

function Control(ctx, oridata){
  this.ctx = ctx || null
  this.get = undefined
  this.post = undefined
  this.data = oridata
  this.opts = {}
  this.initStat = false
}

Control.prototype = {
  init: function(options){
    try {
      var dft = {
        get: this.get,
        post: this.post
      }
      if (_.isPlainObject(options)) dft = _.extend(dft, options)
      this.initStat = true
      this.opts = dft

    } catch (e) {
      console.log(e);
    }
  },
  run: function(ctx, options){
    try {
      this.ctx = ctx
      if (!this.initStat) if (_.isPlainObject(options)) this.init(options)
      let opts = this.opts
      let mtd = ctx.method
      let _data = this.data
      if (mtd === 'GET' && _.isFunction(opts.get)) {
        _data = opts.get.call(this, ctx)
      }
      if (mtd === 'POST' && _.isFunction(opts.post)){
        _data = opts.post.call(this, ctx)
      }
      return _data
    } catch (e) {
      console.log(e);
    }
  }
}

function control(route, ctx, odata){
  let _id = route+'_controler'
  return Cache.ifid(_id, function(){
    let instance = new Control(ctx, odata)
    Cache.set(_id, instance)
    return instance
  })
}

export default control
