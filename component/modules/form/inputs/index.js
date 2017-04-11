import {inject} from 'libs'
const Input = require('../_part/input')
import BaseClass from 'component/class/base'

const $text_type = ['text', 'password', 'select', 'tel', 'date', 'span']
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
  if (typeof data == 'string') return
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
  // dft.attr = profile
  dft.profile = profile

  // 第二次设置attr，不能包含union，union不能在input里面设定
  function resetAttr(item, isary){
    let _props = item.props||item
    let attr = {}
    O.keys(dftAttr).forEach( attribut => {
      if (attribut == 'itemClass') {
        attr[attribut] = _props[attribut]
        ? 'inputItem '+ _props[attribut]
        : 'inputItem'
      } else {
        attr[attribut] = isary
        ? _props[attribut] || ''
        : _props[attribut] || ''
        // : _props[attribut] || profile[attribut]
      }
      // delete _props[attribut]
    })
    return {..._props, attr}
  }

  let assets = []
  const inputs = data.input
  A.isArray(inputs)
  ? assets = inputs.map( item => _.merge({}, dft, resetAttr(item, true)) )
  : assets.push( _.merge({}, dft, resetAttr(inputs)) )
  // map id to state.allocation
  let allocation = {}
  assets.forEach( item => {
    const _name = getTypeName(item)
    if (_name) allocation[_name] = item
  })

  return allocation
}


function defMenthod(ctx){
  return function(dom, intent){
    const dft = ctx.config
    ctx.ipt = dom
    let elements = this.refs
    ctx.elements = function(id, lable){
      if (id == 'all') return elements
      if (id.charAt(0) == '#' || id.charAt(0) == '+') return elements[id]
      return lable ? elements[id] : elements['#'+id]
    }
    ctx.getElements = function(id){
      if (!id) return elements
      return elements[id]
    }
    require('../_part/select')(ctx, intent)  // 引入select
    if (typeof dft.callback == 'function') dft.callback.call(dom, ctx)
  }
}


class FormInput extends BaseClass{
  constructor(config){
    super(config)
    this.form = {}
    this.elements
    this.timmer
    this.allocation = this::createAllocation(config.data)

    this.values = this::this.values
    this.append = this::this.append
    this.warning = this::this.warning
    this.addWarn = this::this.addWarn
    this.removeWarn = this::this.removeWarn
  }

  append(data){
    this.actions.roll('APPEND', data)
  }

  componentWill(){
    inject().css('/css/t/boostrap_datepick.css')
    .js('/js/t/boostrap_datepick.js', ()=>{
      _.delay(()=>{
        this.actions.roll('datapicker')
      }, 500)
    })

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

  // 获取所有元素的即时值  asm（assignment-->判断是否是赋值过程）
  values(data,asm){
    if (!data) return this.form
    if (typeof data == 'string') return this.form[data]
    if (typeof data == 'object') {
      clearTimeout(this.timmer)
      this.timmer = setTimeout(()=>{
        let allocation = this.allocation
        , elements = this.elements
        , form = this.form
        Object.keys(data).forEach( item => {
          if(asm == undefined){
            this.form[item] = data[item]
            elements(item).value = data[item]
            allocation[item].value = data[item]
          }else{
            if(allocation[item].type == 'text'){
              this.form[item] = data[item]
              elements(item).value = data[item]
              allocation[item].value = data[item]
            }
          }
        })
      }, 500)
    }
  }

  addWarn(id, message){
    const theInput = this.elements(id)
    if (theInput) {
      const lable = this.elements(id, 'lable')
      if (message) {
        $(theInput).addClass('itemError')
        if (React.isValidElement(message)) {
          const errDom = $(lable).find('.fkp-input-error')[0]
          React.render(message, errDom)
        } else {
          $(lable).find('.fkp-input-error').addClass('warning').html(message)
        }
      } else {
        $(theInput).addClass('itemError')
      }
    }
  }

  removeWarn(id, message){
    const theInput = this.elements(id)
    if (theInput) {
      const lable = this.elements(id, 'lable')
      if (message) {
        $(theInput).removeClass('itemError')
        if (React.isValidElement(message)) {
          const errDom = $(lable).find('.fkp-input-error')
          React.render(message, errDom)
        } else {
          $(lable).find('.fkp-input-error').removeClass('warning').addClass('success').html(message)
        }
      } else {
        $(theInput).addClass('itemError')
        $(lable).find('.fkp-input-error').empty()
      }
    }
  }

  warning(id, clear){
    this.addWarn(id, clear)
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
