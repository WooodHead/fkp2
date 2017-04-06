import {inject} from 'libs'
import BaseX from 'component/class/basex'
// import wrapItem from 'component/mixins/combinex'

var ratio = window.devicePixelRatio || 1,
  // 缩略图大小
  thumbnailWidth = 100 * ratio,
  thumbnailHeight = 100 * ratio

class thumbUp extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],  // item => {id: file.id, name: file.name, src: imgurl, progress: 0, stat: 'success/faild'}
      preview: this.props.preview
    }
  }
  render(){
    const imglist = this.state.data.map( (item, ii) => {
      const progress = <span className='up-progress' style={{width: item.progress+'%'}}></span>
      return (
        <li key={"preview"+ii}>
          <img src={item.src}/>
          <div className="up-info">{item.name}</div>
          {progress}
        </li>
      )
    })

    const title = this.props.title || '上传文件'
    return this.state.preview
    ? ( <div className='uploader-wrap'>
        <div className='uploader-list'>
          { imglist.length ? <ul> {imglist} </ul> : '' }
        </div>
        <div ref={'upBtn'} className='uploader-button'>{title}</div>
      </div> )
    : <div ref={'upBtn'} className='uploader-button'>{title}</div>
  }
}

const Actions = {
  APPEND: function(state, options){
    this.curState.data.push(options)
    return this.curState
  },

  PROGRESS: function(state, options){
    const data = this.curState.data
    const targetIndex = _.findIndex(data, function(o) { return o.id == options.id });
    if (targetIndex > -1) {
      let target = data[targetIndex]
      target['progress'] = options.progress
      this.curState.data[targetIndex] = target
    }
    return this.curState
  },

  STAT: function(state, options){
    const data = this.curState.data
    const targetIndex = _.findIndex(data, function(o) { return o.id == options.id });
    if (targetIndex > -1) {
      let target = data[targetIndex]
      target['stat'] = options.stat
      this.curState.data[targetIndex] = target
    }
    return this.curState
  }
}


function idfMethod(context){
  const app = context
  return function(dom, intent){
    const self = this
    app.on('DefaultMethod', function(data){
      const uploader = context.uploader
      const btn = self.refs['upBtn']
      uploader.addButton({
        id:  btn,
        multiple: app.config.multiple
      })
    })
  }
}

// let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    this.uploader
    this.combinex(thumbUp, Actions)
    if (this.config.props) {
      this.config.props['itemDefaultMethod'] = idfMethod(this)
    } else {
      this.config.props = {
        preview: this.config.preview,
        title: this.config.title,
        itemDefaultMethod: idfMethod(this)
      }
    }
    setTimeout( ()=>{
      this.injectStatic()
    },500)
  }

  injectStatic(){
    const that = this
    inject().js('/js/t/webuploader.js', ()=>{
      this.uploader = WebUploader.create(this.config.uploaderConfig)
      const uploader = this.uploader
      uploader.on('beforeFileQueued', function( file ){ })
      uploader.on('fileQueued', function( file ) {
        uploader.makeThumb( file, function( error, src ) {
          // that.append(file, src)
          that.dispatch('APPEND', {id: file.id, name: file.name, src: src, progress: 0})
        }, thumbnailWidth, thumbnailHeight );
      })

      uploader.on('startUpload', function(){})
      uploader.on('fileDequeued', function(file){})
      uploader.on('uploadFinished', function(){})  // 当所有文件上传结束时触发
      uploader.on('uploadComplete', function(file){})  // 不管成功或者失败，文件上传完成时触发

      uploader.on( 'uploadProgress', function( file, percentage ) {
        // that.progress(file, percentage)
        that.dispatch('PROGRESS', {id: file.id, name: file.name, progress: percentage})
      });

      uploader.on( 'uploadSuccess', function( file, ret ) {
        // that.stat(file, 'success')
        that.dispatch('STAT', {id: file.id, name: file.name, stat: 'success'})
        if (typeof that.config.success == 'function') {
          that.config.success(file, ret)
        }
      });

      uploader.on( 'uploadError', function( file, reason ) {
        // that.stat(file, 'faild')
        that.dispatch('STAT', {id: file.id, name: file.name, stat: 'faild'})
        if (typeof that.config.faild == 'function') {
          that.config.faild(file, reason)
        }
      });
      that.roll('DefaultMethod', {})
    })
  }

  addButton(id, title, opts={}){
    const uploader = this.uploader
    uploader.addButton({
      id:  id,
      innerHTML: title,
      ...opts
    })
  }

  upload(){
    const uploader = this.uploader
    uploader.upload()
  }

  // stat(file, ret){
  //   if (ret == 'success') this.dispatch('STAT', {id: file.id, name: file.name, stat: 'success'})
  //   this.dispatch('STAT', {id: file.id, name: file.name, stat: 'faild'})
  // }
  //
  // append(file, imgurl){
  //   this.dispatch('APPEND', {id: file.id, name: file.name, src: imgurl, progress: 0})
  // }
  //
  // progress(file, percentage){
  //   this.dispatch('PROGRESS', {id: file.id, name: file.name, progress: percentage})
  // }

}


export default function(opts){
  let dft = {
    success: function(){},
    faild: function(){},
    preview: true,
    title: '上传文件',
    props: false,
    multiple: false,
    uploaderConfig: {
      dnd: undefined,
      chunked: false,
      fileNumLimit: undefined,
      fileSizeLimit: undefined,
      fileSingleSizeLimit: undefined,
      duplicate: undefined,
      // thumb: {
      //   width: 110,
      //   height: 110,
      //
      //   // 图片质量，只有type为`image/jpeg`的时候才有效。
      //   quality: 70,
      //
      //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
      //   allowMagnify: true,
      //
      //   // 是否允许裁剪。
      //   crop: true,
      //
      //   // 为空的话则保留原有图片格式。
      //   // 否则强制转换成指定的类型。
      //   type: 'image/jpeg'
      // },
      // compress: {
      //   width: 1600,
      //   height: 1600,
      //
      //   // 图片质量，只有type为`image/jpeg`的时候才有效。
      //   quality: 90,
      //
      //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
      //   allowMagnify: false,
      //
      //   // 是否允许裁剪。
      //   crop: false,
      //
      //   // 是否保留头部meta信息。
      //   preserveHeaders: true,
      //
      //   // 如果发现压缩后文件大小比原来还大，则使用原来图片
      //   // 此属性可能会影响图片自动纠正功能
      //   noCompressIfLarger: false,
      //
      //   // 单位字节，如果图片大小小于此值，不会采用压缩。
      //   compressSize: 0
      // }
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
        // mimeTypes: 'image/*'
        mimeTypes: 'image/jpg, image/jpeg, image/png, image/gif'
      }
    }
  }
  if (typeof opts == 'object') {
    dft = _.extend({}, dft, opts)
  }

  return new App(dft)
}
