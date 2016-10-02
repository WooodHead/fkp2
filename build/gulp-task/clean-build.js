var gulp = require('gulp'),
    gutil = require('gulp-util'),
    config = require('../out_config')

module.exports = function(gulp,$){
    return function(){
      gulp.src([config.jsBuildPath, config.cssBuildPath, config.imagesBuildPath, config.fontsBuildPath, config.htmlBuildPath, config.tmpPath])
        .pipe($.rimraf())
    }
}
