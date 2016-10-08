config = require '../out_config';

module.exports = (gulp, $, slime, env)->
    return () ->
        slime.js(
          config.ieRequireList,
          {
            rename: 'ie'
            env: env
            pack: true
          }
        )
