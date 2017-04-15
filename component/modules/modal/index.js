import {objtypeof, inject} from 'libs'
import PopClass from 'component/class/poper'

inject().css([
  `/css/t/animate.css`
])

function DocmentView(){
  var doch = window.innerHeight||document.documentElement.offsetHeight||document.body.clientHieght;
  var docw = window.innerWidth||document.documentElement.offsetWidth||document.body.clientWidth;
  var docST = document.documentElement.scrollTop||document.body.scrollTop;
  var docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
  return {width:docw,height:doch,scrollTop:docST,scrollLeft:docSL};
}

class Modal extends PopClass {
  constructor(){
    super([...arguments])
  }

  msgItem(stat){
    var tip = document.createElement('div');
    tip.className = 'modal-item'
    tip.id = 'modal-item'
    return tip;
  }

  //消息实例容器，可定制
  msgBox(stat){
    let docRect = DocmentView();
    let scrollleft = docRect.scrollLeft;
    let scrolltop = docRect.scrollTop;
    let clientwidth = docRect.width;
    let clientheight = docRect.height;

    let pWidth = 'modal-p50'
    if (stat && objtypeof(stat)=='object') {
      // pWidth = stat.p30 || stat.p40 || stat.p50 || stat.p90
      pWidth = stat.pW || pWidth
    }
    var modal = '<div class="modal-bg" style="height:'+clientheight+'px;"><div class="modal-container '+pWidth+' fadeInDown animated-fastest" id="modal-container"></div></div>'
    $('#modal-container').length ? '' : $('body').append(modal);
    return [$('.modal-bg')[0], $('#modal-container')[0] ]
  }

  close(item, container, stat){
    $(container[1]).addClass('slideOutUp')
    setTimeout(()=>{
      $(container[0]).remove()
    },500)
  }

  // 执行动画
  anim(item, container, stat){
    container[1].appendChild(item);
    $(container[0]).click((e)=>{
      if (e.target.className == 'modal-bg') {
        this.close(item, container)
      } else {
        e.stopPropagation()
      }
    })
  }
}

var msgModalInstance
export default function modal(msg, stat, cb){
  if (msgModalInstance) {
    return msgModalInstance.run(msg, stat, cb)
  } else {
    msgModalInstance = new Modal()
    return msgModalInstance.run(msg, stat, cb)
  }
}

modal.p30 = function(msg,stat,cb){
  var dft = {pW: 'modal-p30'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p40 = function(msg,stat,cb){
  var dft = {pW: 'modal-p40'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p50 = function(msg,stat,cb){
  var dft = {pW: 'modal-p50'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p60 = function(msg,stat,cb){
  var dft = {pW: 'modal-p60'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p70 = function(msg,stat,cb){
  var dft = {pW: 'modal-p70'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p80 = function(msg,stat,cb){
  var dft = {pW: 'modal-p80'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p90 = function(msg,stat,cb){
  var dft = {pW: 'modal-p90'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
