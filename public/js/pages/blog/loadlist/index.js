import libs from 'libs'
import ajax from 'ajax'
import adapter from 'component/adapter/mgbloglist'
import {loadlist as LoadList} from 'component'

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

let bloglist  //list实例
(function pull_list_data(page){
  ajax.get('/blog/get', {
    page: page||cur_page
    , tag: cur_tag
    , cat: cur_cat
  })
  .then( data => { // 对原始数据封装
    data.lists = adapter(data.lists)
    return data
  })
  .then( data => {
    if (bloglist) {
      bloglist.append(data.lists)
    } else {
      bloglist = LoadList({
        autoinject: false,
        data: data.lists,
        container:  'blog',
        scrollContainer: $('.box')[0],
        theme: 'list/lagou',
        listClass: 'like_lagou',
        scrollEnd: function(){
          bloglist.loading( () => pull_list_data(++cur_page) )
        },
        pagenation: {  //for node seo, client for clear react warnning
          data: { total: data.total, query: '/blog/page/' }
        }
      }).render()
    }
  })
})()
