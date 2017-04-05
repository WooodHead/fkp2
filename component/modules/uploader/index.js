import {inject} from 'libs'
import BaseX from 'component/class/basex'
// import wrapItem from 'component/mixins/combinex'


class thumbUp extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: []
    }
  }
  render(){
    const imglist = this.state.data.map( (url, ii) => <li><img key={"preview"+ii} src={url}/></li> )

    return (
      <div className='uploader-wrap'>
        <div className='uploader-list'>
          <ul>
            {imglist}
          </ul>
        </div>
        <div className='uploader-button'>上传文件</div>
      </div>
    )
  }
}

const Actions = {
  APPEND: function(state, options){
    const this.curState.data = this.curState.data.push(options.url)
    return this.curState
  }
}

// let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    this.uploader
    this.combinex(thumbUp, Actions)
    inject().js('/js/t/webuploader.js', ()=>{
      this.uploader = webUploader.create(this.config.uploaderConfig)
    })
  }
}

// function button(name, title, cb){
//   preUpload(function(){
//     return render_uploader(name, title, cb, 'button')
//   })
// }
//
// function thumb(name, title, cb){
//   preUpload(function(){
//     return render_uploader(name, title, cb, 'thumb')
//   })
// }
//
// function custom(name, cb){
//   preUpload(function(){
//     return new uploadAction2(name, false, cb, 'button')
//   })
// }

// class upldClass {
//   constructor(config) {
//     this.config = config
//     this.injected = false
//     this.uploader
//     this.injectStatic()
//   }
//
//   injectStatic(){
//     inject().js('/js/t/webuploader.js', ()=>{
//       this.injected = true
//       this.uploader = webUploader.create(this.config.uploaderConfig)
//     })
//   }
//
//   thumb(){
//     const that = this
//     const thumbElement = wrapItem(
//       <div className='uploader-wrap'>
//         <div className='uploader-list'></div>
//         <div className='uploader-button'>上传文件</div>
//       </div>
//       , function(dom){
//         const uploader = this.uploader
//         if (uploader) {
//           const $list = $(dom).find('.uploader-list')
//
//           uploader.on('beforeFileQueued', function( file ){ })
//           uploader.on( 'fileQueued', function( file ) {
//             var $li = $(
//                 '<div id="' + file.id + '" class="file-item thumbnail">' +
//                     '<img>' +
//                     '<div class="info">' + file.name + '</div>' +
//                 '</div>'
//               ),
//               $img = $li.find('img');
//               $list.append( $li );
//
//               // 创建缩略图
//               uploader.makeThumb( file, function( error, src ) {
//                 if ( error ) {
//                   $img.replaceWith('<span>不能预览</span>');
//                   return;
//                 }
//                 $img.attr( 'src', src );
//               }, thumbnailWidth, thumbnailHeight );
//           });
//           uploader.on( 'uploadProgress', function( file, percentage ) { });
//           uploader.on( 'uploadSuccess', function( file, ret ) { });
//           uploader.on( 'uploadError', function( file, reason ) { });
//           uploader.on( 'uploadComplete', function( file ) { });
//         }
//       }
//     )
//   }
//
// }

function upld(opts){
  const dft = {
    uploaderConfig: {
      // 自动上传。
      auto: true,

      // swf文件路径
      swf: '/images/Uploader.swf',

      // 文件接收服务端。
      server: '/upup',

      // 只允许选择文件，可选。
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,png',
        mimeTypes: 'image/*'
      }
    }
  }
  if (typeof opts == 'object') {
    dft = _.extend({}, dft, opts)
  }

  return new App(dft)
}

module.exports = {
  button: button,
  thumb: thumb,
  custom: custom
};
