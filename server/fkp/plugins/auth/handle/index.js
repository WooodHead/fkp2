export function isLogin(ctx){
  const isAjax = ctx.fkp.isAjax()
  if (!isAjax) ctx.redirect('/')
  else {
    let user
    if (ctx.session.$user) {
      user = _.extend({}, ctx.session.$user)
      delete user.thirduser
      delete user._id
      delete user.mode
    } else {
      user = Errors['10010']
    }
    ctx.body = user
  }
}
