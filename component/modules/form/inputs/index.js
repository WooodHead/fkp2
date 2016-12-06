import { inject } from 'libs'
let Input = require('../_part/input')
let render = React.render;


let _fun = function(data, config, cb){
  this.data = data
  this.config = config
  this.value = {}
  this.form = {}
  this.eles
  this.elements = {}
  let self = this
  let ele = config.container
  // ItemMixin的回调方法
  // @intent，props.intent | this.intent
  function dm(dom, intent){
    self.ipt = dom
    Object.keys(this.refs).map((item)=>{
      self.elements[item] = React.findDOMNode(this.refs[item])
    })
    require('../_part/select')(self, intent)  // 引入select
    if (typeof cb == 'function') cb.call(dom, self)
  }

  let Inputs = Input(ele)
  this.eles = <Inputs data={data} itemMethod={config.itemMethod} itemDefaultMethod={dm}/>
}

_fun.prototype = {
  // 获取所有元素的即时值
  values: function(id){
    if (id && this.form[id]) return this.form[id]
    return this.form
  },

  warning: function(id, clear){
    if (this.elements[id]) {
      if (clear) {
        this.elements[id].className = this.elements[id].className.replace(' itemError', '')
      } else {
        this.elements[id].className += ' itemError'
      }
    }
  },

  render: function(){
    if (!this.config.container) return this.eles
    let id = this.config.container
    let container = typeof id == 'string'
    ? document.getElementById(id)
    : id.nodeType ? id : ''
    if (container) {
      render( this.eles, container )
    }
  }
}

function formInputs(data, opts, callback){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: 'form',
    itemMethod: noop
  }
  if (typeof opts == 'function') {
    callback = opts
    opts = undefined
  }
  if (_.isPlainObject(opts)) dft = _.extend(dft, opts)
  if (data) dft.data = data
  inject().css('/css/m/'+dft.theme+'.css')
  return new _fun(dft.data, dft, callback)
}

formInputs.pure = function(opts){
  let InputServer = Input()
  return <InputServer {...opts} />
}

module.exports = formInputs
