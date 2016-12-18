/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
var store = require('component/mixins/storehlc')
import {BaseList, pure} from 'component/modules/list/base_list'
import Tree from 'component/util/tree'

const tapsapp = SAX('TapsApp', {})
class TapsApp extends React.Component {
	constructor(props){
		super(props)
		this.menus
		this.contents = []
		this.state = {
			data: [],
			selectData: [],
			menus: [],
			mulitple: false
		}

		if (this.props.opts) {
			let opts = _.merge({}, this.state, this.props.opts)
			this.state = opts
			this.state.data = this.props.opts.data
			this.state.menus = this.props.opts.data.map( item => item.title )
			this.state.select = 0
		}

		this.mergeState = this::this.mergeState
		this.select = this::this.select
		this._menus = this::this._menus
		this.actions = this::this.actions
		this.getContent = this::this.getContent
	}

	mergeState(options){
		let tmp = _.extend({}, this.state, options)
		this.setState(tmp)
	}

	_menus(){
		let data = this.state.data.map((item)=>{
			delete item.content
			return item
		})
		// menus
		const listProps = _.extend({}, this.props.opts, {data: Tree(data)})
		listProps.listClass = "tabsMenus"
		listProps.itemClass = "tabs-menu"
		delete listProps.container
		delete listProps.itemMethod
		this.menus = BaseList(listProps).render()
	}

	componentWillMount() {
		if (this.props.opts.globalName) { this.actions() }
		let contents = this.state.data.map((item, i)=> item.content )
		tapsapp.append({contents: contents})
		// SAX.append(this.props.opts.globalName, {contents: contents})
		this._menus()
	}

	componentDidMount() {
		if (typeof this.props.opts.tabsDidMethod == 'function') {
			let that = React.findDOMNode(this);
			this.props.opts.tabsDidMethod(that, this.select, this.props.opts.itemMethod)
		}
	}

	actions(){
		const that = this
		const key = this.props.opts.globalName
		SAX.set(key, null, {
			APPEND_ITEM: function(data) {
				const menus = _.cloneDeep(that.state.menus)
				menus.push(data.title)
				const gdata = SAX.get(that.props.opts.globalName)
				gdata.contents.push(data.content)
				SAX.append(that.props.opts.globalName, {contents: gdata.contents})
				this.setState({ data: menus })
			},

			SELECT: function(page, data) {
				if (typeof page == 'object') {
					let index = page._index
					let data = page.data
					that.select(index, data)
				} else {
					that.select(page)
				}
			}
		})
	}

	select(id, data){
		this.setState({ select: (id||0) })
		if (data) this.setState({ selectData: data})
	}

	getContent(){
		const tapscontents = tapsapp.data().contents
		// const gdata = SAX.get(this.props.opts.globalName)
		const content = tapscontents[this.state.select]
		if (typeof content == 'function') {
			if (this.selectData) return content(this.selectData)
			return content()
		}
		return content
	}

	render(){
		const opts = this.state

		// content
		const content = this.getContent()

		// className
		const cls = !opts.cls ? 'tabsGroup tabsGroupX' : 'tabsGroup tabsGroupX ' + opts.cls
    const boxes_cls = !opts.mulitple ? 'tabsBoxes' : 'tabsBoxes mulitple'

		return (
      <div className={cls}>
				{this.menus}
        <div className={boxes_cls}>
          {content}
        </div>
      </div>
    )
	}
}

function storeIt(key){
	return store(key, TapsApp)
}

module.exports = storeIt
