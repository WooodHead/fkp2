import tips from './modules/msgtips'
import modal from './modules/modal'
import sticky from './modules/sticky'
import slip from './modules/slip'
import router from './modules/router'
import * as uploader from './modules/upload'

// import itemHlc from './mixins/itemhlc'
import combinex from './mixins/combinex'
import * as Sync from './index'

function wrapItem(comp, opts, cb){
  return combinex(comp, opts, cb)
}

const combineX = wrapItem

module.exports = {
  tips,
  modal,
  sticky,
  slip,
  router,
  wrapItem,
  combineX,
  uploader,
  ...Sync
}
