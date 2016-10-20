fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config';

module.exports = (gulp, $, slime, env)->
    return ()->
      gulp.src [config.dirs.server + '/**/*.*']
        .pipe($.plumber())
        .pipe($.babel({
          presets: [
            'es2015',
            "react",
            "stage-0",
            "stage-1",
            "stage-3"
          ],
          plugins: [
            'transform-runtime',
            "add-module-exports"
          ]
        }))
        .pipe(gulp.dest(config.dirs.shadow));
