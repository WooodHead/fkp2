config = require '../out_config';

module.exports = (gulp, $, slime, env, port)->
    return (done) ->
      slime.js ['pages'], { env: env }, done
      .wpJsBuild()
