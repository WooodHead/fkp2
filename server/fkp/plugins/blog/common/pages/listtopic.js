let libs = require('libs');
let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')
let config = CONFIG.db

function queryWhere($query, qw){
  qw.map( x => {
    if (x) switch (x[1]) {
      case '==':
        $query.where(x[0]).equals(x[2])
        break;
      case '===':
        $query.where(x[0]).equals(x[2])
        break;
      case '!==':
        $query.where(x[0]).ne(x[2])
        break;
      case '!=':
        $query.where(x[0]).ne(x[2])
        break;
      case 'in':
        $query.where(x[0]).in(x[2])
        break;
      case 'nin':
        $query.where(x[0]).nin(x[2])
        break;
      case '>':
        $query.where(x[0]).gt(x[2])
        break;
      case '>=':
        $query.where(x[0]).gte(x[2])
        break;
      case '<=':
        $query.where(x[0]).lte(x[2])
        break;
      case '<=':
        $query.where(x[0]).lte(x[2])
        break;
      }
  })
}

function getPages(page){
  let ps = config.mongo.pageSize
  let end = ps * page
  let start = end - ps
  return [start, end]
}

async function getList(start, end, options){
  // const tag = bd&&bd.tag
  // const cat = bd && bd.cat
  // return await Topic.topicList(start, end, options)

  const pageSize = config.mongo.pageSize
  end = pageSize

  const query = (options&&options.query ? options.query : {})
  const where = (options&&options.where ? options.where : [])

  const $query = Topic.find(query,'title _id delete tags create_at update_at img user visit_count',{skip:start, limit:end, sort: {update_at: -1, create_at: -1} })
  $query.where('deleted').equals(false)
  if (where.length) {
    queryWhere($query, where)
  }
  return await $query.exec()
}

export default async function(param, options) {
  if (param && param.page){
    let [start, end] = getPages(param.page)
    return await getList(start, end, options)
  }
  return await getList()
}
