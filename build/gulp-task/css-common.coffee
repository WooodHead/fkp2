path = require 'path';
config = require '../out_config';

module.exports =
  (gulp, $, slime, env, port)->
    return (cb) ->
        slime.css config.globalCssDir, {
          pack: true
          env: env
          type: 'less'
          rename: 'common'
        }
        cb()
