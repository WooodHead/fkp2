let libs = require('libs')
let mongoose = require("mongoose");
let User = mongoose.model('User')

export default async function(param, type) {
  if (!param) return
  let initPassWord = 'fkp123456'

  if (!type) {
    const userinfo = await User.findOne({username: param.username}).exec()
    if (!userinfo) {
      return new User({
        username: param.username,
        password: initPassWord
      }).save()
    } else {
      return userinfo
    }
  }

  if (type == 'github') {
    // const userinfo = await User.findOne({id: param.id}).exec()
    const userinfo = await User.userMatches(param.login)
    if (!userinfo) {
      return new User({
        id: param.id,
        username: param.login,
        password: initPassWord,
        nickname: param.name,
        avatar: param.avatar_url,
        email: param.email,
        signfrom: 'github',
        thirduser: param
      }).save()
    } else {
      return userinfo
    }
  }

  // if (type === '...') {}
}
