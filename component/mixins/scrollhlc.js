import {addEvent, rmvEvent, getOffset, DocmentView, scrollView} from 'libs'
import lazyLoad from './lazy'


// scrollAndLazy
export default (ComposedComponent) => {
  return class extends ComposedComponent {
    constructor(props) {
      super(props)
      this.scrollContainer = this.props.scrollContainer
      this._onScroll = this::this._onScroll
      this._onScrollEnd = this::this._onScrollEnd
      this.preLazy = this::this.preLazy
    }

    componentDidMount() {
      if (typeof this.scrollContainer == 'string') {
        const sc = this.scrollContainer
        this.scrollContainer = $(sc)[0]
      }
      if (this.scrollContainer){
        let _ref = this.scrollContainer
        this._scrollContainer = _ref
        if (_ref && typeof this._onScroll == 'function') {
          addEvent(_ref, 'scroll', this._onScroll, false)
        }
      } else {
        this._scrollContainer = window;
        if (typeof this._onScroll == 'function') addEvent(window, 'scroll', this._onScroll, false)
      }
      this.isScrolling = true;
      this.scrollTop = 0;
      this.preLazy();
    }

    componentWillUnmount(){
      if (this.scrollContainer && this.scrollContainer!==window){
        let _ref = this._scrollContainer
        if (_ref && typeof this._onScroll == 'function') rmvEvent(_ref,'scroll', this._onScroll, false);
      } else {
        if (typeof this._onScroll == 'function') rmvEvent(window,'scroll', this._onScroll, false);
      }
    }

    _onScroll(){
      this.scrollTop = scrollView(this._scrollContainer).top;
      // this.scrollTop = $(this._scrollContainer).scrollTop()
      if (typeof this.props.onscroll === 'function') {
        this.props.onscroll.call(this, this.scrollTop);
      }
      this._onScrollEnd()
    }

    _onScrollEnd(){
      var scrollTop =  scrollView(this._scrollContainer).top;
      if(scrollTop == this.scrollTop){
        let that = React.findDOMNode(this)
        , nDivHight  = getOffset(this._scrollContainer).height
        , nScrollHight = scrollView(this._scrollContainer).height
        , nScrollTop = scrollView(this._scrollContainer).top
        lazyLoad(this.layzblocks, this._scrollContainer)
        if( (nScrollTop + nDivHight) > (nScrollHight-300) && this.isScrolling){
          this.isScrolling = false
          if (typeof this.props.onscrollend === 'function') {
            this.props.onscrollend.call(that, scrollTop);
          }
          setTimeout(()=>{
            this.isScrolling = true
          },1000)
        }
      }
    }

    preLazy(){
      let that = React.findDOMNode(this)
      let imgs = _.toArray($(that).find('.lazyimg'))
      let imgs2 = _.toArray($(that).find('img'))
      this.imgs = imgs.concat(imgs2)

      let blocks = this.props.blocks||_.toArray($(that).find('.lasyblock'))
      if (blocks && Array.isArray(blocks)) this.blocks = blocks

      this.layzblocks = this.imgs.concat(this.blocks)
      lazyLoad(this.layzblocks, this._scrollContainer)
    }

  }
}
