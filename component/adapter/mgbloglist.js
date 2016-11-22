import libs from 'libs'

//ajax列表页数据处理
export default function(data){
  // <span><img src={item.user.avatar}/></span>
  return data.map( item => {
    let _title = (
      <div className="title_header">
        <a target="_blank" href={"/blog/topic/"+item._id}>{item.title}</a>
        <abbr>
          {libs.timeAgo(item.create_at)}
        </abbr>
      </div>
    )
    return {
      title: _title,
      body: [
        { k: '作者: ', v: item.user.nickname },
        { k: '标签: ', v: mk_tags(item.tags) },
        { k: '浏览: ', v: item.visit_count }
      ]
    }
  })
}

// 生成标签模版
function mk_tags(tag){
  if (!tag) return ''
  return tag.map( ($v, ii) => {
    $v = _.trim($v)
    return <a key={'tags'+ii} href={'?tag='+$v}>{$v}</a>
  })
}
