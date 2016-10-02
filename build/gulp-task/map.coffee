fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config';
through = require 'through2'

# 检查文件是否为3.3、4.4的异步调用模块状态，临时解决
fileProfile = (file) ->
    _file = path.parse(file.path)
    stat = /[\d]*\.[\d]*/.test(_file.name)
    return stat

  # return through.obj(fileProfile)

module.exports = (gulp, $, slime, env, port)->

    mapJson =
        version: config.version
        name: "sipin-webstore"
        createdAt: (new Date()).toString()
        commonDependencies: {
            css: {}
            js: {}
        } ,
        dependencies: {
            css: {}
            js: {}
        }

    gulp.task 'buildMap:js',['buildCommon:pro','html:build','ie:dev'], ->
        dealWithJs = () ->
            gulp.src [config.jsDevPath + '/**/*.js','!'+config.jsDevPath+'/_common.js']
                .pipe $.if(fileProfile, $.empty(), $.md5({
                        size: 10,
                        separator: '.'
                    }))
                .pipe $.uglify()
                .pipe $.size()
                .pipe gulp.dest(config.jsBuildPath)
                .pipe $.map (file)->
                    _filename = path.basename(file.path).toString() ;
                    _filename = _filename.slice(0, _filename.length) ;
                    filename = _filename.slice(0, _filename.length - 14) ;
                    filename = filename.replace(/-/g,"/") ;
                    if(filename == "common" || filename == "ie")
                        mapJson['commonDependencies']['js'][filename] = _filename;
                    else
                        mapJson['dependencies']['js'][filename] = _filename;
                    return;

        dealWithJs()
        # setTimeout dealWithJs, 2000


    # gulp.task 'buildAdminCss',['images:build','buildMap:js'],->
    #     # gulp.src [config.cssDevPath + '/common.css',config.cssDevPath + '/article.css',config.cssDevPath + '/goods.css']
    #     gulp.src [config.cssDevPath + '/common.css',config.cssDevPath + '/article.css',config.cssDevPath + '/goods.css']
    #         .pipe $.concat("style.css")
    #         .pipe $.minifyCss()
    #         .pipe $.size()
    #         .pipe gulp.dest(config.cssBuildPath+'/admin-css')


    # gulp.task 'buildMap:css',['buildAdminCss'], ->
    gulp.task 'buildMap:css',['images:build','buildMap:js'], ->
        gulp.src config.cssDevPath + '/**/*.css'
            .pipe $.md5({
                size: 10,
                separator: '.'
            } )
            .pipe $.minifyCss()
            .pipe $.size()
            .pipe gulp.dest(config.cssBuildPath)
            .pipe $.map (file) ->
                _filename = path.basename(file.path).toString() ;
                _filename = _filename.slice(0, _filename.length) ;
                filename = _filename.slice(0, _filename.length - 15) ;
                filename = filename.replace(/-/g,"/") ;
                if(filename == "common")
                    mapJson['commonDependencies']['css'][filename] = _filename;
                else
                    mapJson['dependencies']['css'][filename] = _filename;
                return



    gulp.task 'buildMap:writeMap',['buildMap:css','fonts:build'], () ->
        gulp.src config.htmlDevPath + '/**/*.*'
            .pipe $.size()
            # .pipe $.copyExt()
            .pipe gulp.dest(config.htmlBuildPath)

        dealWithMapJson = () ->
            fs.writeFileSync( config.staticPath + '/map.json', JSON.stringify(mapJson)) ;

        dealWithMapJson()
        # setTimeout dealWithMapJson, 6500


    return ()->
        gulp.start 'buildMap:writeMap'
        gulp.start 'copyThirdJsToDist:pro'
