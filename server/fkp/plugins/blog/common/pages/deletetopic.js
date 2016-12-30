let mongoose = require("mongoose");
let Topic = mongoose.model('Topic')

export default async function(ctx, param, really) {
  const user = ctx.session.$user
  try {
    if (Object.keys(param).length) {

      // 特权用户
      if (user.status === 10000) {
        _.map(param, async (v, k)=>{
          if (really) return await Topic.remove({_id: v}).exec()
          const xxx = await Topic.findOneAndUpdate({_id: v}, {deleted: true}).exec()
        })
      }

      // 普通用户
      else {
        _.map(param, async (v, k)=>{
          if (really) return await Topic.deletTopicMatchesId(v, user)
          const xxx = await Topic.findOneAndUpdate({_id: v}, {deleted: true})
          .where('user.author_id').equals(user._id).exec()
        })
      }

      return Errors.success
    }
    // 有某一个id不存在
    return Errors["20001"]
    
  } catch (e) {
    console.log(e);
    return Errors['20002']
  }
}
