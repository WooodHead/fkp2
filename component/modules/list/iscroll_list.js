/**
 * 列表
 */
import {objtypeof} from 'libs'
import iscrollHlc from 'component/mixins/iscrollhlc'
import ListClass from 'component/class/list'

class App extends ListClass {
  constructor(config) {
    super(config)
  }

  componentWill(){
    const dft = this.config
    const BaseList = iscrollHlc( this.createList(dft.globalName), dft.iscroll )  // = this.createList(this.config.globalName)

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

export function IScrollList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: '',    //list-lagou.css
    globalName: _.uniqueId('BaseList_'),
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: '',
    iscroll: {}
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return new App(dft)
}

export function pure(props){
  return IScrollList(props)
}
