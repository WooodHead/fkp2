let libs = require('libs');
let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')
let config = CONFIG.db

export default async function(param) {
  if (param && param.page){
    let [start, end] = getPages(param.page)
    return await getList(start, end)
  }
  return await getList()
}

async function getList(start, end, bd){
  const tag = bd&&bd.tag
  const cat = bd && bd.cat
  return await Topic.topicList(start, end, tag, cat)
}

function getPages(page){
  let ps = config.mongo.pageSize
  let end = ps * page
  let start = end - ps
  return [start, end]
}
