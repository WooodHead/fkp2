let libs = require('libs');
let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')
let config = CONFIG.db

export default async function(param={}) {
  return await Topic.count(param).exec()
}
