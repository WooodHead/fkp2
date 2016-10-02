fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
gutil = require 'gulp-util'
config = require '../out_config';
os = require('os');
ifaces = os.networkInterfaces();
port = 0
_ = require('lodash')

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

    # console.log address
    return address[Object.keys(address)[0]]
    # return address



# 首页列表数据
list = {}
rootDir = config.dirs.src + '/html'
parentDir = rootDir;
docDir = ''
makeHtmlListData = (pa, capt) ->
    docDir = pa;
    list = {}
    tmp = {};
    tip = _getAddress()
    if ipGlobal
        port = 0
        tip = 'www.agzgz.com'
    ipport = if port then ':'+port else ''
    mklist = (htmlPath, caption, parent) ->
        htmlDirPath = if htmlPath then htmlPath else rootDir

        # htmlDirPath = config.dirs.src + '/html'
        htmlDir = fs.readdirSync( htmlDirPath );
        depthDir = htmlDirPath.replace('./src/pc/html/','').replace('public/src/pc/html/','')
        _caption = caption || 'root'

        list[ _caption ] = list[ _caption ] || {}
        list[ _caption ].group = list[ _caption ].group || (if caption then depthDir else _caption)
        list[ _caption ].caption = _caption
        list[ _caption ].list = list[ _caption ].list || []
        list[ _caption ]['parent'] = parent||'root'
        list[ _caption ]['children'] =[]

        dirJson = path.parse(htmlDirPath)
        if dirJson.base != 'html'
            if dirJson.dir != './src/pc/html'
                if dirJson.dir != 'public/src/pc/html'
                    list[ _caption ].subtree = true

        htmlDir.map (filename)->
            firstPath = htmlDirPath + '/' + filename
            thisFile = fs.statSync(firstPath);
            if (thisFile.isFile() && filename.indexOf('_')!=0 && filename!='demoindex' )
                ext = path.extname(filename)
                depthFile = firstPath.replace('./src/pc/html/','').replace(ext, '.html')


                if filename == caption && ext == ''
                    content = fs.readFileSync(firstPath,'utf8')
                    list[ _caption ].readme = content

                if ( ext == '.hbs' || ext == '.html')
                    content = fs.readFileSync(firstPath,'utf8')
                    title = content.match(/<title>([\s\S]*?)<\/title>/ig)
                    if (title && title[0] && title[0].indexOf("{{title}}")>-1 )
                        __title = /<meta name="subtitle" content=(.*?)\/>/.exec(content)[1].replace(/["|']/g, '')
                        title = [__title]

                    _url = if caption then depthFile else ( (caption || '') + '/' + filename.replace(ext,'.html') )
                    _url = _url.replace('public/src/pc/html/','')
                    _ipurl = 'http://'+ tip + ipport + '/' + _url
                    _ipurl = _ipurl.replace(/\/\//g,'/').replace(':/','://')
                    if (!title)
                        console.log 'hbs 没有标题'

                    if(title!=null && title[0])
                        title = title[0].replace(/\<(\/?)title\>/g,'')
                        title = title.replace(/ \{(.*)\}/g, '')  # 清除自定义属性，如{"id":"xxx"}
                        fileprofile = {
                            url: _url,
                            ipurl: _ipurl,
                            group: caption || '',
                            title: title,
                            stat: '',
                            fileName: filename.replace(ext,'.html'),
                            fullpath: firstPath,
                            des: '',
                            mdname: '',
                            ctime: thisFile.ctime,
                            birthtime: thisFile.birthtime
                        }
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
                        _url = _url.replace('public/src/pc/html/','')
                        if (firstPath.indexOf(docDir)>-1)
                            if _url.indexOf('/')==0
                                _url = _url.substring(1)
                            # _url = '/demoindex?md='+_url.replace '_md.html', '.md'
                            _append_url = _url.replace '_md.html', ''
                            # _append_url = _url.replace '_md', ''
                            # _append_url = _append_url.replace(/\//g,'_').replace(docDir+'_','')
                            _append_url = _append_url.replace(/\//g,'_')
                            # _url = '/demoindex?md='+_append_url
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
                            fileprofile = {
                                url: _url,
                                ipurl: _ipurl,
                                group: caption || '',
                                title: title,
                                stat: fileStat,
                                fileName: filename,
                                fullpath: firstPath,
                                des: descript,
                                mdname: '',
                                ctime: thisFile.ctime,
                                birthtime: thisFile.birthtime
                            }
                            list[ _caption ].list.push(fileprofile)
                return

            if (thisFile.isDirectory() && filename.indexOf('_')!=0 )
                list[ _caption ]['children'].push(filename)
                list[ _caption ].subtree = firstPath
                mklist(firstPath, filename, _caption)

        return


    mklist(pa, capt)



module.exports = (gulp, $, slime, env, _path)->
        return () ->
            if env == 'REST'  # 请求来自root/index.js
                port = config.port.dev
                if _path
                    rootDir = _path
                    makeHtmlListData(_path)
                    datas = { demoindex: list } # index html模板名称    list: 模板数据
                    return datas
                else
                    return
            else
                # if env == 'dev'
                if ['pro', 'dev'].indexOf(env)>-1
                    port = config.port.demo
                    makeHtmlListData()
                    datas = { demoindex: list }

            # console.log JSON.stringify(list)
            # 生成分页并生成列表页
            slime.build(config.dirs.src + '/html/',{type: 'hbs',data: datas, 'env': env});
