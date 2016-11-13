let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')

async function deleteTopic(ctx, param) {
  let _user = false
  if (ctx.session.$user) _user = ctx.session.$user
  if (!_user) return Errors['10005']

  if (param.topic){
    let ttt = param.topic
    let topics = await Topic.deletTopicMatchesId(ttt, _user)
    if (topics.error) console.log(topics.error);
    return Errors.success
  } else {
    throw '请指定删除文章的id'
  }
}

module.exports = {
  getData : deleteTopic
}
