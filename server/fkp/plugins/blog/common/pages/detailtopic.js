let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')

export default async function(param) {
  if (!param._id) return
  let fkp = this.fkp
  return await Topic.topicMatchesId(param._id)
}


async function detailTopic(ctx, param) {
  try {
    if (param.topic){
      if (!param.auth) {
        return await getDtail(param.topic)
      } else {
        let _user = ctx.session.$user
        if (!_user) return Errors['10005']
        let [_auth, _topic] = await getDtail(ttt, _user)
        if (_topic.error) throw _topic.error
        return [_topic]
      }
    }
    throw '请指定文章详情的id'
  } catch (e) {
    console.log(e)
  }
}

async function getDtail(ttt, user){
  try {
    let topics = await Topic.topicMatchesId(ttt)
    if (topics.error) throw topics.error
    if (!user) return [topics]
    else {
      let stat = await topics.userMatches(user)
      if (!stat) throw Errors['20003']
      return [stat, topics]
    }
  } catch (err) {
    console.log(err)
  }
}

// module.exports = {
//     getData : detailTopic
// }
