import tips from './modules/msgtips'
import modal from './modules/modal'
import sticky from './modules/sticky'
import slip from './modules/slip'
import router from './modules/router'

import itemHlc from './mixins/itemhlc'
import * as Sync from './index'

function wrapItem(comp, cb){
  return itemHlc(comp, cb)
}

module.exports = {
  tips,
  modal,
  sticky,
  slip,
  router,
  wrapItem,
  ...Sync
}
