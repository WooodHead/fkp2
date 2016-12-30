let Input = require('../_part/input')
import BaseClass from 'component/class/base'

class FormInput extends BaseClass{
  constructor(config){
    super(config)
    this.value = {}
    this.form = {}
    this.elements = {}

    this.values = this::this.values
    this.append = this::this.append
    this.warning = this::this.warning
  }

  append(data){
    this.actions.roll('APPEND', data)
  }

  componentWill(){
    const dft = this.config
    const self = this

    function defaultMethod(dom, intent){
      self.ipt = dom
      Object.keys(this.refs).map((item)=>{
        self.elements[item] = React.findDOMNode(this.refs[item])
      })
      require('../_part/select')(self, intent)  // 引入select
      if (typeof dft.callback == 'function') dft.callback.call(dom, self)
    }

    let Inputs = Input(dft.globalName)
    this.eles = <Inputs data={dft.data} itemMethod={dft.itemMethod} itemDefaultMethod={defaultMethod}/>
  }

  // 获取所有元素的即时值
  values(id){
    if (id && this.form[id]) return this.form[id]
    return this.form
  }

  warning(id, clear){
    if (this.elements[id]) {
      if (clear) {
        this.elements[id].className = this.elements[id].className.replace(' itemError', '')
      } else {
        this.elements[id].className += ' itemError'
      }
    }
  }
}

export default function formInput(data, opts, callback){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    globalName: _.uniqueId('Input_'),
    theme: 'form',
    itemMethod: noop,
    callback: callback
  }
  if (typeof opts == 'function') {
    dft.callback = opts
    opts = undefined
  }
  dft = _.extend(dft, opts)
  if (data) dft.data = data
  return new FormInput(dft)
}

export function pure(props){
  let app = formInput(props.data, props)
  if (app.client) return app
  return app.render()
}
