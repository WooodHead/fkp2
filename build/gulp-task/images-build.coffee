fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config';


module.exports = (gulp,$)->
    return ()->
        gulp.src config.imagesDevPath + '/**/*.*'
            # .pipe $.newer(config.imagesBuildPath)
            # .pipe($.plumber())
            # .pipe $.rimraf()
            .pipe $.size()
            .pipe gulp.dest(config.imagesBuildPath)
