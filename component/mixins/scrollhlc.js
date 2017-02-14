import {addEvent, rmvEvent, getOffset, DocmentView, scrollView} from 'libs'
const noop = function(){}
const client = typeof window == 'undefined' ? false : true
let lazyLoad = noop
if (client) {
  lazyLoad = require('./lazy')
}

let scrollState = {
  scrollTop: 0,
  start: false,
  isScrolling: true,
  directionY: ''
}

let control = false

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

function _onscroll(ctx, container, funs, opts){
  return function(){
    if (!scrollState.start) {
      scrollState.start = scrollView(container).top;
    }
    scrollState.scrollTop = scrollView(container).top
    if (typeof funs.onscroll == 'function') {
      scrollState.directionY = (scrollState.scrollTop - scrollState.start) > 0 ? 'down' : 'up'
      funs.onscroll(ctx.dom, scrollState);
    }
    clearTimeout(control)
    _onscrollEnd(ctx, container, funs, opts)
  }
}

function _onscrollEnd(ctx, container, funs, opts){
  var scrollTop =  scrollView(container).top;
  function delayEnd(){
    scrollState.start = scrollTop
    if(scrollTop !== scrollState.start){
      const nDivHight  = getOffset(container).height
      , nScrollHight = scrollView(container).height
      , nScrollTop = scrollView(container).top

      control = setTimeout(function(){
        lazyLoad(ctx.layzblocks, container)
      }, 1200)

      if( (nScrollTop + nDivHight) > (nScrollHight-300) && scrollState.isScrolling){
        scrollState.isScrolling = false
        if (typeof funs.onscrollend == 'function') {
          funs.onscrollend(ctx.dom, scrollState);
        }
        setTimeout(()=>{
          scrollState.isScrolling = true
        },1000)
      }
    }
  }

  setTimeout(delayEnd, 300)
}

function bindScrollAction(container, ctx, funs, opts){
  const {onscroll, onscrollend} = funs
  if (!container) return
  if (typeof container == 'string') container = document.getElementById(container)
  if (container == window || (typeof container == 'object' && container.nodeType))
    addEvent(container, 'scroll', _onscroll(ctx, container, funs, opts), false)
}

function unBindScrollAction(container){
  if (!container) return
  if (typeof container == 'string') container = document.getElementById(container)
  if (container == window || (typeof container == 'object' && container.nodeType))
    rmvEvent(container, 'scroll', _onscroll, false);
}

// scrollAndLazy
export default (ComposedComponent, opts) => {
  if (!ComposedComponent) {
    console.log('请指定ComposedComponent');
    return
  }

  if (typeof ComposedComponent == 'object' && ComposedComponent.nodeType) {

    const dom = ComposedComponent
    const blks = preLazy(dom)
    const _ctx = {
      layzblocks: blks,
      dom: ComposedComponent
    }

    const funs = {
      onscroll: (opts&&opts.scroll),
      onscrollend: (opts&&opts.scrollEnd)
    }

    const scrollContainer = opts && opts.scrollContainer

    return bindScrollAction(scrollContainer, _ctx, funs, opts)
  }


  // react element
  if (React.isValidElement(ComposedComponent)) {
    return class extends React.Component {
      constructor(props){
        super(props)
        this.state = {}
      }
      componentWillUnmount(){
        unBindScrollAction((opts&&opts.scrollContainer) || this.props.scrollContainer)
      }
      componentDidMount() {
        const dom = React.findDOMNode(this)
        const blks = preLazy(dom, this.props.blocks)
        const ctx = { }
        const _ctx = {
          layzblocks: blks,
          dom: dom
        }

        const scrollContainer = (opts&&opts.scrollContainer) || this.props.scrollContainer

        const funs = {
          onscroll: (opts&&opts.scroll || this.props.onscroll),
          onscrollend: (opts&&opts.scrollEnd || this.props.onscrollend)
        }

        bindScrollAction(scrollContainer, _ctx, funs, opts)

        // this.iscroll = bindScrollAction.call(_ctx, dom, ctx, {onscroll, onscrollend, onpulldown}, opts)
        // if (this.props.itemDefaultMethod) this.props.itemDefaultMethod(this)
      }
      render(){
        return ComposedComponent
      }
    }
  }


  return class extends ComposedComponent {
    constructor(props) {
      super(props)
      this.scrollContainer = this.props.scrollContainer
      this._onScroll = this::this._onScroll
      this._onScrollEnd = this::this._onScrollEnd
      // this.preLazy = this::this.preLazy
      // preLazy = this::preLazy
      this.state.HOC.push('scroll')  //hightOrderComponent push self
    }

    componentDidMount() {
      const dom = React.findDOMNode(this)
      const blks = preLazy(dom, this.props.blocks)
      const _ctx = {
        layzblocks: blks,
        dom: dom
      }

      const funs = {
        onscroll: (opts&&opts.scroll || this.props.onscroll),
        onscrollend: (opts&&opts.scrollEnd || this.props.onscrollend)
      }

      if (typeof this.scrollContainer == 'string') {
        const sc = this.scrollContainer
        this.scrollContainer = $(sc)[0]
      }
      if (this.scrollContainer){
        let _ref = this.scrollContainer
        this._scrollContainer = _ref
      } else {
        this._scrollContainer = window;
      }
      bindScrollAction(this._scrollContainer, _ctx, funs, opts)
      // this.isScrolling = true;
      // this.scrollTop = 0;
      // this.preLazy();
    }

    componentWillUnmount(){
      unBindScrollAction(this._scrollContainer)

      // if (this.scrollContainer && this.scrollContainer!==window){
      //   let _ref = this._scrollContainer
      //   if (_ref && typeof this._onScroll == 'function') rmvEvent(_ref,'scroll', this._onScroll, false);
      // } else {
      //   if (typeof this._onScroll == 'function') rmvEvent(window,'scroll', this._onScroll, false);
      // }
    }

    // _onScroll(){
    //   this.scrollTop = scrollView(this._scrollContainer).top;
    //   if (typeof this.props.onscroll === 'function') {
    //     this.props.onscroll.call(this, this.scrollTop);
    //   }
    //   this._onScrollEnd()
    // }

    // _onScrollEnd(){
    //   var scrollTop =  scrollView(this._scrollContainer).top;
    //   if(scrollTop == this.scrollTop){
    //     let that = React.findDOMNode(this)
    //     , nDivHight  = getOffset(this._scrollContainer).height
    //     , nScrollHight = scrollView(this._scrollContainer).height
    //     , nScrollTop = scrollView(this._scrollContainer).top
    //     lazyLoad(this.layzblocks, this._scrollContainer)
    //     if( (nScrollTop + nDivHight) > (nScrollHight-300) && this.isScrolling){
    //       this.isScrolling = false
    //       if (typeof this.props.onscrollend === 'function') {
    //         this.props.onscrollend.call(that, scrollTop);
    //       }
    //       setTimeout(()=>{
    //         this.isScrolling = true
    //       },1000)
    //     }
    //   }
    // }
    //
    // preLazy(){
    //   let that = React.findDOMNode(this)
    //   let imgs = _.toArray($(that).find('.lazyimg'))
    //   let imgs2 = _.toArray($(that).find('img'))
    //   this.imgs = imgs.concat(imgs2)
    //
    //   let blocks = this.props.blocks||_.toArray($(that).find('.lasyblock'))
    //   if (blocks && Array.isArray(blocks)) this.blocks = blocks
    //
    //   this.layzblocks = this.imgs.concat(this.blocks)
    //   lazyLoad(this.layzblocks, this._scrollContainer)
    // }

  }
}
