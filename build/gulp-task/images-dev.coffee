path = require 'path'
gutil = require 'gulp-util'
config = require '../out_config';


module.exports = (gulp, $, slime, env, port)->
    return ()->
        _dist = config.imagesDevPath
        if (env == 'pro')
           _dist = config.imagesBuildPath

        gulp.src config.dirs.src + '/images/**/*.*'
          # .pipe $.newer(config.imagesDevPath)
          .pipe($.plumber())
          # .pipe $.rimraf()
          .pipe $.size()
          .pipe gulp.dest(_dist)
