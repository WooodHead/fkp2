/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
import im from 'immutable'
import {objtypeof} from 'libs'
var Fox = require('../itemView/f_li')

class TmpApp extends React.Component {
	constructor(props){
		super(props)
		var pdata = this.props.data;
		if( pdata ){ if(!Array.isArray( pdata )){ pdata = [ pdata ] } }
		this.selected = []
		this.state = {
			data: im.fromJS(pdata||[])
		}

		this._dealWithData = this::this._dealWithData
		this._dealWithItemView = this::this._dealWithItemView
		this.listMethod = this::this.listMethod
		this.getListDom = this::this.getListDom
	}

	shouldComponentUpdate(nextProps, nextState) {
		// return !(this.props === nextProps || im.is(this.props, nextProps)) ||
		// 		 !(this.state === nextState || im.is(this.state, nextState));
		return !im.is(this.state.data, nextState.data)
	}

	componentWillMount() {

	}

	getListDom(){
		return React.findDOMNode(this);
	}

	componentWillReceiveProps(nextProps) {
		var pdata = nextProps.data;
		if (pdata) {
			if(!Array.isArray( pdata )) pdata = [ pdata ]
			pdata = im.fromJS(pdata)
			let stateData = this.state.data
			if (!im.is(pdata, stateData)) {
				stateData = stateData.merge(pdata)
				this.setState({ data: stateData })
			}
		}
	}

	componentDidMount(){
		// this.listMethod(this.props.listMethod)
	}

	listMethod(lmd){
		if (lmd && typeof lmd == 'function') {
			let that = React.findDOMNode(this);
			lmd(that, this.props.store)
		}
	}

	_dealWithItemView(opts){
		var that = this;
		var props = _.cloneDeep(that.props);
		props.idf = opts.i;
		props.key = 'fox'+opts.i;
		props.data = opts.item;

		const listOperate = {
			parent: this.getListDom
		}

		//删除多余的属性
		delete props.listClass;
		delete props.listMethod;
		delete props.itemView;
		delete props.onscrollend;

		if(that.props.itemView){
			var view = that.props.itemView;
			return React.createElement(view, props, that.props.children);
		}else{
			return <Fox ref={"child_"+opts.i} operate={listOperate} idf={opts.i} {...props} data={opts.item} />;
		}
	}

	_dealWithData(data){
		var that = this;
		var cls = "hlist";
		var sty = {};

		var itemCollection = [];
		function organizeData(record){
			var items = [];
			record.map(function(item, list_i){
				if (Array.isArray(item)){
					//inline 将数组元素放置在一个li中
					itemCollection.push(organizeData(item));
				} else {
					var it = that._dealWithItemView({i: list_i, item: item})
					items.push(it);
				}
			})

			if(items.length){
				var group = _.uniqueId('group-')
				return (
					<ul key={group} className={cls}>
						{items}
					</ul>
				)
			}
		}

		let stateData = this.state.data.toJS()
		itemCollection.push(organizeData(stateData))
		return itemCollection;
	}

	render(){
		let fills = this._dealWithData()
		let _cls = 'list-wrap'
		let sty
		if(this.props.listClass){
			_cls = "list-wrap " + this.props.listClass
		}
		if(this.props.listStyle){
			sty = this.props.listStyle;
		}
		return (
			<div className={_cls} style={sty}>
				{fills}
				{this.props.children}
			</div>
		)
	}


}
module.exports = TmpApp;
