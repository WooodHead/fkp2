import {inject} from 'libs'
import { htabs as Tabs } from 'component/client'

import pages1 from './_common/pages1'
import pages2 from './_common/pages2'
import pages3 from './_common/pages3'

inject().css(`
  .tabsGroup{
    margin: 30px 0 0 50px
  }
`)

const result = [
  {title: <span><i className="icon-filter"></i>本月活动精选</span>, url:'javascript:;', idf: 'a', content: pages1},
  {title: '踏春赏花', url:'javascript:;', parent: 'a'},
  {title: '建行', url:'javascript:;', parent: 'a'},
  {title: '特权日', url:'javascript:;', parent: 'a'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'a'},

  {title: <span><i className="icon-filter"></i>本月活动精选</span>, url:'javascript:;', idf: 'b', content: pages2},
  {title: '踏春赏花', url:'javascript:;', parent: 'b'},
  {title: '建行', url:'javascript:;', parent: 'b'},
  {title: '特权日', url:'javascript:;', parent: 'b'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'b'},

  {title: <span><i className="icon-filter"></i>本月活动精选</span>, url:'javascript:;', idf: 'c', content: pages3},
  {title: '踏春赏花', url:'javascript:;', parent: 'c'},
  {title: '建行', url:'javascript:;', parent: 'c'},
  {title: '特权日', url:'javascript:;', parent: 'c'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'c'},

  {title: <span><i className="icon-filter"></i>本月活动精选</span>, url:'javascript:;', idf: 'd', content: 'pages4'},
  {title: '踏春赏花', url:'javascript:;', parent: 'd'},
  {title: '建行', url:'javascript:;', parent: 'd'},
  {title: '特权日', url:'javascript:;', parent: 'd'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'd'},

  {title: <span><i className="icon-filter"></i>本月活动精选</span>, url:'javascript:;', idf: 'd', content: 'pages5'},
  {title: '踏春赏花', url:'javascript:;', parent: 'd'},
  {title: '建行', url:'javascript:;', parent: 'd'},
  {title: '特权日', url:'javascript:;', parent: 'd'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'd'},
]

const tabsxx = Tabs({
  data: result,
  theme: 'tabs/tabsnav',
  itemMethod: function(dom, index){
    console.log($(dom));
    if (dom.itemroot){
      $(dom).hover( (e) =>{
        $('.tabsBoxes').css({'display': 'block','top': e.currentTarget.offsetTop})
        $(dom).addClass('active').siblings().removeClass('active')
        e.stopPropagation()
        this.select(index)
      })
      // ,() =>{
      //   $('.tabsBoxes').css({'display': 'none'})
      //   $(dom).removeClass('active')
      // }
    }
  }
})

const tabsxxDom = (
  <div id="tabs-content">{tabsxx.render()}</div>
)

export default tabsxxDom
// tabsxx.render('test')
