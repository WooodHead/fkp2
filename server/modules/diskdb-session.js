// var db = require('diskdb');
import fs from 'fs'
import diskdb from 'diskdb'
import Path from 'path'
const root = Path.join(__dirname, '../db/diskdb/session.db')
if (!fs.existsSync(root)) {
  fs.mkdirSync(root, '0777')
}

const db = diskdb.connect(root);
db.loadCollections(['sessions']);

export default class Sess {
  constructor() {
    this.timeouts = {}
  }

  get(sid){
    const sess = db.sessions.findOne({$id: sid})
    if (sess) return sess['sess']
    return {}
  }

  set(sid, val, ttl){
    const sess = {
      $id: sid,
      sess: val
    }
    db.sessions.save(sess)
    if (sid in this.timeouts) clearTimeout(this.timeouts[sid])
    this.timeouts[sid] = setTimeout(() => {
      db.sessions.remove({$id: sid})
      delete this.timeouts[sid]
    }, ttl)
  }

  destroy(sid) {
    if (sid in this.timeouts) {
      db.sessions.remove({$id: sid})
      clearTimeout(this.timeouts[sid])
      delete this.timeouts[sid]
    }
  }
}
