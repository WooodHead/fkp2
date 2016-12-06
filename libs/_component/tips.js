import {objtype as objtypeof} from './base'
import {inject, addEvent} from './doc'

function DocmentView(){
  var doch = window.innerHeight||document.documentElement.offsetHeight||document.body.clientHieght;
  var docw = window.innerWidth||document.documentElement.offsetWidth||document.body.clientWidth;
  var docST = document.documentElement.scrollTop||document.body.scrollTop;
  var docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
  return {width:docw,height:doch,scrollTop:docST,scrollLeft:docSL};
};

inject().css([
  `/css/t/animate.css`
])
.css([
  ` .tips-container{
    z-Index:10030;
    width:230px;
    position:fixed;
    bottom: 16px;
    right: 32px;
  }
  .tips-item{
    padding: 8px;
    border-radius: 5px;
    width:100%;
    margin-top:10px;
    color:#fff;
    line-height:1.5;
    font-size:16px;
  }

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

/*
* 消息弹出抽象函数
* 实例实现 tipsItem / tipsBox / anim
*/
var tipsbox = function(){
  this.pop = function(mmm,stat,cb){
    if(!stat)stat='normal';
    pushmsg.call(this,mmm,stat);
    if(typeof cb=='function') cb()
  }

  //新建消息实例，可定制
  this.msgItem = function(stat){};

  //消息实例容器，可定制
  this.msgBox = function(stat){};

  //退出消息框
  this.close = function(){};

  //消息动画 实例化后必须定制
  this.anim = function(item,container){ };

  //组合执行方法
  function pushmsg(mm,stat){
    var item = this.msgItem(stat);
    var box = this.msgBox(stat);
    if (objtypeof(mm)=='string') {
      item.innerHTML = mm;
    }
    if (objtypeof(mm)=='object' && mm.nodeName) {
      item.appendChild(mm)
    }
    this.anim(item,box,stat);
  }
}

/*
* msgtips 消息弹出窗，为tipsbox抽象的实例
* @msg 传入的消息
* @stat 传入状态，目前支持normal,alert
* @cb  动画结束后的回调函数
*/
var msgtipInstance
var tips = function(msg,stat,cb){
  var msg_left, msg_top;
  if (msgtipInstance) {
    return msgtipInstance.pop(msg,stat,cb)
  }
  var msgtip = new tipsbox();
  //新建消息实例，可定制
  msgtip.msgItem =function(stat){
    var tip = document.createElement('div');
    var bgcolor='background-color:#4ba2f9;';
    if (objtypeof(stat) == 'object') {
      switch (stat.color) {
        case 'warning':
          bgcolor='background-color:#f0ad4e;';
          break;
        case 'error':
          bgcolor='background-color:rgb(211, 13, 21);';
          break;
        case 'success':
          bgcolor='background-color: #40bc6c;';
          break;
      }
    }
    tip.style.cssText = bgcolor;
    tip.className = 'tips-item bounceInRight animated'
    return tip;
  }

  //消息实例容器，可定制
  msgtip.msgBox=function(stat){
    $('#msgcontainer').length ? '' : $('body').append('<div class="tips-container" id="msgcontainer"></div>');
    return $('#msgcontainer')[0];
  }

  msgtip.close=function(item, container, stat){
    if (stat === true) {
      $(item).addClass('flipOutX')
      setTimeout(function(){
        $(item).remove()
        if($(container).find('.tips-item').length==0) $(container).remove();
      }, 1300)
    } else {
      setTimeout(function(){
        $(item).addClass('flipOutX')
      }, 5000)
      setTimeout(function(){
        $(item).remove()
        if($(container).find('.tips-item').length==0) $(container).remove();
      }, 6000)
    }
  }

  // 执行动画
  msgtip.anim=function(item, container, stat){
    container.appendChild(item);
      if (objtypeof(stat) == 'object' && stat.sticky) {
        $(item).click(()=>{
          msgtip.close(item, container, true)
        })
      }
    else {
      this.close(item, container, stat)
    }
  }
  msgtip.pop(msg,stat,cb);
}

tips.warning = function(msg, stat){
  var dft = {color: 'warning'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.error = function(msg, stat){
  var dft = {color: 'error'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.success = function(msg, stat){
  var dft = {color: 'success'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.sticky = function(msg, stat){
  var dft = {sticky: true}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  if (typeof stat=='string') {
    dft.color = stat
  }
  tips(msg, dft)
}

// for modal, like bootstrap modal
var msgModalInstance
var modal = function(msg,stat,cb){
  var msg_left, msg_top;
  var docRect = DocmentView();
  var scrollleft = docRect.scrollLeft;
  var scrolltop = docRect.scrollTop;
  var clientwidth = docRect.width;
  var clientheight = docRect.height;
  if (msgModalInstance) {
    return msgModalInstance.pop(msg,stat,cb)
  }
  var msgModal = new tipsbox();
  //新建消息实例，可定制
  msgModal.msgItem =function(stat){
    var tip = document.createElement('div');
    tip.className = 'modal-item'
    tip.id = 'modal-item'
    if (isValidRctElement(msg)) {
      React.render(msg, tip)
    }
    return tip;
  }

  //消息实例容器，可定制
  msgModal.msgBox=function(stat){
    let pWidth = ''
    if (stat && objtypeof(stat)=='object') {
      // pWidth = stat.p30 ? 'modal-p30' : stat.p40 ? 'modal-p40' : stat.p50 ? 'modal-p50' : stat.p90 ? 'modal-p90' : ''
      pWidth = stat.p30 || stat.p40 || stat.p50 || stat.p90
    }
    var modal = '<div class="modal-bg" style="height:'+clientheight+'px;"><div class="modal-container '+pWidth+' fadeInDown animated-fastest" id="modal-container"></div></div>'
    $('#modal-container').length ? '' : $('body').append(modal);
    return [$('.modal-bg')[0], $('#modal-container')[0] ]
  }

  msgModal.close = function(item, container){
    $(container[1]).addClass('slideOutUp')
    setTimeout(()=>{
      $(container[0]).remove()
    },500)
  }

  // 执行动画
  msgModal.anim=function(item, container){
    container[1].appendChild(item);
    $(container[0]).click((e)=>{
      if (e.target.className == 'modal-bg') {
        this.close(item, container)
      } else {
        e.stopPropagation()
      }
    })
  }
  msgModal.pop(msg,stat,cb);
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

function isValidRctElement(msg){
  if (typeof React != 'undefined' && React.isValidElement(msg)) return true
}

module.exports = {tips, modal}
