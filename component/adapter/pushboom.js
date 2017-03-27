import libs from 'libs'
import wrapItem from '../mixins/combinex'
// [{
//   _id : "8ffa468ef0f94220a10654a9c6cf4c68",
//   count : 14,
//   id : 13,
//   title : "wui128",
//   type : "boom",
//   url : "http://www.hhgt.com"
// }]
function _delete(dom){
  // $(dom).click(function(){ })
}
function del(){
  const Del = wrapItem(<i className='iconfont icon-lajitong btn-active'></i>, _delete)
  return <Del/>
}

const toolbar = [
  del()
]

//ajax列表页数据处理
export default function(data){
  return data.map( item => {
    const _title = <a target="_blank" href={item.url}>{item.title}</a>
    return {
      title: _title,
      body: [ { li: toolbar } ]
    }
  })
}
