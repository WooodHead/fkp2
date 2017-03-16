import {list} from 'component'

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
const sidelist = list({
  data: result
})
const Side = (
  <div className="side">{sidelist}</div>
)

if(document.getElementById('sides')){
  React.render(Side, document.getElementById('sides'))
}
