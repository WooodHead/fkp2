import { iscroll } from 'component'
import { queryParams, inject, addEvent, rmvEvent } from 'libs'
import adapter from 'component/adapter/mgbloglist'
import adapter_my from 'component/adapter/formbloglist'
import {slip} from 'component/client'

inject()
.css( `
  /* === public/js/pages/blog/tabs/_common/bloglist === */
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
const RUNTIME = SAX('Runtime')
const runtime = RUNTIME.get()
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

// toggle checkbox
let selectedItem = {}
let selectedItemDom = {}
function cboxToggleChecked(cbox, idf, dom){
  if (cbox.checked){
    cbox.checked = false
    delete selectedItem[idf]
    if(selectedItemDom[idf]) delete selectedItemDom[idf]
  } else {
    cbox.checked = true
    selectedItem[idf] = cbox.value
    if(dom) selectedItemDom[idf] = dom
  }
}

// const PullDownBar = Config.pulldownBar
// const pulldownAction = (dom) => {
//
// }

const TriggerBar = Config.triggerBar
function triggerAction(dom) {
  $(dom).click(e => {
    load_list_data(++cur_page)
  })
}

function triggerAction_my(dom) {
  $(dom).click(e => {
    my_list_data(++cur_page)
    setTimeout(()=>{
      listMethod()()
    }, 100)
  })
}

// 下拉刷新
let pulldownStat = false
function pulldownFun(type){
  return async function(topPos){
    let llct = loadlistComponent
    let api = '/blog/get'
    let adp = adapter
    if (type) {
      llct = loadlistComponent_my
      api = '/blog/admin/list'
      adp = adapter_my
    }
    if (topPos > 50) {
      if (!pulldownStat) {
        const PulldownBar = Config.pulldownBar
        llct.pulldown(<PulldownBar />)
        pulldownStat = true
        const data = await Config.pullBlogList(api, 0, adp)
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
      stickys.toolbar('hide')
      stickys.top.hide()
      stickys.bot.hide()
    } else {
      if (runtime.docker == 'mylist') {
        stickys.toolbar('show')
      }
      // stickys.dytop('show')
      stickys.top.show()
      stickys.bot.show()
    }
    if (-topPos<400) {
      // stickys.dytop('hide')
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

let slimeDomParent
function listMethod(type) {
  return function(dom) {
    if (!slimeDomParent) slimeDomParent = dom
    let slipDom = $(slimeDomParent).find('.hlist')[0]
    slip.x(slipDom, {
      rightBlock: function(dom){
        let that = this
        const cbox = $(this.parent).find('input[type=checkbox]')[0]
        if (!$(dom).find('.item-remove').length ){
          $(dom).append(`
            <span class="btn btn-swipmenu item-remove" style="background-color:#fff;">删除</span>
            <span class="btn btn-swipmenu item-edit" style="background-color:#fff;"><a href='/blog/edit?topic=${cbox.value}' target='_blank'>编辑</a></span>
          `)
          $(dom).find('.item-remove').click(async function(){
            if (cbox) {
              const res = await ajax.post('/blog/admin/delete', {0: cbox.value})
              if (res.success) {
                that.remove()
              }
            }
          })
        }
      }
    })

    setTimeout(()=>{
      $('#checkALL').click( e => {
        $('input[name=selected]').each((ii, item)=>{
          cboxToggleChecked(item, ii)
        })
      })

      $('#deleteArticleItem').click( async e => {
        if (Object.keys(selectedItem).length) {
          const res = await ajax.post('/blog/admin/delete', selectedItem)
          if (res.success) {
            if (Object.keys(selectedItemDom).length) {
              Object.keys(selectedItem).map((item)=>{
                selectedItemDom[item].remove()
                // pull_list_data(curPagiPage)
              })
            }
          }
        }
      })
    }, 1500)
  }
}

function itemMethod(dom, data){
  const that = this
  $(dom).click(function(){
    const cbox = $(this).find('input[type=checkbox]')[0]
    cboxToggleChecked(cbox, that.idf, dom)
  })
}


function ScrollList(data, funs){
  const iscrollProps = {
    data: data.lists,
    header: <div style={{marginTop: '30px'}}></div>,
    theme: 'list/qqmusic',
    listClass: 'qqmusic',
    itemMethod: funs.itemMethod,
    listMethod: funs.listMethod,
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
  const data = await Config.pullBlogList('/blog/get', page, adapter)
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
  let data = await Config.pullBlogList('/blog/admin/list', page, adapter_my)
  if (data) {
    if (loadlistComponent_my) loadlistComponent_my.append(data.lists)
    else {
      loadlistComponent_my = ScrollList(data, {
        listMethod: listMethod(),
        itemMethod: itemMethod,
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
