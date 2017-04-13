/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
import store from 'component/mixins/storehlc'
import itemHlc from 'component/mixins/itemhlc'
import {BaseList, pure} from 'component/modules/list/base_list'
import Tree from 'component/util/tree'


function checkContent(content, ii){
	if (typeof content != 'object') return content
	if (Array.isArray(content)){
		console.log('不能指定为数组');
		return
	}
	if (content.props) {
		const Temp = itemHlc(content)
		return <Temp key={_.uniqueId('TabsContent_')}/>
	}
	else {
		return content
	}
}

const tapsapp = SAX(_.uniqueId('TapsApp_'), {})
class TapsApp extends React.Component {
	constructor(props){
		super(props)
		this.menus
		this.contents = []
		this.client = (()=>{
      if (typeof window == 'undefined') return false
      return true
    })()
		this.state = {
			data: [],
			selectData: [],
			menus: [],
			mulitple: false,
			select: 0
		}

		if (this.props.opts) {
			let opts = _.merge({}, this.state, this.props.opts)
			this.state = opts
			this.state.data = this.props.opts.data
			this.state.menus = this.props.opts.data.map( item => item.title )
			// this.state.select = 0
		}

		this.select = this::this.select
		this._menus = this::this._menus
		this.actions = this::this.actions
		this.getContent = this::this.getContent
	}

	_menus(){
		let data = this.state.data.map((item)=>{
			delete item.content
			return item
		})
		// menus
		const listProps = _.extend({}, this.props.opts, {data: Tree(data)})
		// listProps.listClass = "tabsMenus"
		listProps.listClass = "tabs-menu-body"
		listProps.itemClass = "tabs-menu"
		delete listProps.container
		delete listProps.itemMethod
		this.menus = BaseList(listProps).render()
	}

	componentWillMount() {
		if (this.props.opts.globalName) { this.actions() }
		let contents = this.state.data.map( (item, ii) => checkContent(item.content, ii) )
		tapsapp.append({contents: contents})
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
		this.setState({
			select: (id||0),
			selectData: (data||{})
		})
	}

	getContent(){
		const tapscontents = tapsapp.get().contents
		const content = tapscontents[this.state.select]
		if (typeof content == 'function') {
			return content(this.selectData)
		}
		return content
	}

	render(){
		const opts = this.state

		// content
		const content = this.getContent()

		// className
		// const cls = !opts.cls ? 'tabsGroup ' : 'tabsGroup ' + opts.cls
		const cls = !opts.tabClass ? 'tabsGroup ' : 'tabsGroup ' + opts.tabClass
    const boxes_cls = !opts.mulitple ? 'tabsBoxes' : 'tabsBoxes mulitple'

		const treeHeader = this.props.opts.treeHeader
		const treeFooter = this.props.opts.treeFooter

		if (this.props.opts.header ||
			this.props.opts.footer ) {
			return (
				<div className="tabsContainer">
					{this.props.opts.header}
					<div className={cls}>
						<div className='tabsMenus'>{treeHeader}{this.menus}{treeFooter}</div>
		        <div className={boxes_cls}>{content}</div>
		      </div>
					{this.props.opts.footer}
				</div>
		)}
		return (
      <div className={cls}>
				<div className='tabsMenus'>{treeHeader}{this.menus}{treeFooter}</div>
        <div className={boxes_cls}>{content}</div>
      </div>
    )
	}
}

function storeIt(key){
	return store(key, TapsApp)
}

module.exports = storeIt
