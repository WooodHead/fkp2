/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
import store from 'component/mixins/storehlc'
var List = require('component/widgets/listView')
let tmpData = []
class ListApp extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			data: tmpData.length ? tmpData : (this.props.data||[]),
			loading: false,
			over: false,
			trigger: false,
			triggerBar: <div className="overbar"><div className="trigger">加载更多内容</div></div>,
			children: true,
			header: true
		}
	}

	componentWillMount() { }

	componentWillUpdate(nextProps, nextState) {
		// 更新并将当前数据保存到tmpData，再次进入时，为最后一次数据，但性能并不好
		// 尤其在tabs模块中
		// 暂时注销
		// tmpData = nextState.data
	}

	render(){
		let _props = _.extend({}, this.props)
		delete _props.data

		let loadbar = this.state.loading ? <div className="loadbar"><div className="loader">Loading...</div></div> : []
		let overbar = this.state.over ? <div className="overbar"><div className="over">没有更多内容了</div></div> : []
		let triggerbar = this.state.trigger ? this.state.triggerBar : []
		delete _props.children

		let children = this.state.children
		? ((childs)=>  childs ? childs.map( (o, ii) => o ? React.cloneElement(o, {key: ii }):'' ):'' )(this.props.children)
		: ''
		return (
			<div className="list-container">
				{this.props.header}
				<List data={this.state.data} {..._props} />
				{loadbar}
				{overbar}
				{triggerbar}
				{children}
			</div>
		)
	}
}

function storeIt(key){
	if (typeof key == 'string') { storeAction(key) }
	return store(key, ListApp)
}

function storeAction(key){
	SAX.set(key, {}, {
		HIDECHILDREN: function(data){
			if (this.state.children) {
				this.setState({ children: false })
			}
		},
		LOADING: function(data){
			if (!this.state.over) {
				if (data && data.next && typeof data.next == 'function') data.next()
				if (!this.state.loading) {
					this.setState({ loading: true })
				}
			}
		},
		LOADED: function(data){
			if (!this.state.over) {
				_.delay(()=>{
					this.setState({
						loading: false,
						trigger: false
					})
				}, 1000)
			}
		},
		UPDATE: function(data){
			if (!this.state.over) {
				if (data.news) {
					if (_.isPlainObject(data.news)) { data.news = [data.news] }
					if (Array.isArray(data.news) && data.news.length) {
						if (data.type && data.type == 'append') {
							this.setState({ data: [...this.state.data, ...data.news] })
						} else {
							this.setState({ data: data.news })
						}
					}
				}
			}
		},
		OVER: function(data){
			this.setState({
				loading: false,
				over: true
			})
		},
		TRIGGER: function(data){
			if (!this.state.over) {
				if (data.bar){
					this.setState({
						triggerBar: data.bar,
						trigger: true,
						loading: false,
						over: false
					})
				} else {
					this.setState({
						trigger: true,
						loading: false,
						over: false
					})
				}
			}
		}
	})
}

module.exports = storeIt
