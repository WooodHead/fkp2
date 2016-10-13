config = require '../out_config';

module.exports = (gulp, $, slime, env, port)->
    demo = false
    if env == 'demo'
      env = 'dev'
      demo = true
    return (done) ->
      slime.js [config.dirs.pages], { env: env }, done
      .wpJsBuild(demo)
