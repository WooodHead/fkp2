/**
 * 列表
 */
import {objtypeof} from 'libs'
import {pure as bsPure} from 'component/modules/list/base_list'

export function Cards(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: 'cards',    //list-lagou.css
    globalName: _.uniqueId('Cards_'),
    itemMethod: noop,
    listMethod: noop,
    itemClass: 'card-item',
    listClass: 'cards'
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return bsPure(dft)
}

export function pure(props){
  return Cards(props)
}
