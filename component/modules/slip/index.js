import {inject, addEvent, rmvEvent} from 'libs'
import Slip from './_common/slip'

function animateswipe(e){
  // console.log(e.detail);
}
function reorder(e){
  // console.log(e.detail);
}
function beforereorder(e){
  // e.preventDefault();   // 阻止向下拖拉
}
function prevent_beforereorder(e){
  e.preventDefault();   // 阻止向下拖拉
}
function beforeswipe(e){
  // e.preventDefault();   // 阻止X轴拖拉
}
function prevent_beforeswipe(e){
  e.preventDefault();   // 阻止X轴拖拉
}

function slipswipe(e){
  //
}
function afterswipe(e){
  // return true
}

function tap(){

}

export default function slip(slipDom, opts) {
  let dft = {
    'slip:animateswipe': animateswipe,
    'slip:beforereorder': beforereorder,
    'slip:reorder': reorder,
    'slip:beforeswipe:': beforeswipe,
    'slip:afterswipe:': afterswipe,
    'slip:swipe:': slipswipe
  }

  if (typeof opts == 'object') {
    dft = _.merge(dft, opts)
  }

  const instance = new Slip(slipDom, dft)

  for (let item in dft) {
    rmvEvent(slipDom, item, dft[item])
    addEvent(slipDom, item, dft[item])
  }
  return instance

}

slip.x = function(slipDom, opts){
  let dft = {
    'slip:beforereorder': prevent_beforereorder
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return slip(slipDom, dft)
}

slip.y = function(slipDom, opts){
  let dft = {
    'slip:beforeswipe': prevent_beforeswipe
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return slip(slipDom, dft)
}
