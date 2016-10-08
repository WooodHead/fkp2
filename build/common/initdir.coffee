_ = require 'lodash'
fs = require 'fs'
path = require 'path'

chkType = (type) ->
  if (type.indexOf('.')==0)
    type = type.replace('.', '')

  all =
    style: ['css', 'scss', 'sass', 'less', 'stylus', 'styl']
    templet: ['hbs', 'swig', 'htm', 'html', 'php', 'jsp']
    script: ['js', 'jsx', 'coffee', 'cjsx', 'ts', 'tsx']

  staticType = 'script'
  for item of all
    arys = all[item];
    if _.indexOf(arys, type) > -1
      staticType = item

  return staticType;


module.exports = (aryDir, fatherDirName, isPack, depth) ->
  entrys = {}
  readPageDir = (subDir, isPack, depth) ->     # // make directory json
    package_ary = [];
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
