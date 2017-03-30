import BaseX from 'component/class/basex'
import {dropdown} from '../dropdown'
import {grids} from '../grids/nindex'
import input from '../form/inputs'
const isClient = (() => typeof window !== 'undefined')()

const relativeAsset = {
  autoinject: false,
  props: {
    data: ['']
  }
}

const optionsAsset = {
  autoinject: false,
  props: {
    data: ['2222']
  }
}

// const menusAsset = {
//   data: [
//     {title: 'xxx'},
//     {title: 'yyy'},
//     {title: 'zzz'},
//     {title: 'aaa'}
//   ],
//   itemMethod: function(ctx){
//     $(this).click(function(e){
//       e.stopPropagation()
//       ctx.text(this.innerHTML)
//       ctx.value(this.innerHTML)
//       ctx.toggle()
//     })
//   }
// }

function getMenusAsset(_data){
  const that = this
  return {
    data: _data,
    listClass: 'dropdown-item dropdown-link',
    itemMethod: function(ctx){
      $(this).click(function(e){
        e.stopPropagation()
        ctx.text(this.innerHTML)
        ctx.value(this.innerHTML)
        ctx.toggle()
        const apiIndex = $(this).attr('data-id')

        if (that.apis[apiIndex]) {
          that.api = that.apis[apiIndex]
        }

        if (that.relatives[apiIndex]){
          const relItem = that.relatives[apiIndex]
          let resault = relItem
          if (typeof relItem == 'function') {
            resault = relItem()
          }
          that.relativeZone.replace(resault)
        }

      })
    }
  }
}


// <Search data=[] /> 
class SearchBase extends React.Component {
  constructor(props){
    super(props)
    this.timer
    this.state = {
      data: this.props.data||[]
    }
  }
  componentWillMount() {
    try {
      let assets = {},
        menusData = [], 
        apis = [],
        relatives = [];
      
      this.menus = ''
      if (this.state.data.length) {
        this.state.data.map( (item, ii) => {
          assets[ii] = {
            title: item.title,
            api: item.api
          }
          menusData.push({title: item.title, attr:{id: ii}})
          apis.push(item.api||'')
          relatives.push(item.relative||'')
        })
      }
      
      this.apis = apis
      this.relatives = relatives
      this.relativeZone = grids(relativeAsset)

      if (menusData.length) {
        if (menusData.length > 1) {
          this.menus = dropdown(getMenusAsset.call(this, menusData)).render()
        } else {
          this.api = this.apis[0]
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }
  render(){
    const that = this
    const itemClassName = this.props.itemClass
    const listClassName = this.props.listClass

    const searchInputAsset = 
    [{
      desc: <button>搜索</button>,
      input:{
        id:    'autoCompleteSearch',
        type:  'select',
        placeholder: '请选择',
        itemMethod: function(dom){
          if (typeof that.props.searchOptionMethod == 'function') {
            return that.props.searchOptionMethod.call(this, dom)
          }
        }
      },
      union: {
        id: 'autoCompleteSearch',
        cb: function(dom){
          clearTimeout(that.timer)
          that.timer = setTimeout(()=>{
            if (typeof that.props.searchMethod == 'function') {
              const newOptions = that.props.searchMethod.call(this, dom)
              if (newOptions) this.value(newOptions)
            }
          }, 300);
        }
      },
      watch: true
    }, {
      title: ' ',
      input: {type: 'span', value: this.relativeZone.render(), id: 'autoCompleteReplaceZone'}
    }]
    const searchInput = input({data: searchInputAsset}).render()

    return (
      <div className={"search_wrap "+(listClassName ? listClassName+'_parent':'')}>
        {this.menus}
        {searchInput}
      </div>
    )
  }
}

const Actions = {}


// let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    this.combinex(SearchBase, Actions)
  }
}

// [
//   {title: 'xxxx', api: '/api/fdkss', relative, options},
//   {title: 'xxxx', api: '/api/fdkss'},
//   {title: 'xxxx', api: '/api/fdkss'}
// ]


export function search(opts){
  var noop = false
  , dft = {
    data: [],
    options: [],

    searchOptionMethod: '',
    searchMethod: '',

    select: 0,
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Search_'),   // TabsModule
    theme: 'dd', // = /css/m/tabs
    cls: 'searchGroupY',
    itemClass: 'search-menu',
    listClass: 'search-menu-body',
    itemMethod: noop,
    listMethod: noop,
    fold: true,
    evt: 'click',
    placeholder: ''
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}


export function pure(props){
  return search(props)
}