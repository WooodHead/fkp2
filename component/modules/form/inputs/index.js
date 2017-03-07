let Input = require('../_part/input')
import BaseClass from 'component/class/base'

function defMenthod(ctx){
  const dft = ctx.config
  return function(dom, intent){
    ctx.ipt = dom
    Object.keys(this.refs).map((item)=>{
      ctx.elements[item] = React.findDOMNode(this.refs[item])
    })
    require('../_part/select')(ctx, intent)  // 引入select
    if (typeof dft.callback == 'function') dft.callback.call(dom, ctx)
  }
}

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
    let Inputs = Input(dft.globalName)
    this.eles = <Inputs listClass={dft.listClass} data={dft.data} itemMethod={dft.itemMethod} itemDefaultMethod={defMenthod(this)}/>
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

export default function formInput(opts, callback){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    listClass: '',
    rendered: '',
    globalName: _.uniqueId('Input_'),
    theme: 'form',
    itemMethod: noop,
    callback: callback
  }
  dft = _.extend(dft, opts)
  if (typeof callback == 'function') {
    dft.callback = callback
  }
  return new FormInput(dft)
}

export function pure(props, cb){
  return formInput(props, cb)
}
