let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')


// 文章访问量+1
export default async function(param) {
  if (!param._id) return
  return await Topic.findByIdAndUpdate(param._id, {$inc: { visit_count: 1} }).exec()
}
