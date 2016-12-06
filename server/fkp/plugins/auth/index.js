
import GitHub from './third/github'
import RepassWord from './view/repassword'

async function github(ctx, next) {
  const [cat, title, id] = Object.values(ctx.params)
  const blog = await ctx.fkp.blog()
  const G = new GitHub(ctx, blog)
  switch (cat) {
    case 'sign':
      await G.sign()
      break;
    case 'logout':
      ctx.session.$user = null
      break;
    case 'callback':
      await G.callback()
      break;
    default:
      next()
  }
}

async function auth(ctx, next) {
  const [cat, title, id] = Object.values(ctx.params)
  const blog = await ctx.fkp.blog()
  switch (cat) {
    case 'repassword':
      await RepassWord(ctx)
      break;
    case 'resetpwd':
      if (ctx.fkp.isAjax()) {
        const pwdData = ctx.request.body||ctx.query
        await blog.updateuser(ctx, pwdData)
      }
      break;
    default:
      next()
  }
}

let _db
async function authentication(ctx, cmd){
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

// 返回静态mapper的映射表，前端注入静态文件
export default function(fkp){
  fkp.routepreset('/github', {
    customControl: github
  })
  fkp.routepreset('/auth', {
    customControl: auth
  })
  // return authentication
}
