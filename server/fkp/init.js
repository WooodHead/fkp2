let co = require('co')
let Path = require('path')
let through2 = require('through2')
let bluebird = require('bluebird')
let stream = require('stream')
let request = require('request')
let cheerio = require('cheerio')
let Util = require('util')
let fs = bluebird.promisifyAll(require('fs'))

let debug = Debug('fkp')
let mapper = require('./modules/mapper')
let fetch = require('./modules/fetch').default
let router = require('./route')
global.Fetch = fetch

export default async function(app) {

    let innerData = {
      route: {
        prefix: []
      }
    }

    let fns = [
      $,
      save2file,
      routepreset,
      fileexist,
      filetype,
      readfile,
      readdir,
      mkdir,
      copy
    ]

    function _fkp(ctx, opts){
      this.ctx = ctx
      this.opts = opts
    }
    let fkp = function(ctx, opts){
      return new _fkp(ctx, opts)
    }

    // 绑定资源
    fkp.env = process.env.whichMode
    fkp.staticMapper = mapper
    fkp.config = CONFIG
    fkp.root = Path.join(__dirname, '../../')

    // register inner base utile
    for (let item of fns){
      fkp[item.name] = item
    }

    // register other utile
    fkp.utileHand = function(name, fn){
      if (typeof fn == 'function') {
        fkp[name] = function() {
          return fn.apply(null, [fkp, ...arguments])
        }
      }
    }

    // register plugins
    fkp.plugins = function(name, fn){
      if (typeof fn == 'function') {
        _fkp.prototype[name] = function() {
          return fn.apply(this, [fkp, ...arguments])
        }
      }
    }

    fkp.use = function(name, fn){
      _fkp.prototype[name] = function() {
        return fn.apply(this, [fkp, ...arguments])
      }
    }

    // ============ 内联助手方法 ==============

    // node端jq
    function $(str){
      let $$ = cheerio.load(str)
      return $$
    }

    function copy(src, dist){
      // fs.createReadStream(src).pipe(fs.createWriteStream(dist))
      fs.createReadStream(src)
      .pipe(through2({ objectMode: true, allowHalfOpen: false },
        function (chunk, enc, cb) {
          cb(null, chunk)
        }
      ))
      .pipe(fs.createWriteStream(dist))
    }

    async function save2file(str, dist){
      if (str && str.indexOf('http')==0) {
        request.get(str).pipe(fs.createWriteStream(dist))
      }

      if (str && str.length>20) {
        fs.writeFileAsync(dist, str).then( sss=>sss).catch(e=>{
          debug('fileexist: ' + e.message)
          return false
        })
      }
    }

    // 动态设置路由的prefix
    async function routepreset(prefix, routerOptions) {
      if (!prefix) return
      if (prefix.indexOf('/')==-1) return
      let prefixs = innerData.route.prefix
      if (prefixs.indexOf(prefix)>-1) return
      prefixs.push(prefix)
      await router(app, prefix, routerOptions)
    }

    async function fileexist(_path){
      return fs.statAsync(_path).then( sss => sss ).catch( e => {
        debug('fileexist: ' + e.message)
        return false
      })
    }

    async function readfile(_path){
      return fs.readFileAsync(_path).then( sss => sss ).catch( e => {
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

    async function mkdir(path){
      let _mode = '0777'
      return fs.mkdirAsync(path).then( ()=>true ) .catch( e => {
        debug('mkdir: ' + e.message)
        return false
      })
    }

    // =============== 注册助手方法及plugins =============


    try {
      // 手动模块，注册 api 的 router prefix
      require('./modules/api').default(fkp)

      // start register utile function
      let _utilesFiles = fs.readdirSync(Path.resolve(__dirname, './base'))
      if (_utilesFiles && _utilesFiles.length) {
        for (let utileFile of _utilesFiles) {
          if (utileFile.indexOf('_')!=0) {
            let utileFun = require('./base/'+utileFile).default()
            fkp.utileHand(Path.parse(utileFile).name, utileFun)
          }
        }
      }

      // start register plugins
      let _pluginFiles = fs.readdirSync(Path.resolve(__dirname, './plugins'))
      if (_pluginFiles && _pluginFiles.length) {
        for (let pluginFile of _pluginFiles) {
          if (pluginFile.indexOf('_')!=0) {
            let plugin = require('./plugins/'+pluginFile).default(fkp)
            fkp.plugins(Path.parse(pluginFile).name, plugin)
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    // =========== 注册fkp中间件 =============
    app.fkp = fkp
    app.use(async (ctx, next)=>{
      ctx.fkp = fkp
      Fetch.init(ctx)   //初始化Fetch API
      await next()
    })

    return fkp
}
