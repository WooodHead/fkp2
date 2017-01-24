import { inject, msgtips, objtypeof } from 'libs'
import {Pure, BXSlider} from './_component/slider'

class _Sliderer {
  constructor(config){
    config.listClass = _.uniqueId('bs-slider-')
    this.dft = config

    this.data
    this.control
    const control = this.dft.control

    this.data = this.dft.data.map( (item, i) => <li key={"slider_"+i}>{item}</li> )
    if (control && Array.isArray(control) && control.length){
      this.dft.pagerCustom = `.${this.dft.listClass}-control`
      this.control = control.map( (item, i) => <li key={"slider_contorl_"+i}><a data-slide-index={i}>{item}</a></li>  )
    }

    this.render = this::this.render
    this.preRender = this::this.preRender
    this.itemDefaultMethod = this::this.itemDefaultMethod
  }

  inject(cb){
    inject().js(['/js/t/jq/bxslider/plugins/jquery.easing.1.3.js'])
    .js(['/js/t/jq/bxslider/plugins/jquery.fitvids.js'])
    .js(['/js/t/jq/bxslider/jquery.bxslider.js'], () => {
      if (typeof cb === 'function') cb()
    })
  }

  itemDefaultMethod(element, intent){
    let dft = this.dft
    this.inject(()=>{
      let bxslider = $(element).find('.'+this.dft.listClass).bxSlider(this.dft);
      if (typeof dft.callback == 'function') dft.callback(bxslider)
    })
  }

  preRender(){
    inject().css(['/js/t/jq/bxslider/jquery.bxslider.css'])
  }

  render(id){
    const dft = this.dft
    if (typeof id == 'function') {
      this.rendered = id
      id = undefined
    }
    let container = id || dft.container
    this.preRender()
    this.stat = 'done'

    this.eles = (
      <BXSlider
        data={this.data}
        control={this.control}
        itemDefaultMethod={this.itemDefaultMethod}
        itemMethod={dft.itemMethod}
        listMethod={dft.listMethod}
        itemClass={dft.itemClass}
        listClass={dft.listClass}
      />
    )

    if (!container) {
      return this.eles
    }

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      React.render( this.eles, container )
    }

    return this
  }

  // render(){
  //   this.preRender()
  //   let dft = this.dft
  //   let RtElement = (
  //     <Slider
  //       data={this.data}
  //       control={this.control}
  //       itemDefaultMethod={this.itemDefaultMethod}
  //       itemMethod={dft.itemMethod}
  //       listMethod={dft.listMethod}
  //       itemClass={dft.itemClass}
  //       listClass={dft.listClass} />
  //   )
  //   if (dft.container){
  //     let _container
  //     _container = dft.container.nodeType ? dft.container : document.getElementById(dft.container)
  //     React.render( RtElement, _container )
  //     return
  //   }
  //   return RtElement
  // }
}

export function Slider(opts){
// function Sliderer(data, control, options){
  let dft = {
    data: [],
    control: [],
    container: '',
    globalName: '',
    itemMethod: '',
    listMethod: '',
    itemClass: '',
    listClass: '',
    callback: '',

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
  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return new _Sliderer(dft)
}

export function pure(props){
  return Slider(props)
}
