import {inject} from 'libs'
import {wrapItem, grids, list} from 'component/client'
import tree from 'component/util/tree'


function index(router){
  const result = [
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
  const sidetree = tree(result)
  console.log(sidetree);
  const sidelist = list({
    data: sidetree
  })
  const Side = wrapItem(
    <div>
      <h2>左侧边栏</h2>
      <div className="side">
        {sidelist}
      </div>
    </div>
  )
  return <Side/>
}

export default function(router){
  return {
    main: function(data){
      return index(router)
    },

    enter: function(data){
      return this.main(data)
    },

    leave: function(){
    },

    loaded: function(dom){

    }
  }
}
