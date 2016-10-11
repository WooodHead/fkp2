fs = require('fs')
path = require('path')
gulp = require('gulp')
gutil = require('gulp-util')
minimist = require('minimist')
configs = require './config'
slime = require('./build/fkp.build.config')({
  gulp: gulp
})

env = 'dev'
args = process.argv.splice(2);
options = minimist(args)

process.env.WATCH_FILE = 'true'
switch args[0]
  when 'dev' then process.env.NODE_ENV = 'development'
  when 'build' then process.env.NODE_ENV = 'production'
  when 'pro' then process.env.NODE_ENV = 'production'
  else process.env.NODE_ENV = 'development'

# Load plugins
$ = require('gulp-load-plugins')()

# 初始化生成临时目录
tmpDir = './dist/_tmp'
if !fs.existsSync('./dist')
   fs.mkdirSync('./dist')
   if  !fs.existsSync(tmpDir)
       fs.mkdirSync(tmpDir);

getTask = (task,env,port)->
    if !env
        env = 'dev'
    require('./build/gulp-task/'+task)(gulp, $, slime, env, port)



# 清理dist/目录
gulp.task 'clean:build', getTask('clean-build')

# 清理dist/dev目录
gulp.task 'clean:dev', getTask('clean-dev')

# 构建任务，生成压缩版与未压缩版
gulp.task 'build',['clean:dev','clean:build'], () ->
    process.env.WATCH_FILE = 'false'
    gulp.start 'pro'

# 默认启动本地DEMO服务器
gulp.task 'default',['clean:dev'], ->
    gulp.start 'server'


gulp.task 'watch', ()->
    if options.port
        gulp.start 'watch:dev:port'
    else
        gulp.start 'watch:dev'

gulp.task 'watch:pro', ()->
    if options.port
        gulp.start 'watch:pro:port'
    else
        gulp.start 'watch:pro'

#----
gulp.task 'watch:dev', getTask('watch', 'dev')
gulp.task 'watch:dev:port', getTask('watch', 'dev', options.port)
gulp.task 'watch:pro', getTask('watch','pro')
gulp.task 'watch:pro:port', getTask('watch', 'pro', options.port)


#----
#本地资源静态DEMO服务器/代理动态(koajs)服务器
gulp.task "server", ['html','ie:dev','fonts:dev','pagecss:dev','copyThirdJsToDist:dev','buildCommon:dev'] , getTask('server')  # for demo
gulp.task "dev", ['clean:dev', 'ie:dev','fonts:dev','pagecss:dev','copyThirdJsToDist:dev','buildCommon:dev'] , getTask('server','dev')  # for dev
gulp.task "pro", ['clean:build','ie:pro','fonts:pro','pagecss:pro','copyThirdJsToDist:pro','buildCommon:pro'] , getTask('server','pro')  # for dev

# ----
# 对静态页面进行编译
gulp.task 'html', getTask('html')  #webpack解析
gulp.task 'html:dev', getTask('html','dev')   #交由服务器端解析
gulp.task 'html:pro', getTask('html','pro') #交由服务器端解析
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
gulp.task 'pagecss:dev',['commoncss:dev','images:dev'], getTask('css-pages')
gulp.task 'pagecss:pro',['commoncss:pro','images:pro'], getTask('css-pages', 'pro')


#----#----
# common.css
gulp.task 'commoncss:dev', getTask('css-common')
gulp.task 'commoncss:pro', getTask('css-common', 'pro')

#----#----
# 对图像资源复制至dist
gulp.task 'images:dev', getTask('images-dev')
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
# gulp.task 'buildCommon:dev',['wp:dev'], getTask('concat-common-js', 'dev')
# gulp.task 'buildCommon:dev:ng',['wp:dev'], getTask('concat-common-js','ng')
# gulp.task 'buildCommon:dev:bb',['wp:dev'], getTask('concat-common-js','bb')
# # pro
# gulp.task 'buildCommon:pro',['wp:pro'], getTask('concat-common-js', 'pro')
# gulp.task 'buildCommon:pro:ng',['wp:pro'], getTask('concat-common-js','ng')
# gulp.task 'buildCommon:pro:bb',['wp:pro'], getTask('concat-common-js','bb')

gulp.task 'buildCommon:dev',['commonjs:dev', 'wp:dev']
gulp.task 'buildCommon:pro',['commonjs:pro', 'wp:pro']


#----
# js/pages编译并生成_common.js
# gulp.task 'wp:dev', ['g:dev'], getTask('wp')
# gulp.task 'wp:pro', ['g:pro'], getTask('wp', 'pro')
gulp.task 'wp:dev', getTask('wp', 'dev')
gulp.task 'wp:pro', getTask('wp', 'pro')

#----#----
# global
gulp.task 'g:dev', getTask('g')
gulp.task 'g:pro', getTask('g', 'pro')
