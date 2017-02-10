const noop = function(){}
const client = typeof window == 'undefined' ? false : true
let lazyLoad = noop,
isc = noop

if (client) {
  lazyLoad = require('./lazy')
  isc = require('iscroll/build/iscroll-probe')
}

function isPassive() {
  var supportsPassiveOption = false;
  try {
      addEventListener("test", null, Object.defineProperty({}, 'passive', {
          get: function () {
              supportsPassiveOption = true;
          }
      }));
  } catch(e) {}
}


function preLazy(dom, blks){
  let layzblocks = []
  let imgs = _.toArray($(dom).find('.lazyimg'))||[]
  let imgs2 = _.toArray($(dom).find('img'))||[]
  layzblocks = imgs.concat(imgs2)

  let blocks = blks||_.toArray($(dom).find('.lasyblock'))
  if (blocks && Array.isArray(blocks)) {
    layzblocks = layzblocks.concat(blocks)
  }
  lazyLoad(layzblocks, dom)
  return layzblocks
}

let oriPositionY = 0
let oriPositionX = 0
function getDiff(iscrl, opts){
  let direction
  if (!opts.direction || opts.direction == 'Y') {
    if (iscrl.y<oriPositionY) {
      direction = 'down'
    } else {
      direction = 'up'
    }
    oriPositionY = iscrl.y
    return [iscrl.y, direction]
  }
  if (opts.direction == 'X') {
    if (iscrl.x<oriPositionX) {
      direction = 'left'
    } else {
      direction = 'right'
    }
    oriPositionX = iscrl.x
    return [iscrl.x, direction]
  }
  else {
    return [iscrl.x, iscrl.y]
  }
}

function bindScrollAction(dom, ctx, funs, opts){
  const {onscroll, onscrollend, onpulldown} = funs
  const iscr = new isc(dom, opts)
  setTimeout(()=>{
    iscr.refresh()
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
      capture: false,
      passive: false
    } : false);

    if (typeof onscroll == 'function' || typeof onpulldown == 'function') {
      iscr.on('scroll', ()=>{
        // distY
        const diff = getDiff(iscr, opts)
        onscroll ? onscroll.apply(iscr, diff) : ''
        onpulldown ? onpulldown.apply(iscr, diff) : ''
      })
    }
    iscr.on('scrollEnd', ()=>{
      const diff = getDiff(iscr, opts)
      lazyLoad(this.layzblocks, dom)
      if (typeof onscrollend == 'function') {
        onscrollend.apply(iscr, diff)
        setTimeout(()=>{
          iscr.refresh()
        },300)
      }
    })
  }, 1300)
  return iscr
}

// scrollAndLazy
export default (ComposedComponent, options) => {
  if (!ComposedComponent) {
    console.log('请指定ComposedComponent');
    return
  }

  let dft = {
    mouseWheel:true,     // probeType: 3
    // momentum: false
  }
  const opts = _.merge(dft, (options||{}) )
  // dom
  if (typeof ComposedComponent == 'object' && ComposedComponent.nodeType) {
    const dom = ComposedComponent
    const blks = preLazy(dom)
    const ctx = {}
    const _ctx = {
      layzblocks: blks
    }
    const onscroll = opts.scroll
    const onscrollend = opts.scrollEnd
    const onpulldown = opts.pulldown

    return bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend, onpulldown}, opts)
  }

  // react element
  if (React.isValidElement(ComposedComponent)) {
    return class extends React.Component {
      constructor(props){
        super(props)
        this.iscroll
        this.state = {}
        preLazy = this::preLazy
      }
      componentWillUnmount(){
        this.iscroll ? this.iscroll.destroy() : ''
      }
      componentDidMount() {
        const dom = React.findDOMNode(this)
        const blks = preLazy(dom, this.props.blocks)
        const ctx = { }
        const _ctx = {
          layzblocks: blks
        }
        const onscroll = opts.scroll || this.props.onscroll
        const onscrollend = opts.scrollEnd || this.props.onscrollend
        const onpulldown = opts.pulldown || this.props.onpulldown

        this.iscroll = bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend, onpulldown}, opts)
        if (this.props.itemDefaultMethod) this.props.itemDefaultMethod(this)
      }
      render(){
        return ComposedComponent
      }
    }
  }

  // react class
  return class extends ComposedComponent {
    constructor(props) {
      super(props)
      this.iscroll
      preLazy = this::preLazy
      this.state.HOC ? this.state.HOC.push('scroll') : this.state.HOC = ['scroll']  //hightOrderComponent push self
    }

    componentDidMount() {
      const dom = React.findDOMNode(this)
      const blks = preLazy(dom, this.props.blocks)
      const ctx = { }
      const _ctx = {
        layzblocks: blks
      }
      const onscroll = opts.scroll || this.props.onscroll
      const onscrollend = opts.scrollEnd || this.props.onscrollend
      const onpulldown = opts.pulldown || this.props.onpulldown

      this.iscroll = bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend, onpulldown}, opts)
      super.componentDidMount ? super.componentDidMount() : ''
    }

    componentWillUnmount(){
      this.iscroll ? this.iscroll.destroy() : ''
      super.componentWillUnmount ? super.componentWillUnmount() : ''
    }
  }
}
