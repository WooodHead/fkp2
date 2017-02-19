/**

itemView
放回 div 结构, 一般可以直接调用
*/
import im from 'immutable'
import itemHlc from 'component/mixins/itemhlc'
var dealWithDataMethod = require('./_common/itemDealWithData')

function getClass(resault){
	const state = this.state.toJS()
	const data = state.data
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
		const state = this.state.toJS()
		const stateData = state.data
		if (typeof stateData == 'object') {
			_.mapKeys(stateData, function(value, key) {
				if (key.indexOf('data-')>-1) { data_attr[key] = value }
				if (key=='attr') {
					Object.keys(stateData['attr']).map(function(item, ii){
						if (item) {
							data_attr[item] = stateData['attr'][item]
						}
					})
				}
			})
		}

		const _props = {
			id: k1
			, style: sty
			, className: getClass.call(self, this.resault)
			, key: _.uniqueId('fox_')
		}
		return <div {..._props} {...data_attr}>{fill}</div>
	}
}

module.exports = itemHlc(fox);
