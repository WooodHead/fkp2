/**
 * 列表
 */

let libs = require('libs')
let PagiPure = require('component/modules/pagination').pure
import scroll from 'component/mixins/scrollhlc'
import ListClass from 'component/class/list'

let objtypeof = libs.objtypeof

class App extends ListClass {
  constructor(config) {
    super(config)
  }

  componentDid(){
    this.hidechild()
  }

  componentWill(){
    const dft = this.config
    const BaseList = scroll(this.createList(dft.globalName))   // = this.createList(this.config.globalName)
    this.eles = <BaseList
      data={dft.data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}
      header={dft.header}

      itemMethod={dft.itemMethod}
      listMethod={this.componentDid}

      scrollContainer = {dft.scrollContainer}
      onscroll={dft.scroll}
      onscrollend={dft.scrollEnd} >
      {dft.footer}
      {PagiPure(dft.pagenation, true)}
    </BaseList>

    return this
  }
}

export function LoadList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    header: '',
    footer: '',
    container: '',
    scrollContainer: '',
    theme: 'list-lagou',   // public/css/modules/list/lagou
    globalName: _.uniqueId('LoadList_'),
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

export function pure(props, getreact){
  let app = LoadList(props)
  if (!app.client || getreact) return app.render()
  return app
}
