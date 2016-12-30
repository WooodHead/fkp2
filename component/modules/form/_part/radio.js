let ItemMixin = require('component/mixins/item')
// <Radio data={name: [], id: [], title: [], rtitle:[], cb: fn} />

function getArrayItem(item){
  return item && Array.isArray(item) ? item : typeof item == 'string' ? [item] : ''
}

var Radio = React.createClass({
  mixins: [ItemMixin],
	getInitialState:function(){
		return {
      fill: []
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
    let checked = false;
    let _cls = 'fkp-radio-box';
    let me = this;
    const that = this
    if (_.isPlainObject(this.props.data)){
      let data = this.props.data

      try {
        this.names = getArrayItem(data.name)
        this.ids   = getArrayItem(data.id)
        this.titles   = getArrayItem(data.title)
        this.values   = getArrayItem(data.value)
        this.descs   = getArrayItem(data.desc)

        if (data.type) this.type = data.type;
        _cls = this.type==='radio' ? 'fkp-radio-box' : 'fkp-checkbox-box';

        if (!this.names || !this.values) {
          throw '请指定name 和 value'
        }
      } catch (e) {
        console.log(e);
      }

      this.values.map( (val, ii)=>{
        let resault = {}
        const lableClass = this.type==='radio' ? 'radioItem' : 'checkboxItem'

        resault.val = val
        resault.title = this.titles[ii] || ''
        resault.desc = this.descs[ii] || ''
        resault.id = this.ids[ii] || ''
        resault.name = this.names[ii] || this.names[0]

        if (resault.val && resault.val.indexOf('-')==0){
          checked = true;
          resault.val = resault.val.substring(1)
        }

        this.fills.push(
          <lable key={'radio'+ii} className={ lableClass }>
            { resault.title ? <span className="fkp-title">{resault.title}</span> : '' }
            {(
              () => checked
              ? <input defaultChecked type={this.type} name={resault.name} id={resault.id} value={resault.value}/>
              : <input type={this.type} name={resault.name} id={resault.id} value={resault.value}/>
            )()}
            <span className={_cls} />
            { resault.desc ? <span className="fkp-desc">{resault.desc}</span> : '' }
          </lable>
        )
      })
      this.setState({ fill: this.fills })
    }
	},

	render:function(){
    const groupClass = this.type === 'radio' ? 'radioGroup' : 'checkboxGroup'
    return (
      <div ref={this.names[0]} className={groupClass}>
        {this.state.fill}
      </div>
    )
	}
});

module.exports = Radio;
