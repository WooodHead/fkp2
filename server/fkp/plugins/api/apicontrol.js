import makeRoute from '../../route/makeroute'

export default async function(ctx, next){
  let method = ctx.method
  let fkp = ctx.fkp
  let route = makeRoute(ctx)
  let params = ctx.params
  let apilist = Fetch.apilist

  let cat = params.cat
  let title = params.title
  let id = params.id

  ctx.body  = await Fetch.get(route)
}
