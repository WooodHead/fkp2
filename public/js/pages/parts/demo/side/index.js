import { list } from 'component'
import tree from 'component/util/tree'

const result = [
  {
    title: '本月活动精选',
    url: 'undefined',
    li: [
      {title: '携程钜惠', url: 'javascript:;'},
      {title: '踏春赏花', url: 'javascript:;'},
      {title: '建行', url: 'javascript:;'},
      {title: '特权日', url: 'javascript:;'},
      {title: '当季热门推荐', url: 'javascript:;'}
    ]
  },
  {
    title: '本月活动精选',
    url: undefined,
    li: [
      {title: '携程钜惠', url: 'javascript:;'},
      {title: '踏春赏花', url: 'javascript:;'},
      {title: '建行', url: 'javascript:;'},
      {title: '特权日', url: 'javascript:;'},
      {title: '当季热门推荐', url: 'javascript:;'}
    ]
  },
  {
    title: '本月活动精选',
    url: undefined,
    li: [
      {title: '携程钜惠', url: 'javascript:;'},
      {title: '踏春赏花', url: 'javascript:;'},
      {title: '建行', url: 'javascript:;'},
      {title: '特权日', url: 'javascript:;'},
      {title: '当季热门推荐', url: 'javascript:;'}
    ]
  },
  {
    title: '本月活动精选',
    url: undefined,
    li: [
      {title: '携程钜惠', url: 'javascript:;'},
      {title: '踏春赏花', url: 'javascript:;'},
      {title: '建行', url: 'javascript:;'},
      {title: '特权日', url: 'javascript:;'},
      {title: '当季热门推荐', url: 'javascript:;'}
    ]
  },
  {
    title: '本月活动精选',
    url: undefined,
    li: [
      {title: '携程钜惠', url: 'javascript:;'},
      {title: '踏春赏花', url: 'javascript:;'},
      {title: '建行', url: 'javascript:;'},
      {title: '特权日', url: 'javascript:;'},
      {title: '当季热门推荐', url: 'javascript:;'}
    ]
  }
]

const result2 = [
  {title: '本月活动精选', url:'javascript:;', idf: 'a'},
  {title: '踏春赏花', url:'javascript:;', parent: 'a'},
  {title: '建行', url:'javascript:;', parent: 'a'},
  {title: '特权日', url:'javascript:;', parent: 'a'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'a'},

  {title: '本月活动精选', url:'javascript:;', idf: 'b'},
  {title: '踏春赏花', url:'javascript:;', parent: 'b'},
  {title: '建行', url:'javascript:;', parent: 'b'},
  {title: '特权日', url:'javascript:;', parent: 'b'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'b'},

  {title: '本月活动精选', url:'javascript:;', idf: 'c'},
  {title: '踏春赏花', url:'javascript:;', parent: 'c'},
  {title: '建行', url:'javascript:;', parent: 'c'},
  {title: '特权日', url:'javascript:;', parent: 'c'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'c'},

  {title: '本月活动精选', url:'javascript:;', idf: 'd'},
  {title: '踏春赏花', url:'javascript:;', parent: 'd'},
  {title: '建行', url:'javascript:;', parent: 'd'},
  {title: '特权日', url:'javascript:;', parent: 'd'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'd'},
]
const Side2 = tree(result2)
const sidelist = list({
  data: Side2
})
const Side = (
  <div className="side">{sidelist}</div>
)

if(document.getElementById('sides')){
  React.render(Side, document.getElementById('sides'))
}
