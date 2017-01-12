/**
 * 列表
 */
import {objtypeof} from 'libs'
import {pure as bsPure} from 'component/modules/list/base_list'

/*
  data: [
    {idf: 'xxx', title: 'xxx', content: 'yyy', width: '30%'},
    {idf: 'xxx', title: 'xxx', content: 'yyy', width: '70%'},
  ]

  {
    title : content
  }
  invalidate
 */

function grids(opts){
  const data = opts.data
  const len = opts.data.length || []
  let _width = (_.divide(100/len).toString())+'%'
  let validate = true
  let _data = []
  data.map( x => {
    // if (!x.idf) validate = false
    let content = (typeof x == 'string' || React.isValidElement(x) )
    ? x : objtypeof(x) == 'object'
      ? (x.content ? x.content : ' ')
      : ' '

    const $width = objtypeof(x) == 'object'
      ? x.width
        ? x.width : _width
      : typeof x == 'number' && x < 100
        ? x.toString()+'%'
        : _width

    _data.push({
      title: content,
      itemStyle: {width: $width}
    })
  })

  if (validate) {
    opts.data = _data
    let gridInstance = bsPure(opts)

    gridInstance.replace = function(index, data){
      let _data = {}
      if (typeof index != 'number') {
        data = index
        index = 0
      }
      _data.title = (typeof data == 'string' || typeof data == 'number' || React.isValidElement(data))
      ? data
      : typeof data == 'object'
        ? (data.content || ' ')
        : ' '

      _data.itemStyle = {width: data.width||_width}
      this.actions.roll('EDIT', {index: index, data: _data})
    }

    return gridInstance
  }
}

export function Grids(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: 'grids',    //list-lagou.css
    globalName: _.uniqueId('Grids_'),
    itemMethod: noop,
    listMethod: noop,
    itemClass: 'grids-item',
    listClass: 'grids'
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return grids(dft)
  // return bsPure(dft)
}

export function pure(props){
  return Grids(props)
}
