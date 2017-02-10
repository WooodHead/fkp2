import {objtypeof, inject} from 'libs'
import PopClass from 'component/class/poper'

inject().css([
  `/css/t/animate.css`
])
.css([
  `
  /* === component/msgtips === */
  .tips-container{
    z-Index:10030;
    width:230px;
    position:fixed;
    bottom: 16px;
    right: 32px;
  }
  .tips-toast{
    width:130px;
    bottom: 80px;
    right: auto;
    left: 50%;
    margin-left: -65px;
    text-align: center;
  }
  .tips-notification{
    bottom: auto;
    top: 10px;
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
  `
])

class Tips extends PopClass {
  constructor(){
    super([...arguments])
  }

  msgItem(stat){
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
        default:
          if (stat.toast) {
            bgcolor='background-color: #bbbbbb;';
          }
      }
    }
    tip.style.cssText = bgcolor;
    let cls = 'tips-item bounceInRight animated'
    if (stat && stat.toast) {
      cls = 'tips-item fadeIn animated'
    }
    tip.className = cls
    return tip;
  }

  //消息实例容器，可定制
  msgBox(stat){
    let boxContainer
    let boxContainerId = 'msgcontainer'
    let cls = 'tips-container'
    if (stat && stat.toast) {
      cls += ' tips-toast'
      boxContainerId = 'msgcontainer-toast'
    }
    if (stat && stat.notification) {
      cls += ' tips-notification'
      boxContainerId = 'msgcontainer-notification'
    }
    if (!document.getElementById(boxContainerId)) {
      let box = document.createElement('div')
      box.className = cls
      box.id = boxContainerId
      let body = document.getElementsByTagName('body')
      body[0].appendChild(box)
      boxContainer = box
    } else {
      boxContainer = document.getElementById(boxContainerId)
    }
    return boxContainer
    // $('#msgcontainer').length ? '' : $('body').append('<div class="tips-container" id="msgcontainer"></div>');
    // return $('#msgcontainer')[0];
  }

  close(item, container, stat){
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
  anim(item, container, stat){
    container.appendChild(item);
      if (objtypeof(stat) == 'object' && stat.sticky) {
        $(item).click(()=>{
          this.close(item, container, true)
        })
      }
    else {
      this.close(item, container, stat)
    }
  }
}

var msgtipInstance
export default function tips(msg, stat, cb){
  if (msgtipInstance) {
    return msgtipInstance.run(msg, stat, cb)
  } else {
    msgtipInstance = new Tips()
    return msgtipInstance.run(msg, stat, cb)
  }
}

tips.warning = function(msg, stat){
  var dft = {color: 'warning'}
  dft = _.extend(dft, stat)
  tips(msg, dft)
}

tips.error = function(msg, stat){
  var dft = {color: 'error'}
  dft = _.extend(dft, stat)
  tips(msg, dft)
}

tips.success = function(msg, stat){
  var dft = {color: 'success'}
  dft = _.extend(dft, stat)
  tips(msg, dft)
}

tips.toast = function(msg, stat){
  var dft = {toast: true}
  if (typeof stat=='string') {
    dft.color = stat
  } else {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.notification = function(msg, stat){
  var dft = {notification: true}
  if (typeof stat=='string') {
    dft.color = stat
  } else {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.sticky = function(msg, stat){
  var dft = {sticky: true}
  if (typeof stat=='string') {
    dft.color = stat
  } else {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}
