let libs = require('libs');
let mongoose = require("mongoose");
let User = mongoose.model('User')
let config = CONFIG.db

export default async function(param={}) {
  return await User.findOne(param).exec()
}
