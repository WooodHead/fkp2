let _Pagi = require('./_component/index')
let libs = require('libs')
let objtypeof = libs.objtypeof

function idm(_name, itemMethod){
  if (typeof window === 'undefined' ) $ = function(){}
  if (_name && itemMethod) {
    $(this).click(function(e){
      e.preventDefault();
      let page = parseInt($(this).attr("data-page"))
      , jump = $(this).attr("data-jump")
      , href = $(this).find('a').attr('href')
      if (page) {
        SAX.roll(_name, 'JUMP', {start: page-1, jump})
        itemMethod(page)
      }
    })

  }
}

export function pagination(data, opts ) {
  var noop = false,
  dft = {
    container: '',
    globalName: '',
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: 'pagenation',
    data: {
      total: 200,
      per:   10,
      url:   '',
      query: ''
    },
    begin: { start: 0, off: 5 }
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  data = _.merge(data, dft.data)
  if (!dft.globalName) dft.globalName = _.uniqueId('Pagi_')
  let Pagi = _Pagi(dft.globalName)
  SAX.set(dft.globalName, { data: data, begin: dft.begin }, {
    JUMP: function(data){
      let xxx = _.extend({}, this.state.begin, data)
      this.setState({begin: xxx})
    }
  })
  let Component = <Pagi data={data} begin={dft.begin} itemDefaultMethod={idm} itemMethod={dft.itemMethod} listMethod={dft.listMethod} itemClass={dft.itemClass} listClass={dft.listClass}/>
  if (!dft.container) return Component

  // client
  let render = React.render
  render( Component , _.isPlainObject(dft.container)&&dft.container.nodeType ? dft.container : document.getElementById(dft.container) )
}

export function pure(props){
  if (!props) props = {}
  return pagination(props.data, props)
}
