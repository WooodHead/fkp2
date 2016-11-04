// import api from 'api'
import * as libs from 'libs'
import './_common/xyz'
import { Slider } from 'component/modules/slider'

// websocket
var ws = require('libs/wsocket')
ws.emit('hello', 'hi')
ws.on('hello', function(val){
  setTimeout(function(){
    libs.msgtips(val.message)
  },2000)
})

let Xslider = Slider(
[
  <div className="row">
    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
      <img src="/images/test/tree_root.jpg" title="Funky roots" />
    </div>
    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
      <h2>FKP2</h2>
      Full Stack Plus 2<br/> SAP/MPA最佳实践方式
    </div>
  </div>,

  <div className="row">
    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
      <img src="/images/test/hill_road.jpg" title="The long and winding road" />
    </div>
    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
      <h2>脚手架</h2>
      gulp+webpack组合，灵活、模块化的脚手架系统，支持4套模式
    </div>
  </div>,

  <div className="row">
    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
      <img src="/images/test/houses.jpg" title="Happy trees" />
    </div>
    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
      <h2>前端</h2>
      Babel、JQ+React的混合流组件模式，低成本学习成本
    </div>
  </div>,

  <div className="row">
    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
      <img src="/images/test/houses.jpg" title="Happy trees" />
    </div>
    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 descript">
      <h2>node端</h2>
      灵活、低配置，无限层级RESTFUL路由，匹配前端目录结构
    </div>
  </div>
],

// [
//   <img src="/images/test/t_tree_root.jpg" title="Funky roots" />,
//   <img src="/images/test/hill_fence.jpg" title="The long and winding road" />,
//   <img src="/images/test/t_houses.jpg" title="Happy trees" />
// ],

{
  container: 'slider',
})

setTimeout( () => {
  // ajax.get('163')
  // .then( (data) => {
  //   libs.msgtips('get baidu首页数据over')
  // })
  libs.msgtips('get data')
},500)

setTimeout( () => {
  ajax.post('/hello')
  .then( (data) => {
    console.log(data);
  })
  libs.msgtips('get post data')
},1000)
