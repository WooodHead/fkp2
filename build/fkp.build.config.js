var fs = require('fs'),
    del = require('del'),
    _ = require('lodash'),
    path = require('path'),
    gulp = require('gulp'),
    marked = require('marked'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    through = require('through2'),
    shell = require("shelljs"),
    base = require('./common/base'),
    configs = require('./out_config'),
    alias = require('./webpack.alias'),
    $ = require('gulp-load-plugins')(),
    babelQuery = require('./common/babelquery'),
    browserSync = require('browser-sync').create(),
    reload  = browserSync.reload,
    wpEntry = require('./common/wpentry'),
    chkType = base.chkType,
    nodeModulesPath = path.join(__dirname, '../node_modules')

var util = {
  fs: fs,
  $: $,
  _: _,
  del: del,
  path: path,
  base: base,
  gulp: gulp,
  gutil: gutil,
  alias: alias,
  marked: marked,
  through: through,
  webpack: webpack,
  configs: configs,
  chkType: chkType,
  babelQuery: babelQuery
}

Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

function convTimestamp(time){
  var arr = time.split(/[- :]/),
      _date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]),
      timeStr = Date.parse(_date);
  return timeStr
}

var FkpBuild = base.class.create()
FkpBuild.prototype = {
  init: function(opts){
    this.dirname = ''
    this.package_name = ''
    this.env = ''
    this.root = path.resolve('./')
    if (opts && opts.gulp) this.gulp = opts.gulp  // gulpfile.coffee传递
  },

  // generate webpack entry
  initEntry: function(files, opts){
    var defaults = {
      reanme: undefined,
      type: 'js',
      prepend: [],
      append: [],
      depth: true,
      env: 'dev',
      pack: false,
      method: false
    }

    // merge config
    opts = opts ? _.extend(defaults, opts) : defaults
    this.env = opts.env
    return wpEntry.call(this, this.dirname, opts, files, util)
  }
}

var _instance
var FsBuild = base.inherits( FkpBuild, require('./common/initdir')(util))   // readdir or readfile module
var CssBuild = base.inherits( FsBuild, require('./common/cssbuild')(util))  // css module
var JsBuild = base.inherits( CssBuild, require('./common/jsbuild')(util))   // js module
var HtmlBuild = base.inherits( JsBuild, require('./common/htmlbuild')(util))  // html module
var UtilBuild = base.inherits( HtmlBuild, require('./common/buildutil')(util))  // util module
var Build = base.inherits( UtilBuild, {
  watch: function(type) {
    var env = this.env
    if (process.env.WATCH_FILE === 'false'){
      return this
    }
    else{
      switch (type) {
        case 'css':
        break;
        case 'html':
        break;
        default:
          this.gulp.start('watch')
      }
    }
    return this
  },

  // lifecicle
  ready: function(opts) {
    this.env = 'dev'
    switch (process.env.NODE_ENV) {
      case 'production':
        this.env = 'pro'
        break;
      case 'development':
        this.env = 'dev'
        break;
    }
    return this
  },

  openBrowse: function(){
    if (process.env.WATCH_FILE == 'true' && !this.jsruntime.demo) {
      let that = this
      let port = that.env==='pro' ? configs.ports.node : configs.ports.dev
      let fd = fs.openSync(configs.dirs.server+'/tmp.js', 'a')
      if (fd) {
        let _now = convTimestamp(new Date().Format("yyyy-MM-dd hh:mm:ss"))
        fs.futimesSync(fd, _now, _now)         
      }
      setTimeout(function(){
        browserSync.init({
          proxy: 'http://localhost:' + port+'/',
          files: [configs.staticPath+ '/**'],
          logFileChanges: false,
          notify: true,
          injectChanges: true
        })
      }, configs.delay.openBrowse)
    }
    return this
  },

  finish: function(){ }
})

function build(opts){
  _instance = new Build(opts)
  return _instance
}

module.exports = build
