import {addEvent, rmvEvent, getOffset, DocmentView, scrollView} from 'libs'

// scrollAndLazy
export default (ComposedComponent) => {
  return class extends ComposedComponent {
    constructor(props) {
      super(props)
      this.scrollContainer = this.props.scrollContainer
      this._onScroll = this::this._onScroll
      this._onScrollEnd = this::this._onScrollEnd
      this.preLazy = this::this.preLazy
      this.lazyLoad = this::this.lazyLoad
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
      // this.scrollTop = scrollView(this._scrollContainer).top;
      this.scrollTop = $(this._scrollContainer).scrollTop()
      window.clearTimeout(this.ttt);
      if (typeof this.props.onscroll === 'function') {
        this.props.onscroll.call(this, this.scrollTop);
      }
      this._onScrollEnd()
    }

    _onScrollEnd(){
      var scrollTop =  scrollView(this._scrollContainer).top;
      var ttt
      if(scrollTop == this.scrollTop){
        let that = React.findDOMNode(this)
        , nDivHight  = getOffset(this._scrollContainer).height
        , nScrollHight = scrollView(this._scrollContainer).height
        , nScrollTop = scrollView(this._scrollContainer).top
        if( (nScrollTop + nDivHight) > (nScrollHight-300) && this.isScrolling){
          clearTimeout(ttt)
          this.isScrolling = false
          if (typeof this.props.onscrollend === 'function') {
            this.props.onscrollend.call(that, scrollTop);
          }
          this.lazyLoad()
          ttt = setTimeout(()=>{
            this.isScrolling = true
          },1000)
        }
      }
    }

    preLazy(){
      let that = React.findDOMNode(this)
      let imgs = _.toArray($('.lazyimg'))
      let imgs2 = _.toArray($('img'))
      this.imgs = imgs.concat(imgs2)

      let blocks = this.props.blocks||_.toArray($('.lasyblock'))
      if (blocks && Array.isArray(blocks)) this.blocks = blocks

      this.elements = this.imgs.concat(this.blocks)
      this.lazyLoad()
    }

    lazyLoad(elements, datas){
      if (!elements) elements = this.elements
      var that = this
      , holder = React.findDOMNode(this)
      , visibles = []

      var settings = {
        threshold       : 2000,
        failure_limit   : 0,
        event           : "scroll",
        effect          : "show",
        container       : this._scrollContainer,
        data_attribute  : "original",
        skip_invisible  : true,
        appear          : null,
        load            : null,
        error           : null,
        complete        : null,
        placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
      };

      function update() {
        let counter = 0;
        elements.map( (element, i) => {
          // 可见区域内
          if (inviewport(element, settings)){
            if(element.getAttribute('data-src')){
              let _src = element.getAttribute('data-src')
              if (element.nodeName === 'IMG'){
                element.src = _src;
              } else{
                ajax.get(_src, function(data){
                  element.innerHTML(data)
                })
              }
            }
            if(element.getAttribute('data-imgsrc') && element.nodeName != 'IMG'){
              let _src = element.getAttribute('data-imgsrc')
              $(element).append('<img src="'+_src+'" />')
            }
          }

          // 不可见区域
          else {
            if (element.getAttribute('data-imgsrc') && element.nodeName != 'IMG' ){
              $(element).find('img').remove()
            }
            if (element.nodeName==='IMG'){
              $(element).parent().attr('data-imgsrc', element.src)
              $(element).remove()
            }
          }
        })
      }

      function belowthefold(element, settings) {
        var fold;
        if (!settings.container || settings.container == window) {
          fold = DocmentView().height + DocmentView().top;
        } else {
          fold = getOffset(settings.container).bottom;
        }
        return fold <= getOffset(element).top - settings.threshold;
      };

      function rightoffold (element, settings) {
        var fold
        if (!settings.container || settings.container == window) {
          fold = DocmentView().width + DocmentView().left;
        } else {
          fold = getOffset(settings.container).left + getOffset(settings.container).width;
        }
        return fold <= getOffset(element).left - settings.threshold;
      };

      function abovethetop (element, settings) {
        var fold;
        if (!settings.container || settings.container == window) {
          fold = DocmentView().top;
        } else {
          fold = getOffset(settings.container).top;
        }
        return fold >= getOffset(element).top + settings.threshold  + getOffset(element).height;
      }

      function leftofbegin(element, settings) {
        var fold;
        if (!settings.container || settings.container == window) {
          fold = DocmentView().left;
        } else {
          fold = getOffset(settings.container).left;
        }
        return fold >= getOffset(element).left + settings.threshold + getOffset(element).width;
      }

      function inviewport (element, settings) {
        return !rightoffold(element, settings) && !leftofbegin(element, settings) &&
          !belowthefold(element, settings) && !abovethetop(element, settings);
      }

      update()
    }
  }
}
