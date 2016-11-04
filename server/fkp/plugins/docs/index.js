import co from 'co'
import path from 'path'
import mddocs from './docs'

async function docs(fkp, dir, type){
  if (!dir) return false
  let Docs = mddocs(fkp)
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
    return await Docs.getDocsData(dir, opts)
  }

  async function mdfileDoc(_path) {
    return await Docs.loadmdFile(dir)
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
    let stat = await fkp.fileexist(dir)
    if (!stat) {
      await fkp.mkdir(dir)
      return false
    }
  }
  return await folderDocs(dir, dft)
}

export default function(fkp){
  fkp.routepreset('/docs', {
    get: [
      '/',
      '/:cat',
      '/:cat/:title',
      '/:cat/:title/:id',
      '/:cat/:title/:id/:p1',
      '/:cat/:title/:id/:p1/:p2',
      '/:cat/:title/:id/:p1/:p2/:p3'
    ],
    post: [ '/', '/:cat', '/:cat/:title', '/:cat/:title/:id' ]
  })
  return docs
}
