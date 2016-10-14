# gulp-task/server 前的最后一个动作
# webpack 处理 ./public/js/pages/** 目录，业务部分
# pages/**/ => dist/**.js  多级目录为 dist/**-**-**-**.js，无限级深
config = require '../out_config';
module.exports = (gulp, $, slime, env, port)->
    demo = false
    if env == 'demo'
      env = 'dev'
      demo = true
    return (done) ->
      slime.js [config.dirs.pages], { env: env }, done
      .wpJsBuild(demo)
