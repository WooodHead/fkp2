import co from 'co'
import path from 'path'
import renderfdocsSon from './fdocsson'

async function index(fkp, cmd){
  let _data = await fkp().docs('fdocs', 'mdson')
  let _mdson = renderfdocsSon(_data.sonlist)
  let commond = {
    name: '你妹啊，真的可以吗',
    mdson: _mdson
  }

  if (!cmd) return commond
  if (!_.isArray(cmd) || !_.isString()) return false
  if (cmd && typeof cmd == 'string') cmd = [cmd]
  let cmds = _.pick(commond, cmd)
  if (_.isEmpty(cms)) return false
  return cmds
}

export default function(fkp){
  return index
}
