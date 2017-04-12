import {inject} from 'libs'
import { list } from 'component'
import tree from 'component/util/tree'

const result = [
  // {title: '本月活动精选', url:'javascript:;', idf: 'a'},
  {title: '广东', url:'javascript:;', idf: 'xx'},
  {title: '游玩方式', url:'javascript:;', parent: 'xx', idf: 'a'},
  {title: '踏春赏花', url:'javascript:;', parent: 'a'},
  {title: '建行', url:'javascript:;', parent: 'a'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'a'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'xx', idf: 'bxxx'},
  {title: '特权日', url:'javascript:;', parent: 'bxxx'},
  {title: '特权日', url:'javascript:;', parent: 'bxxx'},
  {title: '特权日', url:'javascript:;', parent: 'bxxx'},


  {title: '广东', url:'javascript:;', idf: 'yy'},
  {title: '游玩方式', url:'javascript:;', parent: 'yy', idf: 'yya'},
  {title: '踏春赏花', url:'javascript:;', parent: 'yya'},
  {title: '建行', url:'javascript:;', parent: 'yya'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'yya'},
  {title: '当季热门推荐', url:'javascript:;', parent: 'yy', idf: 'yyb'},
  {title: '特权日', url:'javascript:;', parent: 'yyb'},
  {title: '特权日', url:'javascript:;', parent: 'yyb'},
  {title: '特权日', url:'javascript:;', parent: 'yyb'},

]
const Side = tree(result)
const sidelist = list({
  data: Side
})
const pages3 = (
  <div className="side-content-row-b">{sidelist}</div>
)

export default pages3
