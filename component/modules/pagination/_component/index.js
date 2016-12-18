let List = require('component/widgets/listView')
import store from 'component/mixins/storehlc'
let _storeName;
let _jump = false;

//分页item 组织数据如下
/*
* data format
* {
*    url:  {String}
*    text: {String}
*  }
*/
class PageItem extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    let ele = React.findDOMNode(this)
    , mtd = this.props.itemMethod
    , dmtd = this.props.itemDefaultMethod;

    if(dmtd && typeof dmtd==='function'){
      dmtd.call(ele, _storeName, mtd);
    }
  }

  render(){
    let clsName = "item"
		let itemStyle = ''
		let sty = {}
		let data = this.props.data

    if(this.props.itemClass) clsName = "item "+this.props.itemClass
		if(data.active) clsName+=' active'
    if(this.props.itemStyle){
			clsName = 'item'
			sty = this.props.itemStyle
		}

		let text
		let value=''
    let jump
		if(data.text){
			if(data.text.toString().indexOf('...')>-1){
				value = data.dataPage
				text = '...'
			}else{
				text = data.text;
				value = data.dataPage;
			}
		}
    if (data.dataJump){
        jump = data.dataJump;
    }

		return (
      <li data-page={value} data-jump={jump} className={clsName} style={sty}>
        <a href={data.url}>{text}</a>
      </li>
    )
  }
}

// 分页容器，组织数据格式如下
/*
* datas format
* {
* data: {
*	total: 123 ,  {Number}   产品总的个数
* 	per:   10, 	  {Number}   每页显示的个数
*	url:   '/xxx/yyy.html'   {String}    分页链接开头
* 	query: 'abc="slime"&xyz="pack"&curentPage='   {String}   分页向后台查询的query
* },

* //分页展示页数，从第几页到第几页
* begin: {
*   start: 0,    {Number}   从几开始
*	off: 10		{Number}   偏移值
* }
}
*/
class Pagenation extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data,
      begin: this.props.begin
    }
  }

  componentWillMount() { }

  render(){

    let data = this.state.data
    , newData = []
    , pages = data.total/data.per
    , pre
    , aft
    , half


    , begin = this.state.begin
    , start = parseInt(begin.start||0)
    , ostart = start
    , off = parseInt(begin.off)
    , end = start+off
    , query = ''

		if(data.total%data.per) pages+=0
		if(end>pages) end = pages
		half = off%2 ? (off-off%2)/2 : (off-off%2)/2-1;


		if(start!==0){
      pre = (start-half) < 1 ? 0 : start-half;
      aft = (pre + off) >= pages ? pages : (pre + off);
			start = pre;
			end = pre === 0 ? off >= pages ? aft : off : aft;
		}

		if(ostart>=0){
      newData.push({
        url: ostart == 0 ? 'javascript:;' : data.query+ostart,
        text: '<',dataPage:ostart
      })

      if (ostart > 0) {
        if (ostart%begin.off === 0 && begin.jump){
          start = ostart
          aft = aft + _.floor(begin.off/2)
          end = (start+begin.off) >= pages ? pages : (start+begin.off);
        }
      }
    }

		if(start>1){
			newData.push({
        url: (data.query+1),
        text: '1',
        dataPage:'1',
        dataJump: ''
      })
			newData.push({
        url: 'javascript:;',
        text: '...',
        dataPage: ostart-off>0?ostart-off+1:1,
        dataJump: ostart-off>0?ostart-off+1:1
      })
		}

		if( end > 0 ){
      let ii=start
			for( ii; ii<end; ii++){
				query = data.query+(ii+1);
        newData.push({
          url: query,
          text: ii+1,
          dataPage:ii+1,
          dataJump: '',
          active:( function(){
						if(ostart < half || (ostart + half) > pages){
							return ostart===ii ? true : false
						} else{
							return (half+start)===ii ? true : false
						}
					})()
        })
      }

      if(end <= pages){
        if (end < pages) {
          newData.push({
            url: 'javascript:;',
            text: '...'+ii,
            dataPage: ostart+off>pages?pages+1:ostart+off+1,
            dataJump: ostart+off>pages?pages+1:ostart+off+1
          });

  				newData.push({
            url: data.query+(pages),
            text: (_.ceil(pages)),
            dataPage: _.ceil(pages),
            dataJump: ''
          });
        }

				newData.push({
          url: ostart >= Math.floor(end) ? 'javascript:;' : data.query+(ostart+2),
          text: '>',
          dataPage: ostart >= Math.floor(end) ? '' : ostart+2
        })
      }
		}
    let _props = _.merge({data: newData, itemView:PageItem}, this.props)
    let _List =  React.createElement(List, _props)

    return _List
  }
}


function actRct( storeName ){
  _storeName = storeName;
  return store(storeName, Pagenation)
}

module.exports = actRct
