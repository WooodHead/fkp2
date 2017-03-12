import itemHlc from 'component/mixins/itemhlc'
import store from 'component/mixins/storehlc'
import tree from 'component/util/tree'
import {list} from 'component'
import {smd} from 'libs'

const A = Array, O = Object
const Radio = require('./radio')
let saxer, context

const $text_type = ['text', 'password', 'select', 'tel']
  , $phold_type = ['text', 'password']
  , $radio_check = ['radio','checkbox']
  , $button_type = ['button','submit']

/*
 * 生成select的表单
 * item 配置
*/

function mk_select(P){
  let _select;
  let options = [];
  if (P.attr.union){
    return (
      <span className="iconfont fkp-dd">
        <input ref={'#'+P.id} type='hidden' name={P.name} id={P.id} defaultValue=''/>
        <div ref={'.'+P.id} className="form_control fkp-dd-input">{P.placeholder}</div>
      </span>
    )
  }

  else if (P.options) {
    function optionMethod(dom){
      // console.log(dom);
    }

    const _data = tree(P.options),
          options = list({
            data: _data,
            itemClass: 'fkp-dd-option',
            itemMethod: optionMethod
          })

    return (
      <span className="iconfont fkp-dd">
        <input ref={'#'+P.id} type='hidden' name={P.name} id={P.id} defaultValue=''/>
        <div ref={'.'+P.id} className="form_control fkp-dd-input">{P.placeholder}</div>
        <div ref={'+'+P.id}>
          {options}
        </div>
      </span>
    )
  }

  // // select的option
  // // _value必须为二维数组  _value = [ [...], [...], [...]]
  // // 第一个数组为 option value   required
  // // 第二个数组为 option text    required
  // // 第三个数组为 option custom value，以 data-attr 作为option的二外参数    not required
  // else if (_.isArray(P.value)){
  //   let _vals = P.value[0],
  //       _texts = P.value[1]||[],
  //       _attrs = P.value[2]||[]
  //
  //   if (_vals.length !== _texts.length){
  //     return ( <span>select配置，请检查配置</span> )  // select config error，must be array
  //   }
  //   else {
  //     let $val='请选择'    // pleas selected
  //     let $attr=''        // data-attr
  //     _vals.map(function(_val, i){
  //       _val = _val.toString();
  //       if (_val){
  //         if (_attrs){
  //           $attr = _attrs[i]
  //         }
  //         if(_val.indexOf('-')===0){
  //           $val = _val.replace('-','')
  //           options.push( <li data-value={$val} key={'opts'+i} data-attr={$attr}>{_texts[i]}</li> )
  //         } else {
  //           options.push( <li className="fkp-dd-option" key={'opts'+i} data-attr={$attr} data-value={_val}>{_texts[i]}</li> )
  //         }
  //       }
  //     })
  //     _select = <ul>{options}</ul>
  //     return (
  //       <span className="iconfont fkp-dd">
  //         <input type='text' className="form_control fkp-dd-input" name={P.name} id={P.id} placeholder={P.placeholder} defaultValue=''/>
  //         {_select}
  //       </span>
  //     )
  //   }
  // }
  return ( <span>请检查select配置</span> )
}

// 'text', 'password', 'select', 'tel'
function whatTypeElement(P){
  if (_.indexOf($text_type, P.type)>-1){
    if (P.type === 'select') return mk_select(P)
    if (_.indexOf($phold_type, P.type)>-1){
      return <input
        ref={'#'+(P.id||P.name)}
        placeholder={P.placeholder}
        type={P.type}
        name={P.name}
        id={P.id}
        defaultValue={P.value}
        className='form_control'/>
    }

    return <input
      ref={'#'+(P.id||P.name)}
      type={P.type}
      name={P.name}
      id={P.id}
      defaultValue={P.value}
      className='form_control'/>
  }

  if (_.indexOf($button_type, P.type)>-1){
    return <input
      ref={'#'+(P.id||P.name)}
      type={P.type}
      name={P.name}
      id={P.id}
      defaultValue={P.value}
      className='btn'/>
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
      if (_name ) return this::mk_element(item, {key: _.uniqueId(ii+'_'+jj+'_'), index: ii})
      // if (_name ) return this::mk_element(_name, _.uniqueId(ii+'_'+jj+'_'))
    })

    return (
      <div key={'multi_'+ii} className="inputMultiply">
        {elements}
      </div>
    )
  }

  const _name = getTypeName(inputs)
  if (_name ) return this::mk_element(item, ii)
  // if (_name ) return this::mk_element(_name, ii)
}

/*
 * mk_element
 * 分析配置文件，并输出结构
 *
 */
function mk_element(item, _i){
  const allocation = this.state.allocation
  let _title,
      _desc,
      _class,
      _union,
      lableObj,
      P,
      index = _i,
      key

  if (typeof _i == 'object') {
    index = _.index
    _i = _.key
  }

  P = typeof item == 'string'
  ? allocation[item]
  : this.props.getItemAllocation(item, index)[getTypeName(item.input)]

  _title = P.attr.title
  _desc = P.attr.desc
  _class = P.attr.itemClass
  _union = P.attr.union

  if (_union) {
    _union.target = {
      id: P.id,
      name: P.name,
      type: P.type
    }
    saxer.data.intent.push(_union)
  }
  saxer.data.allocation[P.id] = P

  // radio
  return $radio_check.indexOf(P.type) > -1
  ? <Radio ref={(P.id&&P.id[0]||P.name&&P.name[0])} key={'radioGroup'+_i} data={P} />
  : <lable ref={(P.id||P.name)} key={"lable"+_i} className={_class + ' for-' + (P.id||P.name||'')}>
      {_title ? <span className="fkp-title">{_title}</span> : false}
      {this::whatTypeElement(P)}
      {P.required ? <span className="fkp-input-box" /> : ''}
      {_desc ? <span className="fkp-desc">{_desc}</span> : false}
    </lable>
}



class Input extends React.Component {
  constructor(props){
    super(props)
    this.intent = []

    const data = this.props.data||[]
    this.state = {
      data: data,
      allocation: this.props.allocation
    }

    saxer = SAX(this.props.globalName)
    saxer.append({
      intent: [],
      unions: {},
      allocation:{}
    })

    this._preRender = this::this._preRender
    mk_elements = this::mk_elements
  }

  componentWillMount() {}
  componentDidMount() {}

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

    // {icompany: 'xxxx'}
    VAL: function(data){
      if (!data) return
      let allocation = _.cloneDeep(this.state.allocation)
      let sdata = this.state.data
      O.keys(data).forEach( item => {
        if (allocation[item]) {
          allocation[item]['value'] = data[item]
          const index = allocation[item]['_index']
          let _data = sdata[index]
          _data['input']['value'] = data[item]
        }
      })

      // this.setState({ data: sdata })
      // this.setState({ allocation: allocation })
    },
  })
}

module.exports = storeIt;
