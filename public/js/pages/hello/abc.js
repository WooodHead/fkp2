import {inject, mediaQuery} from 'libs'
import { Slider } from 'component/modules/slider'
import {baselist, grids} from 'component'
import {tips as msgtips, sticky, modal} from 'component/client'
import itemHlc from 'component/mixins/itemhlc'
import scrollHlc from 'component/mixins/scrollhlc'
var ws = require('libs/wsocket')
require('./_common/pushboom')(ws)

const autoinject = false;
// websocket
// ws.emit('hello', 'hi')
// ws.on('hello', function(val){
//   setTimeout(function(){
//     msgtips.toast(val.message)
//   },0)
// })

let Modal = modal.p30
mediaQuery({
  mobile: function(){
    Modal = modal.p70
  }
})

inject().css(
`
  .navtop{
    width: 100%;
    height: 50px;
    padding: 5px;
    background-color: #318853;
  }
`
)

const nevTop = (
  <div className='navtop'>
    <div style={{width: '1050px',margin:'0 auto', height: '100%'}}>
      <img src="/images/logo118.png" style={{height: '100%',width:'auto'}}/>
    </div>
  </div>
)
const StickyBBox = sticky.bottom(document.getElementById('agzgzNav'), {delay: 2000, autoinject: false})
const StickyTBox = sticky(nevTop, {autoinject: false})

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
const list1 = baselist({
  data: titles1,
  listClass: 'books',
  autoinject
})

const floor1 = grids({
  autoinject,
  container: 'test',
  data: [
    {width: '100%', content: <h3 style={{color:'#9c9c9c'}}>推荐文章</h3>},
    {width: '100%', content: list1.render()}
  ],
}).render()

setTimeout(()=>{
  scrollHlc($('.columContainer')[0], {
    scrollContainer: window,
    scroll: function(dom, state){
      if (state.directionY == 'down') {
        StickyBBox.hide()
      } else {
        StickyBBox.show()
      }
    }
  })
}, 1000)

// setTimeout(()=>{
//   const yyy = $('.columWrap')[0]
//   iscrollHlc(yyy, {
//     scrollX: true,
//     scrollY: true,
//     momentum: false,
// 		snap: true
//   })
// },1000)


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
  // msgtips.sticky('格子格子，全都是格子', 'success')
},1000)
