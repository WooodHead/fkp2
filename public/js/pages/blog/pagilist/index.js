import libs from 'libs'
import ajax from 'ajax'
import adapter from 'component/adapter/mgbloglist'
import {pure} from 'component/modules/list/pagi_list'

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

function pull_list_data(page){
  try {
    ajax.get('/blog/get', {
      page: page||cur_page
      , tag: cur_tag
      , cat: cur_cat
    })
    .then( data => { // fetch data
      return data
    })
    .then( data => { // 封装原始数据
      data.lists = adapter(data.lists)
      return data
    })
    .then( data => { // 检测SAX是否有globalName
      if (!document.querySelector('#blog')) return false  //没有#blog，则是detail详情
      return [SAX.has('BLOGLIST'), data]
    })
    .then( stat => {
      if (stat[0]) {
        SAX.roll('BLOGLIST', 'LOADED')
        if (stat[1].lists.length) SAX.roll('BLOGLIST', {news: stat[1].lists}, 'UPDATE')
        else {
          SAX.roll('BLOGLIST', 'OVER')
        }
      } else {
        stat[1].lists.length
        ? pure({
          data: stat[1].lists,
          container:  'blog',
          globalName: 'BLOGLIST',
          listClass: 'like_lagou',
          itemClass: 'lg_item',
          pagenation: {
            data: { total: stat[1].total, query: '/blog/page/' },
            begin: { start: cur_page-1 },
            itemMethod: function(page){
              SAX.roll('BLOGLIST', 'LOADING')
              pull_list_data(page)
            }
          }
        })
        : ''
      }
    })
  } catch (e) {
    console.log(e);
  }
}

pull_list_data()
