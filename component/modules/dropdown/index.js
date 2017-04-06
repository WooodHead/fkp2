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
    },
    refresh: function(){
      /*
        ..... do something
      */
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
        // itemFun.call(item, _ctx)
        itemFun.call(_ctx, item)
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

  componentDid(){ }

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
        listMethod={dft.listMethod}
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
  try {
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
  } catch (error) {
    // console.log(error);
  }

}

export function hdropdown(opts) {
  opts.cls = opts.cls || 'dropdownGroupX'
  return dropdown(opts)
}

export function pure(props){
  return dropdown(props)
}
