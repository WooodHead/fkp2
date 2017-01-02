function objtypeof(object){
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
}
/*
* 消息弹出抽象函数
* 实例实现 tipsItem / tipsBox / anim
*/

function isValidRctElement(msg){
  if (typeof React != 'undefined' && React.isValidElement(msg)) return true
}

function active(mm, stat){
  let item = this.msgItem(stat);
  let box = this.msgBox(stat);
  if (objtypeof(mm)=='string') {
    item.innerHTML = mm;
  }
  if (objtypeof(mm)=='object' && mm.nodeType) {
    item.appendChild(mm)
  }
  if (isValidRctElement(mm)) {
    React.render(mm, item)
  }
  this.anim(item, box, stat)
}

export default class PopClass {
  constructor(){
    this.msgItem = this::this.msgItem
    this.msgBox = this::this.msgBox
    this.anim = this::this.anim
    this.close = this::this.close
    this.run = this::this.run
    this.pop = this.run
  }

  msgItem(stat){}

  msgBox(stat){}

  anim(item, container){}

  close(){}

  run(mmm, stat, cb){
    this.msg = mmm
    this.stat = stat || 'normal';
    active.call(this, mmm, stat);
    if (typeof cb == 'function') cb()
  }
}


// var tipsbox = function(){
//   this.pop = function(mmm,stat,cb){
//     if(!stat)stat='normal';
//     pushmsg.call(this,mmm,stat);
//     if(typeof cb=='function') cb()
//   }
//
//   //新建消息实例，可定制
//   this.msgItem = function(stat){};
//
//   //消息实例容器，可定制
//   this.msgBox = function(stat){};
//
//   //退出消息框
//   this.close = function(){};
//
//   //消息动画 实例化后必须定制
//   this.anim = function(item,container){ };
//
//   //组合执行方法
//   function pushmsg(mm,stat){
//     var item = this.msgItem(stat);
//     var box = this.msgBox(stat);
//     if (objtypeof(mm)=='string') {
//       item.innerHTML = mm;
//     }
//     if (objtypeof(mm)=='object' && mm.nodeName) {
//       item.appendChild(mm)
//     }
//     this.anim(item,box,stat);
//   }
// }
