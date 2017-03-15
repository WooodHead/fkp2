"use strict";
let debug = Debug('pages:hello')
import pushboomDb from './common/pushboom'

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
        <a className="iconfont icon-text" href='/docs' title="FKP2文档">FKP2文档</a>,
        <a className="iconfont icon-video_fill_light" href='/blog' title="博客">博客</a>,
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
            }, true),

            grids = component.grids,

            floor1 = grids({
              data: [
                {width: '100%', content: <h3 style={{color:'#9c9c9c'}}>推荐文章</h3>},
                {width: '100%', content: list1}
              ]
            }),

            treeVal = pushboomDb.find().reverse(),
            PushboomList = component.iscroll({
              data: treeVal||[],
              listClass: 'pushboomBody',
              iscroll: { scrollX: true }
            }, true),

            pushBoomHistoryData = [
              {"title":"文档","url":"http://www.agzgz.com/docs"},
              {"title":"博客","url":"http://www.agzgz.com/blog"},
            ],

            PushboomHis = component.baselist({ data: pushBoomHistoryData, listClass: 'history' }, true),

            pushboom = (
              <div className="pushboomContainer">
                {PushboomList}
                {PushboomHis}
              </div>
            ),

            pushboomStr = ReactDomServer.renderToString(pushboom)

      oridata.floor1 = floor1
      oridata.pushBoom = pushboomStr

      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}

    }
  }
}

export { hello as getData }
