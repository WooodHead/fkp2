let _Pagi = require('./_component/index')
import ListClass from 'component/class/list'

function idm(dom, itemMethod){
  const that = this
  if (typeof window === 'undefined' ) $ = function(){}
  $(dom).click(function(e){
    e.preventDefault();
    let page = parseInt($(this).attr("data-page"))
    , jump = $(this).attr("data-jump")
    , href = $(this).find('a').attr('href')
    if (page) {
      that.jump({start: page-1, jump})
      if(typeof itemMethod == 'function') itemMethod(page)
    }
  })
}

class CompApp extends ListClass {
  constructor(config){
    super(config)
    if (!this.config.globalName) this.config.globalName = _.uniqueId('Pagi_')
  }

  componentWill(){
    const dft = this.config
    let Pagi = _Pagi(dft.globalName)

    this.eles = <Pagi
      data={dft.data}
      begin={dft.begin}
      itemDefaultMethod={idm}
      itemMethod={dft.itemMethod}
      listMethod={dft.listMethod}
      itemClass={dft.itemClass}
      listClass={dft.listClass}/>

    return this
  }
}

export function pagination( opts ) {
  var noop = false,
  dft = {
    container: '',
    globalName: '',
    itemMethod: noop,
    listMethod: noop,
    theme: 'list/pagination',
    listClass: 'pagenation',
    itemClass: '',
    data: {
      total: 200,
      per:   10,
      url:   '',
      query: ''
    },
    begin: { start: 0, off: 5 }
  }
  dft = _.merge(dft, opts)
  return new CompApp(dft)
}

export function pure(props, getreact){
  return pagination(props)
  // let app = pagination(props)
  // if (!app.client || getreact) return app.render()
  // return app
}
