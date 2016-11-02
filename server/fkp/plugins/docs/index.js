import co from 'co'
import path from 'path'
import mddocs from './docs'

async function docs(ctx, dir, type){
  if (!dir) return false
  let Docs = mddocs(ctx)
  let dft = {
    // parse a directory that has '.html' or '.md'
    // base data of menutree/sitemap
    // return a Json obj
    docs: false,

    // one markdown directory
    start: false,
    menutree: false,
    sonlist: false,

    // public/html/**
    sitemap: false,

    // append some json
    append: {}
  }

  async function folderDocs(dir, opts) {
    return await co(Docs.getDocsData(dir, opts))
  }

  async function mdfileDoc(_path) {
    return await co(Docs.loadmdFile(dir))
  }

  if (!type) return await mdfileDoc(dir)


  function setOptions(_type){
    switch (_type) {
      case 'mdmenu':
        dft.menutree = true
        break;
      case 'mdhome':
        dft.start = true
        break;
      case 'mdindex':
        dft.start = '_home.md'
        break;
      case 'mdson':
        dft.sonlist = true
        break;
      case 'sitemap':
        dft.sitemap = true
        break;
    }
  }

  if (_.isPlainObject(type)) dft = _.extend(dft, type)
  if (_.isString(type)) {
    if (type.indexOf(',')>-1) {
      let types = type.split(',')
      for (let item of types) {
        setOptions(_.trim(item))
      }
    } else {
      setOptions(type)
    }
  }

  if (dir == 'fdocs') {
    let stat = await ctx.fkp.fileexist(dir)
    if (!stat) {
      await ctx.fkp.mkdir(dir)
      return false
    }
  }

  return await folderDocs(dir, dft)
}

async function init(ctx, dir, type){
  ctx.fkp.routeprefix('/docs')
  return docs(ctx, dir, type)
}

export default init
