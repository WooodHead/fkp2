import router from '../../route'
import libs from 'libs'
import adapter from 'component/adapter/formbloglist'
import {forList, forDetail, forDelete} from './handle/topic'

export default async function(ctx, next){
  const fkp = ctx.fkp
  const component = fkp.component()
  const blog = await fkp.blog()
  const Auth = await fkp.auth()

  let routePrefix = this.opts.prefix
  let route = router.makeRoute(ctx, routePrefix)
  route = 'blog'

  let [cat, title, id] = Object.values(ctx.params)

  let pageData = router.staticMapper(ctx, fkp.staticMapper, route, routePrefix)
  pageData.blog = { admin: true }

  let xData, xDetail, xAdd, xSave, xDel
  let isAjax = fkp.isAjax()

  // 检查登录及是否为管理员
  const user = ctx.session.$user
  if (!user) {
    if (isAjax) {
      return ctx.body = Errors['10010']
    } else {
      return ctx.redirect('/')   // 应该要跳转到登录页
    }
  }
  const isAdmin = user.status == 10000 ? true : false


  // 获取数据
  switch (cat) {
    case 'delete':
      xDel = await forDelete(ctx, blog, isAjax)
    break;
    case 'list':
      const opts = {
        from: 'admin',
        where: [ ['user.username', '==', user.username] ]
      }
      if (isAdmin) delete opts.where[0]
      xData = await forList(ctx, blog, isAjax, opts)
    break;
  }


  // 处理数据
  if (isAjax) {
    pageData =  xData||xDetail||xSave||xDel
  } else {
    xData = await forList(ctx, blog)
    const attachcss = await fkp.injectcss([
      '/css/m/tabs',
      '/css/m/list/lagou',
      '/css/m/list/pagination'
    ])

    const props = {
      loadlist: {
        data: adapter(xData.lists),
        listClass: 'like_lagou',
        pagenation: {
          data: { total: xData.total, query: '/blog/page/' },
          begin: { start: 0 }
        }
      }
    }

    const tabStr = component.tabs({
      data: [
        {title: '站点', content: component.loadlist(props.loadlist, true) },
        {title: '用户', content: '444'},
        {title: '文章', content: '222'}
      ]
    })

    pageData.blog['serverSide'] = tabStr
    pageData = _.assign(pageData, attachcss)

  }
  return router.renderPage(ctx, route, pageData, isAjax)
}
