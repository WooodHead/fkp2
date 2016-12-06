const libs = require('libs')
const mongoose = require("mongoose");
let Topic = mongoose.model('Topic')

export default async function(ctx, param) {
  try {
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
      return await new Topic(ntopic).save()
    }
  } catch (e) {
    console.log(e)
  }
}

// async function addtopic(ctx, param) {
//   try {
//     let _user = false
//     if (ctx.session.$user) _user = ctx.session.$user
//     if (!_user) return Errors['10005']
//
//     let body = ctx.request.body
//     if (!body) throw("The topic body is empty", 400)
//
//     if (body.cnt) {
//       let parsedMd = await ctx.fkp.markdown(body.cnt, {mdcontent:{}} )
//       , _tags = parsedMd.mdcontent.tags || parsedMd.mdcontent.tag
//       , ntopic
//
//       if (!parsedMd.mdcontent.title) return Errors['10006']
//       if (!parsedMd.mdcontent.desc) return Errors['10007']
//
//       if (typeof _tags == 'string') _tags = _tags.split(',')
//       _tags = _.map(_tags, _.trim)
//       ntopic = {
//         title: parsedMd.mdcontent.title,
//         content: body.cnt,
//         img: parsedMd.mdcontent.img,
//         cats: parsedMd.mdcontent.cats,
//         tags: _tags,
//         user: {
//           id: _user.id,
//           author_id: _user._id,
//           username: _user.username,
//           nickname: _user.nickname,
//           avatar: _user.avatar
//         }
//       }
//
//       return await new Topic(ntopic).save()
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }
