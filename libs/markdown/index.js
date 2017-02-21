let marked = require('marked')
let render = new marked.Renderer()
let renderer = require('./markdownrender').default(render)
// 自定义变量白名单
let accessVar = CONFIG.markdownVariable;

function strLen(str){
  return str.replace(/[^\x00-\xff]/g,"aaa").length;
}

function mkmd(md_raw, templet, opts){
  console.log('markdown解析');
  console.log('========= markdown/'+__filename+' ');
  var mdcnt = templet
  var cvariable = {}   //markdown 自定义变量
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

  if (md_raw.indexOf('@@@')>-1) {
    // var rev = /[@]{3,}[ ]*\n?([^@]*)[@]{3,}[ ]*\n?/i;
    var rev = /^(@{3,}) *\n?([\s\S]*) *\n+\1 *\n?/i;
    // var rev2 = /(.*)(?=: *)[\s]*(.*)(?=\n)/ig;
    var rev2 = / *([\w\u4e00-\u9fa5]+)(?: *\: *([\w\u4e00-\u9fa5]+) *?\n?)/ig;
    var rev3 = /^[a-zA-Z0-9,_ \u4e00-\u9fa5\/\\\:\.]+$/;
    var rev4 = /^[\u4e00-\u9fa5]+$/;

    var tmp = md_raw.match(rev);
    tmp = tmp[2]
    var tmp2 = tmp.match(rev2)
    var tmp3 = tmp2.map(function(item, i){
      var tmp = item.split(':')
      var k = tmp[0]
      var v = _.trim(tmp[1])
      if (!rev4.test(k)){
        if (accessVar.indexOf(k)>-1){
          if (rev3.test(v)){
            cvariable[k] = v
          }
        }
      }
      else {
        // 支持中文
        if ( _.findIndex(accessVar, k)>-1 ){
          let _obj = _.find(accessVar, k);
          if (_.isObject(_obj)){
            if (rev3.test(v)){
                cvariable[_obj[k]] = v
            }
          }
        }
      }
    })
    md_raw = md_raw.replace(rev,'');
  }

  let tokens = marked.lexer(md_raw)
  let props = { }
  tokens.map(function(item, ii){
    switch (item.type) {
      case 'heading':
        if (item.depth == 1) {
          if (!props.title) props.title = item.text
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

  return marked(md_raw, function (err, data) {
    if (err) throw err;

    //图片部分
    var re_img = /!\[.*\]\((.*)\)/i
    var img_first = md_raw.match(re_img);
    if (img_first) mdcnt.mdcontent.img = img_first[1]

    //菜单部分
    const re = /<h2 *(id=[\w|-]+) [^>]*?>(.*?)<\/h2>/ig;
    let menus = []
    let caps = data.match(re)
    if (caps){
      caps.map( cap => {
        const _menu = re.exec(cap)
        const href = '#'+_menu[1]
        const title = _menu[2]
        menus.push('<li><a href="#'+href+'">'+ title + '</a></li>')
      })
    }
    mdcnt.mdcontent.mdmenu = '<ul class="mdmenu">\n'+menus.join('\n')+'<ul>\n'

    var tmp_len = Object.keys(cvariable)
    if (tmp_len) {
      mdcnt.params = cvariable;
    }

    mdcnt.mdcontent.cnt = data
    return mdcnt
  })

  // return marked(md_raw, function (err, data) {
  //   return new Promise((res, rej) => {
  //     if (err) {
  //       console.log(err, 'markdown.js');
  //       rej(err)
  //     }
  //
  //     //标题
  //     var _title = md_raw.match(/#([\s\S]*?)\n/);
  //     if (_title) mdcnt.mdcontent.title = _title[1].replace(/ \{(.*)\}/g, '');  // 清除自定义属性，如{"id":"xxx"}
  //
  //     // let blockquote = /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/
  //     // let def = /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/
  //     // blockquote = blockquote.source.replace('def', def)
  //     // blockquote = new RegExp(blockquote)
  //     // let cap = blockquote.exec(md_raw)
  //     // console.log(md_raw);
  //     // console.log(cap);
  //     // console.log(blockquote);
  //     // console.log('======== 2222');
  //     // console.log('======== 2222');
  //     // console.log('======== 2222');
  //     // console.log('======== 2222');
  //     // if (cap) {
  //     //   let _desc = cap[0].replace('> ', '')
  //     //   if (_desc.length>1) mdcnt.mdcontent.desc = _desc
  //     //   else mdcnt.mdcontent.desc = ' '
  //     // } else {
  //     //   mdcnt.mdcontent.desc = ' '
  //     // }
  //
  //     var _desc = md_raw.replace(_title, '')
  //     if (strLen(_desc) < 30) mdcnt.mdcontent.desc = false
  //     else mdcnt.mdcontent.desc = _desc
  //
  //     //图片部分
  //     // var re_img = /<img.*src\s*=\s*[\"|\']?\s*([^>\"\'\s]*)/i
  //     var re_img = /!\[.*\]\((.*)\)/i
  //     var img_first = md_raw.match(re_img);
  //     if (img_first) mdcnt.mdcontent.img = img_first[1]
  //
  //     //菜单部分
  //     // var re = /<h2[^>]?.*>(.*)<\/h2>/ig;
  //     var re = /<h2 [^>]*>(.*?)<\/h2>/ig;
  //     var re2 = /id="(.*?)">/i;
  //     var mdMenu='', mdMenuList = data.match(re);
  //     if(mdMenuList&&mdMenuList.length){
  //       mdMenuList.map(function(item){
  //         var kkk = item.match(re2);
  //         var href = kkk[1]
  //         if (href!='-') mdMenu += '<li><a href="#'+href+'">'+ re.exec(item)[1]+'</a></li>\n\r';
  //         else mdMenu += '<li>'+ re.exec(item)[1]+'</li>\n\r';
  //         re.lastIndex = 0;
  //       })
  //     }
  //     mdcnt.mdcontent.mdmenu = '<ul class="mdmenu">'+mdMenu+'<ul>'
  //
  //     //内容部分
  //     mdcnt.mdcontent.cnt = data
  //
  //     var tmp_len = Object.keys(cvariable)
  //     if (tmp_len) {
  //       // mdcnt.mdcontent = _.assign(mdcnt.mdcontent, cvariable)
  //       mdcnt.params = cvariable;
  //     }
  //     res(mdcnt)
  //     // return mdcnt
  //   })
  // })
}
module.exports = mkmd
