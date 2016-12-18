/**
 * 列表
 */
let libs = require('libs')
let list = require('./_component/loadlist')  //设定列表域为 lagou
let objtypeof = libs.objtypeof

class List {
  constructor(config){
    this.config = config
    this.client = typeof window == 'undefined' ? false : true
    this.componentWill = this::this.componentWill
    this.componentStatic = this::this.componentStatic
    this.render = this::this.render

    this.componentStatic()
    this.componentWill()
  }

  componentStatic(){
    if (this.client) {
      libs.inject().css(['/css/m/'+this.config.theme])  //注入like_lagou的样式
    }
  }

  componentWill(){
    const dft = this.config
    let Blist = list(dft.globalName)
    this.eles = (
      <Blist
        data={dft.data}
        itemClass={dft.itemClass}
        listClass={dft.listClass}
        listMethod={dft.listMethod}
        itemMethod={dft.itemMethod}
        >
      </Blist>
    )
  }

  render(id){
    let container = id || this.config.container || ''
    if (!container) return this.eles

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      React.render( this.eles, container )
    }
  }
}

export function BaseList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: '',    //list-lagou.css
    globalName: '',
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: ''
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return new List(dft)
}

export function pure(props){
  delete props.container
  delete props.globalName
  return BaseList(props)
}
