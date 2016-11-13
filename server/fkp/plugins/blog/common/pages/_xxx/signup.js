let libs = require('libs')
let mongoose = require("mongoose");
let User = mongoose.model('User')

async function signup(ctx, param) {
  try {
    let initPass = '123456'
    let body = param.body;
    if (body && body.username){
      let user = await User.userMatches(body.username)
      console.log('======  $signup custom user ========');
      if (!user.error) {
        let uuu = new User({
          "username": body.username,
          "password": initPass
        })
        return uuu.save()
      }
      return Errors['10003']
    }

    if (body && body.github){
      let body = body.github
      let user = await User.userMatches(body.login)
      //用户不存在
      if (user === true) {
        let uuu = new User({
          id: body.id,
          username: body.login,
          password: initPass,
          nickname: body.name,
          avatar: body.avatar_url
        })
        return uuu.save()
      }
      return Errors['10003']
    }
    throw '注册用户数据错误'
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getData : signup
}
