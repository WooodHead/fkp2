import init from './init'
let app = init()

// import Koa from 'koa'
// const app = new Koa()

// app.use( async function (ctx, next){
//   // ctx.body = 'Hello World'
//   console.log(ctx.render);
//   return await ctx.render('hello',{})
// })

app.listen(8070)