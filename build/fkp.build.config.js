var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    _ = require('lodash'),
    marked = require('marked'),
    through = require('through2'),
    gutil = require('gulp-util'),
    del = require('del'),
    webpack = require('webpack'),
    configs = require('./config'),
    alias = require('./webpack.alias.js'),
    $ = require('gulp-load-plugins')();

var base = require('./common/base')

function chkType(type) {
  var staticType
  var all = {
    style: ['css', 'scss', 'sass', 'less', 'stylus', 'styl'],
    templet: ['hbs', 'swig', 'htm', 'html', 'php', 'jsp'],
    script: ['js', 'jsx', 'coffee', 'cjsx', 'ts', 'tsx']
  }

  for (var item in all) {
    var arys = all[item];
    if (_.indexOf(arys, type) > -1) staticType = item;
  }
  return staticType;
}


function initDir(aryDir, fatherDirName, isPack, depth) {
  var entrys = {},
      package_ary = [];
  // make directory json
  function readPageDir(subDir, isPack, depth) {
      package_ary = [];

      var dirs = (subDir && subDir.fs) || aryDir;
      // var dirsPath = (subDir && subDir.path) || config.pages;
      var dirsPath = (subDir && subDir.path) || fatherDirName;

      var sameName = false;
      dirs.forEach(function(item) {

          var _filename = (subDir && subDir.filename) || item;
          var name = (subDir && subDir.name) || item;

          // if(fs.statSync(dirsPath + '/' + _filename) && fs.statSync(dirsPath + '/' + _filename).isFile()){
          //     _filename = path.parse(_filename).name;
          // }

          //如果是目录
          // 忽略下划线目录，如_test, _xxx
          if (depth && fs.statSync(dirsPath + '/' + item).isDirectory() && item.indexOf('_') != 0) {
              //获取目录里的脚本合并
              var data = {
                  name: item,
                  path: dirsPath + '/' + item,
                  fs: fs.readdirSync(dirsPath + '/' + item),
                  filename: (subDir && subDir.filename + "-" + item) || item
              };
              readPageDir(data, isPack, depth);
          } else
          if (fs.statSync(dirsPath + '/' + item).isFile()) {
              var ext = path.extname(dirsPath + '/' + item);
              if (chkType(ext.replace('.', '')) || ext === '.md') {
                  // 如果存在同名js
                  if (!sameName) {
                      if (name == item.replace(ext, '')) {
                          entrys[_filename] = [dirsPath + '/' + item];
                          sameName = true;
                      } else {
                          entrys[_filename] = entrys[_filename] || [];
                          entrys[_filename].push(dirsPath + '/' + item);
                      }
                  }
              }
          }
      });
  }

  readPageDir(null, isPack, opts.depth);

  if (isPack) {
      for (var name in entrys) {
          // package_ary.concat(clone(entrys[name]));
          if (entrys[name].length) {
              entrys[name].map(function(item, i) {
                  package_ary.push(item);
              });
          }
      }
      entrys = {};
      entrys[package_name] = package_ary;
  }
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
        isPack: false
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
        isPack  = opts.isPack;


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
        entry = initDir(pagesDir, preDefineDir, isPack, opts.depth)   // 分析目录并返回JSON

      if (isPack) {   // 打包成一个文件
        var ext = staticType === 'script' ? 'js' : type,
          _ultimates = ultimates = [],
          styleType = (staticType === 'style'&& type!=='sass')
            ? true
            : false

        //merge prepend or append
        package_name = dirname;
        for (var item in entry) {
          _ultimates = _.concat([], entry[item])   //合并所有文件到数组
        }
        ultimates = _.concat(opts.prepend, _ultimates, opts.append)

        // 有时候需要将目录打包输出成一个文件
        // 但是输出文件名字不是目录名
        // 可以通过`rename`重新制定输出的打包文件名
        // ==================================
        if (rename){
          package_name = rename
        }

        // 处理样式文件
        // ====================
        var requireListFile
        if (staticType === 'style') {
          for (var i = 0; i < ultimates.length; i++) {
            ultimates[i] = ultimates[i].replace('//', '/')

            //放弃webpack打包
            staticType === 'style'
              ? requireListFile += '@import "' + ultimates[i] + '";\n'     // gulp 模式
              : requireListFile += 'require("' + ultimates[i] + '");\n';   // webpack模式
          }

          var tmpFile = _.uniqueId('build-'),
            tmpDir = configs.dirs.dist + '/_tmp',
            tmpFile = configs.dirs.dist + '/_tmp/' + tmpFile + '.' + ext;


          // 清理临时目录
          gulp.task('cleantmp', function(cb) {
            del([ tmpDir + '/*.*' ], cb);
          })


          // 如果临时目录不存在则创建
          if (!fs.existsSync(tmpDir)) {
              fs.mkdirSync(tmpDir);
              fs.writeFileSync(tmpFile, requireListFile);
          }
          // 启动清理并写入新的文件
          else {
              gulp.start('cleantmp')
              fs.writeFileSync(tmpFile, requireListFile);
          }

          entry = {};
          entry[package_name] = [tmpFile];
          entry['key'] = package_name;
          entry['value'] = [tmpFile];
        }

        else {
          entry = {};
          entry[package_name] = ultimates;
          entry['key'] = package_name;
          entry['value'] = ultimates;
        }
        this.package_name = package_name;

      }

      else{  // isPack is false 打包成多个文件

      }

      return entry;
  }
}

var CssBuild = base.inherits( FkpBuild, {
  css: function(dir, opts, cb){
    var defaults = {
        reanme: undefined,
        type: undefined,
        prepend: [],
        append: [],
        depth: true,
        env: 'dev'
    }

    // 合并配置文件
    if (opts) {
      opts = _.extend(defaults, opts)
    }

    this.env = opts.env
    this.readDirs(dir, opts)
  }
})


var JsBuild = base.inherits( CssBuild, {
  js: function(dir, opts, cb){

  }
})

var HtmlBuild = base.inherits( JsBuild, {
  html: function(dir, opts, cb){

  }
})


var Build = base.inherits( HtmlBuild, {

})


function build(){
  return new Build(arguments)
}

module.exports = build()
