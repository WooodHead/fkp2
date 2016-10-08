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
    initDir = require('./common/initdir'),
    babelQuery = require('./common/babelquery'),
    wpEntry = require('./common/wpentry'),
    chkType = base.chkType,
    nodeModulesPath = path.join(__dirname, '../node_modules')


var util = {
  fs: fs,
  $: $,
  _: _,
  del: del,
  path: path,
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

var FkpBuild = base.class.create()
FkpBuild.prototype = {
  init: function(opts){
    this.dirname = ''
    this.package_name = ''
    this.env = ''
    this.root = path.resolve('../')
    this.mapper = {
      version: configs.version,
      name: "fkp-mapper",
      createdAt: (new Date()).toString(),
      commonDependencies: {
        css: {},
        js: {},
      } ,
      dependencies: {
        css: {},
        js: {},
      }
    }

    if (opts.gulp){
      this.gulp = opts.gulp
    }

    // this.server.dev()
  },

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

    // 合并配置文件
    opts = opts ? _.extend(defaults, opts) : defaults
    this.env = opts.env
    return wpEntry.call(this, this.dirname, opts, files, util)
  },

  readDirs: function(dirname, options) {
    var _this = this,
      tmp = {},
      opts = {
        reanme: undefined,
        type: undefined,
        prepend: [],
        append: [],
        depth: true,
        pack: false
      }

    try {
      if (!dirname) throw '没有指定目录或文件'
      this.dirname = dirname

      // 合并配置文件
      if (options && _.isObject(options)) {
        opts = _.extend(opts, options)
      }

      if (_.isObject(dirname) && !_.isArray(dirname)){
        tmp = dirname
        if (opts.isPack){
          var tmp_array = []
          _.mapKeys(dirname, function(val, key){
            tmp_array = tmp_array.concat( val )
          })
          if (opts.rename){
            tmp = {}
            tmp[opts.rename] = tmp_array
          }
          else {
            throw 'slime 指定pack为true，必须同时指定 options.rename'
          }
        }
        return tmp
      }

      if (typeof dirname === 'string'){
        return this.readDir(dirname,  opts)
      }

      if (_.isArray(dirname)){
        dirname.map(function(item, i) {
          var _tmp = _this.readDir(item, opts)
          if (_tmp._src ){
            if (tmp._src){
              tmp._src = tmp._src.concat(_tmp._src)
            } else {
              tmp = _.assign(tmp, _tmp)
            }
          } else {
            tmp = _.assign(tmp, _tmp)
          }
        })

        if (tmp._src){
          var ultimates = []
          ultimates = _.concat(opts.prepend, tmp._src, opts.append)
          delete tmp._src
          if (opts.rename){
            tmp[opts.rename] = ultimates
          } else{
            throw 'slime 指定数组时，必须同时指定 options.rename'
          }
        }

        if (opts.isPack){
          var tmp_array = []
          _.mapKeys(tmp, function(val, key){
            tmp_array = tmp_array.concat( val )
          })
          if (opts.rename){
            tmp = {}
            tmp[opts.rename] = tmp_array
          }
          else {
            throw 'slime 指定pack为true，必须同时指定 options.rename'
          }
        }

        return tmp;
      }
    } catch (e) {
      console.error( __filename + ":" + e )
    }

  },

  readDir: function(dirname, opts) {
      var pagesDir,
        package_name,       //包名

        default_dir  = dirname,
        preDefineDir = dirname,

        rename  = opts.rename,
        type    = opts.type,
        isPack  = opts.pack;

      // configs.dirs中预定义目录
      // 如 pages
      let dirs = configs.dirs
      for (var item in dirs) {
        if (item === dirname) {
          pagesDir = fs.readdirSync(dirs[item]);
          preDefineDir = dirs[item];
          package_name = isPack === true ? dirname : '';
        }
      }

      if (!pagesDir) {
        if (!fs.existsSync(dirname)) {
          throw new Error("==============Error: you must identify a entry");
          return false;
        }

        // 目录
        if (fs.statSync(dirname).isDirectory()) {
          pagesDir = fs.readdirSync(dirname);
          package_name = isPack === true ? path.basename(dirname) : '';
        }

        // 文件
        else if ( fs.statSync(dirname).isFile() ){   // 文件
          var __ultimates = [dirname]
          return {
            '_src': __ultimates,
          }
        }
      }

      // 生成entry
      var staticType = chkType(type),
        _entry = initDir(pagesDir, preDefineDir, isPack, opts.depth),   // 分析目录并返回JSON/Array
        entry={}

      if (isPack) {   // 打包成一个文件
        var ext = staticType === 'script' ? 'js' : type,
          _ultimates = ultimates = [],
          styleType = (staticType === 'style'&& type!=='sass') ? true : false;

        package_name = dirname;

        _ultimates = _entry
        ultimates = _.concat(opts.prepend, _ultimates, opts.append)

        // 有时候需要将目录打包输出成一个文件
        // 但是输出文件名字不是目录名
        // 可以通过`rename`重新制定输出的打包文件名
        // ==================================
        if (rename){
          package_name = rename
        }

        entry[package_name] = ultimates
        this.package_name = package_name
      }

      else{  // isPack is false 打包成多个文件
        entry = _entry
      }

      return entry;
  }
}

var CssBuild = base.inherits( FkpBuild, require('./common/cssbuild')(util))

var JsBuild = base.inherits( CssBuild, require('./common/jsbuild')(util))

var HtmlBuild = base.inherits( JsBuild, require('./common/htmlbuild')(util))

var Build = base.inherits( HtmlBuild, {
  server: {
    dev: function(){
      shell.exec('node index.js &')
    },
    pro: function(){
      shell.exec('pm2 start index.js')
    }
  },
  watch: function(){
    that = this
    return {
      css: function(){
        that.gulp.start('watch')
      }
    }
  }

})


function build(opts){
  return new Build(opts)
}

module.exports = build
