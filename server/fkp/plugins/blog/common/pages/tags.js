let libs = require('libs');
let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')
let config = CONFIG.db

export default async function(options={}) {
  return await Topic.distinct('tags', options).exec()
}
