import Tree from 'component/util/tree'
import ListClass from 'component/class/list'

function select(idx, dom, data){
  const config = this.config
  idx = idx||0
  dom = dom || (this.items[idx]&&this.items[idx].dom)
  if (!dom) return

  this.items.forEach( item => {
    $(item.dom).removeClass('itemSelected')
    if (dom.itemroot) $(item.dom).removeClass('selected')
  })

  if (dom.itemroot) $(dom).addClass('selected')
  else {
    $(dom).addClass('itemSelected')
  }
}

class App extends ListClass {
  constructor(config) {
    super(config)
    this.group = []
    this._listMethod = this::this._listMethod
    this._itemMethod = this::this._itemMethod
  }

  _listMethod(dom, intent){
    this.aboutList = [dom, intent]
  }

  _itemMethod(dom, intent){
    this.group.push(dom)
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

      if (config.fold) {
        $(dom).find('.itemCategory > ul').addClass('disN')
      }

      this.group.forEach( (line, jj) => {
        let context = {
          config: config,
          parent: line,
          items: [],
          group: this.group
        }

        let ctx = {
          parent: line,
          select: context::select
        }

        $(line).find('li').each( (ii, item) => {
          if ($(item).hasClass('itemroot')) item.itemroot = 'true'
          context.items.push({
            index: ii,
            dom: item
          })
          if (typeof itemFun == 'function') itemFun.call(ctx, item, ii)
        })
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
      itemMethod={this._itemMethod}
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
}

export function filtrate(opts){
  var noop = false
  , dft = {
    data: [],
    select: 0,
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Trees_'),   // TabsModule
    theme: 'filtrate', // = /css/m/filtrate
    cls: '',
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
  return filtrate(opts)
}

export function pure(props){
  return filtrate(props)
}
