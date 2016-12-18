var libs = require('libs');
var BaseTabs = require('./_component/base_tabs')
var render = React.render;


function tabsDid(dom, select, itemFun){
  let that = this
  that.items = []
  $(dom).find('.list-container li').each(function(ii, item){
    that.items.push(item)
    if ($(item).hasClass('itemroot')) {
      $(item).find('.itemCategory ul').addClass('none')
    }
    if (typeof itemFun == 'function') {
      itemFun.call(that, item, ii)
    }
    // else {
    //   $(item).on(that.config.evt, function(e){
    //     e.stopPropagation()
    //     if ($(this).has('div.itemroot').length){
    //       $(this).find('.itemroot ul').toggleClass('none')
    //     } else {
    //       that.select(ii)
    //       $(this).addClass('selected').siblings().removeClass('selected')
    //     }
    //   })
    // }
  })
}

class App {
  constructor(config){
    this.config = config
    this.eles
    this.stat

    this.componentWill = this::this.componentWill
    this.componentDid = this::this.componentDid
    this.append = this::this.append
    this.select = this::this.select
    this.render = this::this.render
    this.componentWill()
  }

  componentWill(){
    const inject = libs.inject()
    inject.css('/css/m/'+this.config.theme+'.css')

    let Tabs = BaseTabs(this.config.globalName)
    this.config.tabsDidMethod = this::tabsDid
    this.eles = <Tabs opts={this.config} />
  }

  componentDid(){
    this.stat = 'finish'
  }

  append(item){
    const config = this.config
    if (this.stat == 'finish' && config.globalName) {
      const _name = this.config.globalName
      SAX.roll(_name, 'APPEND_ITEM', item)
    }
  }

  select(page, data){
    const config = this.config
    $(this.items).removeClass('selected')
    let index=0, dom
    if (Array.isArray(page)) {
      [index, dom] = page
    } else {
      index = page
    }
    if (dom && $(dom).hasClass('itemroot')) {
      $(dom).find('.caption:first').toggleClass('fold')
      $(dom).find('ul:first').toggleClass('none')
    } else {
      $(this.items[(index||0)]).addClass('selected')
      // sax
      if (this.stat == 'finish' && config.globalName) {
        const _name = config.globalName
        SAX.roll(_name, 'SELECT', index)
      }
    }
  }

  render(id){
    let container = id || this.config.container || ''
    if (!container) {
      this.componentDid()
      return this.eles
    }

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      this.componentDid()
      render( this.eles, container )
    }
  }
}

export function tabs(opts){
  var noop = false
  , dft = {
    data: [],
    container: '',
    globalName: '',   // TabsModule
    theme: 'tabs',
    cls: '',
    itemMethod: noop,
    listMethod: noop,
    tabsDidMethod: noop,
    mulitple: false,
    evt: 'click'
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}

export function htabs(opts) {
  opts.cls = 'tabsGroupY'
  return tabs(opts)
}

export function pure(opts){
  delete opts.globalName
  return BaseTabs(opts)
}
