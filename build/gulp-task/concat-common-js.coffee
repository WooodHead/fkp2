fs = require 'fs'
path = require 'path';
config = require '../out_config.coffee';


# 组装数组，用来打包成common.js
# 不能调换顺序
# config.globalList下的 global/config.js修正了一些库的版本兼容问题
# 比如react 14 版本以后 render挂载在 ReactDOM 上
# config.js中从新绑定render等方法到React上，修正13,14,15版的兼容问题
# 我们可以把修正的内容卸载 global/config.js文件下
# 该文件作为全局运行
getFileMap = (env) ->
		# if (env indexOf 'ng') then return config.vendorList_ng.concat(config.globalList)
		# if (env indexOf 'bb') then return config.vendorList_bb.concat(config.globalList)
		_vlist = config.vendorList_adv[0]
		if (env == 'pro') then _vlist = config.vendorList_adv[1]
		return _vlist.concat(config.globalList)  # for advance browser


module.exports = (gulp, $, slime, env)->
		return () ->
				slime.js getFileMap(env), {
					pack: true
					rename: 'precommon'
					env: env
				}
