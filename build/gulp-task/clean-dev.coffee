gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config'

module.exports = (gulp,$) ->
  return () ->
    gulp.src( [config.htmlDevPath, config.jsDevPath, config.cssDevPath, config.imagesDevPath, config.fontsDevPath,config.tmpPath])
    .pipe($.rimraf())
