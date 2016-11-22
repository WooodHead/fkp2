import libs from 'libs'

/**
 * 返回分页列表数据
 * @param  {[type]}  ctx    [description]
 * @param  {[type]}  blog   [description]
 * @param  {Boolean} isAjax [description]
 * @return {Promise}        [description]
 */
export async function forList(ctx, blog, isAjax){
  let [total, lists] = await _forlist(ctx, blog, isAjax)
  return {total, lists: lists}
}

export async function forDetail(ctx, blog, isAjax){
  let fkp = ctx.fkp
  let detail = await blog.detailtopic({_id: (ctx.params.title||ctx.query.topic)})
  if (!detail.error) {
    let mdcontent = await fkp.markdown(detail.content)
    // console.log(mdcontent.mdcontent.cnt);
    return mdcontent
  }
}

async function _forlist(ctx, blog, isAjax){
  let lists = []
  if (isAjax) {
    let [page, tag, cat] = ctx.method == 'GET' ? Object.values(ctx.query) : Object.values(ctx.request.body)
    page = (page&&parseInt(page)) || 1
    if (tag) lists = await blog.listtopic({tag:tag, page: page})
    if (cat) lists = await blog.listtopic({cat:cat, page: page})
    lists = await blog.listtopic({page: page})
  } else {
    let [cat, title, id] = Object.values(ctx.params)
    lists = await blog.listtopic({page: title||1})
  }
  let total = await blog.total()
  return [total, lists]
}
