import co from 'co'
import path from 'path'

/**
 * 主要用于markdown模板的变量替换，当然也可用于直接执行
 * @param  {[JSON]}  fkp fkp附带一些助手方法，由fkp核心模块传递过来
 * @param  {[String]}  cmd 选择执行commond的一种方法
 * @return {Promise}
 */

async function getContent(fkp, mapper, src){
  if (src.indexOf('http')==0) return '<link rel="stylesheet" href="'+src+'">'
  if (mapper[src]) {
    let content = await fkp.readfile(path.join(fkp.root, '/dist/', fkp.config.version, (fkp.env=='dev'?'/dev':''), '/css/'+mapper[src]))
    if (content) return content.toString()
  }
}

async function index(fkp, key, src){
  if (Array.isArray(key)) {
    src = key
    key = 'attachJs'
  }
  let content, contents, mapper = fkp.staticMapper.pageCss
  if (_.isString(src)) content = await getContent(fkp, mapper, src)
  if (Array.isArray(src)) {
    let contents = []
    for (let item of src) {
      contents.push(await getContent(fkp, mapper, item))
    }
    content = contents && contents.join('')
  }
  if (content) {
    console.log('control pageData will attach css file, pageData.attachCss');
    let tmp = {}
    if (!key) key = 'attachCss'
    tmp[key] = '<style>'+content+'</style>'
    SAX.set('pageData', tmp)  //挂在变量attachCss到pageData
    return true
  }
}

export default function(fkp){
  return index
}
