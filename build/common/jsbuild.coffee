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

        # 合并配置文件
        opts = if opts then _.extend(defaults, opts) else defaults
        this.env = opts.env


        _files = this.readDirs(dir, opts)
        if !opts.pack
          if _.isObject(_files)
            for item of _files
              if _.isArray _files[item]
                __files = __files.concat _files[item]

        this.gulpBuild(_files, opts)

      # gulp build css
      gulpBuild: (files, opts) ->

      # webpack build css
      wpBuild: (files) ->

  }
