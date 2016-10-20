env = 'dev'
fs = require('fs')
$ = require('gulp-load-plugins')()
path = require('path')
gulp = require('gulp')
minimist = require('minimist')
args = process.argv.splice(2);
options = minimist(args)
slime = require('./build/fkp.build.config') { gulp: gulp }

process.env.WATCH_FILE = 'true'   # build时不需要watch
setEnv = (_env) ->
  if _env == 'demo'
    process.env.NODE_ENV = 'development'
    process.env.SHADOW_NODE_ENV = 'demo'

switch args[0]
  when 'demo' then setEnv('demo')
  when 'dev' then process.env.NODE_ENV = 'development'
  when 'build' then process.env.NODE_ENV = 'production'
  when 'pro' then process.env.NODE_ENV = 'production'
  else process.env.NODE_ENV = 'development'

# 调度函数
getTask = (task,env,port)->
    if !env
        env = 'dev'
    require('./build/gulp-task/'+task)(gulp, $, slime, env, port)

# 清理dist/目录
gulp.task 'clean:pro', getTask('clean-build')

# 清理dist/dev目录
gulp.task 'clean:dev', getTask('clean-dev')


gulp.task 'watch', ()->
  if options.port
    getTask('watch', 'dev', options.port)()
  else
    getTask('watch', 'dev')()

gulp.task 'watch:pro', ()->
  if options.port
    getTask('watch', 'pro', options.port)()
  else
    getTask('watch','pro')()

#----
# ly demo   // watch  启动DEMO服务器， watch性能较好，用于静态开发环境
# ly dev    // watch  启动node服务器   watch性能较好，用于node开发环境
# ly pro    // watch  启动node服务器   watch性能较差，用于node/生产文件是否有问题
# ly build  // no watch 构建任务，生成压缩版  不启动服务器
gulp.task "demo", ['clean:dev', 'html:demo', 'ie:dev', 'fonts:dev', 'pagecss:dev', 'copyThirdJsToDist:dev', 'buildCommon:demo'] , getTask('frontend', 'demo')  # for demo
gulp.task "dev", ['clean:dev', 'html:dev', 'ie:dev','fonts:dev','pagecss:dev','copyThirdJsToDist:dev','buildCommon:dev'] , getTask('frontend','dev')  # for dev
gulp.task "pro", ['clean:pro','html:pro', 'ie:pro','fonts:pro','pagecss:pro','copyThirdJsToDist:pro','buildCommon:pro'] , getTask('frontend','pro')  # for dev
gulp.task 'build',['clean:dev','clean:pro'], () ->
  process.env.WATCH_FILE = 'false'
  gulp.start 'pro'
gulp.task 'default',['clean:dev'], ->
  gulp.start 'demo'

# ----
# 对静态页面进行编译
gulp.task 'html', getTask('html', 'demo')     #webpack解析
gulp.task 'html:demo', getTask('html', 'demo')     #webpack解析
gulp.task 'html:dev', getTask('html','dev')   #交由服务器端解析
gulp.task 'html:pro', getTask('html','pro')   #交由服务器端解析
gulp.task 'html:build', getTask('html','pro') #交由服务器端解析

# ----
# 合并ie8需要的脚本依赖
gulp.task 'ie:dev', getTask('ie', 'dev')
gulp.task 'ie:pro', getTask('ie', 'pro')

#----
# 对字体图标资源复制至dist
gulp.task 'fonts:dev', getTask('fonts-dev', 'dev')
gulp.task 'fonts:pro', getTask('fonts-dev', 'pro')
gulp.task 'fonts:build', getTask('fonts-build')


#----
# page.css  合并雪碧图
# gulp.task 'pagecss:dev', getTask('css-pages')
gulp.task 'pagecss:dev',['commoncss:dev','images:dev'], getTask('css-pages', 'dev')
gulp.task 'pagecss:pro',['commoncss:pro','images:pro'], getTask('css-pages', 'pro')


#----#----
# common.css
gulp.task 'commoncss:dev', getTask('css-common', 'dev')
gulp.task 'commoncss:pro', getTask('css-common', 'pro')

#----#----
# 对图像资源复制至dist
gulp.task 'images:dev', getTask('images-dev', 'dev')
gulp.task 'images:pro', getTask('images-dev', 'pro')

#----
# 拷贝如编辑器这样的无法分解的前端js
gulp.task 'copyThirdJsToDist:dev', ['copyThirdCssToDist:dev'], getTask('js-copy2-dev')
gulp.task 'copyThirdJsToDist:pro', ['copyThirdCssToDist:pro'], getTask('js-copy2-build')

#----#----
# 拷贝如组件（JS + CSS）类似的CSS
gulp.task 'copyThirdCssToDist:dev', getTask('css-copy2-dev')
gulp.task 'copyThirdCssToDist:pro', getTask('css-copy2-build')

#----
gulp.task 'commonjs:dev', getTask('concat-common-js', 'dev')
gulp.task 'commonjs:pro', getTask('concat-common-js', 'pro')

#----
# 构建任务，生成未压缩
gulp.task 'buildCommon:demo',['commonjs:dev', 'wp:demo']
gulp.task 'buildCommon:dev',['commonjs:dev', 'wp:dev']
gulp.task 'buildCommon:pro',['commonjs:pro', 'wp:pro']

#----
# js/pages编译并生成_common.js
gulp.task 'wp:demo', getTask('wp', 'demo')
gulp.task 'wp:dev', getTask('wp', 'dev')
gulp.task 'wp:pro', getTask('wp', 'pro')
