import co from 'co'
import path from 'path'
import markdown from './markdown'
import markdownRender from './markdownrender'

async function index(fkp, md_raw, opts){
  let render = markdownRender(fkp)
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

  let data = await fkp.excute()
  let compiled = await fkp.template(md_raw||this.data||'')
  md_raw = compiled(data)

  let  archive = await co(markdown(md_raw, mdcnt, dft))
  return archive
}

export default function(fkp){
  return index
}
