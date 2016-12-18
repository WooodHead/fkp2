/**
itemView
放回 li 结构, 用于modules/list 调用，作为ul/li部分
*/
var ItemMixin = require('component/mixins/item')
var dealWithDataMethod = require('./_common/itemDealWithData')

function getClass(resault){
	const data = this.props.data
	let cls = resault.clsName
	if (data.className) cls = data.className
	if (data.li) cls += ' itemroot'
	return cls
}

var fox = React.createClass({
	mixins: [ItemMixin],
	componentWillMount: function() {
		this.idf = this.props.idf
	},

	// 组件判断是否重新渲染时调用
  // 虚拟dom比对完毕生成最终的dom后之前
	shouldComponentUpdate:function(nextProps){
		var data = JSON.stringify(this.props.data)
		var _data = JSON.stringify(nextProps.data)
		if (data !== _data) return true;
		return false
	},

	dealWithData: dealWithDataMethod,

	render: function () {
		const me = this;
		let resault = this.dealWithData();
		let k1 = resault.k1
		, v1 = resault.v1
		, k2 = resault.k2
		, v2 = resault.v2
		, clsName = resault.clsName
		, sty = resault.sty
		, fill = resault.fill

		let data_attr = {}
		_.mapKeys(this.props.data, function(value, key) {
		  if (key.indexOf('data-')>-1) { data_attr[key] = value }
		})

		let _props = {
			"id":	 				k1,
			"style":			sty,
			"className": 	getClass.call(me, resault),
			"key": 				_.uniqueId('fox_')
		}
		_props = _.merge(_props, data_attr)
		return React.createElement('li', _props, fill)
}

});

module.exports = fox;
