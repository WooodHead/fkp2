/**
 * 列表
 */
let libs = require('libs')
let pure = require('component/modules/pagination').pure
import ListClass from 'component/class/list'

class App extends ListClass {
  constructor(config) {
    super(config)
  }

  componentWill(){
    const dft = this.config
    const BaseList = this.createList(dft.globalName)   // = this.createList(this.config.globalName)

    this.eles = <BaseList
      data={dft.data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}
      header={dft.header}
      listMethod={dft.listMethod}
      itemMethod={dft.itemMethod} >
      {dft.footer ? dft.footer : ''}
      {pure(dft.pagenation, true)}
    </BaseList>

    return this
  }
}

export function PagiList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    header: '',
    footer: '',
    container: '',
    theme: 'list/lagou',  // public/css/modules/list/lagou
    globalName: _.uniqueId('PagiList_'),
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: '',
    pagenation: {
      data: {
        total: 200,
        query: '',
        per:   10
      }
    }
  }
  dft = _.merge(dft, opts)
  return new App(dft)
}

export function pure(props, getreact){
  let app = PagiList(props)
  if (!app.client || getreact) return app.render()
  return app
}
