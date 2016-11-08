let ItemMixin = require('component/mixins/item')
let Radio = require('./radio')

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

function mk_elements(item, ii){
  if (Array.isArray(item.input)) {
    let eles = item.input.map((ele, jj)=>{
      let _ele = mk_element({input: ele}, _.uniqueId(ii+'_'+jj+'_'));
      return _ele
    })
    return <div key={'multi_'+ii} className="inputMultiply">{eles}</div>
  }
  return mk_element(item, ii)
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
  if (React.isValidElement(item.input)) { P = _.extend({}, Object.create(item.input.props)) }
  else { P = item.input }

  let _title = item.title || '',
  _desc = item.desc || '',
  _class = item.class ? 'inputItem '+item.class : 'inputItem'

  let $text_type = ['text', 'password', 'select', 'tel']
  ,   $phold_type =['text']
  ,   $radio_check = ['radio','checkbox']
  ,   $button_type = ['button','submit']

  let lableObj;

  function whatElement(){
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

  // radio
  if (_.indexOf($radio_check, P.type)>-1){
    lableObj = <Radio key={'radioGroup'+_i} data={item.input}/>
  }

  // 'text', 'password', 'select', 'tel'
  else {
    lableObj = <lable key={"lable"+_i} className={_class + ' for-' + (P.name||P.id)}>
      {_title ? <span className="fkp-title">{_title}</span> : false}
      {whatElement()}
      {P.required ? <span className="fkp-input-box" /> : ''}
      {_desc ? <span className="fkp-desc">{_desc}</span> : false}
    </lable>
  }

  if (_.isObject(item.union)){
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

/*
 * inputs
 * Input批量产出form表单，目前支持 text/hiden/password/tel
 * ==========================================================================================
 * 方案1
    var _input_config = {
        name:      ['user', 'message' , 'submit'],
        id:        ['user', 'message' , 'submit'],
        type:      ['text', 'text', 'button'],
        title:     ['姓名' , '聊天' , ''],
        value:     [null  , null  , '发射'],
        class:     ['user'  ,null  , 'chatSubmit'],
        placehold: [null  , '请输入聊天内容']
    }
 * ==========================================================================================
 * 方案2
 * var _input_config = [
     //0
     'Radio & Checkbox',    //分割线加标题
     {
         input:{
             type: 'radio',               // checkbox/text/tel/password/select/button
             name: ['ddd', 'ddd', 'ddd'],
             title: ['选项1', '选项2', '选项3'],
             value: ['1', '2', '3']
         }
     },
     {
         input:{
             name:      'user',
             id:        'user',
             value:     null,
             type:      'text',
             placehold: '我的id是user'
         },
         title:     '姓名',
         class:     null,
         desc:      '*用户名'
     },

     {
         input:{
             name:      'message',
             id:        'message',
             value:     null,
             type:      'text',
             placehold: '绑定user'
         },
         title:     '聊天',
         class:     null,
         desc:      null,
         union: {                   // 联动配置，联动user的value
             id: "user",
             cb: function(form){
                 // this是message的父级lable
                 libs.msgtips('我是message,我关联姓名');
                 $('#user').on('input',function(){
                     $('#message').val($('#user').val())
                     form.message = $('#user').val()
                 })
             }
         }
     },
     ....
     ....
* ==========================================================================================
*/
let Input = {
  mixins: [ItemMixin],
	getInitialState:function(){
		return {
      fill: false
		}
	},
	//插入真实 DOM之前
	componentWillMount:function(){
    if (this.props.data){
      this.setState({
        fill: this.props.data
      })
    }
	},

  _preRender: function(){
    let self = this;
    this.intent = [];
    this.fills = [];

    if (this.state.fill){
      let self = this;
      let eles= this.state.fill;

      if (_.isArray(eles)){
        self.fills = eles.map(function(item, i){
          if( _.isString(item)) return (<div key={'split'+i} className="split">{item}</div>)
          return ( mk_elements.call(self, item, i) )
        })
      }
    }
  },
	render:function(){
    this._preRender()
    let fill = this.fills ? this.fills : false;
    if (fill){
      return ( <div className="inputGroup"> {fill} </div> )
    }
	}
}

//
function actRct( storeName ){
  return require('component/util/index')(storeName, Input)
}

module.exports = actRct;
