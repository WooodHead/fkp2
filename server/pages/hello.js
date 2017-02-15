"use strict";
let debug = Debug('pages:hello')

SIO.on('hello', function(data, socket, client) {
  var _io = this.io
  , _id = socket.id
  , remoteIp = client.address
  if (typeof data === 'string') {
    if (data === 'hi') {
      socket.emit('hello', {
        user: 'FKPJS',
        message: `HELLO <br/> 我是websocket的数据`
      })
    }
  }
})

function hello(oridata) {
  return {
    get: async function(ctx){
      const component = ctx.fkp.component()

      // let xxx = await Fetch.get('163')
      // console.log(xxx);
      // let xxx = await ctx.fkp.injectjs(['t/test'])   // node 端注入js

      // let xxx = await Fetch.mock('163')
      // console.log(xxx);

      // let blog = await ctx.fkp.blog()
      // let xxx = await blog.listtopic({page:1})

      // let fdocsHome = await ctx.fkp.docs('fdocs', {
      //   start: true
      // })
      // oridata = _.extend(oridata, fdocsHome)


      const titles1 = [
        <a className="iconfont icon-text" title="列表，如果所有元素都是列表">如果所有元素都是列表</a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-text" title="列表，如果所有元素都是列表"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
        <a className="iconfont icon-goods_new_fill_light"></a>,
        <a className="iconfont icon-video_fill_light"></a>,
      ]
      const list1 = component.baselist({
        data: titles1,
        theme: 'list/books',
        listClass: 'books'
      }, true)

      const grids = component.grids
      const floor1 = grids({
        data: [
          {width: '100%', content: <h3 style={{color:'#9c9c9c'}}>推荐文章</h3>},
          {width: '100%', content: list1}
        ]
      })

      const floor2 = grids({
        header: <h2 className="splite"></h2>,
        data: [
          {width: '100%', content: <h3 style={{color:'#9c9c9c'}}>开源收藏</h3>},
          {width: '100%', content: list1}
        ]
      })

      oridata.floor1 = floor1
      oridata.floor2 = floor2

      // floor1.render()
      // floor2.render()

      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}

    }
  }
}

export { hello as getData }
