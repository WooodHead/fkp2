/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
var Fox = require('../itemView/f_li')

var tmpApp = React.createClass({
	getDefaultProps: function() {
		return {

		};
	},

	getInitialState: function() {
		return {
      	data: this.props.data||[],
	    };
	},

	//插入真实 DOM之前
	componentWillMount:function(){
		var pdata = this.props.data;
		if( pdata ){
			if(!Array.isArray( pdata )){
				pdata = [ pdata ]
			}
			this.setState({
				data: pdata
			})
		}
	},

	//已加载组件收到新的参数时调用
	componentWillReceiveProps:function(nextProps){
		var pdata = nextProps.data;
		if(!Array.isArray( pdata )){
			pdata = [ pdata ]
		}
		if( nextProps.data ){
			this.setState({
				data: pdata
			});
		}
		// this.listMethod(nextProps);
	},

	_dealWithItemView: function(opts){
		var that = this;
		var props = _.cloneDeep(that.props);
		props.idf = opts.i;
		props.key = 'fox'+opts.i;
		props.data = opts.item;

		//删除多余的属性
		delete props.listClass;
		delete props.listMethod;
		delete props.itemView;
		delete props.onscrollend;

		if(that.props.itemView){
			var view = that.props.itemView;
			return React.createElement(view, props, that.props.children);
		}else{
			// var _props = _.extend({data: opts.item, key: ('fox'+opts.i), idf: opts.i }, props)
			// return React.createElement(Fox, _props, that.props.children)
			return <Fox idf={opts.i} key={opts.i} {...props} data={opts.item} />;
		}
	},

	_dealWithData: function(data){
		var that = this;
		var cls = "hlist";
		var sty = {};
		if(this.props.listStyle){
			cls = "hlist";
			sty = this.props.listStyle;
		}

		var itemCollection = [];
		function organizeData(record){
			var items = [];
			record.map(function(item,list_i){
				if (Array.isArray(item)){
					//inline 将数组元素放置在一个li中
					itemCollection.push(organizeData(item));
				} else {
					var it = that._dealWithItemView({i: list_i, item: item})
					items.push(it);
				}
			});
			if(items.length){
				var group = _.uniqueId('group-')
				return (
					<ul key={group} className={cls} style={sty}>
						{items}
					</ul>
				)
			}else {
				return;
			}
		}
		itemCollection.push(organizeData(data));

		return itemCollection;
	},

	loopRender: function(){
		return this._dealWithData(this.state.data);
	},


	// 组件判断是否重新渲染时调用
    // 虚拟dom比对完毕生成最终的dom后之前
	// shouldComponentUpdate:function(){
	// 	return true;
	// },

	listMethod: function(props){
		if(props.listMethod){
			var mtd = props.listMethod;
			var that = React.findDOMNode(this);
			if(typeof mtd==='function'){
				var the = this;
				mtd(that,the.props.store);
			}
		}
	},

	componentDidMount: function () {
		this.listMethod(this.props)
	},

	render: function () {
		var fills = this.loopRender();
		var _cls = 'list-wrap'
		if(this.props.listClass){
			_cls = "list-wrap " + this.props.listClass;
		}
		return (
			<div className={_cls}>
				{fills}
				{this.props.children}
			</div>
		)
	}
});

module.exports = tmpApp;
