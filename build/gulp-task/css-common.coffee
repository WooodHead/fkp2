path = require 'path';
config = require '../out_config';

module.exports = (gulp, $, slime, env, port)-> 
    return () ->
        slime.css config.globalCssDir, {
          pack: true
          env: env
          type: 'less'
          rename: 'common'
        }

        # slime.build(config.globalCssDir,true,{
        #     env: env,
        #     type: 'less',
        #     rename: 'common',
        #     prepend: [path.join(config.globalCssDir+'/_base/index.less')]
        # });
