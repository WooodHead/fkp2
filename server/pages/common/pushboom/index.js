const pushboomDb = LocalDB('PUSHIT.DB/BOOM')
const pushboomHistoryDb = LocalDB('PUSHIT.DB/BOOMHISTORY')

const regs = {
  // boom: /^ *@([\w\u4e00-\u9fa5\uFE30-\uFFA0\-]*) *## *([\w\:\/\.\-\?&\;\,\=]*) *$/
  boom: /^@([\w\u4e00-\u9fa5\uFE30-\uFFA0\S ]*)##([\w\:\/\.\-\?&\;\,\=#]*) *$/
}

function boomValue(val){
  const values = regs.boom.exec(val)
  if (values) return [values[1], values[2]]
}

SIO.on('pushboom:data', function(data, socket, client){
  const pushboomData = pushboomDb.find().reverse()
  socket.emit('pushboom:data', pushboomData)
})

SIO.on('pushboom', function(data, socket, client) {
  const _io = this.io
  , _id = socket.id
  , remoteIp = client.address
  if (typeof data === 'string') {
    const tmp = boomValue(data)
    if (tmp) {
      const [title, url] = tmp
      const count = pushboomDb.count()+1
      const item = { title, url, count, type: 'boom' }
      let dublicat = pushboomDb.findOne({title})
      if (!dublicat) {
        dublicat = pushboomDb.findOne({url})
        if (!dublicat) {
          if (count > 50) {
            pushboomDb.removeAll({type: 'boom'})
            socket.emit('pushboom', {error: '机房故障，发生爆炸，数据都没了'})
          } else {
            pushboomDb.set(item)
            socket.emit('pushboom', item)
          }
        } else {
          socket.emit('pushboom', {error: '请不要重复添加'})
        }
      } else {
        socket.emit('pushboom', {error: '请不要重复添加'})
      }
    } else {
      socket.emit('pushboom', {error: '数据格式不正确'})
    }
  }
})

export default pushboomDb
