let fs = require('fs')
let co = require('co');
let path = require('path');
let publicConfig = require('build/src_config');
let react2html = require('server/modules/parseReact')

// 分析目录结构并格式化目录树为JSON
// md, html

module.exports = function(fkp){

  // a markdown directory's homefile
  // this directory maybe has some sub directory
  // every directory maybe has homefile like _home.md/_home.json/_home.jpg/_home.png
  // support 2 level
  async function sonsHomeFiles(dir){
    let _docsList = []
    let rootList = await fkp.readdir(dir)
    if (!rootList) return []
    return new Promise(async (resolve, reject)=>{
      for (let i=0; i<rootList.length; i++){
        let filename = rootList[i]
        let path = dir + '/' + filename
        let _stat = await fkp.fileexist(path)
        if (_stat.isDirectory() && filename.indexOf('_')!==0 && filename!=='images' ){
          let doc = {
            name: filename,
            path: path
          }
          let secondList = await fkp.readdir(path)
          if (secondList && secondList.length){
            if (_.includes(secondList, '_home.json')) doc['config'] = path + '/_home.json'
            if (_.includes(secondList, '_home.md')) doc['home'] = path + '/_home.md'
            if (_.includes(secondList, '_home.jpg')) doc['img'] = '/docs/'+filename + '/_home.jpg'
            if (_.includes(secondList, '_home.png')) doc['img'] = '/docs/'+filename + '/_home.png'
            _docsList.push(doc)
          }
        }
      }
      resolve(_docsList)
    })
  }

  // 读取并解析 md 文件
  async function loadmdFile(url, whichdir){
    try {
      if (typeof url != 'string') url = '/_home_start/index.md'
      let _id = 'loadmdFile_'+url
      return Cache.ifid(_id, async ()=>{
        if (whichdir){
          let _tmp = whichdir.replace(/\//g, '_')+'_'    // maybe problem
          if (url.indexOf('_')!=0 && url.indexOf('/')==-1) {
            url = url.replace(_tmp,'').replace(/_/g,"/")
          }
          if (url.indexOf('.md')===-1) url = url + '.md'
          url = path.join(fkp.root, whichdir, url);
        }
        let exist = await fkp.fileexist(url)
        if (exist && exist.isFile()){
          let mdcnt = {mdcontent:{}};
          let md_raw = fs.readFileSync( url, 'utf8' );
          if (!md_raw || !md_raw.length) return false
          return await fkp().markdown(md_raw);
        }
        return false
      })
    } catch (e) {
      console.log(e);
    }
  }

  // 所有public/html下的文件
  async function getSiteMap(url){
    try {
      url = path.join(publicConfig.dirs.src, 'html')
      let _id = 'sitemap_' + url
      return Cache.ifid(_id, async ()=>{
        let _htmlImages = [];
        let _imgstat = await fkp.fileexist(path.join(publicConfig.dirs.src, 'images/html'))
        if (_imgstat) {
          let htmlImages = await fkp.readdir( path.join(publicConfig.dirs.src, 'images/html') )
          _htmlImages = htmlImages.map((item, i)=>{
            return path.parse(htmlImages[i]).name;
          })
        }

        // let _sitemap = _readdirs(path.join(publicConfig.dirs.src, 'html'));
        let _sitemap = fkp.parsedir(path.join(publicConfig.dirs.src, 'html'));
        let htmlFiles = _sitemap.demoindex.root.list;
        htmlFiles.map( (item, i)=>{
          let fileName = path.parse(item.fileName).name
          let index = _htmlImages.indexOf(fileName);
          htmlFiles[i].img = index>-1 ? '/images/html/'+htmlImages[index] : ''
        })

        Cache.set(_id, _sitemap)
        return _sitemap
      })
    } catch (e) {
      console.log('========== modules=staticdocs: getSiteMap error');
      console.log(e);
    }
  }

  async function _getDocsData(doc_dir, options){
    try {
      if (!doc_dir) return false
      let exist = await fkp.fileexist(doc_dir);
      if (!exist) return false

      let sitemap = {},
      start = {},
      docs = {},
      defaults = {
        docs: false,
        sitemap: false,
        start: false,
        sonlist: false,
        menutree: false,
        append: {}
      }
      let opts = _.extend({}, defaults, options||{})

      // 所有public/html下的文件
      if (opts.sitemap) sitemap = await getSiteMap()

      // 文档目录下的首页文件内容
      if (opts.start){
        let tmp = await loadmdFile(opts.start, doc_dir)
        if (tmp) start.home = tmp.mdcontent
        else start.home = {cnt: '<h1>FKP-JS</h1><small>a full stack framwork</small>', title: 'FKP-JS', author: '天天修改'}
      }

      // dir docs
      // let _docs = _readdirs(doc_dir)
      let _docs = await fkp.parsedir(doc_dir)
      docs = {docs: _docs}
      let docsData = _.extend({}, opts.append, sitemap, docs, start);

      if (opts.menutree){
        let _props = {
          data: _docs
        }
        let reactHtml = await react2html('component/modules/menutree/index', _props)
        docsData.menutree = reactHtml[0]
      }

      if (opts.sonlist) {
        docsData.sonlist = await sonsHomeFiles(doc_dir)
      }

      if (!opts.docs) delete docsData.docs
      if (!opts.sitemap) delete docsData.demoindex
      if (!opts.start) delete docsData.home
      return docsData
    } catch (e) {
      console.log(e);
    }
  }

  async function getDocsData(url, opts){
    let id = url;
    let tmp;

    if (opts.pre) id = opts.pre + url
    if (Cache.has(id)) return Cache.get(id)
    else {
      tmp = await _getDocsData(url, opts)
      Cache.set(id, tmp)
      return tmp;
    }
  }

  return {
    getDocsData: getDocsData,
    loadmdFile: loadmdFile,
    sonsHomeFiles: sonsHomeFiles
  }
}
