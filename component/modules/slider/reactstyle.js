import { inject, msgtips, objtypeof } from 'libs'
import {Pure, Slider} from './_component/slider'

class _Sliderer {
  constructor(data, control, opts){
    this.dft = {
      container: '',
      globalName: '',
      itemMethod: undefined,
      listMethod: undefined,
      itemClass: '',
      listClass: _.uniqueId('bxslider-'),
      callback: undefined,

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

    if (objtypeof(control)=='object') {
      opts = control
      control = undefined
    }

    this.data = undefined
    this.control = undefined
    this.dft = _.extend(this.dft, opts)
    if (!Array.isArray(data)) {
      console.error("slider component error: param data must be Array")
      return
    }

    if (Array.isArray(control)) this.control = control
    this.data = data.map( (item, i) => <li key={"slider_"+i}>{item}</li> )
    if (control && Array.isArray(control)){
      this.dft.pagerCustom = '.'+this.dft.listClass+'-control'
      this.control = control.map( (item, i) => <li key={"slider_contorl_"+i}><a data-slide-index={i}>{item}</a></li>  )
    }

    if (this.dft.globalName){
      SAX.set(dft.globalName, { data: data })
    }

    this.render = this.render.bind(this)
    this.itemDefaultMethod = this.itemDefaultMethod.bind(this)
  }

  injectStatic(cb){
    inject().js(['/js/t/jq/bxslider/plugins/jquery.easing.1.3.js'])
    .js(['/js/t/jq/bxslider/plugins/jquery.fitvids.js'])
    .js(['/js/t/jq/bxslider/jquery.bxslider.js'], () => {
      if (typeof cb === 'function') cb()
    })
  }

  itemDefaultMethod(element, intent){
    let dft = this.dft
    this.injectStatic(()=>{
      let bxslider = $(element).find('.'+this.dft.listClass).bxSlider(this.dft);
      if (typeof dft.callback == 'function') dft.callback(bxslider)
    })
  }

  preRender(){
    inject().css(['/js/t/jq/bxslider/jquery.bxslider.css'])
  }

  render(){
    this.preRender()
    let dft = this.dft
    let RtElement = (
      <Slider
        data={this.data}
        control={this.control}
        itemDefaultMethod={this.itemDefaultMethod}
        itemMethod={dft.itemMethod}
        listMethod={dft.listMethod}
        itemClass={dft.itemClass}
        listClass={dft.listClass}
      />
    )
    if (dft.container){
      let _container
      _container = dft.container.nodeType ? dft.container : document.getElementById(dft.container)
      React.render( RtElement, _container )
      return
    }
    return RtElement
  }
}

function Sliderer(data, control, options){
  return new _Sliderer(data, control, options).render()
}

module.exports = {
  Pure: Pure,
  Slider: Sliderer
}
