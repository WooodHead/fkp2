config = require '../out_config';

module.exports = (gulp,$,slime,env)->
    return (cb) ->
        slime.build 'global', false, {"env": env, source: 'dir'}, cb

        # slime.build ['pages'], false, {"env": env, noCommon: false, source: 'dir'}, cb
