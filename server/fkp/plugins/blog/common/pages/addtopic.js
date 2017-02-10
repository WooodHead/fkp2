const libs = require('libs')
const mongoose = require("mongoose");
let Topic = mongoose.model('Topic')

export default async function(ctx, param) {
  try {
    const Auth = await ctx.fkp.auth()
    const UpdateUser = Auth.updateuser(ctx)

    let _user = ctx.session.$user
    let body = ctx.request.body
    if (body.cnt) {
      let parsedMd = await ctx.fkp.markdown(body.cnt, {mdcontent:{}} )
      , _tags = parsedMd.mdcontent.tags || parsedMd.mdcontent.tag
      , ntopic

      if (!parsedMd.mdcontent.title) return Errors['10006']
      if (!parsedMd.mdcontent.desc) return Errors['10007']

      if (typeof _tags == 'string') {
        _tags = _tags.split(',')
      }
      _tags = _.map(_tags, _.trim)
      ntopic = {
        title: parsedMd.mdcontent.title,
        content: body.cnt,
        img: parsedMd.mdcontent.img,
        cats: parsedMd.mdcontent.cats,
        tags: _tags,
        user: {
          id: _user.id,
          author_id: _user._id,
          username: _user.username,
          nickname: _user.nickname,
          avatar: _user.avatar,
          thirduser: _user.thirduser
        }
      }

      if (body.id) {
        delete ntopic.user
        ntopic.update_at = new Date().getTime()
        return await Topic.findByIdAndUpdate(body.id, { $set: ntopic }).exec()
        // return await Topic.updateTopicMatchesId(body.id, {$set: ntopic}, _user)
      } else {
        await UpdateUser.score()
        return await new Topic(ntopic).save()
      }
    }
  } catch (e) {
    console.log(e)
  }
}
