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
        that.relativeZone.replace('777777')
        that.api = that.apis[apiIndex]
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
      data: this.props.data||[],
      options: this.props.options||[]
    }
  }
  componentWillMount() {
    try {
      let assets = {},
        menusData = [], 
        apis = []
    
      if (this.state.data.length) {
        this.state.data.map( (item, ii) => {
          assets[ii] = {
            title: item.title,
            api: item.api
          }
          menusData.push({title: item.title, attr:{id: ii}})
          apis.push(item.api)
        })
      }
      this.apis = apis
      this.menusData = menusData
      this.relativeZone = grids(relativeAsset)
      this.optionsZone = grids(optionsAsset)
      this.menus = dropdown(getMenusAsset.call(this, this.menusData)).render()
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
      title: this.menus,
      desc: <button>搜索</button>,
      input:{
        id:    'autoCompleteSearch',
        type:  'select',
        placeholder: '请选择',
        itemMethod: function(dom){
          if (typeof that.props.optionMethod == 'function') {
            that.props.optionMethod.call(this, dom)
          }
        }
      },
      union: {
        id: 'autoCompleteSearch',
        cb: function(dom){
          clearTimeout(that.timer)
          that.timer = setTimeout(()=>{
            if (typeof that.props.searchMethd == 'function') {
              const newOptions = that.props.searchMethd.call(this, dom)
              this.value(newOptions)
            }
            // this.value([
            //   {title: 'xxxx', attr: {value: '111'}},
            //   {title: 'yyyy', attr: {value: '222'}},
            //   {title: 'zzzz', attr: {value: '333'}}
            // ])
          }, 1000);
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

    menuMethod: '',
    optionMethod: '',
    searchMethd: '',

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