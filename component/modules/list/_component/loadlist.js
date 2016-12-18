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
			<div className="list-container">
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
	if (typeof key == 'string') { storeAction(key) }
	return store(key, ListApp)
}

function storeAction(key){
	SAX.set(key, null, {
		HIDECHILDREN: function(data){
			this.setState({
				children: false
			})
		},
		LOADING: function(data){
			if (!this.state.over) {
				if (data && data.next && typeof data.next == 'function') data.next()
				this.setState({
					loading: true
				})
			}
		},
		LOADED: function(data){
			if (!this.state.over) {
				_.delay(()=>{
					this.setState({
						loading: false
					})
				}, 1000)
			}
		},
		UPDATE: function(data){
			if (!this.state.over) {
				if (data.news && data.news.length) {
					_.delay(()=>{
						if (data.type && data.type == 'append') {
							this.setState({ data: [...this.state.data, ...data.news] })
						} else {
							this.setState({ data: data.news })
						}
					}, 300)
				}
			}
		},
		OVER: function(data){
			this.setState({
				loading: false,
				over: true
			})
		}
	})
}

module.exports = storeIt
