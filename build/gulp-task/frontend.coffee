# 最后被执行的方法，在这里启动css/images/third/html的watch及生成静态资源镜像文件
# demo: slime will server it
# dev: node will server
# pro: node will server
# build: no server
# this module will write map file about static js/css
module.exports = (gulp, $, slime, env)->
    return (cb)->
      slime.mapfile()
      .openBrowse()
      if process.env.WATCH_FILE is 'true'
        slime.watch()
