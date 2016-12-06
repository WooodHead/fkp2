let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')

export default async function(param) {
  if (!param._id) return
  return await Topic.topicMatchesId(param._id)
}
