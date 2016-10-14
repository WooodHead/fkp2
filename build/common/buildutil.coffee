module.exports = (util) ->
  _ = util._
  $ = util.$
  fs = util.fs
  path = util.path
  gulp = util.gulp
  configs = util.configs
  through = util.through
  chkType = util.base.chkType
  gutil = util.gutil
  chkType = util.chkType
  marked = util.marked
  webpack = util.webpack

  return {
    # watch: (type) ->
    #   this.gulp.start('watch')
    #
    # clean: (type) ->
    #   switch type
    #     when 'dir' then ''
    #     when 'file' then ''

    mapfile: () ->
      mapPath = configs.staticPath+'/dev'
      if this.env == 'pro'
        mapPath = configs.staticPath

      _src =
        js: [mapPath + '/js/*.js', '!'+mapPath+'/js/precommon.js']
        css: [mapPath + '/css/*.css']
        mapj: mapPath + '/map.json'

      mapJson =
        version: configs.version
        name: "fkp"
        createdAt: (new Date()).toString()
        commonDependencies: {
          css: {}
          js: {}
        }
        dependencies: {
          css: {}
          js: {}
        }

      this.gulp.task 'map:jsdev',()->
        gulp.src _src.js
        .pipe $.size()
        .pipe $.map (file)->
          _fileparse = path.parse(file.path)
          _filename = _fileparse.base
          filename = _fileparse.name.replace(/-/g,'/')
          if (filename.indexOf('__'))
              filename = filename.split('__')[0]
          if filename.indexOf("common")>-1 || filename.indexOf("ie")>-1
              mapJson['commonDependencies']['js'][filename] = _filename;
          else
              mapJson['dependencies']['js'][filename] = _filename

      this.gulp.task 'map:cssdev',['map:jsdev'],()->
        gulp.src _src.css
        .pipe $.size()
        .pipe $.map (file)->
          _fileparse = path.parse(file.path)
          _filename = _fileparse.base
          filename = _fileparse.name.replace(/-/g,'/')
          filename = _fileparse.name.replace(/-/g,'/')
          if (filename.indexOf('__'))
              filename = filename.split('__')[0]
          if(filename == "common" || filename == "ie")
              mapJson['commonDependencies']['css'][filename] = _filename;
          else
              mapJson['dependencies']['css'][filename] = _filename;

          fs.writeFileSync( _src.mapj,  JSON.stringify(mapJson))

      this.gulp.start 'map:cssdev', ()->
        console.log '======= ok'

  }
