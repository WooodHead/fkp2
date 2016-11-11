import init from './init'
import router from './route'

export default async function(app) {
  let fkp = await init(app)

  //路由处理
  if (_.isArray(CONFIG.route.prefix)) {  //koa-router prefix，任何prefix均带有resful三层结构 :cat:title:id
    let prefix = CONFIG.route.prefix
    prefix.map((item)=>{
      if (item.indexOf('/')==0) router(app, item)
    })
  }
  router(app)
}
