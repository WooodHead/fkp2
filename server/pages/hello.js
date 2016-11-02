"use strict";
let debug = Debug('pages:hello')

function hello(oridata) {
  return {
    get: async function(ctx){
      let fdocsHome = await ctx.fkp().docs('fdocs', 'mdhome')
      oridata.fkp = 'FKP2'
      oridata = _.extend(oridata, fdocsHome)
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { hello as getData }
