/**
 * 列表
 */
let libs = require('libs')
let list = require('./_component/loadlist')  //设定列表域为 lagou
var scroll = require('component/mixins/scrollhlc')
let PagiPure = require('component/modules/pagination').pure
let objtypeof = libs.objtypeof

export function LoadList(data, opts){
  if (!data || objtypeof(data)!='array') return list()
  let render = React.render
  let noop = function(){}
  let dft = {
    container: '',
    scrollContainer: '',
    theme: 'list-lagou.css',
    globalName: '',
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
  if (objtypeof(opts) == 'object') dft = _.extend(dft, opts)
  if (typeof opts == 'string') dft.container = opts

  if (typeof opts.itemClick == 'function') {
    dft.itemMethod = opts.itemClick
    delete dft.itemClick
  }

  // 隐藏 pagenation bar
  dft.listMethod = function(){
    if (dft.globalName) {
      SAX.roll(dft.globalName, 'HIDECHILDREN')
    }
  }

  let Blist = preDefine(dft.globalName)
  let Component = (
    <Blist
      data={data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}

      itemMethod={dft.itemMethod}
      listMethod={dft.listMethod}

      scrollContainer = {dft.scrollContainer}
      onscroll={dft.scroll}
      onscrollend={dft.scrollEnd} >
      {PagiPure(dft.pagenation)}
    </Blist>
  )

  if (!dft.container) return Component

  // client
  let inject = libs.inject()
  inject.css(['/css/m/'+dft.theme])  //注入like_lagou的样式
  render( Component, _.isPlainObject(dft.container)&&dft.container.nodeType ? dft.container : document.getElementById(dft.container) )
}

function preDefine(gname){
  let blist
  if (typeof window == 'undefined') blist = list(gname)
  else {
    blist = scroll(list(gname))
  }
  if (gname && typeof gname=='string') {
    SAX.set(gname, null, {
      HIDECHILDREN: function(data){
        this.setState({
          children: false
        })
      },
      LOADING: function(data){
        if (!this.state.over) {
          if (typeof data.next == 'function') data.next()
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
          }, 1000)
        }
      },
      UPDATE: function(data){
        if (!this.state.over) {
          if (data.news && data.news.length) {
            _.delay(()=>{
              this.setState({
                data: [...this.state.data, ...data.news]
              })
            }, 300)
          }
        }
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
  return LoadList(props.data||[], props)
}
