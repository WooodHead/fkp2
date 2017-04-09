"use strict";
let debug = Debug('pages:hello')
import path from 'path'

async function injectStatic(fkp, params){
  let attachjs, attachcss
  if (params && params.js) {
    let _js = params.js
    if (params.js.indexOf(',')) _js = params.js.split(',')
    attachjs = await fkp.injectjs(_js)
  }

  if (params && params.css) {
    let _css = params.css
    if (params.css.indexOf(',')) _css = params.css.split(',')
    attachcss = await fkp.injectcss(_css)
  }

  return {...attachcss, ...attachjs}
}

/*
name: 'fkpdoc',
    path: 'fdocs/fkpdoc',
    home:
     { path: 'fdocs/fkpdoc/_home.md',
       mdcontent: [Object],
       params: {} } },
 */
function adpaterSon(component, data){
  const baselist = component.baselist
  const _data = data.map( item => {
    const title = item.home&&item.home.mdcontent&&item.home.mdcontent.title ? item.home.mdcontent.title : item.name
    const url = <a href={'/docs/'+item.name}>{title}</a>
    return {
      body: [
        <img src={item.img||'https://unsplash.it/g/150'}/>,
      ],
      footer: [
        url,
        (item.home && item.home.params.desc) || '还没有介绍'
      ]
    }
  })
  return baselist({
    data: _data
  })
}

function docs(oridata) {
  return {
    GET: async function(ctx){
      let cat = ctx.params.cat
      let title = ctx.params.title
      let id = ctx.params.id
      let p1 = ctx.params.p1
      let p2 = ctx.params.p2
      let p3 = ctx.params.p3
      let attachStatics
      const component = ctx.fkp.component()

      oridata.docs = {}

      // 解析目录
      if (cat) {
        // 子目录
        let _path = 'fdocs/'+cat

        let docsConfig = {
          start: '_home.md',
          menutree: true
        }

        if (id || title) {
          delete docsConfig.start
        }

        let fdocs = await ctx.fkp.docs(_path, docsConfig)
        oridata.docs = _.extend({}, fdocs)
        if (oridata.docs.params) {
          oridata.docs.params.js && oridata.docs.params.js.length
          ? oridata.docs.params.js = '/js/parts/tree,'+oridata.docs.params.js
          :oridata.docs.params.js = '/js/parts/tree'
        } else {
          oridata.docs.params = {js: '/js/parts/tree'}
        }

        // 解析文章
        if (id || title) {
          let mdpath = cat+'/'+title
          if (id) mdpath = path.join(cat+'/'+title +'/'+id, (p1||''), (p2||''), (p3||''))
          let mdfile = await ctx.fkp.docs('fdocs/'+mdpath+'.md')
          if (mdfile) {
            oridata.docs = _.extend(oridata.docs, mdfile)
          } else {
            return ctx.redirect('/404')
          }
          // if (oridata.docs.params) {
          //   oridata.docs.params.js && oridata.docs.params.js.length
          //   ? oridata.docs.params.js = '/js/parts/tree,'+oridata.docs.params.js
          //   :oridata.docs.params.js = '/js/parts/tree'
          // }
        }
        attachStatics = await injectStatic(ctx.fkp, oridata.docs.params)
      }

      else {
        //主目录
        let fdocs = await ctx.fkp.docs('fdocs', {
          start: true,
          sonlist: true
        })
        const sonStr = adpaterSon(component, fdocs.sonlist)
        const mdson = {mdson: sonStr}
        const compiled = await ctx.fkp.template(fdocs.home.cnt)
        fdocs.home.cnt = compiled(mdson)
        attachStatics = await injectStatic(ctx.fkp, fdocs.home.params)
        oridata.docs.docindex = fdocs.home
      }

      if (attachStatics) {
        oridata = _.merge(oridata, attachStatics)
      }

      oridata.fkp = 'FKP2'
      return oridata;
    },

    POST: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { docs as getData }
