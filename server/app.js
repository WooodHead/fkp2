// import init from './init'
// let app = init()
//
// // import Koa from 'koa'
// // const app = new Koa()
//
// // app.use( async function (ctx, next){
// //   // ctx.body = 'Hello World'
// //   return await ctx.render('hello',{})
// // })
// app.listen(8070)



// require('coffee-script/register');
import init from './init'
import request from 'request'
console.log(request);
async function server(){
  try {
    let app = await init()
    app.listen(CONFIG.port, function(){
      if (process.env.whichMode!='dev') {
        request('http://localhost:3000/__browser_sync__?method=reload',
        function (error, response, body) {
          if (error) console.log('yes, i know that');
        })         
      }
    })
  } catch (e) {
    console.error(e.stack)
  }
}
server()
