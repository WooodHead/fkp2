config = require '../out_config';

module.exports = (gulp, $, slime, env, port)->
    return (cb) ->
        slime.build ['pages'], false, {
          env: env
          noCommon: false
          source: 'dir'
          port: port
        }, cb
