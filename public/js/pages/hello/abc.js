import {inject} from 'libs'
import './_common/xyz'
import { Slider } from 'component/modules/slider'
import {baselist, grids} from 'component'
import {tips as msgtips, sticky} from 'component/client'
import itemHlc from 'component/mixins/itemhlc'

// websocket
var ws = require('libs/wsocket')
ws.emit('hello', 'hi')
ws.on('hello', function(val){
  setTimeout(function(){
    msgtips.toast(val.message)
  },2000)
})

const Xxx = itemHlc(
  <div className='bottombar-descript'>
    <img src='/images/logo.png' style={{display: 'inline-block', verticalAlign:'middle'}}/>
    <span style={{display: 'inline-block', verticalAlign: 'middle',marginLeft:'0.6em'}}>关注JS全栈，关注React，欢迎入群</span>
  </div>
  , function(dom){
  $(dom).click(function(){
    msgtips.notification('你电到我了')
  })
})
const StickyBBox = sticky.bottom(<Xxx />, {delay: 2000})
// sticky(<Xxx />)

let Xslider = Slider({
  container: 'slider',
  data: [
    <div className="row">
      <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
        <img src="/images/test/tree_root.jpg" title="Funky roots" />
      </div>
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
        <h3>FKP2</h3>
        Full Stack Plus 2<br/> SAP/MPA最佳实践方式
      </div>
    </div>,

    <div className="row">
      <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
        <img src="/images/test/hill_road.jpg" title="The long and winding road" />
      </div>
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
        <h3>脚手架</h3>
        gulp+webpack组合，灵活、模块化的脚手架系统，支持4套模式
      </div>
    </div>,

    <div className="row">
      <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
        <img src="/images/test/houses.jpg" title="Happy trees" />
      </div>
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
        <h3>前端</h3>
        Babel、JQ+React的混合流组件模式，低成本学习成本
      </div>
    </div>,

    <div className="row">
      <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
        <img src="/images/test/houses.jpg" title="Happy trees" />
      </div>
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
        <h3>node端</h3>
        灵活、低配置，无限层级RESTFUL路由，匹配前端目录结构
      </div>
    </div>
  ],
  // control: [
  //   <img src="/images/test/t_tree_root.jpg" title="Funky roots" />,
  //   <img src="/images/test/hill_fence.jpg" title="The long and winding road" />,
  //   <img src="/images/test/t_houses.jpg" title="Happy trees" />
  // ],
}).render()

// const titles = [
//   <a title="列表，如果所有元素都是列表">列表，如果所有元素都是列表</a>,
//   <a>元件，组件是怎么构成的</a>,
//   <a>元件，可伸缩的元件设计</a>
// ]

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
]
const list1 = baselist({
  data: titles1,
  theme: 'list/books',
  listClass: 'books'
})

const floor1 = grids({
  data: [
    {width: '27%', content: <h3 style={{color:'#9c9c9c'}}>推荐文章</h3>},
    {width: '71%', content: list1.render()}
  ],
  container: 'test'
})

const floor2 = grids({
  header: <h2 className="splite"></h2>,
  data: [
    {width: '27%', content: <h3 style={{color:'#9c9c9c'}}>开源收藏</h3>},
    {width: '71%', content: list1.render()}
  ],
  container: 'opensrc'
})

floor1.render()
floor2.render()


// ajax.get('/api/163')
// .then( (data) => {
//   console.log(data);
//   msgtips('get baidu首页数据over')
// })
// msgtips.warning('get data')

setTimeout( () => {
  ajax.post('/hello')
  .then( (data) => {
    console.log(data);
  })
  msgtips.success('post data yes, click to close', 'error')
  msgtips.sticky('欢迎密集喜爱症患者, 点击关闭', 'error')
},1000)
