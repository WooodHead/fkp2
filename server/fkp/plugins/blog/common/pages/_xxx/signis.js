let libs = require('libs')
let mongoose = require("mongoose");
let User = mongoose.model('User')

async function signis(ctx, param) {
  if (this.session.$user) return this.session.$user

  try {
    let body = param.body
    if (!body) throw("The body is empty")
    if (!body.username) {
      if (body.test) return Errors['10005']
    }
    let username = body.username
    let user = await User.hasUserMatches(username)
    this.session.$user = user
    return user
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getData : signis
}
