import {sticky} from 'component/client'
import itemHlc from 'component/mixins/itemhlc'
import adapter from 'component/adapter/mgbloglist'
import {
  input as Input,
  loadlist as LoadList,
  tabs as Tabs,
  cards as Cards
} from 'component'

import {
  queryParams,
  inject
} from 'libs'

inject()
.css(`
  .footerToolbar{
    background-color: #eeeeee;
    line-height: 2;
    padding: 1em 1.6em;
  }
  .footerToolbar input[type=button]{
    height: 2em;
    line-height: 0.9;
    width: 4em;
    border: none;
    box-shadow:-1px -1px 1px #999 inset;
  }
  #deleteItem{
    background-color:#fff;
    margin-left: -1em;
  }
  .tabsBoxes .like_lagou li:before{
    content: none;
  }
`)

let params = queryParams('/blog')
let cur_page=1, cur_tag, cur_cat
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
function cboxToggleChecked(cbox, idf){
  if (cbox.checked){
    cbox.checked = false
    delete selectedItem[idf]
  } else {
    cbox.checked = true
    selectedItem[idf] = cbox.value
  }
}

function formToolBar(){
  const formConfig = [
    {type: 'checkbox',id:['checkALL'], name: ['checkALL'], value: ['4'], desc: '全选'},
    {type: 'button', value: '删除', id:"deleteItem"}
  ]
  const fi = Input({ data: [{ input: formConfig}] })

  fi.rendered = function(){
    $('#checkALL').click( e => {
      $('input[name=selected]').each((ii, item)=>{
        cboxToggleChecked(item, ii)
      })
    })

    $('#deleteItem').click( async e => {
      if (Object.keys(selectedItem).length) {
        const res = await ajax.post('/blog/admin/delete', selectedItem)
        if (res.success) {
          pull_list_data(curPagiPage)
        }
      }
    })
  }

  return fi.render()
}


inject().css('/css/m/sticky/blog')
// sticky top bar
const StickyBar = itemHlc( <div className="sticky-blog toplock">aaa</div> )
const stickyTopBar1 = sticky(<StickyBar />)

// sticky top bar1, scroll to 200 then trigger it
let stickyTopBar
function triggerTopStickyBar(behavior){
  if (behavior == 'show') {
    if (stickyTopBar) {
      stickyTopBar.show()
    } else {
      const StickyTBar = itemHlc( <div className="sticky-blog" style={{marginTop: '30px'}}>bbb</div> )
      stickyTopBar = sticky(<StickyTBar />)
      stickyTopBar.container.style.zIndex = '9990'
    }
  } else {
    stickyTopBar ? stickyTopBar.hide() : ''
  }
}

// sticky bottom bar
const StickyBBar = itemHlc(
  <div className="sticky-blog bottomlock">
    <div className="b-left" id="b-left"></div>
    <div className="b-right" id="b-right">
      {formToolBar()}
    </div>
  </div> )
const stickyBottomBar = sticky.bottom(<StickyBBar />, {delay: 1000})




inject()
.css( `
  .tb-bar{
    padding: 1em 2em 6em 2em;
    text-align: center;
    cursor: pointer;
  }
  .overbar{
    padding: 1em 2em 6em 2em;
    text-align: center;
    cursor: pointer;
  }
`)
// fetch blog list data array
let loadlistComponent
let curPagiPage = 0
async function pullBlogList(api, page) {
  if (!api) api = '/blog/get'
  let _data = await ajax.get(api, {page: page})
  _data.lists = adapter(_data.lists)
  return _data
}

// blog list scroll function
function scrollFun(topPos){
  if (topPos>200) triggerTopStickyBar('show')
  else {
    triggerTopStickyBar('hide')
  }
}

// blog list scrollend function
const TriggerBar = itemHlc(<div className='tb-bar'>加载更多内容</div>)
function scrollEndFun(topPos){
  loadlistComponent.trigger( <TriggerBar itemMethod={ dom => {
    $(dom).click(function(){
      load_list_data(++cur_page)
    })
  }}/> )
}

// blog list
async function load_list_data(page){
  const data = await pullBlogList('/blog/get', page)
  if (loadlistComponent) loadlistComponent.append(data.lists)
  else {
    const props = {
      data: data.lists,
      globalName: 'BLOGLOADLIST',
      theme: 'list/qqmusic',
      listClass: 'qqmusic',
      header: <div style={{marginTop: '15px'}}></div>,
      pagenation: {
        data: { total: data.total, query: '/blog/page/', per: 20 }
      },
      scroll: scrollFun,
      scrollEnd: scrollEndFun
    }
    loadlistComponent = LoadList(props)
    return loadlistComponent
  }
}

const tabsTreeHeader = () => {
  const headerItem = [
    { img: '/images/logo128.png',
      body:[
        {title: <div>天天修改</div>},
        {title: <hr />},
      ]
    }
  ]
  return Cards({
    data: headerItem,
    theme: 'cards/blog'
  })
}

// tabs 结构
(async function(){
  const bloglist = await load_list_data(0)
  const tabsConfig = [
    {title: 'AGZGZ', idf: 'category'},
    {title: '博客', content: bloglist.render(), parent: 'category'},
    {title: '用户', content: '444', parent: 'category'}
  ]
  const menuHeader = tabsTreeHeader()
  const tabs = Tabs({
    data: tabsConfig,
    treeHeader: menuHeader.render(),
    container: 'blog',
    theme: 'tabs/blog',  // = /css/m/tabs/blog
    fold: false,
    itemMethod: tabsUnitFun
  })

  tabs.rendered = function(){
    $(stickyBottomBar.container).css({width: '100%'})
    this.select(1)
  }

  tabs.render()
})()

// tabs的菜单部分 子项目点击方法
function tabsUnitFun(dom, index){
  $(dom).click( e => {
    e.stopPropagation()
    if (index == 1 ) {
      stickyTopBar1.show()
      stickyBottomBar.show()
    }
    if (index != 1 && index != 0) {
      triggerTopStickyBar('hide')
      stickyTopBar1.hide()
      stickyBottomBar.hide()
    }
    this.select(index, dom)
  })
}
