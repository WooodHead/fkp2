/**
itemView
放回 li 结构, 用于modules/list 调用，作为ul/li部分
*/
var ItemMixin = require('component/mixins/item')
var dealWithDataMethod = require('./_common/itemDealWithData')

var fox = React.createClass({
	mixins: [ItemMixin],
	// 组件判断是否重新渲染时调用
    // 虚拟dom比对完毕生成最终的dom后之前
	shouldComponentUpdate:function(nextProps){
		var data = JSON.stringify(this.props.data)
		var _data = JSON.stringify(nextProps.data)
		if (data !== _data) return true;
		return false
	},

	componentDidMount: function () {},

	dealWithData: dealWithDataMethod,

	render: function () {
		var me = this;
		var resault = this.dealWithData();
		var k1 = resault.k1,
		v1 = resault.v1,
		k2 = resault.k2,
		v2 = resault.v2,
		clsName = resault.clsName,
		sty = resault.sty,
		fill = resault.fill;

		var data_attr = {}
		_.mapKeys(this.props.data, function(value, key) {
		  if (key.indexOf('data-')>-1) {
				data_attr[key] = value;
			}
		});

		function getClass(){
			if (me.props.data.className) return me.props.data.className;
			return clsName
		}

		var _props = {
			"ref":			this.props.data.ref,
			"id":	 		k1,
			"style":		sty,
			"className": 	getClass(),
			"key": 			_.uniqueId('fox_')
		}
		_props = _.assign(_props, data_attr)
		if (this.props.data.loadbar){
			var _type = this.props.data.loadbar;
			if (_type==='loadbar'){
				_props.className = 'lazyloadbar'
				fill = <div ref="loadbar" className="loadtype" style={{"display":"none"}}><div className="loader">Loading...</div></div>
			}
		}
		return React.createElement('li', _props, fill)
}

});

module.exports = fox;
