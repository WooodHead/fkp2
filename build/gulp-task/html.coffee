fs = require 'fs'
path = require 'path'
config = require '../out_config'

module.exports = (gulp, $, slime, env, _path)->
  return () ->
    if env == 'REST'  # 请求来自node
      if _path
        rootDir = _path
        list = slime.makeHtmlListData(_path)
        datas = { demoindex: list } # index html模板名称    list: 模板数据
        return datas
      else
        return
    else
      if ['pro', 'dev', 'demo'].indexOf(env)>-1
        list = slime.makeHtmlListData()
        datas = { demoindex: list }

      # 生成分页并生成列表页
      slime.html config.dirs.src + '/html/', {
        type: 'hbs'
        data: datas
        env: env
        pack: true
      }
