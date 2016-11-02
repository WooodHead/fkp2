// 动态设置路由的prefix
export default function(ctx, prefix) {
  if (!prefix) return
  if (prefix.indexOf('/')==-1) return
  let prefixs = CONFIG.route.prefix
  if (prefixs.indexOf(prefix)) return
  prefixs.push(prefix)
}
