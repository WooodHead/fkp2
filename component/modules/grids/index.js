/**
 * 列表
 */
import {objtypeof} from 'libs'
import {pure as bsPure} from 'component/modules/list/base_list'
import ListClass from 'component/class/list'

class G extends ListClass {
  constructor(config){
    super(config)
    const len = config.data.length || []
    const _width = (_.divide(100/len).toString())+'%'
    this.style = {
      width: _width
    }
    this.replace = this::this.replace
  }

  replace(index, data){
    let dft = this.config

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
    _data.itemStyle = {width: data.width||this.style.width}
    dft.data[index] = _data
    if (this.stat == 'finish') {
      this.actions.roll('EDIT', {index: index, data: _data})
    }
    else {
      this.componentWill()
    }
  }

  componentWill(){
    const dft = this.config
    const BaseList = this.createList(dft.globalName)   // = this.createList(this.config.globalName)

    this.eles = <BaseList
      data={dft.data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}
      itemStyle={dft.itemStyle}
      listStyle={dft.listStyle}
      header={dft.header}
      listMethod={dft.listMethod}
      itemMethod={dft.itemMethod} >
      {dft.footer ? dft.footer : ''}
    </BaseList>
  }
}

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

    let _itemStyle = _.merge({}, opts.itemStyle, {width: $width})
    _data.push({
      title: content,
      itemStyle: _itemStyle
    })
  })

  if (validate) {
    opts.data = _data
    return new G(opts)
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
