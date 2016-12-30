import path from 'path'
import * as handle from './handle'
import GitHub from './third/github'
import RepassWord from './view/repassword'

async function github(ctx, next) {
  const [cat, title, id] = Object.values(ctx.params)
  const _auth = await ctx.fkp.auth()
  const G = new GitHub(ctx, _auth)
  switch (cat) {
    case 'sign':
      await G.sign()
      break;
    case 'logout':
      ctx.session.$user = null
      break;
    case 'callback':
      const res = await G.callback()
      ctx.session.$user = res.user;
      return ctx.redirect(res.url)
      break;
    default:
      next()
  }
}

async function authentication(ctx, next) {
  const [cat, title, id] = Object.values(ctx.params)
  const $auth = await ctx.fkp.auth()
  switch (cat) {
    case 'sign':
      ctx.redirect('/github/sign')
      break;
    case 'isLogin':
      handle.isLogin(ctx)
      break;
    case 'login':
      await RepassWord(ctx)
      break;
    case 'repassword':
      await RepassWord(ctx)
      break;
    case 'resetpwd':
      if (ctx.fkp.isAjax()) {
        const param = ctx.request.body||ctx.query
        const update = $auth.updateuser(ctx)
        await update.password(param)
      }
      break;
    default:
      next()
  }
}

let _db
async function auth(ctx, cmd){
  let fkp = ctx.fkp
  if (_db) return _db
  if (CONFIG.db.select=='mongo') {
    _db = await fkp.database(path.join(__dirname, './common'))
    if (_db && cmd) {
      // do something
    }
    return _db
  }
}

export default function(fkp){
  fkp.routepreset('/github', {
    customControl: github
  })
  fkp.routepreset('/auth', {
    customControl: authentication
  })
  return auth
}
