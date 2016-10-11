fs = require 'fs'
path = require 'path'
config = require '../out_config';
browserSync = require 'browser-sync'
reload = browserSync.reload

_md5 = false;
_src = {
    js: [config.staticPath + '/dev/js/*.js','!'+config.jsDevPath+'/precommon.js'],
    css: [config.staticPath + '/dev/css/*.css'],
    mapj: config.staticPath + '/dev/map.json'
}

module.exports = (gulp,$,slime,env)->
    mapJson =
        version: config.version
        name: "fkp"
        createdAt: (new Date()).toString()
        commonDependencies: {
            css: {}
            js: {}
        } ,
        dependencies: {
            css: {}
            js: {}
        }

    gulp.task 'map:jsdev',()->
        gulp.src _src.js
        .pipe $.size()
        .pipe $.map (file)->
          _fileparse = path.parse(file.path)
          _filename = _fileparse.base
          filename = _fileparse.name.replace(/-/g,'/')
          if (filename.indexOf('__'))
              filename = filename.split('__')[0]

          if filename.indexOf("common")>-1 || filename.indexOf("ie")>-1
              mapJson['commonDependencies']['js'][filename] = _filename;
          else
              mapJson['dependencies']['js'][filename] = _filename;
          # return;


    gulp.task 'map:cssdev',['map:jsdev'],()->
      gulp.src _src.css
      .pipe $.size()
      .pipe $.map (file)->
        _fileparse = path.parse(file.path)
        _filename = _fileparse.base
        filename = _fileparse.name.replace(/-/g,'/')
        filename = _fileparse.name.replace(/-/g,'/')
        if (filename.indexOf('__'))
            filename = filename.split('__')[0]
        if(filename == "common" || filename == "ie")
            mapJson['commonDependencies']['css'][filename] = _filename;
        else
            mapJson['dependencies']['css'][filename] = _filename;

        fs.writeFileSync( _src.mapj,  JSON.stringify(mapJson)) ;
        return;

    gulp.task 'rebuild:html', ['map:cssdev'], ()->
      gulp.start 'html:build'

    gulp.task 'rebuild:dev', ['map:cssdev'], ()->
      gulp.start 'html:dev'


    # demo 环境
    doSync = ( stat, cb )->
      buildCommon = 'buildCommon:dev'


    return (cb)->
      if (env == 'pro')
        _md5 = true
        _src = {
            js: [config.staticPath + '/js/*.js','!'+config.staticPath+'/js/precommon.js']
            css : [config.staticPath + '/css/*.css']
            mapj: config.staticPath + '/map.json'
        }

      if ['pro', 'dev'].indexOf(env)>-1
        if env == 'dev'
          gulp.start 'rebuild:dev'
        else
          gulp.start 'rebuild:html'
      else
        if env.indexOf('ng') > -1
          gulp.start 'rebuild:html'
