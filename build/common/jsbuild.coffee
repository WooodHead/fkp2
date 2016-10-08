Attachment2commonPlugin = require('./plugins/attachment2common-webpack-plugin')

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
  webpack = util.webpack

  return {
      js: (dir, opts, cb) ->
        defaults =
          reanme: undefined
          type: 'js'
          prepend: []
          append: []
          depth: true
          env: 'dev'
          pack: false,
          method: false
          watch: false

        # 合并配置文件
        opts = if opts then _.extend(defaults, opts) else defaults
        this.env = opts.env

        _files = this.readDirs(dir, opts)

        __files = _files

        # if opts.pack and _.isObject(_files)
        #   __files = []
        #   for item of _files
        #     __files = __files.concat _files[item]

        # if opts.rename == 'common' || opts.method == 'gulp'
          # this.gulpJsBuild(__files, opts)

        if opts.env == 'pro'
          opts.md5 = true
        else
          opts.md5 = false

        _config = this.initEntry __files, opts, cb
        if __files.common or __files.ie
          this.gulpJsBuild __files, opts
        else
          this.wpJsBuild _config, opts, cb


      # gulp build js
      gulpJsBuild: (files, opts, cb) ->
        nEntry = {}
        nowp = {}
        that = this

        nEntry = files

        if nEntry.hasOwnProperty('ie')
          nowp.ie = _.clone(nEntry.ie)
          delete nEntry.ie

        if nEntry.hasOwnProperty('common')
          nowp.common = _.cloneDeep(nEntry.common)
          delete nEntry.common

        if opts.method is 'gulp'
          nowp = nEntry

        # _md5 = true opts.env is 'pro'
        if opts.env == 'pro' then _md5 = true else _md5 = false
        if opts.method is 'gulp' or nowp.ie or nowp.common

          _dist = path.join( configs.dirs.dist + '/' + configs.version + '/dev/js/')
          if opts.env is 'pro'
            _dist = path.join( configs.dirs.dist + '/' + configs.version + '/js/')

          for file of nowp
            if nowp[file].length
              do (file) ->
                gulp.src(nowp[file])
                .pipe $.plumber()
                .pipe $.concat file + '.js'
                .pipe $.if opts.md5, $.uglify()
                .pipe $.if opts.md5, $.md5({ size: 10, separator: '__' })
                .pipe gulp.dest(_dist)
                .pipe $.map (item) ->
                  _filename = path.basename(item.path).toString()
                  if file.indexOf "common">-1 || file.indexOf "ie">-1
                      that.mapper['commonDependencies']['js'][file] = _filename
                  else
                      that.mapper['dependencies']['js'][file] = _filename
                  return

      # webpack dll to make common.js
      wpDllBuildCommon: (files, opts, cb) ->

        _dist = path.join( configs.dirs.dist + '/' + configs.version + '/dev/js/')
        if opts.env is 'pro'
          _dist = path.join( configs.dirs.dist + '/' + configs.version + '/js/')

        cfg = {
          entry: files
          output: {
            path: _dist
            filename: '[name].dll.js'
            # output.library
            # 将会定义为 window.${output.library}
            # 在这次的例子中，将会定义为`window.vendor_library`
            library: '[name]_library'
          }
          plugins: [
            new webpack.DllPlugin({
              # path
              # 定义 manifest 文件生成的位置
              # [name]的部分由entry的名字替换
              path: path.join _dist, '[name]-manifest.json'

              # name
              # dll bundle 输出到那个全局变量上
              # 和 output.library 一样即可。
              name: '[name]_library'
            })
          ]
        }

      # webpack build js
      wpJsBuild: (cfg, opts, cb) ->
        that = this
        _dist = path.join( configs.dirs.dist + '/' + configs.version + '/dev/js/')
        if opts.env is 'pro'
          _dist = path.join( configs.dirs.dist + '/' + configs.version + '/js/')

        cfg.plugins.push new Attachment2commonPlugin('common.js')
        if (opts.md5)
          cfg.plugins.push new webpack.optimize.UglifyJsPlugin { compress: { warnings: false } }

        webpack cfg, (err, stats) ->
          if (err) then throw new gutil.PluginError '[webpack]', err
          gutil.log '[webpack]', stats.toString { colors: true }
          that.watch().css()
          # cb()

        # cfg.plugins.push new webpack.DllReferencePlugin({
        #   context: _dist,
        #   manifest: require('./common-manifest.json')
        # })

        # _webpackDevCompiler = webpack(cfg)
        # console.log _webpackDevCompiler.plugin.length
        # _webpackDevCompiler.run (err, stats) ->
        #     if err then throw new gutil.PluginError '[webpack]', err
        #     gutil.log '[webpack]', stats.toString { colors: true }
        #     # cb()
  }
