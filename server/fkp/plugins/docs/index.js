import co from 'co'
import path from 'path'

async function docs(ctx, dir, opts){
  if (!dir) return false
  const fkp = ctx.fkp
  const markdownParse = fkp.parsedocs()
  let dft = {
    docs: false,
    start: false,
    menutree: false,
    sonlist: false,
    sitemap: false,
    append: {}
  }

  // if (!opts) return await fkp.parsedocs('file')(dir)
  if (!opts) return await markdownParse.file(dir)
  if (_.isPlainObject(opts)) {
    dft = _.merge(dft, opts)
  }

  if (dir == 'fdocs') {
    let stat = await fkp.fileexist(dir)
    if (!stat) {
      await fkp.mkdir(dir)
      return false
    }
  }
  // return await fkp.parsedocs('folder')(dir, dft)
  return await markdownParse.folder(dir, dft)
}

export default function(fkp){
  fkp.routepreset('/docs', {
    get: [
      '/',
      '/:cat',
      '/:cat/:title',
      '/:cat/:title/:id',
      '/:cat/:title/:id/:p1',
      '/:cat/:title/:id/:p1/:p2',
      '/:cat/:title/:id/:p1/:p2/:p3'
    ],
    post: [ '/', '/:cat', '/:cat/:title', '/:cat/:title/:id' ]
  })
  return docs
}
