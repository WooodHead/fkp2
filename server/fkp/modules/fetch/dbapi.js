import path from 'path'
import dbindex from 'server/db'
let debug = Debug('modules:fetch:mockapi')

module.exports = function(){
  try {
    if (!dbindex) throw 'server/db 不存在'
    return {
      db: async function(api, param){
        return await dbindex(this.ctx, api, param)
      }
    }
  } catch (e) {
    console.log(e)
  }
}
