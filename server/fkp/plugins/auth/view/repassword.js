export default async function(ctx){
  if (ctx.header.referer.indexOf('/blog/add')>-1 && ctx.session.$user) {
  // if (ctx.session.$user) {
    let fkp = ctx.fkp
    let attachjs = await fkp.injectjs(['/js/common', '/js/parts/repassword'])
    let attachcss = await fkp.injectcss(['/css/common', '/css/m/announce', '/css/m/form'])
    let staticFile = _.extend({}, attachjs, attachcss)

    let repassword = `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta content="telephone=no" name="format-detection" />
          <title>设置密码</title>
          {{=attachCss}}
        </head>
        <body>
          <div id="formBox"></div>
        </body>
        {{=attachJs}}
      </html>
    `
    ctx.body = await fkp.template(repassword, staticFile, 1)
  }
}
