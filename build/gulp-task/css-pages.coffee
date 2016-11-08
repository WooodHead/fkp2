config = require '../out_config';

module.exports = (gulp, $, slime, env, port)->
  return (cb) ->
    slime.css config.pageCssDir, { type: 'less', env: env }
    slime.css config.dirs.src + '/css/modules/', { type: 'less', env: env, dist: 'm' }
    cb()
