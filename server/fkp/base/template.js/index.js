function index(fkp, raw, data, type=2) {
  // let parseSetting = {
  //   evaluate:    /{{([\s\S]+?)}}/g,
  //   interpolate: /{{=([\s\S]+?)}}/g,
  //   escape:      /{{-([\s\S]+?)}}/g
  // }
  let parseSetting = {
    evaluate:    /{{{([\s\S]+?)}}}/g,
    interpolate: /{{{=([\s\S]+?)}}}/g,
    escape:      /{{{-([\s\S]+?)}}}/g
  }

  if (!raw) return

  if (type==2) _.templateSettings = _.extend(_.templateSettings, parseSetting)
  let compiled = _.template(raw)
  if (data) return compiled(data)
  return compiled
}

export default function(fkp){
  return index
}
