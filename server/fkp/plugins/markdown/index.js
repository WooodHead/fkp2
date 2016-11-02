import co from 'co'
import path from 'path'
import markdown from './markdown'
import markdownRender from './markdownrender'

export default async function(ctx, md_raw, opts){
  let render = markdownRender(ctx)
  let mdcnt = {
    mdcontent:{}
  }
  let dft = {
    renderer: render,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  }
  if (_.isPlainObject(opts)) dft = _.extend(opts)

  let fkpper = ctx.fkp()
  let data = await fkpper.excute()
  let compiled = await fkpper.template(md_raw||this.data||'')
  md_raw = compiled(data)

  let  archive = await co(markdown(md_raw, mdcnt, dft))
  return archive
}
