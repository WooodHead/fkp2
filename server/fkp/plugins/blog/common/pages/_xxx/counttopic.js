let mongoose = require("mongoose")

/**
 * 文章浏览统计
 * @param  {[type]}  ctx   [description]
 * @param  {[type]}  param 传递过来的参数
 * @return {Promise}       [description]
 */
async function cTopic(ctx, param) {
  try {
    if (param.topic) ttt = param.topic
    else throw '请指定文章id'
    let Topic = mongoose.model('Topic')
    , topics = await Topic.topicCount(ttt)
    if (topics.error) throw topics.error
    return Errors['10000']
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getData : cTopic
}
