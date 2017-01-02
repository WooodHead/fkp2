import adapter from 'component/adapter/formbloglist'
import {
  input as Input,
  pagilist as PagiList,
  loadlist as LoadList,
  tabs as Tabs,
  htabs as hTabs
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
    {
      input: [
        {type: 'checkbox',id:['checkALL'], name: ['checkALL'], value: ['4'], desc: '全选'},
        {type: 'button', value: '删除', id:"deleteItem"}
      ]
    }
  ]

  const fi = Input({
    data: formConfig
  })

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


// tab mybloglist
// 拿博客列表数据
let pagilistComponent
let loadlistComponent
let curPagiPage = 0

async function pullBlogList(api, page) {
  if (!api) api = '/blog/get'
  return await ajax.get(api, {page: page})
  .then( data => {
    data.lists = adapter(data.lists)
    return data
  })
}

async function load_list_data(page){
  const data = await pullBlogList('/blog/get', page)
  loadlistComponent
  ? loadlistComponent.append(data.lists)
  : loadlistComponent = LoadList({
      data: data.lists,
      scrollContainer: '.tabsBoxes',
      globalName: 'BLOGLOADLIST',
      theme: 'list/lagou',
      listClass: 'like_lagou',
      scrollEnd: function(){
        loadlistComponent.loading( () => load_list_data(++cur_page) )
      },
      pagenation: {
        data: { total: data.total, query: '/blog/page/' }
      }
    })

  return loadlistComponent
}

async function pull_list_data(page){
  const data = await pullBlogList('/blog/admin/list', page)
  pagilistComponent
  ? pagilistComponent.update(data.lists)
  : pagilistComponent = PagiList({
      data: data.lists,
      globalName: 'BLOGLIST',
      theme: 'list/qqmusic',
      listClass: 'qqmusic',
      footer: <div className="footerToolbar">{formToolBar()}</div>,
      itemMethod: function(dom, data){
        const that = this
        $(dom).click(function(){
          const cbox = $(this).find('input[type=checkbox]')[0]
          cboxToggleChecked(cbox, that.idf)
        })
      },
      pagenation: {
        data: { total: data.total, query: '/blog/page/'},
        begin: { start: page },
        itemMethod: function(index){ curPagiPage = index; pagilistComponent.loading( () => pull_list_data(index)) }
      }
    })

  return pagilistComponent
}

// tabs 结构
export default async function(){
  const mylist = await pull_list_data(0)
  const bloglist = await load_list_data(0)
  const tabsConfig = [
    {title: '站点', content: bloglist.render() },
    {title: '用户', content: '444'},
    {title: '文章', content: mylist.render()}
  ]

  Tabs({
    container: 'admin',
    data: tabsConfig,
    itemMethod: tabsUnitFun
  })
  .render()
}

// tabs的菜单部分 子项目点击方法
function tabsUnitFun(dom, index){
  $(dom).click( e => {
    e.stopPropagation()
    this.select(index)
  })
}
