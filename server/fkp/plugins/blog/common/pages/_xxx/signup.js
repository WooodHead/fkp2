// const github_user_info_stuctor = { login: 'webkixi',
//   id: 9692156,
//   avatar_url: 'https://avatars.githubusercontent.com/u/9692156?v=3',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/webkixi',
//   html_url: 'https://github.com/webkixi',
//   followers_url: 'https://api.github.com/users/webkixi/followers',
//   following_url: 'https://api.github.com/users/webkixi/following{/other_user}',
//   gists_url: 'https://api.github.com/users/webkixi/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/webkixi/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/webkixi/subscriptions',
//   organizations_url: 'https://api.github.com/users/webkixi/orgs',
//   repos_url: 'https://api.github.com/users/webkixi/repos',
//   events_url: 'https://api.github.com/users/webkixi/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/webkixi/received_events',
//   type: 'User',
//   site_admin: false,
//   name: '天天修改',
//   company: null,
//   blog: 'http://agzgz.com',
//   location: null,
//   email: 'kixi@163.com',
//   hireable: null,
//   bio: null,
//   public_repos: 52,
//   public_gists: 0,
//   followers: 10,
//   following: 12,
//   created_at: '2014-11-12T08:29:57Z',
//   updated_at: '2016-11-07T10:06:01Z'
// }


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
