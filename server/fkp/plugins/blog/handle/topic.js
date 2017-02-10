import libs from 'libs'
import {isLogin} from './user'
/**
 * 返回分页列表数据
 * @param  {[type]}  ctx    [description]
 * @param  {[type]}  blog   [description]
 * @param  {Boolean} isAjax [description]
 * @return {Promise}        [description]
 */
export async function forList(ctx, blog, isAjax, options){
  let [total, lists] = await _forlist(ctx, blog, isAjax, options)
  return {total, lists: lists}
}

export async function forSave(ctx, blog, isAjax){
  if (!await isLogin(ctx)) return Errors['10005']
  return await blog.addtopic(ctx)
}

export async function forDelete(ctx, blog, isAjax){
  if (!await isLogin(ctx)) return Errors['10005']
  const bodys = ctx.request.body
  return await blog.deletetopic(ctx, bodys)
}

export async function forDetail(ctx, blog, isAjax){
  let fkp = ctx.fkp
  let detail = await blog.detailtopic({_id: (ctx.params.title||ctx.query.topic)})
  if (!isAjax) {
    await blog.counttopic({_id: (ctx.params.title||ctx.query.topic)})
  }
  if (!detail.error) {
    let mdcontent = await fkp.markdown(detail.content)
    mdcontent.mdcontent.user = detail.user
    mdcontent.mdcontent.profile = {
      _id: detail._id,
      src: detail.content,
      last_reply_at: detail.last_reply_at,
      collect_count: detail.collect_count,
      visit_count: detail.visit_count,
      reply_count: detail.reply_count,
      lock: detail.lock,
      good: detail.good,
      top: detail.top,
      update_at: detail.update_at,
      create_at: detail.create_at
    }
    return mdcontent
  }
}

export async function forTotal(ctx, blog, isAjax){
  return await blog.total()
}

async function _forlist(ctx, blog, isAjax, opts){
  let lists = []
  if (isAjax) {
    let {page, tag, category} = ctx.method == 'GET' ? ctx.query : ctx.request.body
    page = (page&&parseInt(page)) || 1
    if (tag) {
      lists = await blog.listtopic({page: page}, {query: {tags: decodeURI(tag)}})
    }
    else if (category) lists = await blog.listtopic({page: page}, {query: {cats: decodeURI(category)}})
    else {
      lists = await blog.listtopic({page: page}, opts)
    }
  } else {
    let [cat, title, id] = Object.values(ctx.params)
    let {page, tag, category} = ctx.query
    page = title||(page&&parseInt(page)) || 1

    if (tag) {
      lists = await blog.listtopic({page: page}, {query: {tags: decodeURI(tag)}})
    }
    else if (category) lists = await blog.listtopic({page: page}, {query: {cats: decodeURI(category)}})
    else {
      lists = await blog.listtopic({page: page}, opts)
    }
  }
  let total = await blog.total()
  return [total, lists]
}
