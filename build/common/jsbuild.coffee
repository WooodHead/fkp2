WebpackDevServer = require 'webpack-dev-server'
Attachment2commonPlugin = require('./plugins/attachment2common-webpack-plugin')
WriteMemoryFilePlugin = require('./plugins/writememoryfile-webpack-plugin')
ExtractTextPlugin = require('extract-text-webpack-plugin')
BrowserSyncPlugin = require('browser-sync-webpack-plugin')

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

          if opts.env == 'pro'
            opts.md5 = true
          else
            opts.md5 = false

          if opts.env is 'pro'
            _dist = path.join( configs.dirs.dist + '/' + configs.version + '/js/')
          else
            _dist = path.join( configs.dirs.dist + '/' + configs.version + '/dev/js/')

          _files = this.readDirs(dir, opts)
          _wpconfig = this.initEntry _files, opts, cb

          this.jsruntime = {
            dist: _dist
            files: _files
            webpackConfig: _wpconfig
            callback: cb
            md5: opts.md5
            opts: opts
          }

          return this

      # gulp build js
      gulpJsBuild: () ->
          that = this
          _dist = this.jsruntime.dist
          _md5 = this.jsruntime.md5
          _files = this.jsruntime.files
          _cb = this.jsruntime.callback
          _wpcfg = this.jsruntime.webpackConfig
          _opts = this.jsruntime.opts

          for file of _files
            if _files[file].length
              do (file) ->
                gulp.src(_files[file])
                .pipe $.plumber()
                .pipe $.concat file + '.js'
                .pipe $.if _md5, $.uglify()
                .pipe $.if _md5, $.md5({ size: 10, separator: '__' })
                .pipe gulp.dest(_dist)


      # webpack dll to make common.js
      wpDllBuildCommon: () ->
          that = this
          _dist = this.jsruntime.dist
          _md5 = this.jsruntime.md5
          _files = this.jsruntime.files
          _cb = this.jsruntime.callback
          _wpcfg = this.jsruntime.webpackConfig
          _opts = this.jsruntime.opts

          cfg = {
            entry: _files
            output: {
              path: _dist
              filename: '[name].dll.js'
              # output.library
              # 将会定义为 window.${output.library}
              # 在这次的例子中，将会定义为`window.vendor_library`
              library: '[name]_library'
            }
            plugins: [
              new webpack.DllPlugin(
                # path
                # 定义 manifest 文件生成的位置
                # [name]的部分由entry的名字替换
                path: path.join _dist, '[name]-manifest.json'

                # name
                # dll bundle 输出到那个全局变量上
                # 和 output.library 一样即可。
                name: '[name]_library'
              )
            ]
          }

      wpJsBuild: (demo) ->
          that = this
          _dist = this.jsruntime.dist
          _md5 = this.jsruntime.md5
          _files = this.jsruntime.files
          _cb = this.jsruntime.callback
          _wpcfg = this.jsruntime.webpackConfig
          _opts = this.jsruntime.opts

          commonFileName = if _md5 then 'common__[hash].js' else 'common.js'
          paramsForCommonsChunk =
            name: 'common'
            filename: commonFileName
            minChunks: 2, # //Infinity

          this.jsruntime.demo = demo
          this.jsruntime.params = {
            wpCommonTrunk: paramsForCommonsChunk
          }

          if _md5
            this.wpProBuild()
          else
            this.wpDevBuild()

          return this


      # webpack build js
      # watch or not
      wpProBuild: () ->
          that = this
          _dist = this.jsruntime.dist
          _md5 = this.jsruntime.md5
          _files = this.jsruntime.files
          _cb = this.jsruntime.callback
          _wpcfg = this.jsruntime.webpackConfig
          _opts = this.jsruntime.opts
          _demo = this.jsruntime.demo

          _wpcfg.plugins = _wpcfg.plugins.concat [
            new webpack.DefinePlugin({
              'process.env':
                  NODE_ENV: JSON.stringify "production"
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.CommonsChunkPlugin( this.jsruntime.params.wpCommonTrunk ),
            new Attachment2commonPlugin( path.join _dist, '/precommon.js' ),
            new webpack.optimize.UglifyJsPlugin { compress: { warnings: false } }
          ]

          # _wpcfg.plugins.push new webpack.DllReferencePlugin({
          #   context: _dist,
          #   manifest: require('./common-manifest.json')
          # })

          # pro
          if process.env.WATCH_FILE == 'true'
            _wpcfg.watch = true
            _wpcfg.plugins.push new webpack.HotModuleReplacementPlugin()
            # _wpcfg.plugins.push new BrowserSyncPlugin { proxy: 'http://localhost:'+configs.ports.node }, { reload: false }
            webpack _wpcfg, (err, stats) ->
              if err then throw new gutil.PluginError '[webpack]', err
              gutil.log '[webpack]', stats.toString { colors: true }
              _cb()

          # build
          else
            _webpackDevCompiler = webpack(_wpcfg)
            _webpackDevCompiler.run (err, stats) ->
                if err then throw new gutil.PluginError '[webpack]', err
                gutil.log '[webpack]', stats.toString { colors: true }
                _cb()


      # devServer
      # watch
      wpDevBuild: () ->
          that = this
          _dist = this.jsruntime.dist
          _md5 = this.jsruntime.md5
          _files = this.jsruntime.files
          _cb = this.jsruntime.callback
          _wpcfg = this.jsruntime.webpackConfig
          _opts = this.jsruntime.opts
          _demo = this.jsruntime.demo

          _wpcfg.plugins = _wpcfg.plugins.concat [
            new webpack.DefinePlugin({
              "process.env": {
                NODE_ENV: JSON.stringify "development"
              }
            }),
            new webpack.optimize.CommonsChunkPlugin( this.jsruntime.params.wpCommonTrunk ),
            new webpack.HotModuleReplacementPlugin(),
            new Attachment2commonPlugin( path.join _dist, '/precommon.js' ),
            new WriteMemoryFilePlugin()
          ]

          # demo
          if _demo
            _wpcfg.plugins.push(new BrowserSyncPlugin {
              server:
                baseDir: [ configs.htmlDevPath, configs.staticPath + '/dev']
                index: ["hello.html"]
              files: [configs.staticPath+ '/**']
              logFileChanges: false
              notify: false
              injectChanges: true
            }, { reload: true })

          # dev
          else
            # _wpcfg.plugins.push(new BrowserSyncPlugin {
            #   proxy: 'http://localhost:' + configs.ports.dev+'/'
            #   files: [configs.staticPath+ '/**']
            #   logFileChanges: false
            # }, { reload: false } )


          for item of _wpcfg.entry
            _wpcfg.entry[item].unshift(
              "react-hot-loader/patch", #for 3
              "webpack-dev-server/client?http://localhost:"+configs.ports.dev+'/',
              # "webpack/hot/only-dev-server"
            )

          new WebpackDevServer webpack(_wpcfg), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
            historyApiFallback: true
            clientLogLevel: "info"
            stats: { colors: true }
            # noInfo: true
            progress: true
            hot: true
            inline: true
            watchOptions: {
              aggregateTimeout: 300
              poll: 1000
            }
            host: '0.0.0.0'
            port: configs.ports.node
            publicPath: '/'
            proxy: {
              '*': {
                target: 'http://localhost:' + configs.ports.node
                secure: false
                changeOrigin: true
                # ws: false
                # bypass: (req, res, opt) ->
                  # if /(\.json|\.jpg|\.png|\.css)$/.test(req.path) || /\.bundle\.js/.test(req.path)
                  #   console.log('bypass', req.path)
                  #   return req.path
              }
            }
          }
          .listen configs.ports.dev, "localhost", (err) ->
            if err then throw new gutil.PluginError("webpack-dev-server", err)
            gutil.log("[webpack-dev-server]", "http://localhost:8070/webpack-dev-server/index.html")
            _cb()
  }
