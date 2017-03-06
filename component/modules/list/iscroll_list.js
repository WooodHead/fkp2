/**
 * 列表
 */
import {objtypeof} from 'libs'
import iscrollHlc from 'component/mixins/iscrollhlc'
import ListClass from 'component/class/list'

let isCount = 0
function injectStatic(type, ij, dft){
  if (!this.client) return
  const len = dft.data.length

  let orientation;
  let scrollerWidth;
  let liStyle = `display: block;`
  const parent = dft.scrollClass+'-root'
  const scrollClass = dft.scrollClass+'-parent'

  if (type == 'X') {
    orientation = `
      height: 100%;
      white-space:nowrap;
    `
    liStyle = `
      display: inline-block;
      width: 2em;
      height: 2em;
      line-height: 2em;
      text-align: center;
    `
  }
  if (type == 'Y') {
    const scrollMargin = dft.scrollEnd ? '10em' : '0'
    orientation = `
      width: 100%;
    `
  }
  if (type == 'FREE') {
    orientation = `
      width: auto;
      height: auto;
    `
  }

  ij.css(`
    /* === component/list/iscroll_list === */
    .${parent}{
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      z-index: 11
    }
    .${parent} .${scrollClass}{
      position: absolute;
      ${orientation}
    }
    .${scrollClass} li{
      ${liStyle}
    }
  `)
}

class App extends ListClass {
  constructor(config) {
    super(config)
    isCount++
    this.ij = this.inject()
    injectStatic = this::injectStatic

    const dft = this.config
    let direction = 'Y'
    dft.iscroll.direction = 'Y'
    if (dft.iscroll.scrollX && !dft.iscroll.scrollY){
      dft.iscroll.direction = 'X'
      direction = 'X'
    } else
    if (dft.iscroll.scrollX && dft.iscroll.scrollY) {
      dft.iscroll.direction = 'FREE'
      direction = 'FREE'
    }

    dft.scrollClass = `for-iscroll-${direction}`
    if (!dft.listClass) dft.listClass = dft.scrollClass
    else {
      dft.listClass += ` ${dft.scrollClass}`
    }

    dft.wrapClass = dft.scrollClass+'-root'
    if (direction == 'X') {
      injectStatic('X', this.ij, dft)
    } else
    if (direction == 'FREE') {
      injectStatic('FREE', this.ij, dft)
    } else {
      injectStatic('Y', this.ij, dft)
    }

    this.itemDefaultMethod = this::this.itemDefaultMethod
  }

  itemDefaultMethod(ctx){
    this.iscroll = ctx.iscroll
  }

  componentWill(){
    const dft = this.config
    const BaseList = this.createList(dft.globalName) //, dft.iscroll )  // = this.createList(this.config.globalName)
    const Eles = iscrollHlc(
      <div className={dft.wrapClass}>
        <BaseList
          data={dft.data}
          itemClass={dft.itemClass}
          listClass={dft.listClass||'for-iscroll'}
          header={dft.header}
          listMethod={dft.listMethod}
          itemMethod={dft.itemMethod}
        >
          {dft.footer ? dft.footer : ''}
        </BaseList>
      </div>,
      dft.iscroll
    )
    this.eles = <Eles
      itemDefaultMethod={this.itemDefaultMethod}
      onpulldown={dft.pulldown}
      onscroll={dft.scroll}
      onscrollend={dft.scrollEnd}
    />
  }
}

export function IScrollList(opts){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    theme: '',    //list-lagou.css
    globalName: _.uniqueId('IscrollList_'),
    itemMethod: noop,
    listMethod: noop,
    itemClass: '',
    listClass: '',
    pulldown: '',
    scroll: '',
    scrollEnd: '',
    iscroll: {
      // preventDefault: false
    }
  }
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  if (dft.scroll) {
    dft.iscroll.probeType = 3
  }
  return new App(dft)
}

export function pure(props){
  return IScrollList(props)
}
