import libs from 'libs'

/**
 * 返回分页列表数据
 * @param  {[type]}  ctx    [description]
 * @param  {[type]}  blog   [description]
 * @param  {Boolean} isAjax [description]
 * @return {Promise}        [description]
 */
export async function isLogin(ctx){
  if (ctx.session.$user) return ctx.session.$user
}
