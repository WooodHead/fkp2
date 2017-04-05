let marked = require('./marked')
let render = new marked.Renderer()
let renderer = require('./markdownrender').default(render)
// 自定义变量白名单
let accessVar = CONFIG.markdownVariable;

function strLen(str){
  return str.replace(/[^\x00-\xff]/g,"aaa").length;
}

function _createDiv(raw){
  let prope = {}
  const regDiv = /^ *(<>|&lt;&gt;)?([\.\#]*(\S+)?) *(?:\n+|$)/ig
  const regAttr = /[\.\#](\w+)?/ig
  const _text = regDiv.exec(raw)
  if (_text) {
    const _attr = _text[2]
    const attrs = _attr.match(regAttr)
    if (attrs && attrs.length) {
      attrs.map( attr => {
        if (attr.charAt(0) == '#') prope.id = attr.substring(1)
        if (attr.charAt(0) == '.') {
          if (!prope.className) prope.className = attr.substring(1)
          else {
            prope.className += ' '+ attr.substring(1)
          }
        }
      })
      return '<div id="'+(prope.id||'')+'" class="'+(prope.className||'')+'"></div>'
    } else {
      return '<div></div>'
    }
  }
}

function creatDiv(raw){
  if (raw && typeof raw == 'object'){
    return _createDiv(raw.text)
  } else {
    return _createDiv(raw)
  }
}

function getConfig(md_raw, cvariable){
  // var rev = /[@]{3,}[ ]*\n?([^@]*)[@]{3,}[ ]*\n?/i;
  // var rev2 = /(.*)(?=: *)[\s]*(.*)(?=\n)/ig;
  // var rev3 = /^[a-zA-Z0-9,_ \u4e00-\u9fa5\/\\\:\.]+$/;
  const rev = /^(@{3,}) *\n?([\s\S]*) *\n+\1 *(?:\n+|$)/i;
  // const rev2 = / *([\w\u4e00-\u9fa5]+)(?: *\: *([\w\u4e00-\u9fa5]+) *(?:\n+|$))/ig;
  const rev2 = /(.*)(?: *\:(.+) *(?:\n+|$))/ig;
  const rev3 = /^[\w\-\u4e00-\u9fa5\uFE30-\uFFA0\/\\\.]+/i;  //检测合法的key, value
  const cnReg = /^[\u4e00-\u9fa5\uFE30-\uFFA0]+$/;   // 检测中文

  let tmp = md_raw.match(rev);
  if (tmp && tmp[2]) {
    tmp = tmp[2]
    let tmp2 = tmp.match(rev2)
    if (tmp2) {
      tmp2.map(function(item, i){
        const tmp = item.split(':')
        const k = _.trim(tmp[0])
        const v = _.trim(tmp[1])
        const _v = rev3.test(v)
        if (!cnReg.test(k) && accessVar.indexOf(k)>-1 ){
          if (_v) cvariable[k] = v
        } else {
          const _obj = _.find(accessVar, k);
          if (_obj) {
            if (_v) cvariable[_obj[k]] = v
          }
        }
      })
    }
    md_raw = md_raw.replace(rev,'');
  }
  return [md_raw, cvariable]
}

function mkmd(raw, templet, opts){
  console.log('markdown解析');
  console.log('========= markdown/'+__filename+' ');
  var mdcnt = templet
  let dft = {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  }
  if (_.isPlainObject(opts)) dft = _.merge(dft, opts)
  marked.setOptions(dft)

  //markdown 自定义变量
  let [md_raw, cvariable] = getConfig(raw, {})

  let tokens = marked.lexer(md_raw)
  let props = { }
  tokens.map(function(item, ii){
    switch (item.type) {
      case 'heading':
        if (item.depth == 1) {
          if (!props.title) {
            props.title = item.text
          }
        }
      break;
      case 'blockquote_start':
        const nextItem = tokens[ii+1]
        if (!props.desc) props.desc = cvariable.desc || nextItem.text
      break;
    }
  })
  if (!props.title) props.title = '还没有想好标题'
  mdcnt.mdcontent.title = props.title.replace(/ \{(.*)\}/g, '');
  mdcnt.mdcontent.desc = props.desc
  cvariable.desc = cvariable.desc || props.desc

  try {
    let data = marked.parser(tokens)

    // 插入div
    const regDiv = /<p>&lt;&gt;(.*)? *(?:\n+|$)/ig
    const regDiv1 = /<p>&lt;&gt;(.*)?<\/p> *(?:\n+|$)/i
    data = data.replace(regDiv, function($0, $1){
      return creatDiv($1+'\n')
    })

    // 首图
    const regImg = /<img *src= *['"](.*?)['"] *\/>/ig
    const imgs = data.match(regImg)
    if (imgs) {
      mdcnt.mdcontent.img = imgs[0]
      mdcnt.mdcontent.imgs = imgs
    }

    // 菜单
    let mdMenus = ['<ul class="mdmenu>']
    const regMenu = /<(h[2]) *(?:id=['"]?(.*?)['"]?) *>(.*?)<\/\1>/ig
    const regMenu1 = /id=['"]?([^>]*)['"] *>(.*)</i
    const menus = data.match(regMenu)
    if (menus) {
      menus.map( item => {
        const cap = regMenu1.exec(item)
        if (cap) {
          const [xxx, href, title] = cap
          mdMenus.push('<li><a href="#'+(href||'')+'">'+ (title||'') + '</a></li>')
        }
      })
      mdMenus.push('</ul>')
      mdcnt.mdcontent.mdmenu = mdMenus.join('\n')
    }

    mdcnt.params = cvariable;
    mdcnt.mdcontent.cnt = data
    return mdcnt

  } catch (e) {
    throw e
  }
}
module.exports = mkmd
