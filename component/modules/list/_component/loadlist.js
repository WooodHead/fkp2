/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
var store = require('component/mixins/storehlc')
var List = require('component/widgets/listView')

class ListApp extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			data: [],
			loading: false,
			over: false,
			children: true
		}
	}

	componentWillMount() {
		this.setState({
			data: this.props.data
		})
	}

	render(){
		let _props = _.extend({}, this.props)
		delete _props.data

		let loadbar = this.state.loading ? <div className="loadbar"><div className="loader">Loading...</div></div> : []
		let overbar = this.state.over ? <div className="overbar"><div className="loader">没有更多内容了</div></div> : []
		delete _props.children

		let children = this.state.children ? this.props.children : []
		return (
			<div>
				<List data={this.state.data} {..._props} />
				{loadbar}
				{overbar}
				{children}
			</div>
		)
	}
}

function storeIt(key){
	if (!key) return ListApp
	return store(key, ListApp)
}

module.exports = storeIt
