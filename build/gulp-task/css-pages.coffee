config = require '../out_config';

module.exports = (gulp, $, slime, env, port)->
  return (cb) ->
      slime.css config.pageCssDir, {
        pack: false
        type: 'less'
        env: env
      }
      cb()
