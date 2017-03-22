import Tree from 'component/util/tree'
import ListClass from 'component/class/list'

function _lMethod(ctx){
  return function(dom, intent){
    ctx.aboutList = [dom, intent]
  }
}

let index = 0
function itdMethod(ctx){
  let items = ctx.items
  const itemFun = ctx.config.itemMethod

  const _ctx = {
    select: ctx.rootdom,
    toggle: function(){
      $(ctx.rootdom).toggleClass('selected')
    },
    text: function(val){
      if (!val) return ctx.captiondom.innerHTML
      ctx.captiondom.innerHTML = val
    },
    value: function(val){
      ctx.value = val
    }
  }

  return function(dom, intent) {
    dom.firstroot = true
    dom.itemroot = true
    ctx.rootdom = dom
    _ctx.select = dom
    ctx.captiondom = $(dom).find('.caption')[0]
    $(dom).off('click').on('click', function(e){
      $(this).toggleClass('selected')
    })
    $(dom).find('li').each( (ii, item) => {
      if ($(item).hasClass('itemroot')) {
        item.itemroot = true
      }
      ctx.items.push(item)
      if (typeof itemFun == 'function') {
        itemFun.call(item, _ctx)
      }
    })
  }
}

class App extends ListClass {
  constructor(config) {
    super(config)
    this.items = []
    this.rootdom = ''
    this.captiondom = ''
    this.value = ''
  }

  componentDid(){
    // if (this.client) {
    //   const that = this
    //   const config = this.config
    //   const itemFun = config.itemMethod
    //   const listFun = config.listMethod
    //   const [dom, intent] = this.aboutList
    //   if (typeof listFun == 'function') {
    //     listFun(dom, intent)
    //   }
    //
    //   that.items = []
    //   let menusBody = $(dom).find('.'+config.listClass)
    //   menusBody.find('li').each(function(ii, item){
    //     if ($(item).hasClass('itemroot')) {
    //       item.itemroot = true
    //       if (ii == 0) {
    //         item.firstroot = true
    //         that.rootdom = item
    //         that.captiondom = $(item).find('.caption')[0]
    //       }
    //       if (config.fold) $(item).find('.itemCategory ul').addClass('none')
    //     }
    //     that.items.push(item)
    //   })
    //
    //   const ctx = {
    //     select: that.rootdom,
    //     text: function(val){
    //       if (!val) return that.captiondom.innerHTML
    //       that.captiondom.innerHTML = val
    //     },
    //     value: function(val){
    //       that.value = val
    //     }
    //   }
    //
    //   that.items.forEach( (item, ii) => {
    //     if (item.firstroot) {
    //       $(item)off('click').on('click', function(e){
    //         $(this).toggleClass('selected')
    //       })
    //     }
    //     if (typeof itemFun == 'function') {
    //       itemFun.call(item, ctx)
    //     }
    //   })
    // }
  }

  componentWill(){
    const dft = this.config
    const cls = !dft.cls ? 'dropdownGroup' : 'dropdownGroup  ' + dft.cls
    const List = this.createList(dft.globalName)
    const dropdownComponent =
    (
      <List
        data={dft.data}
        itemClass={dft.itemClass}
        listClass={dft.listClass}
        header={dft.header}
        itemMethod={itdMethod(this)}
      >
        {dft.footer}
      </List>
    )
    this.eles = dropdownComponent
  }

  select(page, dom, data){
    const config = this.config
    const index=page||0
    dom = dom || this.items[index]

    const _select = (page, dom, data) => {
      $(this.items).removeClass('selected')
      if (dom && $(dom).hasClass('itemroot')) {
        $(dom).find('.caption:first').toggleClass('fold')
        $(dom).find('ul:first').toggleClass('none')
      } else {
        $(dom).addClass('selected')
      }
    }

    _select(page, dom, data)
  }
}

export function dropdown(opts){
  var noop = false
  , dft = {
    data: [],
    select: 0,
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Dropdowns_'),   // TabsModule
    theme: 'dd', // = /css/m/tabs
    cls: 'dropdownGroupY',
    itemClass: 'dropdown-menu',
    listClass: 'dropdown-menu-body',
    itemMethod: noop,
    listMethod: noop,
    fold: true,
    evt: 'click',
    placeholder: ''
  }
  dft = _.extend(dft, opts)

  dft.data.forEach( item => {
    item.parent = 'top'
  })

  let firstText
  let defaultTitile = dft.data[dft.select]['title']
  if (dft.placeholder) defaultTitile = dft.placeholder
  if (typeof defaultTitile == 'string' || typeof defaultTitile == 'number') {
    firstText = <span className="caption">{defaultTitile}<i></i></span>
  } else {
    firstText = defaultTitile
  }

  dft.data.unshift({title: firstText, idf: 'top'})
  dft.data = Tree(dft.data)
  return new App(dft)
}

export function hdropdown(opts) {
  opts.cls = opts.cls || 'dropdownGroupX'
  return dropdown(opts)
}

export function pure(props){
  return dropdown(props)
}
