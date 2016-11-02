"use strict";
let debug = Debug('pages:hello')
import path from 'path'

function hello(oridata) {
  return {
    get: async function(ctx){
      let fkper = ctx.fkp()
      let cat = ctx.params.cat
      let title = ctx.params.title
      let id = ctx.params.id
      let p1 = ctx.params.p1
      let p2 = ctx.params.p2
      let p3 = ctx.params.p3

      oridata.docs = {}

      if (cat) {
        let _path = 'fdocs/'+cat
        let fdocs = await fkper.docs(_path, 'mdindex, mdmenu')
        oridata.docs = _.extend({}, fdocs)
      } else {
        let fdocs = await ctx.fkp().docs('fdocs', 'mdhome')
        oridata.docs.docindex = fdocs.home
      }

      if (id || title) {
        let mdpath = cat+'/'+title
        if (id) mdpath = path.join(cat+'/'+title +'/'+id, (p1||''), (p2||''), (p3||''))
        let mdfile = await fkper.docs('fdocs/'+mdpath+'.md')
        delete oridata.docs.home
        if (mdfile) oridata.docs = _.extend(oridata.docs, mdfile)
      }

      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { hello as getData }
