import itemHlc from 'component/mixins/itemhlc'
import store from 'component/mixins/storehlc'
let Radio = require('./radio')
let smd = require('libs').smd

const $text_type = ['text', 'password', 'select', 'tel']
  , $phold_type = ['text', 'password']
  , $radio_check = ['radio','checkbox']
  , $button_type = ['button','submit']

/*
 * 生成select的表单
 * item 配置
*/
function mk_select(item){
  let P = {
    id: '',
    name: 'noname',
    type: 'text',
    value: '',
    placehold: ''
  }
  if (React.isValidElement(item.input)) { P = _.extend({}, Object.create(item.input.props)) }
  else { P = item.input }

  let _title = item.title || ''
  , _desc = item.desc || ''
  , _class = item.class ? 'inputItem '+item.class : 'inputItem';

  let _select;
  let options = [];

  if (_.isObject(item.union)){
    return (
      <span className="iconfont fkp-dd">
        <input type='text' className="form_control fkp-dd-input" name={P.name} id={P.id} placeholder={P.placehold} defaultValue=''/>
      </span>
    )
  }

  // select的option
  // _value必须为二维数组  _value = [ [...], [...], [...]]
  // 第一个数组为 option value   required
  // 第二个数组为 option text    required
  // 第三个数组为 option custom value，以 data-attr 作为option的二外参数    not required
  else if (_.isArray(P.value)){
    _vals = P.value[0];
    _texts = P.value[1]||[];
    _attrs = P.value[2]||[];
    if (_vals.length !== _texts.length){
      return ( <span>select配置，请检查配置</span> )  // select config error，must be array
    }
    else {
      let $val='请选择'    // pleas selected
      let $attr=''        // data-attr
      _vals.map(function(_val, i){
        _val = _val.toString();
        if (_val){
          if (_attrs){
            $attr = _attrs[i]
          }
          if(_val.indexOf('-')===0){
            $val = _val.replace('-','')
            options.push( <li data-value={$val} key={'opts'+i} data-attr={$attr}>{_texts[i]}</li> )
          } else {
            options.push( <li className="fkp-dd-option" key={'opts'+i} data-attr={$attr} data-value={_val}>{_texts[i]}</li> )
          }
        }
      })
      _select = <ul>{options}</ul>
      return (
        <span className="iconfont fkp-dd">
          <input type='text' className="form_control fkp-dd-input" name={P.name} id={P.id} placeholder={P.placehold} defaultValue=''/>
          {_select}
        </span>
      )
    }
  }
  return ( <span>请检查select配置</span> )
}

// 'text', 'password', 'select', 'tel'
function whatTypeElement(P){
  if (_.indexOf($text_type, P.type)>-1){
    if (P.type === 'select') return mk_select.call(this, item)
    if (_.indexOf($phold_type, P.type)>-1){
      return <input placeholder={P.placehold} type={P.type} name={P.name} id={P.id} defaultValue={P.value} className='form_control'/>
    }
    return <input type={P.type} name={P.name} id={P.id} defaultValue={P.value} className='form_control'/>
  }

  if (_.indexOf($button_type, P.type)>-1){
    return <input type={P.type} name={P.name} id={P.id} defaultValue={P.value} className='btn'/>
  }
}



function mk_elements(item, ii){
  if (Array.isArray(item.input)) {
    let profile = _.cloneDeep(item)
    delete profile.input
    let eles = item.input.map((ele, jj)=>{
      let _ele = this::mk_element({input: ele, ...profile}, _.uniqueId(ii+'_'+jj+'_'));
      return _ele
    })
    return <div key={'multi_'+ii} className="inputMultiply">{eles}</div>
  }
  return this::mk_element(item, ii)
}
/*
 * mk_element
 * 分析配置文件，并输出结构
 *
 */
function mk_element(item, _i){
  let P = {
    id: '',
    name: 'noname',
    type: 'text',
    value: '',
    placehold: ''
  }
  P = item.input
  if (React.isValidElement(item.input)) P = _.extend({}, item.input.props)

  let lableObj
  const _title = item.title || P.title || ''
  const _desc = item.desc || P.desc || ''
  const _class = (item.itemClass||P.itemClass) ? 'inputItem '+(item.itemClass||P.itemClass) : 'inputItem'

  // radio
  if (_.indexOf($radio_check, P.type)>-1){
    lableObj = <Radio key={'radioGroup'+_i} data={item.input} />
  } else {
    lableObj = <lable ref={(P.id||P.name)} key={"lable"+_i} className={_class + ' for-' + (P.id||P.name||'')}>
      {_title ? <span className="fkp-title">{_title}</span> : false}
      {whatTypeElement(P)}
      {P.required ? <span className="fkp-input-box" /> : ''}
      {_desc ? <span className="fkp-desc">{_desc}</span> : false}
    </lable>
  }

  if (item.union) {
    item.union.target = {
      id: P.id,
      name: P.name,
      type: P.type,
      item: item
    }
    this.intent.push( item.union )
  }
  return lableObj

}


class Input extends React.Component {
  constructor(props){
    super(props)
    this.intent = []
    this.state = { data: this.props.data||[] }
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
        {fill}
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
    }
  })
}

module.exports = storeIt;
