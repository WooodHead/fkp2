const db = CONFIG.db

export default async function(ctx, folder){
  try {
    if (db && db.select) return await require('./'+db.select).default(ctx.fkp, folder, db.requiredFolder)
    throw 'CONFIG.db.select 没有开启默认数据库'
  } catch (e) {
    console.log(e)
    return false
  }
}
