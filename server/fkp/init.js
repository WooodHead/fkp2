let co = require('co')
let Path = require('path')
let through2 = require('through2')
let bluebird = require('bluebird')
let stream = require('stream')
let request = require('request')
let cheerio = require('cheerio')
let Util = require('util')
let fs = bluebird.promisifyAll(require('fs'))

let mapper = require('./modules/mapper')
let fetch = require('./modules/fetch').default
let router = require('./route')
global.Fetch = fetch

let debug = Debug('fkp')
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
      this.database = async (folder) => {
        return await require('../db').default(this.ctx, folder)
      }
    }
    function fkp(ctx, opts){
      let fkpInstanc = new _fkp(ctx, opts)
      for (let property of Object.entries(fkp)) {
        let [_name, _value] = property
        fkpInstanc[_name] = _value
      }
      return fkpInstanc
    }

    // manual set static property or fun or some resource
    fkp.env = process.env.whichMode
    fkp.staticMapper = mapper
    fkp.config = CONFIG
    fkp.root = Path.join(__dirname, '../../')


    // Register inner utile fun
    for (let item of fns){
      fkp[item.name] = item
    }

    // Register other utile fun
    fkp.utileHand = function(name, fn){
      if (typeof fn == 'function') {
        fkp[name] = function() {
          return fn.apply(null, [fkp, ...arguments])
        }
      }
    }

    // Register plugins fun
    fkp.plugins = function(name, fn){
      if (typeof fn == 'function') {
        _fkp.prototype[name] = function() {
          return fn.apply(this, [this.ctx, ...arguments])
        }
      }
    }

    // as plugins, it look nice
    fkp.use = function(name, fn){
      _fkp.prototype[name] = function() {
        return fn.apply(this, [this.ctx, ...arguments])
      }
    }

    /*
      ============ 内联助手方法 ==============
      下面的方法为fkp的内部静态方法，外部静态方法存放在base目录中，通过自动注册的方式挂载，所有方法通过fkp.xxx的方式调用，
      the flow fun is fkp's inner static fun, the other static fun in './base', will be auto register to fkp
      all static fun, u can use it like fkp.xxx
      =======================================
    */

    function $(str){
      let $$ = cheerio.load(str)
      return $$
    }

    function copy(src, dist){
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

    /**
     * 预动态设置路由, 在plugins方法中使用
     * Predifine koa-router's prefix and route before default route set
     * we use it in plugins fun
     * @param  {String}  prefix        koa-router's prefix
     * @param  {JSON}  routerOptions   koa-router's route
    */
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

    /*
    =============== 注册助手方法及plugins =============
    1、助手方法为一般的静态方法，第一个参数fkp，通过fkp.xxx调用，助手方法不能调用plugins方法
      utile fun is common fun, first arguments is 'fkp', in utile u can not call plugins fun
    2、插件方法为new fkp后的对象方法，带有this的上下文，第一个参数ctx，为koa环境对象，插件方法挂载在fkp上，调用方法同样为fkp.xxx
      plugins fun is one fun of a instance of 'new fkp'，first arguments is ctx that is context of koa, ctx.fkp include all fkp's static fun
      and all plugins fun, u can call every fun in control(control file in server/pages/..., or u define it in plugins)
    =================================================*/

    try {
      /**
       * 手动启用api模块，提升预定义api接口的访问效率，预定义api接口放置在 /apis/apilist.js文件中
       * 前端通过 ajax.get('/api/xxx')，访问接口，返回数据
       * 不启用该模块，前端通过 ajax.get('/xxx')访问接口，返回数据
       * Start this module to increasing efficiency of request data from API, All API define in /apis/apilist.js file
       * FED pass ajax.get('/api/xxx') to request data
       * if not, FED pass ajax.get('/xxx') to request data
       */
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
      ctx.fkp = fkp(ctx)
      Fetch.init(ctx)   //init Fetch, Fetch is global function
      await next()
    })

    return fkp
}
