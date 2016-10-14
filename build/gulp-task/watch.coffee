spawn = require('child_process').spawn
exec = require('child_process').exec
path = require('path')
browserSync = require('browser-sync').create()
reload  = browserSync.reload
config = require '../out_config';

module.exports = (gulp,$,slime,env,port)->
    return () ->
      if env == 'demo' then env = 'dev'

      # 监控css文件
      gulp.watch [config.dirs.src + '/css/?(global|pages)/**/*.?(less|css|styl)',
      config.dirs.watch_src + '/images/slice/*.png'], ['pagecss:'+env], () ->

      # 监控第三方直传文件: css
      gulp.watch [ config.dirs.src + '/css/_copy2dist/**/*.?(less|css|styl)', config.dirs.src + '/images/slice/*.png' ], ['copyThirdCssToDist:'+env], () ->
          console.log 'copy2css watch'

      # 监控第三方直传文件:js
      gulp.watch config.dirs.src + '/js/_copy2dist/**/*.?(coffee|js|jsx|ts|tsx)', ['copyThirdJsToDist:'+env], () ->
          console.log 'copy2js watch'

      # watch图片文件
      gulp.watch config.dirs.src + '/images/**/*.*', ['images:'+env], () ->
          console.log 'images watch'

      # html
      if process.env.SHADOW_NODE_ENV == 'demo'
        gulp.watch config.dirs.src + '/html/**/*.*', ['html:demo']
      else
        gulp.watch config.dirs.src + '/html/**/*.*', ['html:'+env]
