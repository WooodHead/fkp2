fs = require 'fs'
os = require 'os'
_ = require 'lodash'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config'
ifaces = os.networkInterfaces()

port = 0

chkType = (type) ->
  if type.indexOf('.') == 0
    type = type.replace('.', '')

  templet = ['hbs', 'swig', 'htm', 'html', 'php', 'jsp', 'jade']

  if templet.indexOf type > -1
    return type

  return false


_subString = (str, len, hasDot) ->
  newLength = 0
  newStr = ""
  chineseRegex = /[^\x00-\xff]/g
  singleChar = ""
  strLength = str.replace(chineseRegex,"**").length;
  for i in [1..strLength]
    singleChar = str.charAt(i).toString()
    if singleChar.match(chineseRegex)
      newLength++
    else
      newLength += 2
    if newLength > len
      break
    newStr += singleChar
  newStr = newStr.replace(/(\r|\n|#|\-)/ig,'')
  if(hasDot && strLength > len)
    newStr += "...";
  return newStr;


ipGlobal = false
_getAddress = () ->
  address = {}
  realIp = ''
  Object.keys(ifaces).forEach (ifname) ->
    alias = 0
    ifaces[ifname].forEach (iface) ->
      if ('IPv4' != iface.family || iface.internal != false)
        # skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;

      if (alias >= 1)
        # this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
        address[ifname] = iface.address
      else
        if(iface.address.indexOf('192.168') > -1 ||
        	iface.address.indexOf('172.16') > -1 ||
        	iface.address.indexOf('10.') == 0)
            if(!ipGlobal)
              console.log '私网'
              # this interface has only one ipv4 adress
              console.log(ifname, iface.address);
              address[ifname] = iface.address
        else
          console.log '公网'
          console.log(ifname, iface.address);
          address = []
          ipGlobal = true
          address[ifname] = iface.address

  console.log ipGlobal
  return address[Object.keys(address)[0]]



# 首页列表数据
list = {}
rootDir = config.dirs.src + '/html'
parentDir = rootDir;
docDir = ''
makeHtmlListData = (_path, _capt) ->
    docDir = _path;
    list = {}
    tmp = {};
    tip = _getAddress()
    if ipGlobal
      port = 0
      tip = 'www.agzgz.com'
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
        if dirJson.base != 'html'     # 是否子目录
          if dirJson.dir != './html'
            if dirJson.dir != rootDir
              list[ _caption ].subtree = true

        htmlDir.map (filename)->
            firstPath = htmlDirPath + '/' + filename
            thisFile = fs.statSync(firstPath);

            if (thisFile.isFile() && filename.indexOf('_')!=0 && filename!='demoindex' )
                ext = path.extname(filename)
                depthFile = filename.replace(ext, '.html')
                # depthFile = firstPath.replace('./html/','').replace(ext, '.html')

                # 说明文件
                # if filename == caption && !ext
                #     content = fs.readFileSync(firstPath,'utf8')
                #     list[ _caption ].readme = content

                if chkType(ext)
                    content = fs.readFileSync(firstPath,'utf8')

                    getTitle = () ->
                      title = content.match(/<title>([\s\S]*?)<\/title>/ig)
                      if (title && title[0].indexOf("{{title}}")>-1 )
                        __title = /<meta name="subtitle" content=(.*?)\/>/.exec(content)[1].replace(/["|']/g, '')
                        title = [__title]
                      return title

                    _url = '/'
                    getUrl = () ->
                      tmp_filename = filename.replace(ext,'.html')
                      _url = tmp_filename
                      if caption
                        _url = caption + '/' + tmp_filename
                      return '/'+_url

                    getIPUrl = () ->
                      _ipurl = 'http://'+ tip + ipport + '/' + _url
                      _ipurl = _ipurl.replace(/\/\//g,'/').replace(':/','://')
                      return _ipurl


                    title = getTitle()
                    if (!title) then console.log 'hbs 没有标题'

                    if(title && title[0])
                      title = title[0].replace(/\<(\/?)title\>/g,'').replace(/ \{(.*)\}/g, '')   # 清除自定义属性，如{"id":"xxx"}
                      fileprofile =
                        url: getUrl()
                        ipurl: getIPUrl(this.url)
                        group: _caption
                        title: title
                        stat: ''
                        fileName: filename.replace(ext,'.html')
                        fullpath: firstPath
                        des: ''
                        mdname: ''
                        ctime: thisFile.ctime
                        birthtime: thisFile.birthtime

                      firstMd = firstPath.replace(ext,'.md')
                      filenameMd = filename.replace(ext, '.md')
                      if(fs.existsSync(firstMd))
                        tmp[filenameMd] = true;
                        desContent = fs.readFileSync(firstMd,'utf8')
                        mdname = gutil.replaceExtension(filename,'_md.html')
                        des = _subString(desContent,200,true)
                        fileprofile.des = des
                        fileprofile.mdname = mdname

                      list[ _caption ].list.push(fileprofile)

                if ext == '.md'
                    fileStat = ''  # 文件title在列表中的状态，如推荐，热门等等，通过title的头字符描述
                    getTitle = (cnt)->
                      title = cnt.match(/#([\s\S]*?)\n/)||''
                      if title then title = title[1].replace(/ \{(.*)\}/g, '')  # 清除自定义属性，如{"id":"xxx"}
                      title = _.trim(title)
                      if title.indexOf('@')==0
                        title = title.substring(1)
                        fileStat = 'recommend'
                      return title

                    getDescript = (cnt)->
                      return cnt.match(/>([\s\S]*?)\n/)

                    getUrl = ()->
                      _filenameMd = filename.replace(ext, '_md.html')
                      _url = if caption then depthFile.replace('.html','_md.html') else ( (caption || '') + '/' + _filenameMd )
                      # _url = _url.replace('public/html/','')
                      if (firstPath.indexOf(docDir)>-1)
                        if _url.indexOf('/')==0
                          _url = _url.substring(1)
                        _append_url = _url.replace('_md.html', '').replace(/\//g,'_')
                        _url = '?md='+_append_url
                        return _url

                    if !tmp[filename]
                      content = fs.readFileSync(firstPath,'utf8')
                      descript = getDescript(content)
                      title = getTitle(content)
                      _url = getUrl()
                      _ipurl = 'http://'+ tip + ipport + '/' + _url
                      _ipurl = _ipurl.replace(/\/\//g,'/').replace(':/','://')

                      if (firstPath.indexOf(docDir)==-1)
                        filename = filename.replace(ext,'_md.html')

                      if title
                        fileprofile =
                          url: _url
                          ipurl: _ipurl
                          group: _caption
                          title: title
                          stat: fileStat
                          fileName: filename
                          fullpath: firstPath
                          des: descript
                          mdname: ''
                          ctime: thisFile.ctime
                          birthtime: thisFile.birthtime

                        list[ _caption ].list.push(fileprofile)
                return

            if (thisFile.isDirectory() && filename.indexOf('_')!=0 )
              list[ _caption ]['children'].push(filename)
              list[ _caption ].subtree = firstPath
              mklist(firstPath, filename, _caption)

        return

    mklist(_path, _capt)

module.exports = (gulp, $, slime, env, _path)->
        return () ->
          if env == 'REST'  # 请求来自node
            port = config.ports.dev
            if _path
              rootDir = _path
              makeHtmlListData(_path)
              datas = { demoindex: list } # index html模板名称    list: 模板数据
              return datas
            else
              return
          else
            if ['pro', 'dev'].indexOf(env)>-1
              port = config.ports.demo
              makeHtmlListData()
              datas = { demoindex: list }


            # 生成分页并生成列表页
            slime.html config.dirs.src + '/html/', {
              type: 'hbs'
              data: datas
              env: env
              pack: true
            }
