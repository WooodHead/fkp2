import {inject} from 'libs'
import list from 'component/modules/list/_component/loadlist'


function delay(cb, timer){
  if (typeof cb == 'function') {
    _.delay(cb, (timer||17))
  }
}

function rendered(cb){
  delay(cb, 1000)
}

export default class {
  constructor(config){
    const dft = {
      autoinject: true
    }
    this.config = _.merge(dft, config)
    this.data = this.config.data
    this.eles
    this.stat = 'start'
    this.actions = this.config.globalName ? SAX(this.config.globalName):{roll: ()=>{}}
    this.rendered = this.config.rendered
    this.client = (() => typeof window !== 'undefined')()

    this.componentWill = this::this.componentWill
    this.inject = this::this.inject
    this.componentDid = this::this.componentDid
    this._componentDid = this::this._componentDid
    this.createList = this::this.createList
    this.sequentialRun = this::this.sequentialRun
    this.render = this::this.render
  }

  createList(gname){
    return list(gname)
  }

  inject(src){
    if (this.client) {
      const ij = inject()
      if (this.config.theme && this.config.autoinject) {
        ij.css(['/css/m/'+this.config.theme])  //注入样式
      }
      if (typeof src == 'function') {
        src(ij)
      }
      return ij
    }
  }

  componentWill(){}

  componentDid(){ }

  _componentDid(){
    delay(()=>{
      this.stat = 'finish'
      delay(()=>{
        this.componentDid()
        if (typeof this.rendered == 'function') {
          // this.rendered()
          rendered(this.rendered)
        }
      }, 17)

    }, 17)
  }

  sequentialRun(){
    if (this.stat != 'finish') {
      this.inject()
      this.componentWill()
      this.stat = 'firstrun'
    }
    this._componentDid()
  }

  render(id){
    if (typeof id == 'function') {
      this.rendered = id
      id = undefined
    }
    let container = id || this.config.container
    this.sequentialRun()

    if (!container) {
      this.stat = 'done'
      return this.eles
    }

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      React.render( this.eles, container )
    }
    this.stat = 'done'

    return this
  }
}
