import Tree from 'component/util/tree'
import ListClass from 'component/class/list'

class App extends ListClass {
  constructor(config) {
    super(config)
    this._listMethod = this::this._listMethod
  }

  _listMethod(dom, intent){
    this.aboutList = [dom, intent]
  }

  componentDid(){
    if (this.client) {
      const that = this
      const config = this.config
      const itemFun = config.itemMethod
      const listFun = config.listMethod
      const [dom, intent] = this.aboutList

      if (typeof listFun == 'function') {
        listFun(dom, intent)
      }

      that.items = []
      const context = {
        parent: dom,
        select: this.select,
        siblings: that.items
      }
      let menusBody = $(dom).find('.'+config.listClass)
      menusBody.find('li').each(function(ii, item){
        that.items.push(item)
        if ($(item).hasClass('itemroot')) {
          item.itemroot = 'true'
          if (config.fold) $(item).find('.itemCategory ul').addClass('none')
        }
        if (typeof itemFun == 'function') {
          itemFun.call(context, item, ii)
        }
      })
    }
  }

  componentWill(){
    const dft = this.config
    const cls = !dft.cls ? 'treeGroup' : 'treeGroup ' + dft.cls
    const List = this.createList(dft.globalName)
    // itemMethod={dft.itemMethod}
    const treeComponent = <List
      data={dft.data}
      itemClass={dft.itemClass}
      listClass={dft.listClass}
      header={dft.header}

      listMethod={this._listMethod} >
      {dft.footer}
    </List>

    this.eles = (
      <div className="treeContainer">
        <div className={cls}>
          {treeComponent}
        </div>
      </div>
    )
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

export function tree(opts){
  var noop = false
  , dft = {
    data: [],
    select: 0,
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Trees_'),   // TabsModule
    theme: 'tree', // = /css/m/tabs
    cls: 'treeGroupY',
    itemClass: 'tree-menu',
    listClass: 'tree-menu-body',
    itemMethod: noop,
    listMethod: noop,
    fold: true,
    evt: 'click'
  }
  dft = _.extend(dft, opts)
  dft.data = Tree(dft.data)
  return new App(dft)
}

export function htree(opts) {
  opts.cls = opts.cls || 'treeGroupX'
  return tree(opts)
}

export function pure(props){
  return tree(props)
}
