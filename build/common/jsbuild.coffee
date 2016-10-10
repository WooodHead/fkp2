WebpackDevServer = require 'webpack-dev-server'
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

          if opts.env == 'pro'
            opts.md5 = true
          else
            opts.md5 = false

          _config = this.initEntry __files, opts, cb
          if __files.precommon or __files.ie
            this.gulpJsBuild __files, opts
          else
            # this.wpJsBuild _config, opts, cb
            this.wpDevBuild _config, opts, cb


      # gulp build js
      gulpJsBuild: (files, opts, cb) ->
          nEntry = {}
          nowp = {}
          that = this

          nEntry = files

          if nEntry.hasOwnProperty('ie')
            nowp.ie = _.clone(nEntry.ie)
            delete nEntry.ie

          if nEntry.hasOwnProperty('precommon')
            nowp.precommon = _.cloneDeep(nEntry.precommon)
            delete nEntry.precommon

          if opts.method is 'gulp'
            nowp = nEntry

          # _md5 = true opts.env is 'pro'
          if opts.env == 'pro' then _md5 = true else _md5 = false
          if opts.method is 'gulp' or nowp.ie or nowp.precommon

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
                  # .pipe $.map (item) ->
                  #   _filename = path.basename(item.path).toString()
                  #   if file.indexOf "common">-1 || file.indexOf "ie">-1
                  #       that.mapper['commonDependencies']['js'][file] = _filename
                  #   else
                  #       that.mapper['dependencies']['js'][file] = _filename
                  #   return




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

          cfg.plugins.push new Attachment2commonPlugin(_dist + '/precommon.js')

          if (opts.md5)
            cfg.plugins.push new webpack.optimize.UglifyJsPlugin { compress: { warnings: false } }

          _webpackDevCompiler = webpack(cfg)
          _webpackDevCompiler.run (err, stats) ->
              if err then throw new gutil.PluginError '[webpack]', err
              gutil.log '[webpack]', stats.toString { colors: true }
              cb()

          # webpack cfg, (err, stats) ->
          #   if (err) then throw new gutil.PluginError '[webpack]', err
          #   gutil.log '[webpack]', stats.toString { colors: true }
          #   that.watch().css()
          #   # cb()

          # cfg.plugins.push new webpack.DllReferencePlugin({
          #   context: _dist,
          #   manifest: require('./common-manifest.json')
          # })




      wpDevBuild: (cfg, opts, cb) ->
          that = this
          _dist = path.join( configs.dirs.dist + '/' + configs.version + '/dev/js/')
          cfg.plugins.push new Attachment2commonPlugin(_dist + '/precommon.js')

          for item of cfg.entry
            cfg.entry[item].unshift(
              # "react-hot-loader/patch", for 3
              "webpack-dev-server/client?http://localhost:"+configs.ports.dev+"/",
              "webpack/hot/only-dev-server"
            )


          new WebpackDevServer webpack(cfg), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
            historyApiFallback: true
            stats: {
              colors: true
              # "errors-only": true
            }
            # noInfo: true
            progress: true
            hot: true
            inline: true
            progress: true
            watchOptions: {
              aggregateTimeout: 300
              poll: 1000
            }
            host: '0.0.0.0'
            port: configs.ports.dev
            # publicPath: cfg.output.publicPath,
            proxy: {
              '*': {
                target: 'http://localhost:' + configs.ports.dev
                secure: false
                ws: false
                # bypass: (req, res, opt) ->
                  # if /(\.json|\.jpg|\.png|\.css)$/.test(req.path) || /\.bundle\.js/.test(req.path)
                  #   console.log('bypass', req.path)
                  #   return req.path
              }
            }
          }
          .listen 8060, "localhost", (err) ->
            if err then throw new gutil.PluginError("webpack-dev-server", err)
            gutil.log("[webpack-dev-server]", "http://localhost:8070/webpack-dev-server/index.html")
            that.watch().css()
  }
