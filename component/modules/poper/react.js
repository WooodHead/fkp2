import { inject, msgtips } from 'libs'

class Slider {
  constructor(){
    let noop = function(){}
    this.def = {
      container: '',
      globalName: '',
      itemMethod: noop,
      listMethod: noop,
      itemClass: '',
      listClass: 'pagenation wid-12'

      // GENERAL
      mode: 'horizontal',
      slideSelector: '',
      infiniteLoop: true,
      hideControlOnEnd: false,
      speed: 500,
      easing: null,
      slideMargin: 0,
      startSlide: 0,
      randomStart: false,
      captions: false,
      ticker: false,
      tickerHover: false,
      adaptiveHeight: false,
      adaptiveHeightSpeed: 500,
      video: false,
      useCSS: true,
      preloadImages: 'visible',
      responsive: true,
      slideZIndex: 50,
      wrapperClass: 'bx-wrapper',

      // TOUCH
      touchEnabled: true,
      swipeThreshold: 50,
      oneToOneTouch: true,
      preventDefaultSwipeX: true,
      preventDefaultSwipeY: false,

      // ACCESSIBILITY
      ariaLive: true,
      ariaHidden: true,

      // KEYBOARD
      keyboardEnabled: false,

      // PAGER
      pager: true,
      pagerType: 'full',
      pagerShortSeparator: ' / ',
      pagerSelector: null,
      buildPager: null,
      pagerCustom: null,

      // CONTROLS
      controls: true,
      nextText: 'Next',
      prevText: 'Prev',
      nextSelector: null,
      prevSelector: null,
      autoControls: false,
      startText: 'Start',
      stopText: 'Stop',
      autoControlsCombine: false,
      autoControlsSelector: null,

      // AUTO
      auto: false,
      pause: 4000,
      autoStart: true,
      autoDirection: 'next',
      stopAutoOnClick: false,
      autoHover: false,
      autoDelay: 0,
      autoSlideForOnePage: false,

      // CAROUSEL
      minSlides: 1,
      maxSlides: 1,
      moveSlides: 0,
      slideWidth: 0,
      shrinkItems: false,
    }
    this.init = this.init.bind(this)
    this.pure = this.pure.bind(this)
    this.render = this.render.bind(this)
    this.itemDefaultMethod = this.itemDefaultMethod.bind(this)
  }

  init(data, opts){
    this.dft = _.extend(this.dft, opts)
    this.data = data
    this.RtElement = <Pagi data={this.data} begin={dft.begin} itemDefaultMethod={this.itemDefaultMethod} itemMethod={dft.itemMethod} listMethod={dft.listMethod} itemClass={dft.itemClass} listClass={dft.listClass}/>

    if this.dft.globalName{
      SAX.set(dft.globalName, { data: data })
    }
  }

  itemDefaultMethod(){
    console.log('======= xxx');
    console.log('======= xxx');
    console.log('======= xxx');
  }

  injectStatic(){
    inject().css(['/js/t/jq/bxslider/jquery.bxslider.css'])
    .js(['/js/t/jq/bxslider/plugin/jquery.easing.1.3.js'])
    .js(['/js/t/jq/bxslider/plugin/jquery.fitvids.js'])
    .js(['/js/t/jq/bxslider/jquery.bxslider.js'], () => {
      libs.msgtips('注入数据ok')
    })
  }

  pure(){
    return Pagi
  }

  render(){
    this.injectStatic()
    let dft = this.dft
    let RtElement = this.RtElement
    if (dft.container){
      let _container
      if (dft.container.nodeType) _container = dft.container
      else _container = document.getElementById(dft.container)
      React.render( RtElement, _container )
      return
    }
    return RtElement
  }
}



module.exports = slider
