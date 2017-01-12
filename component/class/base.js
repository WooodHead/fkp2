import {inject} from 'libs'
import list from 'component/modules/list/_component/loadlist'


function delay(cb, timer){
  if (typeof cb == 'function') {
    setTimeout(cb, (timer||17))
  }
}

export default class {
  constructor(config){
    this.config = config
    this.data = this.config.data
    this.eles
    this.stat
    this.actions = this.config.globalName ? SAX(this.config.globalName):{roll: ()=>{}}
    this.rendered
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
      if (this.config.theme) {
        ij.css(['/css/m/'+src])  //注入样式
      }
    }
  }

  componentWill(){}

  componentDid(){ }

  _componentDid(){
    delay(()=>{
      typeof this.rendered == 'function' ? this.rendered() : ''
      delay(this.componentDid, 17)
      delay(()=>{this.stat = 'finish'}, 17)
    }, 17)

    // _.delay(()=>{
    //   typeof this.rendered == 'function' ? this.rendered() : ''
    //   _.delay(this.componentDid, 17)
    //   _.delay(()=>{this.stat = 'finish'}, 17)
    // }, 17)
  }

  sequentialRun(){
    if (this.stat != 'finish') {
      this.inject(this.config.theme)
      this.componentWill()
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
    this.stat = 'done'

    if (!container) {
      return this.eles
    }

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      React.render( this.eles, container )
    }

    return this
  }
}
