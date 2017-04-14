import { inject } from 'libs'
import { htabs as Tabs,input as Input } from 'component/client'
import { list } from 'component'

import pages1 from './_common/page1'

inject().css('/css/parts.css')


const hotData = [
  {
    title: '热门出发城市',
    body: [{
      li:[
        {
          title: '北京',
          url: '#beijin'
        },
        {
          title: '上海',
          url: '#beijin'
        },
        {
          title: '天津',
          url: '#beijin'
        },
        {
          title: '青岛',
          url: '#beijin'
        },
        {
          title: '南京',
          url: '#beijin'
        },
        {
          title: '杭州',
          url: '#beijin'
        },
        {
          title: '厦门',
          url: '#beijin'
        },
        {
          title: '成都',
          url: '#beijin'
        },
        {
          title: '深圳',
          url: '#beijin'
        },
        {
          title: '广州',
          url: '#beijin'
        },
        {
          title: '沈阳',
          url: '#beijin'
        },
        {
          title: '武汉',
          url: '#beijin'
        },
        {
          title: '香港',
          url: '#beijin'
        },
        {
          title: '台北',
          url: '#beijin'
        }
      ]
    }]
  }
]

const hot = list({data: hotData})

const searchInputdata =
[{
  input:{
    id:    'autoCompleteSearch',
    type:  'text',
    placeholder: '搜索城市（支持汉字、首字母查询）',
    itemMethod: function(dom){
      // if (typeof that.props.searchOptionMethod == 'function') {
      //   return that.props.searchOptionMethod.call(this, dom)
      // }
    }
  },
  union: {
    id: 'autoCompleteSearch',
    cb: function(dom){
      // clearTimeout(that.timer)
      // that.timer = setTimeout(()=>{
      //   if (typeof that.props.searchMethod == 'function') {
      //     const newOptions = that.props.searchMethod.call(this, dom)
      //     if (newOptions) this.value(newOptions)
      //   }
      // }, 300);
    }
  }
}]
const searchInput = Input({data: searchInputdata, autoinject: false})

const searchinputDom = (
  <div className="search-input">
    {searchInput.render()}
  </div>
)


const cityDom = (
  <div className="city_searchBox">
    <div className='city-hot'>{hot}</div>
    {searchinputDom}
    {pages1}
  </div>
)
export default cityDom
