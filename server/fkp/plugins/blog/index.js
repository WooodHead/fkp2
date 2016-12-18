import path from 'path'
import blogcontrol from './blogcontrol'
import blogadmin from './blogadmin'

// mongo blog
let _db
async function blog(ctx, cmd){
  let fkp = ctx.fkp
  if (_db) return _db
  if (CONFIG.db.select=='mongo') {
    _db = await fkp.database(path.join(__dirname, './common'))
    if (_db && cmd) {
      // do something
    }
    return _db
  }
}

export default function(fkp){
  fkp.routepreset('/blog/admin', {
    customControl: blogadmin
  })
  fkp.routepreset('/blog', {
    customControl: blogcontrol
  })
  fkp.routepreset('/logs', {
    customControl: blogcontrol
  })
  return blog
}
