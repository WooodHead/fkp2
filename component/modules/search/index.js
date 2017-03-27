import BaseX from 'component/class/basex'
import {dropdown} from '../dropdown'
import {grids} from '../grids/nindex'
import input from '../form/inputs'
const isClient = (() => typeof window !== 'undefined')()

const relativeAsset = {
  autoinject: false,
  props: {
    data: ['11111']
  }
}

const menusAsset = {
  data: [
    {title: 'xxx'},
    {title: 'yyy'},
    {title: 'zzz'},
    {title: 'aaa'}
  ],
  itemMethod: function(ctx){
    $(this).click(function(e){
      e.stopPropagation()
      ctx.text(this.innerHTML)
      ctx.value(this.innerHTML)
      ctx.toggle()
    })
  }
}

class SearchBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[]
    }
  }
  componentWillUpdate() {
    
  }
  componentWillMount() {
    
  }
  render(){
    const itemClassName = this.props.itemClass
    const listClassName = this.props.listClass

    // const searchInput = input(searchInputAsset).render()
    // const relative = grids(relativeAsset).render()
    // const menus = dropdown(menusAsset).render()

    const relative = grids(relativeAsset).render()
    const menus = dropdown(menusAsset).render()

    const searchInputAsset = 
    [{
      title: menus,
      desc: <button >搜索</button>,
      input:{
        id:    'autosearch',
        type:  'select',
        options: [ { title: 'aaa' } ],
        placeholder: '请选择'
      }
    }]
    const searchInput = input({data: searchInputAsset}).render()
    
    return (
      <div className={"search_wrap "+(listClassName ? listClassName+'_parent':'')}>
        {searchInput}
        {relative}
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

export function search(opts){
  var noop = false
  , dft = {
    data: [],
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