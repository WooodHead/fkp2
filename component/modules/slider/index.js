import { inject, objtypeof } from 'libs'
import {BXSlider} from './_component/slider'
import Base from 'component/class/base'

let bsCount = 0

function itemDefaultMethod(element, intent){
  let dft = this.config
  this.operate = {
    element: element,
    intent: intent
  }
  this.ij
  .css('/js/t/jq/bxslider/jquery.bxslider.css')
  .js('/js/t/jq/bxslider/plugins/jquery.easing.1.3.js')
  .js('/js/t/jq/bxslider/plugins/jquery.fitvids.js')
  .js('/js/t/jq/bxslider/jquery.bxslider.js', () => {
    setTimeout(()=>{
      let bxslider = $(element).find('.'+dft.listClass).bxSlider(dft);
      if (typeof dft.callback == 'function') dft.callback(bxslider)
    }, 100)
  })
}

class _Sliderer extends Base {
  constructor(config){
    config.listClass = `bs-slider-${bsCount}`
    super(config)
    this.ij = this.inject()
    itemDefaultMethod = this::itemDefaultMethod
    bsCount++
  }

  componentDid(){
    // const dft = this.config
  }

  componentWill(){
    const dft = this.config
    const data = dft.data.map( (item, i) => <li key={"slider_"+i}>{item}</li> )
    const control = dft.control.map( (item, i) => <li key={"slider_contorl_"+i}><a data-slide-index={i}>{item}</a></li>  )
    this.eles = <BXSlider
      data={data}
      control={control}
      itemDefaultMethod={itemDefaultMethod}
      itemMethod={dft.itemMethod}
      listMethod={dft.listMethod}
      itemClass={dft.itemClass}
      listClass={dft.listClass}
    />
  }
}

export function Slider(opts){
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
