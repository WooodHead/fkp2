fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config'

module.exports = (gulp, $, slime, env)->
    return ()->
      slime.copy([config.dirs.src + '/css/_copy2dist/**/*.*'], config.cssDevPath+'/t/')
