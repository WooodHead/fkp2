/**
 * 列表
 */
let libs = require('libs')
let list = require('./_component/loadlist')  //设定列表域为 lagou
let objtypeof = libs.objtypeof

export function BaseList(data, opts){
  if (!data || objtypeof(data)!='array') return List()
  let noop = function(){}
  let dft = {
    container: '',
    theme: 'list-lagou.css',
    globalName: '',
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: ''
  }
  if (objtypeof(opts) == 'object') dft = _.extend(dft, opts)
  if (typeof opts == 'string') dft.container = opts

  let Blist = list(dft.globalName)
  let Component = <Blist itemClass={dft.itemClass} listClass={dft.listClass} listMethod={dft.listMethod} onscrollend={dft.scrollEnd} scroll={dft.scroll} data={data} itemMethod={dft.itemMethod}/>
  if (!dft.container) return Component

  // client
  let render = React.render
  let inject = libs.inject()
  inject.css(['/css/m/'+dft.theme])  //注入like_lagou的样式
  render( Component, _.isPlainObject(dft.container)&&dft.container.nodeType ? dft.container : document.getElementById(dft.container) );
}

export function pure(props){
  return BaseList(props.data||[], props)
}
