let Input = require('../_part/input')
import BaseClass from 'component/class/base'

const $text_type = ['text', 'password', 'select', 'tel']
    , $phold_type = ['text', 'password']
    , $radio_check = ['radio','checkbox']
    , $button_type = ['button','submit']
    , A = Array
    , O = Object

// 生成dom映射数据 {domID: dom's allocation}
// {username: {id, type, value, attr:{title, desc, required}}, union:{id, callback, target} }
function createAllocation(data){
  let allocation = {}
  data.forEach( (item, ii) => {
    // allocation = this::createStore(allocation, getItemAllocation(item, ii))
    allocation = _.merge(allocation, getItemAllocation(item, ii) )
  })
  return allocation
}

function getTypeName(item){
  if ($radio_check.indexOf(item.type)>-1) {
    return typeof item.name == 'string'
    ? item.name
    : A.isArray(item.name)
      ? item.name[0]
      : ''
  } else {
    return item.id||item.name
  }
}

// 生成配置文件，并挂在到state上
function getItemAllocation(data, index){
  const dft = {
    _index: index,
    id: '',
    name: '',
    type: 'text',
    value: '',
    placeholder: ''
  }

  const dftAttr = {
    title: '',
    desc: '',
    itemClass: 'inputItem',
    required: '',
    // union: {}
  }

  let profile = {}
  O.keys(data).forEach( item => {
    if (item != 'input') profile[item] = data[item]
    if (item == 'itemClass') {
      profile[item] = data[item] ? 'inputItem ' + data[item] : 'inputItem'
    }
  })

  // 第一次设置attr，可能包含了union
  dft.attr = profile

  // 第二次设置attr，不能包含union，union不能在input里面设定
  function resetAttr(item){
    let _props = item.props||item
    O.keys(dftAttr).forEach( attribut => {
      if (attribut == 'itemClass' && _props[attribut]) {
        dft.attr[attribut] = _props[attribut]
        ? 'inputItem '+ _props[attribut]
        : 'inputItem'
      } else {
        dft.attr[attribut] = _props[attribut] || dft.attr[attribut] || ''
      }
      delete _props[attribut]
    })
    return _props
  }

  let assets = []
  const inputs = data.input
  A.isArray(inputs)
  ? assets = inputs.map( item => _.extend( dft, resetAttr(item)) )
  : assets.push( _.extend(dft, resetAttr(inputs)) )

  // map id to state.allocation
  let allocation = {}
  assets.forEach( item => {
    const _name = getTypeName(item)
    if (_name) allocation[getTypeName(item)] = item
  })

  return allocation
}


function defMenthod(ctx){
  const dft = ctx.config
  let allocation = ctx.allocation
  return function(dom, intent){
    ctx.ipt = dom
    ctx.elements = this.refs
    require('../_part/select')(ctx, intent)  // 引入select
    if (typeof dft.callback == 'function') dft.callback.call(dom, ctx)
  }
}


class FormInput extends BaseClass{
  constructor(config){
    super(config)
    this.form = {}
    this.elements = {}
    this.allocation = this::createAllocation(config.data)

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
    this.eles = (
      <Inputs
        allocation={this.allocation}
        getItemAllocation={getItemAllocation}
        globalName={dft.globalName}
        listClass={dft.listClass}
        data={dft.data}
        itemMethod={dft.itemMethod}
        itemDefaultMethod={defMenthod(this)}/>
    )
  }

  // 获取所有元素的即时值
  values(data){
    if (!data) return this.form
    if (typeof data == 'string') this.form[id]
    let allocation = this.allocation
        , elements = this.elements
        , form = this.form

    Object.keys(data).forEach( item => {
      this.form[item] = data[item]
      elements['#'+item].value = data[item]
      allocation[item].value = data[item]
    })
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
