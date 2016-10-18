os = require 'os'

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
    clean: (type) ->
      switch type
        when 'dir' then ''
        when 'file' then ''

    ipAddress: () ->
        address = {}
        ipIsGlobal = false
        ifaces = os.networkInterfaces()
        Object.keys(ifaces).forEach (ifname) ->
          alias = 0
          ifaces[ifname].forEach (iface) ->
            if ('IPv4' != iface.family || iface.internal != false)
              # skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;

            if (alias >= 1)
              # this single interface has multiple ipv4 addresses
              address[ifname] = iface.address
              console.log(ifname + ':' + alias, iface.address);
            else
              # this interface has only one ipv4 adress
              address[ifname] = iface.address
              if iface.address.indexOf('192.168') > -1 or iface.address.indexOf('172.16') > -1 or iface.address.indexOf('10.') == 0
                ipIsGlobal = false
                console.log '私网ip'
                console.log(ifname, iface.address);
              else
                ipIsGlobal = true
                console.log '公网ip'
                console.log(ifname, iface.address);

        # console.log address
        return [address[Object.keys(address)[0]], ipIsGlobal]

    mapfile: () ->
      that = this
      setTimeout(()->
        that._mapfile()
      , 17)
      return this

    _mapfile: () ->
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
          return

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

      this.gulp.start 'map:cssdev'
      return this

  }
