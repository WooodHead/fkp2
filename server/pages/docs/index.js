"use strict";
let debug = Debug('pages:hello')
import path from 'path'

function docs(oridata) {
  return {
    get: async function(ctx){
      let cat = ctx.params.cat
      let title = ctx.params.title
      let id = ctx.params.id
      let p1 = ctx.params.p1
      let p2 = ctx.params.p2
      let p3 = ctx.params.p3

      oridata.docs = {}

      if (cat) {
        let _path = 'fdocs/'+cat
        let fdocs = await ctx.fkp.docs(_path, {
          start: '_home.md',
          menutree: true
        })
        oridata.docs = _.extend({}, fdocs)
      } else {
        let fdocs = await ctx.fkp.docs('fdocs', {
          start: true
        })
        oridata.docs.docindex = fdocs.home
      }

      if (id || title) {
        let mdpath = cat+'/'+title
        if (id) mdpath = path.join(cat+'/'+title +'/'+id, (p1||''), (p2||''), (p3||''))
        let mdfile = await ctx.fkp.docs('fdocs/'+mdpath+'.md')
        delete oridata.docs.home
        if (mdfile) oridata.docs = _.extend(oridata.docs, mdfile)
      }

      const attachjs = await ctx.fkp.injectjs(['/js/parts/tree'])
      oridata = _.merge(oridata, attachjs)

      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { docs as getData }
