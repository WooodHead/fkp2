// var libs = require('libs')
//
// //支持uploader.button
// //支持uploader.thumb
// //支持uploader.custom
// import {uploader} from 'component/client'
//
// // 支持inject.css
// // 支持inject.js
// var inject = libs.inject()
//
//
//
// //注入上传的button按钮样式
// inject.css('/css/t/upload/button.css', render_upload_button)
//
//
// function render_upload_button(){
//   // uploader.custom(
//   //   function(){
//   //     var me = this;
//   //     $('#bbcc').click(function(){
//   //       me.trigger('upfile')
//   //     })
//   //   },
//   //   //上传成功后的回调
//   //   function(){
//   //     console.log('======== 完成')
//   //     // libs.msgtips('不错啊')
//   //   }
//   // )
//
//   // Uploader.button('upload', function(){
//   //   libs.msgtips('上传成功')
//   // })
//   //
//   uploader.thumb('test', '带缩略图', function(){
//     console.log('上传成功');
//     // libs.msgtips('上传成功')
//   })
// }

import {inject} from 'libs'
import { htabs as Tabs } from 'component/client'
import uploader from 'component/modules/uploader'


inject().css(`
  #test{
    width: 400px;
    height: 600px;
  }
`)

const upld = uploader({
  success: function(file, ret){
    console.log('========== 11111111');
    console.log(ret);
  }
})

const upld1 = uploader({
  success: function(file, ret){
    console.log('========== 2222222');
    console.log(ret);
  }
})

const abc = (
  <div className="xcontainer">
    <div className="up1">
      123
      {upld.render()}
    </div>
    <div className="up2">
      456
      {upld1.render()}
    </div>
  </div>
)

const configTabs = [
  {title: '账号登录', content: 'partForm'},
  {title: '微信/QQ登录', content: abc},
]

const tabsxx = Tabs({
  data: configTabs,
  theme: 'tabs/contentpop',
  itemMethod: function(dom, index){
    $(dom).click( e => {
      e.stopPropagation()
      this.select(index)
    })
  }
})

tabsxx.render('test')
