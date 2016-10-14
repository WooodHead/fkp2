
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
      # 分析目录结构并返回JSON对象
      initDir: (aryDir, fatherDirName, isPack, depth) ->
        entrys = {}
        readPageDir = (subDir, isPack, depth) ->     # // make directory json
          package_ary = []
          dirs = (subDir && subDir.fs) || aryDir
          dirsPath = (subDir && subDir.path) || fatherDirName
          sameName = false;   # //同名文件
          dirs.forEach (item) ->
            _filename = (subDir && subDir.filename) || item
            name = (subDir && subDir.name) || item
            # 目录，忽略下划线目录，如_test, _xxx及隐藏目录
            if depth and fs.statSync(dirsPath + '/' + item).isDirectory() and item.indexOf('_') != 0 and item.indexOf('.') !=0
              data =
                name: item
                path: dirsPath + '/' + item
                fs: fs.readdirSync(dirsPath + '/' + item)
                filename: (subDir && subDir.filename + "-" + item) || item
              readPageDir(data, isPack, depth)
            # //文件，忽略下划线文件，如_test, _xxx及隐藏文件
            else
              if fs.statSync(dirsPath + '/' + item).isFile() and item.indexOf('_') != 0 and item.indexOf('.') !=0
                ext = path.extname(dirsPath + '/' + item)
                if (chkType(ext) || ext == '.md')
                  #  如果存在同名js
                  if (!sameName)
                    if name == item.replace(ext, '')
                      entrys[_filename] = [dirsPath + '/' + item]
                      sameName = true
                    else
                      entrys[_filename] = entrys[_filename] || []
                      entrys[_filename].push(dirsPath + '/' + item)
        readPageDir(null, isPack, depth)
        package_ary = []
        for name of entrys
          entrys[name].map (item, i) ->
            item = item.replace('//', '/')
            entrys[name][i] = item
            package_ary.push(item)
        if (isPack)
          return package_ary

        return entrys

      readDirs: (dirname, options) ->
        that = this
        tmp = {}
        opts =
          reanme: undefined
          type: undefined
          prepend: []
          append: []
          depth: true
          pack: false

        try
          if !dirname then throw '没有指定目录或文件'
          this.dirname = dirname

          # // 合并配置文件
          if options and _.isObject(options) and !_.isArray options
            opts = _.extend opts, options
            this.ready(opts)

          if _.isObject(dirname) and !_.isArray dirname
            tmp = dirname
            if (opts.isPack)
              tmp_array = []
              _.mapKeys dirname, (val, key) ->
                tmp_array = tmp_array.concat val
              if (opts.rename)
                tmp = {}
                tmp[opts.rename] = tmp_array
              else
                throw 'slime 指定pack为true，必须同时指定 options.rename'
            return tmp

          if typeof dirname == 'string'
            return this.readDir(dirname,  opts)

          if _.isArray(dirname)
            dirname.map (item, i) ->
              _tmp = that.readDir(item, opts)
              if _tmp._src
                if tmp._src then tmp._src = tmp._src.concat(_tmp._src)
                else tmp = _.assign(tmp, _tmp)
              else
                tmp = _.assign(tmp, _tmp)
            if (tmp._src)
              ultimates = []
              ultimates = _.concat(opts.prepend, tmp._src, opts.append)
              delete tmp._src
              if opts.rename then tmp[opts.rename] = ultimates
              else throw 'slime 指定数组时，必须同时指定 options.rename'
            if opts.isPack
              tmp_array = []
              _.mapKeys tmp, (val, key) ->
                tmp_array = tmp_array.concat( val )
              if opts.rename
                tmp = {}
                tmp[opts.rename] = tmp_array
              else
                throw 'slime 指定pack为true，必须同时指定 options.rename'
            return tmp;
        catch error
          console.error( __filename + ":" + error )


      readDir: (dirname, opts) ->
        pagesDir=''
        package_name=''       # 包名
        default_dir  = dirname
        preDefineDir = dirname
        rename  = opts.rename
        type    = opts.type
        isPack  = opts.pack

        # // configs.dirs中预定义目录
        # // 如 pages
        dirs = configs.dirs
        for item of dirs
          if item == dirname
            pagesDir = fs.readdirSync(dirs[item])
            preDefineDir = dirs[item]
            package_name = if isPack then dirname else ''

        if (!pagesDir)
          if !fs.existsSync(dirname)
            throw new Error("==============Error: you must identify a directory or file");
            return false

          # 目录
          if fs.statSync(dirname).isDirectory()
            pagesDir = fs.readdirSync(dirname)
            package_name =  if isPack then path.basename(dirname) else ''

          #  文件
          else if fs.statSync(dirname).isFile()
            __ultimates = [dirname]
            return {
              '_src': __ultimates
            }

        # // 生成entry
        staticType = chkType(type)
        _entry = this.initDir(pagesDir, preDefineDir, isPack, opts.depth)   # 分析目录并返回JSON/Array
        entry={}

        if (isPack)   # // 打包成一个文件
          ext = if staticType == 'script' then 'js' else type
          _ultimates = ultimates = []
          styleType = if (staticType == 'style' and  type!='sass') then true else false
          package_name = dirname
          _ultimates = _entry
          ultimates = _.concat(opts.prepend, _ultimates, opts.append)

          # 有时候需要将目录打包输出成一个文件
          # 但是输出文件名字不是目录名
          # 可以通过`rename`重新制定输出的打包文件名
          # ==================================
          if rename
            package_name = rename
          entry[package_name] = ultimates
          this.package_name = package_name
        else  #  isPack is false 打包成多个文件
          entry = _entry

        return entry
    }
