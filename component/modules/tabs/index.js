var libs = require('libs');
var BaseTabs = require('./_component/base_tabs')
var render = React.render;
import BaseClass from 'component/class/base'


function tabsDid(dom, select, itemFun){
  let that = this
  const config = this.config
  that.items = []
  let menusBody = $(dom).find('.tabs-menu-body')
  menusBody.find('li').each(function(ii, item){
    that.items.push(item)
    if ($(item).hasClass('itemroot')) {
      item.itemroot = true
      if (config.fold) $(item).find('.itemCategory ul').addClass('none')
    }
    if (typeof itemFun == 'function') {
      itemFun.call(that, item, ii)
    }
  })
}


class App extends BaseClass {
  constructor(config) {
    super(config)
    this.change = function(){}
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
      this.actions.roll('APPEND_ITEM', item)
    }
  }

  select(page, dom, data){
    const config = this.config
    const index=page||0

    const _select = (page, dom, data) => {
      $(this.items).removeClass('selected')
      if (dom && $(dom).hasClass('itemroot')) {
        $(dom).find('.caption:first').toggleClass('fold')
        $(dom).find('ul:first').toggleClass('none')
      } else {
        this.change(page, dom, data)
        $(this.items[(index||0)]).addClass('selected')
        if (this.stat == 'finish' && config.globalName) {
          this.actions.roll('SELECT', {_index: index, data: data})
        }
      }
    }

    _select(page, dom, data)
  }
}

export function tabs(opts){
  var noop = false
  , dft = {
    data: [],
    select: 0,
    header: '',
    footer: '',
    treeHeader: '',
    treeFooter: '',
    container: '',
    globalName: _.uniqueId('Tabs_'),   // TabsModule
    theme: 'tabs', // = /css/m/tabs
    cls: 'tabsGroupX',
    tabClass: 'tabsGroupX',
    itemMethod: noop,
    listMethod: noop,
    tabsDidMethod: noop,
    mulitple: false,
    fold: true,
    evt: 'click'
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}

export function htabs(opts) {
  opts.cls = opts.cls || 'tabsGroupY'
  return tabs(opts)
}

export function pure(props, getreact){
  return tabs(props)
}
