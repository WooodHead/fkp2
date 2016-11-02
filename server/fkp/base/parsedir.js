let co = require('co')
let path = require('path')
let bluebird = require('bluebird')
let fs = bluebird.promisifyAll(require('fs'))
let parseanyHtmlDirs = require('./_readhtmldir').default

export default async function(ctx, url){
  try {
    let _id = 'parsedir_'+url
    return Cache.ifid(_id, ()=>{
      let dirdata = parseanyHtmlDirs(url)
      Cache.set(_id, dirdata)
      return dirdata
    })
  } catch (e) {
    debug('parsedir: ' + e.message)
    // console.log(e.stack);
    return false
  }
}
