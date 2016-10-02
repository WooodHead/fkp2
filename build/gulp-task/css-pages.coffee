config = require '../out_config';
module.exports = (gulp, $, slime, env)->
    return () ->
        slime.build(config.pageCssDir,false,{type: 'less', env: env});
