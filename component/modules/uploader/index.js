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
      data: []  // item => {id: file.id, name: file.name, src: imgurl, progress: 0, stat: 'success/faild'}
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
    return (
      <div className='uploader-wrap'>
        <div className='uploader-list'>
          { imglist.length ? <ul> {imglist} </ul> : '' }
        </div>
        <div ref={'upBtn'} className='uploader-button'>上传文件</div>
      </div>
    )
  }
}

const Actions = {
  APPEND: function(state, options){
    // this.curState.data = this.curState.data.push(options)
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
    app.on('DefaultMethod', function(){
      const uploader = context.uploader
      const btn = self.refs['upBtn']
      uploader.addButton({
        id:  btn
        // innerHTML: '选择文件'
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
        itemDefaultMethod: idfMethod(this)
      }
    }
    this.injectStatic()
  }

  injectStatic(){
    const that = this
    inject().js('/js/t/webuploader.js', ()=>{
      this.uploader = WebUploader.create(this.config.uploaderConfig)
      const uploader = this.uploader
      uploader.on('beforeFileQueued', function( file ){ })
      uploader.on('fileQueued', function( file ) {
        uploader.makeThumb( file, function( error, src ) {
          that.append(file, src)
        }, thumbnailWidth, thumbnailHeight );
      })

      uploader.on( 'uploadProgress', function( file, percentage ) {
        that.progress(file, percentage)
      });

      uploader.on( 'uploadSuccess', function( file, ret ) {
        that.stat(file, 'success')
        if (typeof that.config.success == 'function') {
          that.config.success(file, ret)
        }
      });

      uploader.on( 'uploadError', function( file, reason ) {
        that.stat(file, 'faild')
        if (typeof that.config.faild == 'function') {
          that.config.faild(file, reason)
        }
      });
      that.roll('DefaultMethod', {})
    })
  }

  stat(file, ret){
    if (ret == 'success') this.dispatch('STAT', {id: file.id, name: file.name, stat: 'success'})
    this.dispatch('STAT', {id: file.id, name: file.name, stat: 'faild'})
  }

  append(file, imgurl){
    this.dispatch('APPEND', {id: file.id, name: file.name, src: imgurl, progress: 0})
  }

  progress(file, percentage){
    this.dispatch('PROGRESS', {id: file.id, name: file.name, progress: percentage})
  }

}


function upld(opts){
  let dft = {
    props: false,
    success: function(){},
    faild: function(){},
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

module.exports = {
  // button: button,
  // custom: custom
  thumb: upld
};
