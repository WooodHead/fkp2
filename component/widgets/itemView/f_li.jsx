/**
itemView
放回 li 结构, 用于modules/list 调用，作为ul/li部分
*/
import im from 'immutable'
import itemHlc from 'component/mixins/itemhlc'
var dealWithDataMethod = require('./_common/itemDealWithData')

function getClass(resault){
	const data = this.state.get("data").toJS()
	let cls = resault.clsName
	if (data.className) cls = data.className
	if (data.li) cls += ' itemroot'
	return cls
}

// props: {
// 	idf,
// 	data: [....],  item: {....}
// 	itemClass
// }
//
// item: {
// title:any,
// url: 和title在一起，组成a，没有的话,title就是title
// li:[], 会在 li下组成一个新的ul->li结构
// img:[]/String,
// body:[{title:any, url, li:[], k, v}],   k和v在一起变成 span span 结构
// footer:[{like body}],
// dot:[{like body}],
// data-xxx:"dom's attr"
// }

class fox extends React.Component {
	constructor(props) {
		super(props)
		this.state = im.fromJS(this.props).delete('operate')

		this.dealWithData = this::dealWithDataMethod
		this.updateState = this::this.updateState
		this.getState = this::this.getState
	}

	getState(){
		let _state = this.state.toJS()
		return _state
	}

	updateState(state){
		if (!data) return
		let _state = this.state.merge(im.fromJS(state))
		this.setState(_state)
	}

	componentWillMount() {
		let state = this.state.toJS()
		this.resault = this.dealWithData(state)
		this.idf = this.state.get('idf')
		this.parent = this.props.operate.parent
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.props === nextProps || im.is(this.props, nextProps)) ||
         !(this.state === nextState || im.is(this.state, nextState));
	}

	render(){
		const self = this
		let {k1, v1, k2, v2, clsName, sty, fill} = this.resault
		let data_attr = {}
		const stateData = this.state.get("data").toJS()
		_.mapKeys(stateData, function(value, key) {
		  if (key.indexOf('data-')>-1) { data_attr[key] = value }
		})

		const _props = {
			id: k1
			, style: sty
			, className: getClass.call(self, this.resault)
			, key: _.uniqueId('fox_')
		}
		return <li {..._props} {...data_attr}>{fill}</li>
	}
}
module.exports = itemHlc(fox);

// var fox = React.createClass({
// 	mixins: [ItemMixin],
// 	componentWillMount: function() {
// 		this.idf = this.props.idf
// 	},
//
// 	// 组件判断是否重新渲染时调用
//   // 虚拟dom比对完毕生成最终的dom后之前
// 	shouldComponentUpdate:function(nextProps, nextState){
// 		return !(this.props === nextProps || is(this.props, nextProps)) ||
//          !(this.state === nextState || is(this.state, nextState));
// 	},
//
// 	dealWithData: dealWithDataMethod,
//
// 	render: function () {
// 		const self = this;
// 		let resault = this.dealWithData();
// 		let k1 = resault.k1
// 		, v1 = resault.v1
// 		, k2 = resault.k2
// 		, v2 = resault.v2
// 		, clsName = resault.clsName
// 		, sty = resault.sty
// 		, fill = resault.fill
//
// 		let data_attr = {}
// 		_.mapKeys(this.props.data, function(value, key) {
// 		  if (key.indexOf('data-')>-1) { data_attr[key] = value }
// 		})
//
// 		let _props = {
// 			"id":	 				k1,
// 			"style":			sty,
// 			"className": 	getClass.call(self, resault),
// 			"key": 				_.uniqueId('fox_')
// 		}
// 		_props = _.merge(_props, data_attr)
// 		return React.createElement('li', _props, fill)
// }
//
// });
