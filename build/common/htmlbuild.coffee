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
  del = util.del
  grabString = util.base.grabString

  # 首页列表数据
  makeHtmlListData = (_path, _capt) ->
    port = 8070
    rootDir = configs.dirs.src + '/html'
    ipaddress = this.ipAddress()
    docDir = _path || ''
    list = {}
    tmp = {};
    tip = ipaddress[0]
    if ipaddress[1]
      tip = 'www.agzgz.com'
      port = 0
    ipport = if port then ':'+port else ''
    depth=1

    mklist = (htmlPath, caption, parent) ->
        depth++
        htmlDirPath = htmlPath || rootDir
        htmlDir = fs.readdirSync( htmlDirPath );
        depthDir = htmlDirPath.replace('public/html/','')
        _caption = caption || 'root'

        list[ _caption ] = list[ _caption ] || {}
        list[ _caption ].group = list[ _caption ].group || _caption
        list[ _caption ].caption = _caption
        list[ _caption ].list = list[ _caption ].list || []
        list[ _caption ]['parent'] = parent||'root'
        list[ _caption ]['children'] =[]

        dirJson = path.parse(htmlDirPath)
        if dirJson.base != 'html' && dirJson.dir != './html' && dirJson.dir != rootDir
          list[ _caption ].subtree = true

        htmlDir.map (filename)->
            firstPath = htmlDirPath + '/' + filename
            firstStat = fs.statSync(firstPath);

            if firstStat.isFile() and filename.indexOf('_')!=0 and filename!='demoindex'
                ext = path.extname(filename)
                depthFile = filename.replace(ext, '.html')
                if chkType(ext) == 'templet'
                  content = fs.readFileSync(firstPath,'utf8')

                  getTitle = () ->
                    title = content.match(/<title>([\s\S]*?)<\/title>/ig)
                    if (title && title[0].indexOf("{{title}}")>-1 )
                      title = [/<meta name="subtitle" content=(.*?)\/>/.exec(content)[1].replace(/["|']/g, '')]
                    return title

                  _url = '/'
                  getUrl = () ->
                    _url = filename.replace(ext,'.html')
                    if caption then _url = caption + '/' + _url
                    return '/'+_url

                  getIPUrl = () ->
                    _ipurl = 'http://'+ tip + ipport + '/' + _url
                    return _ipurl.replace(/\/\//g,'/').replace(':/','://')

                  title = getTitle()
                  if (!title) then console.log 'hbs 没有标题'

                  if(title && title[0])
                    fileprofile ={
                      url: getUrl()
                      ipurl: getIPUrl(this.url)
                      group: _caption
                      title: title[0].replace(/\<(\/?)title\>/g,'').replace(/ \{(.*)\}/g, '')
                      stat: ''
                      fileName: filename.replace(ext,'.html')
                      fullpath: firstPath
                      des: ''
                      mdname: ''
                      ctime: firstStat.ctime
                      birthtime: firstStat.birthtime
                    }

                    # html同名的md说明文件
                    firstMd = firstPath.replace(ext,'.md')
                    filenameMd = filename.replace(ext, '.md')
                    if(fs.existsSync(firstMd))
                      tmp[filenameMd] = true;
                      desContent = fs.readFileSync(firstMd,'utf8')
                      fileprofile.des = grabString(desContent,200,true)
                      fileprofile.mdname = gutil.replaceExtension(filename, '_md.html')

                    list[ _caption ].list.push(fileprofile)

                if ext == '.md'
                  fileStat = ''  # 文件title在列表中的状态，如推荐，热门等等，通过title的头字符描述
                  getTitle = (cnt)->
                    title = cnt.match(/#([\s\S]*?)\n/)||''
                    if title then title = _.trim title[1].replace(/ \{(.*)\}/g, '')  # 清除自定义属性，如{"id":"xxx"}
                    if title.indexOf('@')==0
                      title = title.substring(1)
                      fileStat = 'recommend'
                    return title

                  getDescript = (cnt)->
                    return cnt.match(/>([\s\S]*?)\n/)

                  getUrl = ()->
                    _filenameMd = filename.replace(ext, '_md.html')
                    _url = if caption then depthFile.replace('.html','_md.html') else ( (caption || '') + '/' + _filenameMd )
                    if docDir and firstPath.indexOf docDir > -1
                      if _url.indexOf('/')==0 then _url = _url.substring(1)
                      _append_url = _url.replace('_md.html', '').replace(/\//g,'_')
                      return '?md='+_append_url

                  if !tmp[filename]
                    content = fs.readFileSync firstPath,'utf8'
                    descript = getDescript content
                    title = getTitle content
                    _url = getUrl()
                    _ipurl = 'http://'+ tip + ipport + '/' + _url
                    _ipurl = _ipurl.replace(/\/\//g,'/').replace(':/','://')

                    if docDir and firstPath.indexOf docDir == -1
                      filename = filename.replace(ext,'_md.html')

                    if title
                      fileprofile = {
                        url: _url
                        ipurl: _ipurl
                        group: _caption
                        title: title
                        stat: fileStat
                        fileName: filename
                        fullpath: firstPath
                        des: descript
                        mdname: ''
                        ctime: firstStat.ctime
                        birthtime: firstStat.birthtime
                      }
                      list[ _caption ].list.push(fileprofile)

            if firstStat.isDirectory() and filename.indexOf('_') != 0
              list[ _caption ]['children'].push(filename)
              list[ _caption ].subtree = firstPath
              mklist(firstPath, filename, _caption)

    mklist(_path, _capt)
    return list

# =============================
# 运行时处理模板需要的数据

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
        data = _.extend data, opts.data

      if opts and opts.api
        api = _.clone(options.api)

      if _.has(data, _filename)
        data = _.extend(data, data[_filename])

      file.data = data

      # if api && _.has(api, _filename)
        # todo something

      cb(null, file)

# ============================
# 返回slime的模板处理方法

  return {
    makeHtmlListData: makeHtmlListData

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
      opts.pack = true
      this.htmlruntime = {}

      if opts.env == 'demo'
        this.env = 'dev'
        opts.env = 'dev'
        this.htmlruntime.demo = true
      else
        this.env = opts.env
        this.htmlruntime.demo = false

      _files = this.readDirs(dir, opts)

      __files = _files
      if _.isObject(_files) and opts.pack
        __files = []
        for item of _files
          __files = __files.concat _files[item]

      this.gulpHtmlBuild(__files, opts)


    gulpHtmlBuild: (files, opts) ->
        that = this
        parseTemplet = true
        baseHtmlPath = path.join configs.dirs.src, 'html/'
        _htmlDistPath = configs.htmlDevPath

        # clog('parse hbs:' + options.env)
        if ['pro', 'dev'].indexOf(this.env) > -1
          parseTemplet = false
          if this.htmlruntime.demo
            parseTemplet = true
          if this.env == 'pro'
            _htmlDistPath = configs.htmlBuildPath

        errrHandler = ( e ) ->
            gutil.beep()
            gutil.log( e )

        htmlCompiler = $.compileHandlebars
        gulp.src files, { base: baseHtmlPath }
        .pipe $.plumber({ errorHandler: errrHandler })
        .pipe( do () ->
          return through.obj (file, enc, cb) ->
            ext_name = path.parse(file.path).ext.replace('.', '')
            if (chkType(ext_name) == 'templet' || ext_name == 'md')
              switch ext_name
                when 'ejs' then htmlCompiler = $.ejs
                when 'pug' then htmlCompiler = $.pug
                when 'jade' then htmlCompiler = $.pug
                else htmlCompiler = $.compileHandlebars
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
        .pipe $.if(parseTemplet, htmlCompiler())
        .pipe $.rename( (path) ->
            if (path.extname != '.php' || path.extname != '.jsp')
              path.extname = '.html'
              if (path.extname == '.md') then path.extname = '.md.html'
          )
        .pipe gulp.dest(_htmlDistPath)

  } # end return
