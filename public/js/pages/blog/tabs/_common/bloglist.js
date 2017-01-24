import { iscroll } from 'component'
import { queryParams, inject } from 'libs'

inject()
.css( `
  .tb-bar{
    padding: 2em 2em 6em 2em;
    text-align: center;
    cursor: pointer;
  }
  .overbar{
    padding: 1em 2em 6em 2em;
    text-align: center;
    cursor: pointer;
  }
`)

const BLOG = SAX('Blog')
const Config = BLOG.get()
const stickys = Config.stickys
let cur_page=1, cur_tag, cur_cat
let loadlistComponent
let loadlistComponent_my
let curPagiPage = 0

const params = queryParams('/blog')
if (params) {
  switch (params.cat) {
    case 'page':
      cur_page = params.title || 1
      break;
    case 'tag':
      cur_tag = params.title || ''
      cur_page = params.id || 1
      break;
    case 'cat':
      cur_cat = params.title || ''
      cur_page = params.id || 1
      break;
  }
}

const TriggerBar = Config.triggerBar
function triggerAction(dom) {
  $(dom).click(e => {
    load_list_data(++cur_page)
  })
}

function triggerAction_my(dom) {
  $(dom).click(e => {
    my_list_data(++cur_page)
  })
}

// 下拉刷新
let pulldownStat = false
function pulldownFun(type){
  return async function(topPos){
    let llct = loadlistComponent
    let api = '/blog/get'
    if (type) {
      llct = loadlistComponent_my
      api = '/blog/admin/list'
    }
    if (topPos > 50) {
      if (!pulldownStat) {
        llct.pulldown()
        pulldownStat = true
        const data = await Config.pullBlogList(api, 0)
        llct.update(data.lists)
        setTimeout(()=>{
          pulldownStat = false
        },10000)
      }
    }
  }
}

// 滚动触发sticky
function scrollFun(){
  return function(topPos, direction){
    if (direction == 'down') {
      stickys.dytop('hide')
      stickys.top.hide()
      stickys.bot.hide()
    } else {
      stickys.dytop('show')
      stickys.top.show()
      stickys.bot.show()
    }
    if (-topPos<400) {
      stickys.dytop('hide')
      stickys.top.show()
      stickys.bot.show()
    }
  }
}

// 上拉手动刷新
function scrollEndFun(type){
  return function(topPos){
    let llct = loadlistComponent
    let ta = triggerAction
    if (type) {
      llct =loadlistComponent_my
      ta = triggerAction_my
    }
    llct.trigger( <TriggerBar itemMethod={ta}/> )
  }
}

function ScrollList(data, funs){
  const iscrollProps = {
    data: data.lists,
    header: <div style={{marginTop: '30px'}}></div>,
    theme: 'list/qqmusic',
    listClass: 'qqmusic',
    pulldown: funs.pulldown,
    scroll: funs.scroll,
    scrollEnd: funs.scrollEnd,
    iscroll:{
      scrollbars: true,
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: true
    }
  }
  return iscroll(iscrollProps)
}

// blog list
export async function load_list_data(page){
  const data = await Config.pullBlogList('/blog/get', page)
  if (loadlistComponent) loadlistComponent.append(data.lists)
  else {
    loadlistComponent = ScrollList(data, {
      pulldown: pulldownFun(),
      scroll: scrollFun(),
      scrollEnd: scrollEndFun()
    })
  }
  return loadlistComponent
}

export async function my_list_data(page){
  let data = await Config.pullBlogList('/blog/admin/list', page)
  if (data) {
    if (loadlistComponent_my) loadlistComponent_my.append(data.lists)
    else {
      loadlistComponent_my = ScrollList(data, {
        pulldown: pulldownFun('mylist'),
        scroll: scrollFun(),
        scrollEnd: scrollEndFun('mylist')
      })
    }
    return loadlistComponent_my
  }
}

export async function listInstance(type){
  if (!type) {
    if (!loadlistComponent) {
      return await load_list_data(0)
    }
    return loadlistComponent
  } else {
    if (!loadlistComponent_my) {
      return await my_list_data(0)
    }
    return loadlistComponent_my
  }
}
