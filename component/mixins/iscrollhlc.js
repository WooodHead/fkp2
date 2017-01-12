import lazyLoad from './lazy'
import isc from 'iscroll/build/iscroll-probe'

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

function bindScrollAction(dom, ctx, funs, opts){
  const {onscroll, onscrollend} = funs

  setTimeout(()=>{
    const iscr = new isc(dom, opts)
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
      capture: false,
      passive: false
    } : false);

    if (typeof onscroll == 'function') {
      iscr.on('scroll', ()=>{
        onscroll.call(ctx, iscr.x, iscr.y)
      })
    }
    iscr.on('scrollEnd', ()=>{
      lazyLoad(this.layzblocks, dom)
      if (typeof onscrollend == 'function') {
        onscrollend.call(ctx, iscr.x, iscr.y)
      }
    })
    return iscr
  }, 1300)

}

// scrollAndLazy
export default (ComposedComponent, options) => {
  if (!ComposedComponent) {
    console.log('请指定ComposedComponent');
    return
  }

  let dft = {
    mouseWheel:true,     // probeType: 3
  }
  const opts = _.merge(dft, (options||{}) )

  if (typeof ComposedComponent == 'object' && ComposedComponent.nodeType) {
    const dom = ComposedComponent
    const blks = preLazy(dom)
    const ctx = {}
    const _ctx = {
      layzblocks: blks
    }
    const onscroll = opts.scroll
    const onscrollend = opts.scrollEnd

    return bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend}, opts)
  }

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

        this.iscroll = bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend}, opts)
        // super.componentDidMount ? super.componentDidMount() : ''
      }
      render(){
        return ComposedComponent
      }
    }
  }


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

      this.iscroll = bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend}, opts)
      super.componentDidMount ? super.componentDidMount() : ''
    }

    componentWillUnmount(){
      this.iscroll ? this.iscroll.destroy() : ''
    }
  }
}
