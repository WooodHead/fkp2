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

function active(mm, stat, cb){
  this.item = this.msgItem(stat);
  this.box = this.msgBox(stat);
  this.container = this.box;
  if (objtypeof(mm)=='string') {
    this.item.innerHTML = mm;
  }
  if (objtypeof(mm)=='object' && mm.nodeType) {
    this.item.appendChild(mm)
  }
  if (isValidRctElement(mm)) {
    React.render(mm, this.item)
  }
  this.anim(this.item, this.box, stat)
  return this
  // if (typeof cb == 'function') cb()
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
    return active.call(this, mmm, stat, cb);
  }
}
