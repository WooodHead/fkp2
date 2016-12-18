/**
 * 列表
 */
let libs = require('libs')
let list = require('./_component/loadlist')  //设定列表域为 lagou
let pure = require('component/modules/pagination').pure
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
      Blist = list(dft.globalName)
      this.actions = SAX(dft.globalName)
    } else {
      Blist = list(dft.globalName)
    }

    this.eles = <div>
      <Blist
        data={dft.data}
        itemClass={dft.itemClass}
        listClass={dft.listClass}
        listMethod={dft.listMethod}
        itemMethod={dft.itemMethod}/>
      {pure(dft.pagenation)}
    </div>

    return this
  }

  componentDid(){
    this.stat = 'finish'
    this.actions.roll('HIDECHILDREN')
  }

  append(ary){
    this.update(ary, 'append')
  }

  loaded(){
    this.actions.roll('LOADED')
  }

  loading(cb){
    this.actions.roll('LOADING', {next: cb})
  }

  update(ary, type){
    this.loaded()
    if (ary.length) this.actions.roll('UPDATE', {news: ary, type: type})
    else { this.over() }
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

export function PagiList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: 'list-lagou.css',
    globalName: '',
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: '',
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

// export function PagiList(data, opts){
//   if (!data || objtypeof(data)!='array') return list()
//   let render = React.render
//   let noop = function(){}
//   let dft = {
//     container: '',
//     theme: 'list-lagou.css',
//     globalName: '',
//     itemMethod: noop,
//     listMethod: noop,
//     itemClass: '',
//     listClass: '',
//     pagenation: {
//       data: {
//         total: 200,
//         query: ''
//       }
//     }
//   }
//   if (objtypeof(opts) == 'object') dft = _.extend(dft, opts)
//   if (typeof opts == 'string') dft.container = opts
//
//   let Blist = preDefine(dft.globalName)
//   let Component = (
//     <div>
//       <Blist itemClass={dft.itemClass} listClass={dft.listClass} listMethod={dft.listMethod} onscrollend={dft.scrollEnd} scroll={dft.scroll} data={data} itemMethod={dft.itemMethod}/>
//       {pure(dft.pagenation)}
//     </div>
//   )
//   if (!dft.container) return Component
//
//   // client
//   let inject = libs.inject()
//   inject.css(['/css/m/'+dft.theme])  //注入like_lagou的样式
//   render( Component, _.isPlainObject(dft.container)&&dft.container.nodeType ? dft.container : document.getElementById(dft.container) )
// }
//
// function preDefine(gname){
//   let blist = list(gname)
//   return blist
// }
//
// export function pure(props){
//   return PagiList(props.data||[], props)
// }
