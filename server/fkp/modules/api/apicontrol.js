import router from '../../route'

export default async function(ctx, next){
  let route = router.makeRoute(ctx)
  route = route.replace('api/', '')
  ctx.body  = await Fetch.get(route)
}
