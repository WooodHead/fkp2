import {objtypeof, inject} from 'libs'
import PopClass from 'component/class/poper'

inject()
.css('/css/t/animate.css')

function DocmentView(){
  var doch = window.innerHeight||document.documentElement.offsetHeight||document.body.clientHieght;
  var docw = window.innerWidth||document.documentElement.offsetWidth||document.body.clientWidth;
  var docST = document.documentElement.scrollTop||document.body.scrollTop;
  var docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
  return {width:docw,height:doch,scrollTop:docST,scrollLeft:docSL};
}

let uuid = 0
class Sticky extends PopClass {
  constructor(opts){
    super([...arguments])
    this.opts = opts
    this.visible = false
    this.hide = this::this.hide
    this.show = this::this.show
    this.uuid = 'sticky-container-' + (++uuid)

    if (opts.autoinject) {
      inject().css('/css/m/sticky')
    }
  }

  msgItem(stat){
    var tip = document.createElement('div');
    tip.className = 'sticky-item'
    tip.id = 'sticky-item'
    return tip;
  }

  //消息实例容器，可定制
  msgBox(stat){
    let pos = 'fadeInDown'
    if (stat && objtypeof(stat)=='object') {
      pos = stat.pos
    }
    var dom = '<div class="sticky-container '+pos+' animated-faster" id="'+this.uuid+'"></div>'
    return $('#'+this.uuid).length ? $('#'+this.uuid)[0] : $(dom)[0]
  }

  hide(){
    if (!this.visible) return
    this.visible = false
    const container = this.box
    switch (this.type) {
      case 'left':
        container.className = 'container-none fadeOutLeft animated'
        break;
      case 'right':
        container.className = 'container-none fadeOutRight animated'
        break;
      case 'bottom':
        container.className = 'container-none fadeOutDown animated'
        break;
      default:
        container.className = 'container-none fadeOutTop animated'
    }
  }

  show(){
    if (this.visible) return
    this.visible = true
    const container = this.box
    switch (this.type) {
      case 'left':
        container.className = 'sticky-container sticky-left fadeInLeft animated-faster'
        break;
      case 'right':
        container.className = 'sticky-container sticky-right fadeInRight animated-faster'
        break;
      case 'bottom':
        container.className = 'sticky-container sticky-bottom fadeInUp animated-faster'
        break;
      default:
        container.className = 'sticky-container fadeInDown animated-faster'
    }
  }

  close(){
    const container = this.box
    this.hide()
    setTimeout(()=>{
      $(container).remove()
    },2000)
  }

  // 执行动画
  anim(item, container, stat){
    this.visible = true
    container.appendChild(item)
    if (stat && stat.delay) {
      if (objtypeof(stat.delay) == 'number') {
        setTimeout(()=>{
          $('body').append(container)
        }, stat.delay)
      }
    } else {
      $('body').append(container)
    }
  }
}

var msgStickyInstance
export default function sticky(msg, opts, cb){
  const dft = {
    autoinject: true
  }
  opts = _.extend(dft, opts)
  msgStickyInstance = new Sticky(opts)
  msgStickyInstance.type = opts ? opts.type : ''
  return msgStickyInstance.run(msg, opts, cb)
}

sticky.left = function(msg,stat,cb){
  var dft = {pos: 'sticky-left fadeInLeft', type: 'left'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  return sticky(msg,dft,cb)
}

sticky.right = function(msg,stat,cb){
  var dft = {pos: 'sticky-right fadeInRight', type: 'right'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  return sticky(msg,dft,cb)
}
sticky.bottom = function(msg,stat,cb){
  var dft = {pos: 'sticky-bottom fadeInUp', type: 'bottom'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  return sticky(msg,dft,cb)
}
