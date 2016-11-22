let libs = require('libs')
let fs = require('fs')
let path = require('path')

function _db(fkp){
  this.fkp = fkp
}

export default async function(fkp, folder, requiredFolder){
  let connectState = await require('./common/connect').default(folder)
  try {
    if (!connectState) throw '数据库没有连接'
    let $folder = await fkp.fileexist(folder)
    if ($folder.isDirectory()) {
      let dirs = (await fkp.readdir(folder) || []).filter((x) => Object.values(requiredFolder).includes(x))
      if (dirs.length>1) {
        return registerModel(fkp, {
          control: path.join(folder, requiredFolder.control),
          model: path.join(folder, requiredFolder.model)
        })
      }
      throw '请指定正确的control目录和model目录，参考config.db.requiredFolder'
    }
    throw '请指定正确的control目录和model目录, 参考config.db.requiredFolder'
  } catch (e) {
    console.log(e)
    return false
  }
}

// 注册model
async function registerModel(fkp, options){
  fs.readdirSync(options.model).forEach(function(file) {
    if (~file.indexOf(".js")) require(options.model + "/" + file)
  })
  return await registerControl(fkp, options)
}

// 注册control
async function registerControl(fkp, options){
  let ctrlfiles = (await fkp.readdir(options.control)||[]).map( ctrlfile => {
    if (~ctrlfile.indexOf(".js")) {
      let filename = ctrlfile.replace('.js', '')
      _db.prototype[filename] = require( path.join(options.control, ctrlfile) ).default
    }
  })
  if (ctrlfiles && ctrlfiles.length) return new _db(fkp)
}
