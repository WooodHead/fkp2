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
let Validator = libs.validator()

export default async function(ctx, param) {
  const _user = ctx.session.$user
  if (_user && param) {
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
    // console.log(xxx);
  }
}
