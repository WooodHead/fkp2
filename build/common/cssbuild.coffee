module.exports = (util) ->
  _ = util._
  $ = util.$
  del = util.del
  gulp = util.gulp
  path = util.path
  configs = util.configs
  gutil = util.gutil
  through = util.through

  return {
    css: (dir, opts, cb) ->
      defaults =
        reanme: undefined
        type: 'less'
        prepend: []
        append: []
        depth: true
        env: 'dev'
        pack: false,
        method: false,
        dist: ''

      # 合并配置文件
      opts = if opts then _.extend(defaults, opts) else defaults
      this.env = opts.env

      _files = this.readDirs(dir, opts)

      if opts.env == 'pro'
        opts.md5 = true
      else
        opts.md5 = false

      _cssDistPath = path.join configs.cssDevPath, opts.dist
      _imgDistPath = configs.imagesDevPath
      if this.env == 'pro'
        _cssDistPath = path.join configs.cssBuildPath, opts.dist
        _imgDistPath = configs.imagesBuildPath

      this.cssruntime = {
        cssDistPath: _cssDistPath
        imgDistPath: _imgDistPath
        files: _files
        callback: cb
        md5: opts.md5
        opts: opts
      }

      this.gulpCssBuild(_files, opts)

    # gulp build css
    gulpCssBuild: (files, opts) ->
      _cssDistPath = this.cssruntime.cssDistPath
      _imgDistPath = this.cssruntime.imgDistPath
      _md5 = this.cssruntime.md5

      switch opts.type
        when "less"   then cssstyle = $.less || $.empty
        when "styl"   then cssstyle = $.stylus || $.empty
        when "stylus" then cssstyle = $.stylus || $.empty
        when "sass"   then cssstyle = $.sass || $.empty
        when "scss"   then cssstyle = $.sass || $.empty
        else cssstyle = $.less || $.empty

      errrHandler = ( e ) ->
          # 控制台发声,错误时beep一下
          gutil.beep()
          gutil.log( e )

      tmp = (item) ->
        gulp.src files[item]
        .pipe $.plumber({ errorHandler: errrHandler })
        .pipe $.if('*.less', (if $.less then $.less() else $.empty()) )
        .pipe $.if('*.styl', (if $.stylus then $.stylus() else $.empty()) )
        .pipe $.if('*.stylus', (if $.stylus then $.stylus() else $.empty()) )
        .pipe $.if('*.css',  $.empty())
        # .pipe cssstyle()
        .pipe $.autoprefixer({
            browsers: ['last 2 versions', 'not ie <= 8', 'Firefox > 20', 'iOS > 6', 'Android > 4'],
            cascade: true
          })
        # .pipe $.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')
        # .pipe if (files._src || files._ary) then $.rename({ 'extname': '.css' }) else $.concat(item + ".css")
        .pipe $.concat(item + ".css")
        .pipe $.if( _md5, $.minifyCss())
        .pipe $.if( _md5, $.md5 {size: 10, separator: '__'} )
        .pipe gulp.dest(_cssDistPath)
        .pipe $.cssSpritesmith({
          # sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
          # imagepath: configs.imagesDevPath + 'slice/',
          imagepath: _imgDistPath + 'slice/demo/'
          # 映射CSS中背景路径，支持函数和数组，默认为 null
          imagepath_map: null
          # 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
          # 基于静态css文件的相对路径
          spritedest: '../images/sprite/demo/'
          # 替换后的背景路径，默认 ../images/
          # 基于静态css文件的相对路径
          spritepath: '../images/sprite/demo/'
          # 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
          padding: 20
          # 是否使用 image-set 作为2x图片实现，默认不使用
          useimageset: false
          # 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
          newsprite: false
          # 给雪碧图追加时间戳，默认不追加
          spritestamp: false
          # 在CSS文件末尾追加时间戳，默认不追加
          cssstamp: false
        })
        .pipe $.debug({ title: 'sprite:' })
        .pipe $.if '*.png', gulp.dest(_imgDistPath)
        .pipe $.if '*.css', gulp.dest('./')

      for file, val of files
        tmp(file)


    # webpack build css
    wpCssBuild: (files) ->

  }
