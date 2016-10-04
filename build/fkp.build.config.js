var fs = require('fs'),
    del = require('del'),
    _ = require('lodash'),
    path = require('path'),
    gulp = require('gulp'),
    marked = require('marked'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    through = require('through2'),
    base = require('./common/base'),
    configs = require('./out_config'),
    alias = require('./webpack.alias'),
    $ = require('gulp-load-plugins')();


function chkType(type) {
  if (type.indexOf('.')===0) type = type.replace('.', '')
  var all = {
    style: ['css', 'scss', 'sass', 'less', 'stylus', 'styl'],
    templet: ['hbs', 'swig', 'htm', 'html', 'php', 'jsp'],
    script: ['js', 'jsx', 'coffee', 'cjsx', 'ts', 'tsx']
  }

  var staticType = 'script'
  for (var item in all) {
    var arys = all[item];
    if (_.indexOf(arys, type) > -1) staticType = item;
  }
  return staticType;
}

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
  chkType: chkType
}


function initDir(aryDir, fatherDirName, isPack, depth) {
  var entrys = {};
  function readPageDir(subDir, isPack, depth) {     // make directory json
    package_ary = [];
    var dirs = (subDir && subDir.fs) || aryDir;
    var dirsPath = (subDir && subDir.path) || fatherDirName;

    var sameName = false;   //同名文件
    dirs.forEach(function(item) {
      var _filename = (subDir && subDir.filename) || item;
      var name = (subDir && subDir.name) || item;

      //目录，忽略下划线目录，如_test, _xxx及隐藏目录
      if (depth &&
        fs.statSync(dirsPath + '/' + item).isDirectory() &&
        item.indexOf('_') !== 0 &&
        item.indexOf('.') !==0
      ) {
        var data = {
          name: item,
          path: dirsPath + '/' + item,
          fs: fs.readdirSync(dirsPath + '/' + item),
          filename: (subDir && subDir.filename + "-" + item) || item
        };
        readPageDir(data, isPack, depth);
      }

      //文件，忽略下划线文件，如_test, _xxx及隐藏文件
      else if (
        fs.statSync(dirsPath + '/' + item).isFile() &&
        item.indexOf('_') !== 0 &&
        item.indexOf('.') !==0
      ) {
        var ext = path.extname(dirsPath + '/' + item);
        if (chkType(ext) || ext === '.md') {
          // 如果存在同名js
          if (!sameName) {
            if (name === item.replace(ext, '')) {
              entrys[_filename] = [dirsPath + '/' + item];
              sameName = true;
            } else {
              entrys[_filename] = entrys[_filename] || [];
              entrys[_filename].push(dirsPath + '/' + item);
            }
          }
        }
      }
    })
  }

  readPageDir(null, isPack, depth);
  var package_ary = [];
  for (var name in entrys) {
      entrys[name].map(function(item, i) {
        item = item.replace('//', '/')
        entrys[name][i] = item
        package_ary.push(item)
      });
  }

  if (isPack) return package_ary
  return entrys
}




var FkpBuild = base.class.create()
FkpBuild.prototype = {
  init: function(){
    this.dirname = arguments[0]
    this.options = arguments[1]
    this.cb = arguments[2]
    this.package_name = ''
  },

  readDirs: function(dirname, options) {
    var tmp = {},
        _this = this;

    if (typeof dirname === 'string') return this.readDir(dirname,  options)
    else if (_.isArray(dirname)){
      dirname.map(function(item, i) {
        var _tmp = _this.readDir(item, options);
        tmp = _.assign(tmp, _tmp)
      })
    }

    return tmp;
  },

  readDir: function(dirname, options) {
      var opts = {
        reanme: undefined,
        type: undefined,
        prepend: [],
        append: [],
        depth: true,
        pack: false
      };

      // 合并配置文件
      if (options && _.isObject(options)) {
        opts = _.extend(opts, options)
      }

      var pagesDir,
        package_name,       //包名

        default_dir  = dirname,
        preDefineDir = dirname,

        rename  = opts.rename,
        type    = opts.type,
        isPack  = opts.pack;


      //configs.dirs中预定义目录
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
          var __ultimates = [dirname];
            __ultimates = _.concat(prepend, __ultimates, append)

          return {
            '_src': __ultimates,
            'key': '_src',
            'value': __ultimates
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
          styleType = (staticType === 'style'&& type!=='sass') ? true : false

        package_name = dirname;
        // entry[package_name] = _entry

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
        // entry['key'] = package_name;
        // entry['value'] = ultimates;
      }

      else{  // isPack is false 打包成多个文件
        entry = _entry
      }

      return entry;
  }
}

var CssBuild = base.inherits( FkpBuild, require('./common/cssbuild')(util))


var JsBuild = base.inherits( CssBuild, {
  js: function(dir, opts, cb){

  }
})

var HtmlBuild = base.inherits( JsBuild, require('./common/htmlbuild')(util))


var Build = base.inherits( HtmlBuild, {

})


function build(){
  return new Build()
}

module.exports = build()
