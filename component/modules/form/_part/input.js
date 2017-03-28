import itemHlc from 'component/mixins/itemhlc'
import store from 'component/mixins/storehlc'
import tree from 'component/util/tree'
import {list} from 'component'
import {smd} from 'libs'

const A = Array, O = Object
const rcbox = require('./radio')
let saxer, context

const $text_type = ['text', 'password', 'select', 'tel', 'date', 'span']
  , $phold_type = ['text', 'password']
  , $radio_check = ['radio','checkbox']
  , $button_type = ['button','submit']

const inputAttributs ={
  placeholder: '',
  name: '',
  id: '',
  disabled: '',
  value: '',
  type: 'text'
}

function mkAttributs(p){
  let attrs = {}
  for (var attr in inputAttributs) {
    if (attr == 'value') {
      attrs['defaultValue'] = p[attr]
    } else {
      attrs[attr] = p[attr]
    }
  }
  return attrs
}

/*
 * 生成select的表单
 * item 配置
*/

function __select(P, options){
  const attrs = mkAttributs(P)
  return (
    <span className="iconfont fkp-dd">
      <input ref={'#'+P.id} type='text' className="form_control fkp-dd-input" {...attrs} />
      <div ref={'+'+P.id} className='fkp-dd-list'>
        {options ? options : ''}
      </div>
    </span>
  )
}

function mk_select(P){
  let options;

  if (P.options) {
    const _data = tree(P.options),
    options = list({
      data: _data,
      itemClass: 'fkp-dd-option',
    })
    return __select(P, options)
  }
  return __select(P)
}

function mk_datepicker(P){
  let attrs = mkAttributs(P)
  attrs.type = 'text'
  return (
    <span className="iconfont form-datepicker">
      <input ref={'#'+P.id} type='text' className="form_control" {...attrs} />
    </span>
  )
}

function mk_span(P){
  const attrs = mkAttributs(P)
  return (
    <span className="iconfont form-span">
      {P.value}
    </span>
  )
}

// 'text', 'password', 'select', 'tel'
function whatTypeElement(P){
  const attrs = mkAttributs(P)
  if (_.indexOf($text_type, P.type)>-1){
    if (P.type === 'select') return mk_select(P)
    if (P.type == 'date') return mk_datepicker(P)
    if (P.type == 'span') return mk_span(P)
    if (_.indexOf($phold_type, P.type)>-1){
      return (
        <input
          ref={'#'+(P.id||P.name)}
          className='form_control'
          {...attrs}
        />
      )
    }

    return (
      <input
        ref={'#'+(P.id||P.name)}
        className='form_control'
        {...attrs}
      />
    )
  }

  if (_.indexOf($button_type, P.type)>-1){
    return (
      <input
        ref={'#'+(P.id||P.name)}
        className='btn'
        {...attrs}
      />
    )
  }
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

function mk_elements(item, ii){
  const inputs = item.input
  context = this
  if (Array.isArray(inputs)) {
    const elements = inputs.map( (ele, jj) => {
      const _name = getTypeName(ele)
      if (_name ) return mk_element(_name, {key: _.uniqueId('grpinput_'), index: ii})
    })

    return (
      <div key={'multi_'+ii} className="inputMultiply">
        {elements}
      </div>
    )
  }

  const _name = getTypeName(inputs)
  if (_name ) return mk_element(item, ii)
}

/*
 * mk_element
 * 分析配置文件，并输出结构
 *
 */
let tmp_P = {}
function mk_element(item, _i){
  const allocation = saxer.data.allocation
  let _title,
      _desc,
      _class,
      _union,
      lableObj,
      P,
      index = _i,
      key

  if (typeof _i == 'object') {
    index = _i.index
    _i = _i.key
  }
  P = typeof item == 'string'
  ? allocation[item]
  : this.props.getItemAllocation(item, index)[getTypeName(item.input)]
  // : allocation[getTypeName(item.input)]

  _title = P.profile.title || P.attr.title || ''
  _desc = P.profile.desc || P.attr.desc || ''
  _class = P.attr.itemClass
  _union = P.profile.union||P.attr.union
  if (_union && !tmp_P[P.id]) {
    tmp_P[P.id] = 'true'
    _union.target = {
      id: P.id,
      name: P.name,
      type: P.type
    }
    saxer.data.intent.push(_union)
  }

  // radio
  return $radio_check.indexOf(P.type) > -1
  ? ( ()=>{
    const resault = rcbox(P)
    return (
      <div ref={resault.superID} className={resault.groupClass}>
        {resault.title ? <span className="fkp-title">{resault.title}</span> : ''}
        {resault.fill}
        {resault.desc ? <span className="fkp-desc">{resault.desc}</span> : ''}
      </div>
    )
  })()

  : <lable ref={(P.id||P.name)} key={"lable"+_i} className={_class + ' for-' + (P.id||P.name||'')}>
      {_title ? <span className="fkp-title">{_title}</span> : ''}
      {this::whatTypeElement(P)}
      {P.required ? <span className="fkp-input-required" /> : ''}
      {<span className="fkp-input-error" />}
      {_desc ? <span className="fkp-desc">{_desc}</span> : ''}
    </lable>
}



class Input extends React.Component {
  constructor(props){
    super(props)
    this.intent = []

    const data = this.props.data||[]
    this.state = {
      data: data
    }

    saxer = SAX(this.props.globalName)
    saxer.append({
      intent: [],
      allocation: this.props.allocation
    })

    this._preRender = this::this._preRender
    mk_elements = this::mk_elements
    mk_element = this::mk_element
  }

  _preRender(){
    return this.state.data.map( (item, i) => {
      if( typeof item == 'string') return <div key={'split'+i} className="split" dangerouslySetInnerHTML={{__html: smd(item)}}></div>
      return mk_elements(item, i)
    })
  }

  render(){
    let fill = this._preRender()
    let _cls = 'inputGroup'
    if (this.props.listClass) _cls = 'inputGroup '+this.props.listClass
    return (
      <div className={_cls}>
        {this.state.fill||fill}
      </div>
    )
  }
}

function storeIt(key){
	if (typeof key == 'string') { storeAction(key) }
	return store(key, itemHlc(Input))
}

function storeAction(key){
  SAX.set(key, {}, {
    APPEND: function(data){
      let sdata = Array.from(this.state.data)
      sdata = sdata.concat(data)
      this.setState({ data: sdata })
    },

    UPDATESELECT: function(record){
      if (!record) return
      const {index, options} = record
      let sdata = Array.from(this.state.data)
      sdata[index].input['options'] = options
      this.setState({ data: sdata })
    },
  })
}

module.exports = storeIt;
