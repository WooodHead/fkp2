let ItemMixin = require('component/mixins/item')
// <Radio data={name: [], id: [], title: [], rtitle:[], cb: fn} />

var Radio = React.createClass({
  mixins: [ItemMixin],
	getInitialState:function(){
		return {
      fill: false
		}
	},
	//插入真实 DOM之前
	componentWillMount:function(){
    this.names = [];
    this.ids = [];
    this.titles = [];
    this.values = [];
    this.fills = [];
    this.descs = [];
    this.fills = [];
    this.type = 'radio';
    let checked;
    let _cls = 'fkp-radio-box';

    let me = this;
    let eles= this.props.data

    if (_.isObject(eles)){
      let data = this.props.data

      if (data.name) this.names = _.isArray(data.name) ? data.name : ['noname']
      if (data.id) this.ids = _.isArray(data.id) ? data.id : ''
      if (data.type) this.type = data.type;
      if (data.title) this.titles = _.isArray(data.title) ? data.title : ['']
      if (data.value) this.values = _.isArray(data.value) ? data.value : ['novalue']
      if (data.desc) this.descs = _.isArray(data.desc) ? data.desc : ['']
      _cls = me.type==='radio' ? 'fkp-radio-box' : 'fkp-checkbox-box';

      if (this.names.length){
        this.values.map(function(item, i){
          let _id = me.ids[i] ? me.ids[i] : '',
          _title = me.titles[i] ? me.titles[i] : '',
          _value = me.values[i] ? me.values[i] : 'novalue',
          _desc  = me.descs[i] ? me.descs[i] : '',
          _input = [],
          _name = me.names[i] ? me.names[i] : me.names[0],
          _active = ''
          if (_value && _value!=='novalue' && _value.indexOf('-')===0){
            // && parseInt(_value)<0){
            checked = true;
            _value = _value.replace('-','')
          }
          else { checked = false; }

          var lableClass = me.type==='radio' ? 'radioItem' : 'checkboxItem';
          me.fills.push(
            <lable key={'radio'+i} className={lableClass}>
              {(function(){
                if (_title) return <span className="fkp-title">{_title}</span>
              })()}
              {(function(){
                if (checked) return <input defaultChecked type={me.type} name={_name} id={_id} value={_value}/>
                else {
                  return <input type={me.type} name={_name} id={_id} value={_value}/>
                }
              })()}
              <span className={_cls} />
              {(function(){
                if (_desc) return <span className="fkp-desc">{_desc}</span>
              })()}
            </lable>
          )
          // me.fills.push(_input)
        })
      }

      if (this.fills.length){
        this.setState({
          fill: this.fills
        })
      }
    }
	},
	// //插入真实 DOM之后
	// componentDidMount:function(){
    //
	// },
	// //被重新渲染之前
	// componentWillUpdate:function(){
    //
	// },
	// //被重新渲染之后
	// componentDidUpdate:function(){
    //
	// },
	// //移出真实 DOM之前
	// componentWillUnmount:function(){
    //
	// },
	// //已加载组件收到新的参数时调用
	// componentWillReceiveProps:function(){
    //
	// },
	// //组件判断是否重新渲染时调用
    // 虚拟dom比对完毕生成最终的dom后之前
	// shouldComponentUpdate:function(){
	// 	return true;
	// },
    //
	// handleClick:function(){
    //
	// },
	render:function(){
    let fill = this.state.fill ? this.state.fill : false;
    let groupClass = this.type === 'radio' ? 'radioGroup' : 'checkboxGroup'
    if (fill){
      return (
        <div ref={this.names[0]} className={groupClass}>
          {fill}
        </div>
      )
    }
	}
});

module.exports = Radio;
