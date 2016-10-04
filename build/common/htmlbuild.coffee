module.exports = (util) ->
  _ = util._
  $ = util.$
  fs = util.fs
  path = util.path
  gulp = util.gulp
  configs = util.configs
  through = util.through
  gutil = util.gutil
  chkType = util.chkType
  marked = util.marked

  # 获取markdown文件的内容
  getMd = (opts) ->
    return through.obj (file, enc, cb) ->
      if file.isNull()
        cb(null, file)
        return

      if file.isStream()
        cb new gutil.PluginError('gulp-markdown', 'Streaming not supported')
        return

      mdtemp = fs.readFileSync( path.join(configs.dirs.src, 'html/_common/templet/md.hbs'), 'utf-8')

      marked.setOptions {
        renderer: new marked.Renderer()
        gfm: true
        tables: true
        breaks: false
        pedantic: false
        sanitize: true
        smartLists: true
        smartypants: false
      }

      marked file.contents.toString(), {}, (err, data) ->
        if (err)
          cb new gutil.PluginError('gulp-markdown', err, { fileName: file.path })
          return

        mdtemp = mdtemp.replace '~~md~~', data
        re = /<h2[^>]?.*>(.*)<\/h2>/ig
        mdMenu = ''
        mdMenuList = data.match(re)
        if mdMenuList && mdMenuList.length
          mdMenuList.map (item) ->
            mdMenu += '<li>' + re.exec(item)[1] + '</li>\n\r'
            re.lastIndex = 0

        data = mdtemp.replace '~~md-menu~~', mdMenu
        file.contents = new Buffer(data)
        file.path = gutil.replaceExtension(file.path, '_md.html')

        cb(null, file)

  # 获取html的数据，并将数据匹配至html的handlebars模板
  getHtmlData = (baseHtmlPath, opts) ->
    return through.obj (file, enc, cb) ->
      data = {}
      api=''
      _fileParse = path.parse(file.path)
      _filename = _fileParse.name
      _filePath = file.path.replace(path.resolve(baseHtmlPath), '').substring(1).replace(_fileParse.ext, '')
      _fileTmp = path.parse(_filePath)

      if _fileTmp.dir == _fileTmp.name
        _filePath = _fileTmp.dir
      else
        _filePath = _filePath.replace(/[\\|\/]/g, '-')

      data.commoncss = 'common.css'
      data.commonjs = 'common.js'
      data.pagecss = _filePath + '.css'
      data.pagejs = _filePath + '.js'

      if opts and opts.data
        data = opts.data

      if opts and opts.api
        api = _.clone(options.api)

      if _.has(data, _filename)
        data = _.extend(data, data[_filename])

      file.data = data

      # if api && _.has(api, _filename)
        # todo something

      cb(null, file)

# ============================

  return {
    html: (dir, opts, cb) ->
      defaults =
        reanme: undefined
        type: 'less'
        prepend: []
        append: []
        depth: true
        env: 'dev'
        pack: false
        method: false
        data: false

      # 合并配置文件
      opts = if opts then _.extend(defaults, opts) else defaults
      this.env = opts.env

      _files = this.readDirs(dir, opts)

      __files = []
      if _.isObject(_files)
        for item of _files
          if _.isArray _files[item]
            __files = __files.concat _files[item]

      this.gulpBuild(__files, opts)


    gulpBuild: (files, opts) ->
      list = {}
      indexList = {}
      tmpObj = {}
      baseHtmlPath = path.join configs.dirs.src, 'html/'

      parseTemplet = true
      _htmlDistPath = configs.htmlDevPath

      # clog('parse hbs:' + options.env)
      if ['pro', 'dev'].indexOf(this.env) > -1
        parseTemplet = false
        if this.env == 'pro'
          _htmlDistPath = configs.htmlBuildPath

      gulp.src files, { base: baseHtmlPath }
      .pipe( do () ->
        return through.obj (file, enc, cb) ->
          ext_name = path.parse(file.path).ext.replace('.', '')
          if (chkType(ext_name) || ext_name == 'md')
            this.push(file)
          cb()
      )
      .pipe $.newer(configs.htmlDevPath)
      .pipe $.plumber()
      .pipe $.if('*.md', getMd(opts))
      .pipe $.fileInclude {
          prefix: '@@'
          basepath: '@file'
          test: '123456'
          context:
            dev: !gutil.env.production
        }
      .pipe $.size()
      .pipe getHtmlData(baseHtmlPath, opts)
      .pipe $.if(parseTemplet, $.compileHandlebars())
      .pipe $.rename( (path) ->
          if (path.extname != '.php' || path.extname != '.jsp')
            path.extname = '.html'
            if (path.extname == '.md') then path.extname = '.md.html'
        )
      .pipe gulp.dest(_htmlDistPath)

  } # end return
