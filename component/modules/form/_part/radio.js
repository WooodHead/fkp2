let ItemMixin = require('component/mixins/item')
// <Radio data={name: [], id: [], title: [], rtitle:[], cb: fn} />

function getArrayItem(item){
  return item && Array.isArray(item) ? item : typeof item == 'string' ? [item] : ''
}

function isArray(data){
  return data&&Array.isArray(data)
}

function isString(data){
  return typeof data == 'string'
}

class Radioo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data
    }
  }

  componentWillMount() { }

  preRender(){
    let superID
    let titles = [],
        descs = [],
        names = [],
        ids = []
    const pdata = this.state.data
    const itemClass = pdata.attr.itemClass ? pdata.attr.itemClass : ''
    const lableClass = pdata.type ==='radio' ? 'radioItem '+itemClass : 'checkboxItem '+itemClass
    const _cls = pdata.type==='radio' ? 'fkp-radio-required' : 'fkp-checkbox-required';


    let values = pdata.value
    if (!isArray(values)) values = [values]
    const len = values.len
    values.forEach( (val, ii) => {

      // superID or names
      if (isArray(pdata.name)) {
        if (pdata.name.length == len) {
          names = pdata.name
          ids = names
          superID = pdata.name[0]
        } else {
          superID = pdata.name[0]
        }
      } else {
        superID = pdata.name
      }
      this.superID = superID

      // title
      if (isArray(pdata.attr.title)) {
        if (pdata.attr.title.length == len) titles = pdata.attr.title
        else {
          titles.push(pdata.attr.title[ii]||'')
        }
        pdata.attr.title = ''
      }

      // desc
      if (isArray(pdata.attr.desc)) {
        if (pdata.attr.desc.length == len) descs = pdata.attr.desc
        else {
          descs.push(pdata.attr.desc[ii]||'')
        }
      }
    })

    return values.map( (val, ii) => {
      let checked = false

      if (val.charAt(0)=='-'){
        checked = true
      }

      let resault = {
        title: titles.length ? titles[ii] : '',
        name: names.length ? names[ii] : superID,
        id: names.length ? names[ii]+'-'+ii : superID+'-'+ii,
        value: val,
        desc: descs.length ? descs[ii] : ''
      }
      return (
         <lable key={'radio'+ii} className={ lableClass }>
          {resault.title ? <span className="fkp-title">{resault.title}</span> : ''}
          {
            checked
            ? <input ref={'#'+resault.id} defaultChecked type={pdata.type} name={resault.name} id={resault.id} value={resault.value}/>
            : <input ref={'#'+resault.id} type={pdata.type} name={resault.name} id={resault.id} value={resault.value}/>
          }
          <span className={_cls} />
          { resault.desc ? <span className="fkp-desc">{resault.desc}</span> : '' }
        </lable>
      )
    })
  }

  render(){
    const state = this.state
    const fill = this.preRender()
    const groupClass = this.state.data.type === 'radio' ? 'radioGroup' : 'checkboxGroup'
    return (
      <div ref={this.superID} className={groupClass}>
        {
          state.data.attr.title
          ? <span className="fkp-title">{state.data.attr.title}</span>
          : ''
        }
        {fill}
      </div>
    )
  }
}

// var Radio = React.createClass({
//   mixins: [ItemMixin],
// 	getInitialState:function(){
// 		return {
//       fill: []
// 		}
// 	},
// 	//插入真实 DOM之前
// 	componentWillMount:function(){
//     this.names = [];
//     this.ids = [];
//     this.titles = [];
//     this.values = [];
//     this.fills = [];
//     this.descs = [];
//     this.fills = [];
//     this.type = 'radio';
//     let checked = false;
//     let _cls = 'fkp-radio-box';
//     let me = this;
//     const that = this
//     if (_.isPlainObject(this.props.data)){
//       let data = this.props.data
//
//       this.names = getArrayItem(data.name)
//       this.ids   = getArrayItem(data.id)
//       this.titles   = getArrayItem(data.title)
//       this.values   = getArrayItem(data.value)
//       this.descs   = getArrayItem(data.desc)
//
//       if (data.type) this.type = data.type;
//       _cls = this.type==='radio' ? 'fkp-radio-box' : 'fkp-checkbox-box';
//
//       if (!this.names || !this.values) {
//         throw '请指定name 和 value'
//       }
//
//       const itemClass = data.itemClass ? data.itemClass : ''
//
//       this.values.map( (val, ii)=>{
//         let resault = {}
//         let lableClass = this.type ==='radio' ? 'radioItem '+itemClass : 'checkboxItem '+itemClass
//
//         resault.val = val
//         resault.title = this.titles[ii] || ''
//         resault.desc = this.descs[ii] || ''
//         resault.id = this.ids[ii] || ''
//         resault.name = this.names[ii] || this.names[0]
//
//         if (resault.val && resault.val.indexOf('-')==0){
//           checked = true;
//           resault.val = resault.val.substring(1)
//         }
//
//         this.fills.push(
//           <lable key={'radio'+ii} className={ lableClass }>
//             { resault.title ? <span className="fkp-title">{resault.title}</span> : '' }
//             {(
//               () => checked
//               ? <input defaultChecked type={this.type} name={resault.name} id={resault.id} value={resault.value}/>
//               : <input type={this.type} name={resault.name} id={resault.id} value={resault.value}/>
//             )()}
//             <span className={_cls} />
//             { resault.desc ? <span className="fkp-desc">{resault.desc}</span> : '' }
//           </lable>
//         )
//       })
//       this.setState({ fill: this.fills })
//     }
// 	},
//
// 	render:function(){
//     const groupClass = this.type === 'radio' ? 'radioGroup' : 'checkboxGroup'
//     return (
//       <div ref={this.names[0]} className={groupClass}>
//         {this.state.fill}
//       </div>
//     )
// 	}
// });

module.exports = Radioo;
