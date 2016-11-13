let libs = require('libs')
let mongoose = require("mongoose");
let User = mongoose.model('User')

async function signin(ctx, param) {
  try {
    if (this.session.$user) return this.session.$user
    // else {
    //   let _rtn = Errors['10005']
    //   _rtn.dbconfig = process.env.dbconfig
    //   return _rtn;
    // }

    let body = param.body
    if (!body) throw("The body is empty")
    if (!body.username) {
      if (body.test){
        let _rtn = Errors['10005'];
        _rtn.dbconfig = process.env.dbconfig
        return _rtn;
      }
    }
    if (!body.password) throw("Missing password")
    let user = await User.passwordMatches(body.username, body.password)
    if (!user.error) {
      this.session.$user = user
      return user
    }
    return Errors['10001']
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getData : signin
}
