/**
 * 列表
 */
let libs = require('libs')
let list = require('./_component/loadlist')  //设定列表域为 lagou
let pure = require('component/modules/pagination').pure
let objtypeof = libs.objtypeof

export function PagiList(data, opts){
  if (!data || objtypeof(data)!='array') return list()
  let render = React.render
  let noop = function(){}
  let dft = {
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
  if (objtypeof(opts) == 'object') dft = _.extend(dft, opts)
  if (typeof opts == 'string') dft.container = opts

  let Blist = preDefine(dft.globalName)
  let Component = (
    <div>
      <Blist itemClass={dft.itemClass} listClass={dft.listClass} listMethod={dft.listMethod} onscrollend={dft.scrollEnd} scroll={dft.scroll} data={data} itemMethod={dft.itemMethod}/>
      {pure(dft.pagenation)}
    </div>
  )
  if (!dft.container) return Component

  // client
  let inject = libs.inject()
  inject.css(['/css/m/'+dft.theme])  //注入like_lagou的样式
  render( Component, _.isPlainObject(dft.container)&&dft.container.nodeType ? dft.container : document.getElementById(dft.container) )
}

function preDefine(gname){
  let blist = list(gname)
  if (gname && typeof gname=='string') {
    SAX.set(gname, null, {
      LOADING: function(data){
        if (!this.state.over) {
          this.setState({
            loading: true
          })
        }
      },
      LOADED: function(data){
        if (!this.state.over) {
          _.delay(()=>{
            this.setState({
              loading: false
            })
          }, 2000)
        }
      },
      UPDATE: function(data){
        this.setState({
          data: data.news
        })
      },
      OVER: function(data){
        this.setState({
          loading: false,
          over: true
        })
      }
    })
  }
  return blist
}

export function pure(props){
  return PagiList(props.data||[], props)
}
