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


import uploader from 'component/modules/uploader'
const upld = uploader.thumb({
  success: function(file, ret){
    console.log(ret);
  }
})
upld.render('test')
