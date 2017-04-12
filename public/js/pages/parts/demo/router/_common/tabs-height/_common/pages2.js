import {inject} from 'libs'
import { list } from 'component'
import tree from 'component/util/tree'

const result = [
  {title: '本月活动精选', url:'javascript:;', idf: 'a', content: pages1},
  {title: '踏春赏花', url:'javascript:;', parent: 'a'},
  {title: '建行', url:'javascript:;', parent: 'a'},
  {title: '特权日', url:'javascript:;', parent: 'a'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'a'},

  {title: '本月活动精选', url:'javascript:;', idf: 'b', content: 'pages1'},
  {title: '踏春赏花', url:'javascript:;', parent: 'b'},
  {title: '建行', url:'javascript:;', parent: 'b'},
  {title: '特权日', url:'javascript:;', parent: 'b'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'b'},

  {title: '本月活动精选', url:'javascript:;', idf: 'c', content: 'pages1'},
  {title: '踏春赏花', url:'javascript:;', parent: 'c'},
  {title: '建行', url:'javascript:;', parent: 'c'},
  {title: '特权日', url:'javascript:;', parent: 'c'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'c'},

  {title: '本月活动精选', url:'javascript:;', idf: 'd', content: 'pages1'},
  {title: '踏春赏花', url:'javascript:;', parent: 'd'},
  {title: '建行', url:'javascript:;', parent: 'd'},
  {title: '特权日', url:'javascript:;', parent: 'd'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'd'},
]
const Side = tree(result)
const sidelist = list({
  data: Side
})
const pages1 = (
  <div className="side-content">{sidelist}</div>
)

export default pages1
