import {inject} from 'libs'
import { list, grids} from 'component/client'
import tree from 'component/util/tree'

const _data = [
  {
    title: '阿里巴巴',
    url: 'javascript:;',
    img: 'https://img.alicdn.com/bao/uploaded/i1/TB1okguKFXXXXXHXFXXSutbFXXX.jpg_120x120.jpg',
  },
  {
    title: '阿里巴巴',
    url: 'javascript:;',
    img: 'https://img.alicdn.com/bao/uploaded/i1/TB1okguKFXXXXXHXFXXSutbFXXX.jpg_120x120.jpg',
  },
  {
    title: '阿里巴巴',
    url: 'javascript:;',
    img: 'https://img.alicdn.com/bao/uploaded/i1/TB1okguKFXXXXXHXFXXSutbFXXX.jpg_120x120.jpg',
  },
  {
    title: '阿里巴巴',
    url: 'javascript:;',
    img: 'https://img.alicdn.com/bao/uploaded/i1/TB1okguKFXXXXXHXFXXSutbFXXX.jpg_120x120.jpg',
  }
]
const adList = list({
  data: _data
})

const advertising = grids({data: [adList]})

const result = [
  {title: <span className="title-more"><i className="icon-filter"></i><a href="#">本月活动精选</a><a href="javascript:;" className="more">更多 ></a></span>, idf: 'a', content: pages1},
  {title: '踏春赏花', url:'javascript:;', parent: 'a'},
  {title: '建行', url:'javascript:;', parent: 'a'},
  {title: '特权日', url:'javascript:;', parent: 'a'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'a'},

  {title: '本月活动精选', url:'javascript:;', idf: 'b', content: 'pages1'},
  {title: '踏春赏花', url:'javascript:;', parent: 'b'},
  {title: '建行', url:'javascript:;', parent: 'b'},
  {title: '特权日', url:'javascript:;', parent: 'b'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'b'},
]
const Side = tree(result)
const sidelist = list({
  data: Side
})

const pages1 = (
  <div className="side-content">
    {sidelist}
    <div className="advertising">{advertising.render()}</div>
  </div>
)

export default pages1
