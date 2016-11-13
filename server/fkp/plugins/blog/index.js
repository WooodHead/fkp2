import path from 'path'

// mongo blog
async function blog(ctx, cmd){
  let fkp = ctx.fkp
  if (CONFIG.db.select=='mongo') {
    let _db = await fkp.database(path.join(__dirname, './common'))
    if (_db && cmd) {
      // do something
    }
    return _db
  }
}


export default function(fkp){
  return blog
}
