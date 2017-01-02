import {objtypeof, inject} from 'libs'
import PopClass from 'component/class/poper'

inject().css([
  `/css/t/animate.css`
])
.css([ `
  .modal-bg{
    z-Index:10020;
    background-color:rgba(236, 247, 254, 0.7);
    position:fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }
  .modal-container{
    width: 70%;
    min-height: 200px;
    background-color:#fff;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 32px;
    border-radius: 6px;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    -webkit-background-clip: padding-box;
    -moz-background-clip: padding-box;
    background-clip: padding-box;
  }
  .modal-p30{
    width: 30%;
  }
  .modal-p40{
    width: 40%;
  }
  .modal-p50{
    width: 50%;
  }
  .modal-p90{
    width: 90%;
  }
  `
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
    
    let pWidth = ''
    if (stat && objtypeof(stat)=='object') {
      pWidth = stat.p30 || stat.p40 || stat.p50 || stat.p90
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
  var dft = {p30: 'modal-p30'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p40 = function(msg,stat,cb){
  var dft = {p40: 'modal-p40'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p50 = function(msg,stat,cb){
  var dft = {p50: 'modal-p50'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p90 = function(msg,stat,cb){
  var dft = {p90: 'modal-p90'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
