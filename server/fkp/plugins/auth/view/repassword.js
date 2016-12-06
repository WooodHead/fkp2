export default async function(ctx){
  if (ctx.session.$user) {
    let fkp = ctx.fkp
    let attachjs = await fkp.injectjs(['/js/common', '/js/parts/repassword'])
    let attachcss = await fkp.injectcss(['~/css/m/announce', '~/css/m/form'])
    let staticFile = _.extend({}, attachjs, attachcss)

    let repassword = `
      <html>
        <head>
          <title>设置密码</title>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="/css/common.css" />
          {{=attachCss}}
        </head>
        <body>
          <div id="formBox"></div>
          {{=attachJs}}
        </body>
      </html>
    `
    ctx.body = await fkp.template(repassword, staticFile, 1)
  }
}
