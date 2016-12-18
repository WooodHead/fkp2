import libs from 'libs'
import ajax from 'ajax'
import adapter from 'component/adapter/mgbloglist'
import {PagiList, pure} from 'component/modules/list/pagi_list'

let params = libs.queryParams('/blog')
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

let pagilist
(function pull_list_data(page){
  ajax.get('/blog/get', {
    page: page||cur_page
    , tag: cur_tag
    , cat: cur_cat
  })
  .then( data => { // 封装原始数据
    data.lists = adapter(data.lists)
    return data
  })
  .then( data => {
    if (pagilist) {
      pagilist.update(data.lists)
    } else {
      pagilist = PagiList({
        data: data.lists,
        container:  'blog',
        globalName: 'BLOGLIST',
        listClass: 'like_lagou',
        itemClass: 'lg_item',
        pagenation: {
          data: { total: data.total, query: '/blog/page/' },
          begin: { start: cur_page-1 },
          itemMethod: function(page){
            SAX.roll('BLOGLIST', 'LOADING')
            pagilist.loading(()=>{
              pull_list_data(page)
            })
          }
        }
      }).render()
    }
  })
})()
