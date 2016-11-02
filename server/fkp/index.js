let co = require('co')
let path = require('path')
let bluebird = require('bluebird')
let fs = bluebird.promisifyAll(require('fs'))
let parseanyHtmlDirs = require('./base/_readhtmldir').default
let debug = Debug('fkp')

export default async function(app) {

    function copy(src, dist){
      fs.createReadStream(src).pipe(fs.createWriteStream(dist));
    }

    async function fileexist(_path){
      return fs.statAsync(_path).then( sss => sss ).catch( e => {
        debug('fileexist: ' + e.message)
        return false
      })
    }

    function filetype(extname) {
      if (extname.indexOf('.')===0) extname = extname.replace('.', '')
      var all = {
        style: ['css', 'less', 'stylus', 'styl'],
        templet: ['hbs', 'ejs', 'jade', 'pug', 'htm', 'html', 'php', 'jsp'],
        script: ['js', 'jsx', 'coffee', 'cjsx', 'ts', 'tsx']
      }

      var staticType = 'script'
      for (let item in all) {
        var arys = all[item];
        if (_.indexOf(arys, extname) > -1) staticType = item;
      }
      return staticType;
    }

    async function readdir(_path){
      let stat = await fileexist(_path)
      if (!stat) return false
      return fs.readdirAsync(_path)
      .then( dirs => {
        return dirs.filter( item => item.indexOf('.')!=0 || item.indexOf('.')==-1 || item.indexOf('_')!=0 )
      })
      .catch( e => {
        debug('readdir: ' + e.message)
        return false
      })
    }

    function mkdir(path){
      let _mode = '0777'
      return fs.mkdirAsync(path).then( ()=>true ) .catch( e => {
        debug('mkdir: ' + e.message)
        return false
      })
    }

    let fns = [
      fileexist,
      filetype,
      readdir,
      mkdir,
      copy
    ]

    function _fkp(data, opts){
      this.data = data
      this.opts = opts
    }

    let fkp = function(data, opts){
      return new _fkp(data, opts)
    }
    fkp.config = CONFIG
    fkp.root = path.join(__dirname, '../../')
    for (let item of fns){
      fkp[item.name] = item
    }

    fkp.plugins = function(name, fn){
      _fkp.prototype[name] = function() {
        return fn.apply(this, [fkp, ...arguments])
      }
    }

    fkp.utileHand = function(name, fn){
      fkp[name] = function() {
        return fn.apply(null, [fkp, ...arguments])
      }
    }

    // register 助手方法
    let _utilesFiles = fs.readdirSync(path.resolve(__dirname, './base'))
    if (_utilesFiles && _utilesFiles.length) {
      for (let utileFile of _utilesFiles) {
        if (utileFile.indexOf('_')!=0) {
          let utileFun = require('./base/'+utileFile).default
          fkp.utileHand(path.parse(utileFile).name, utileFun)
        }
      }
    }

    // // register 插件
    let _pluginFiles = fs.readdirSync(path.resolve(__dirname, './plugins'))
    if (_pluginFiles && _pluginFiles.length) {
      for (let pluginFile of _pluginFiles) {
        if (pluginFile.indexOf('_')!=0) {
          let plugin = require('./plugins/'+pluginFile).default(fkp)
          fkp.plugins(path.parse(pluginFile).name, plugin)
        }
      }
    }

    app.use(async (ctx, next)=>{
      ctx.fkp = fkp
      await next()
    })
}
// export default function() {
//   return async function(ctx, next) {
//
//     function copy(src, dist){
//       fs.createReadStream(src).pipe(fs.createWriteStream(dist));
//     }
//
//     async function fileexist(_path){
//       return fs.statAsync(_path).then( sss => sss ).catch( e => {
//         debug('fileexist: ' + e.message)
//         // console.log(e.stack);
//         return false
//       })
//     }
//
//     function filetype(extname) {
//       if (extname.indexOf('.')===0) extname = extname.replace('.', '')
//       var all = {
//         style: ['css', 'less', 'stylus', 'styl'],
//         templet: ['hbs', 'ejs', 'jade', 'pug', 'htm', 'html', 'php', 'jsp'],
//         script: ['js', 'jsx', 'coffee', 'cjsx', 'ts', 'tsx']
//       }
//
//       var staticType = 'script'
//       for (let item in all) {
//         var arys = all[item];
//         if (_.indexOf(arys, extname) > -1) staticType = item;
//       }
//       return staticType;
//     }
//
//     async function readdir(_path){
//       let stat = await fileexist(_path)
//       if (!stat) return false
//       return fs.readdirAsync(_path)
//       .then( dirs => {
//         return dirs.filter( item => item.indexOf('.')!=0 || item.indexOf('.')==-1 || item.indexOf('_')!=0 )
//       })
//       .catch( e => {
//         debug('readdir: ' + e.message)
//         // console.log(e);
//         return false
//       })
//     }
//
//     function mkdir(path){
//       let _mode = '0777'
//       return fs.mkdirAsync(path).then( ()=>true ) .catch( e => {
//         debug('mkdir: ' + e.message)
//         // console.log(e.stack);
//         return false
//       })
//     }
//
//     let fns = [
//       fileexist,
//       filetype,
//       readdir,
//       mkdir,
//       copy
//     ]
//
//     function _fkp(data, opts){
//       this.data = data
//       this.opts = opts
//     }
//
//     let fkp = function(data, opts){
//       return new _fkp(data, opts)
//     }
//     fkp.config = CONFIG
//     fkp.root = path.join(__dirname, '../../')
//     for (let item of fns){
//       fkp[item.name] = item
//     }
//
//     fkp.plugins = function(name, fn){
//       _fkp.prototype[name] = function() {
//         return fn.apply(this, [fkp, ...arguments])
//       }
//     }
//
//     fkp.utileHand = function(name, fn){
//       fkp[name] = function() {
//         return fn.apply(null, [fkp, ...arguments])
//       }
//     }
//
//     // register 助手方法
//     let _utilesFiles = await readdir(path.resolve(__dirname, './base'))
//     if (_utilesFiles && _utilesFiles.length) {
//       for (let utileFile of _utilesFiles) {
//         if (utileFile.indexOf('_')!=0) {
//           let utileFun = require('./base/'+utileFile).default
//           fkp.utileHand(path.parse(utileFile).name, utileFun)
//         }
//       }
//     }
//
//     // register 插件
//     let _pluginFiles = await readdir(path.resolve(__dirname, './plugins'))
//     if (_pluginFiles && _pluginFiles.length) {
//       for (let pluginFile of _pluginFiles) {
//         if (pluginFile.indexOf('_')!=0) {
//           let plugin = require('./plugins/'+pluginFile).default
//           fkp.plugins(path.parse(pluginFile).name, plugin)
//         }
//       }
//     }
//
//     ctx.fkp = fkp
//     await next()
//   }
// }
