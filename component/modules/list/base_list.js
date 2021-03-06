/**
 * 列表
 */
import {objtypeof} from 'libs'
import scroll from 'component/mixins/scrollhlc'
import ListClass from 'component/class/list'

class App extends ListClass {
  constructor(config) {
    super(config)
  }

  componentWill(){
    const dft = this.config
    const BaseList = this.createList(dft.globalName)   // = this.createList(this.config.globalName)
    // const BaseList = scroll(this.createList(dft.globalName))   // = this.createList(this.config.globalName)

    this.eles = <BaseList
      data={dft.data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}
      header={dft.header}
      listMethod={dft.listMethod}
      itemMethod={dft.itemMethod} >
      {dft.footer ? dft.footer : ''}
    </BaseList>

    return this
  }
}

export function BaseList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: '',    //list-lagou.css
    globalName: _.uniqueId('BaseList_'),
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: ''
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return new App(dft)
}

export function pure(props, getreact){
  return BaseList(props)
}
