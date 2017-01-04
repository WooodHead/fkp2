var libs = require('libs');
var BaseTabs = require('./_component/base_tabs')
var render = React.render;
import BaseClass from 'component/class/base'


function tabsDid(dom, select, itemFun){
  let that = this
  that.items = []
  $(dom).find('div:first li').each(function(ii, item){
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


class App extends BaseClass {
  constructor(config) {
    super(config)
  }

  componentWill(){
    const dft = this.config
    this.Component = BaseTabs(this.config.globalName)   // = this.createList(this.config.globalName)
    const Tabs = this.Component
    this.config.tabsDidMethod = this::tabsDid
    this.eles = <Tabs opts={this.config} />
    return this
  }

  append(item){
    const config = this.config
    if (this.stat == 'finish' && config.globalName) {
      const _name = this.config.globalName
      this.actions.roll('APPEND_ITEM', item)
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
        this.actions.roll('SELECT', {_index: index, data: data})
      }
    }
  }
}

export function tabs(opts){
  var noop = false
  , dft = {
    data: [],
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Tabs_'),   // TabsModule
    theme: 'tabs', ///css/m/tabs
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

export function pure(props, getreact){
  return tabs(props)
  // let app = tabs(props)
  // if (!app.client || getreact) return app.render()
  // return app
}
