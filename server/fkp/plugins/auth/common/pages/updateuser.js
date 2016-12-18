// { _id: '58444b199c13ce0607d3bc71',
//   id: '9692156',
//   username: 'webkixi',
//   avatar: 'https://avatars.githubusercontent.com/u/9692156?v=3',
//   email: 'kixi@163.com',
//   thirduser:
//    { login: 'webkixi',
//      id: 9692156,
//      avatar_url: 'https://avatars.githubusercontent.com/u/9692156?v=3',
//      gravatar_id: '',
//      url: 'https://api.github.com/users/webkixi',
//      html_url: 'https://github.com/webkixi',
//      followers_url: 'https://api.github.com/users/webkixi/followers',
//      following_url: 'https://api.github.com/users/webkixi/following{/other_user}',
//      gists_url: 'https://api.github.com/users/webkixi/gists{/gist_id}',
//      starred_url: 'https://api.github.com/users/webkixi/starred{/owner}{/repo}',
//      subscriptions_url: 'https://api.github.com/users/webkixi/subscriptions',
//      organizations_url: 'https://api.github.com/users/webkixi/orgs',
//      repos_url: 'https://api.github.com/users/webkixi/repos',
//      events_url: 'https://api.github.com/users/webkixi/events{/privacy}',
//      received_events_url: 'https://api.github.com/users/webkixi/received_events',
//      type: 'User',
//      site_admin: false,
//      name: '天天修改',
//      company: null,
//      blog: 'http://agzgz.com',
//      location: null,
//      email: 'kixi@163.com',
//      hireable: null,
//      bio: null,
//      public_repos: 52,
//      public_gists: 0,
//      followers: 10,
//      following: 12,
//      created_at: '2014-11-12T08:29:57Z',
//      updated_at: '2016-12-04T14:02:43Z' },
//   signfrom: 'github',
//   update_at: '1480870671290',
//   create_at: '1480870671290',
//   phone: '',
//   nickname: '天天修改' }

let bcrypt = require('bcryptjs')
let libs = require('libs')
let mongoose = require("mongoose")
let User = mongoose.model('User')
let Follow = mongoose.model('Follow')
let Favorite = mongoose.model('Favorite')
let Validator = libs.validator()

class upUser {
  constructor(ctx){
    this.ctx = ctx
    this.user = ctx.session.$user
    this.password = this::this.password
    this.score = this::this.score
  }

  async password(param){
    const ctx = this.ctx
    const _user = this.user
    if (param.password) {
      try {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(param.password, salt);
        param.password = hash;
        await User.findByIdAndUpdate(_user._id, {password: param.password}).exec()
        ctx.body = Errors.success
      } catch (err) {
        console.log(err)
      }
    }
  }

  async score(){
    const ctx = this.ctx
    const _user = this.user
    const $user = await User.findByIdAndUpdate(_user._id, {$inc: { score: 1} }).exec()
    this.user.score = $user.score
    return Errors.success
  }

  // 喜爱
  async favorite(id, type){
    // new Favorite({
    //   uid: _user._id,
    //   type: type,
    //   favorite: {
    //     // ...
    //   }
    // }).save()
  }

  // 更新跟随谁, 主动更新
  async following(target){
    new Follow({
      uid: _user._id,
      following: target
    }).save()
    const $user = await User.findByIdAndUpdate(_user._id, {$inc: { following: 1} }).exec()
    return await this.follower(target)
  }

  // 跟新跟随者，被动更新
  async follower(target){
    new Follow({
      uid: target,
      follower: _user._id
    }).save()
    const $user = await User.findByIdAndUpdate(target, {$inc: { follower: 1} }).exec()
    return $user
  }

  avatar(param){}
  location(param){}
}

export default function(ctx) {
  const _user = ctx.session.$user
  return new upUser(ctx)
}
