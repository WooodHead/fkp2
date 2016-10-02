fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config'

module.exports = (gulp,$)->
    return ()->
        gulp.src config.dirs.src + '/js/_copy2dist/**/*.*'
            .pipe($.plumber())
            # .pipe $.uglify()
            .pipe $.size()
            # .pipe $.copyExt()
            .pipe gulp.dest(config.jsBuildPath+'/t/')
