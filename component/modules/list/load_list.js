/**
 * 列表
 */
let libs = require('libs')
let list = require('./_component/loadlist')  //设定列表域为 lagou
var scroll = require('component/mixins/scrollhlc')
let PagiPure = require('component/modules/pagination').pure
let objtypeof = libs.objtypeof

class App {
  constructor(config){
    this.config = config
    this.eles
    this.stat
    this.actions
    this.client = (()=>{
      if (typeof window == 'undefined') return false
      return true
    })()

    this.componentWill = this::this.componentWill
    this.componentDid = this::this.componentDid
    this.append = this::this.append
    this.render = this::this.render

    // actions
    this.loaded = this::this.loaded
    this.loading = this::this.loading
    this.update = this::this.update
    this.over = this::this.over

    this.componentWill()
    return this
  }

  componentWill(){
    const dft = this.config
    let Blist
    if (this.client) {
      const inject = libs.inject()
      inject.css(['/css/m/'+dft.theme])  //注入like_lagou的样式
      Blist = scroll(list(dft.globalName))
      this.actions = SAX(dft.globalName)
    } else {
      Blist = list(dft.globalName)
    }
    this.eles = <Blist
      data={dft.data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}

      itemMethod={dft.itemMethod}
      listMethod={this.componentDid}

      scrollContainer = {dft.scrollContainer}
      onscroll={dft.scroll}
      onscrollend={dft.scrollEnd} >
      {PagiPure(dft.pagenation)}
    </Blist>

    return this
  }

  componentDid(){
    this.stat = 'finish'
    this.actions.roll('HIDECHILDREN')
  }

  append(ary){
    this.actions.roll('UPDATE', {news: ary, type: 'append'})
  }

  loaded(){
    this.actions.roll('LOADED')
  }

  loading(cb){
    this.actions.roll('LOADING', {next: cb})
  }

  update(ary){
    this.actions.roll('UPDATE', {news: ary})
  }

  over(){
    this.actions.roll('OVER')
  }

  render(id){
    let container = id || this.config.container || ''
    if (!container) {
      return this.eles
    }

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      React.render( this.eles, container )
    }

    return this
  }
}

export function LoadList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    scrollContainer: '',
    theme: 'list-lagou.css',
    globalName: '',
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: '',
    scrollEnd: noop,
    scroll: noop,
    pagenation: {
      data: {
        total: 200,
        query: ''
      }
    }
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}

export function pure(props){
  let app = LoadList(props)
  if (app.client) return app
  return app.render()
}
