module.exports = {
  // 第三方登陆
  auth: {
    //本地环境使用github登陆，使用 ./ly dev env_test
    github:{
      clientID: 'b1ba9181f8928e4cbfa2',
      clientSecret: 'cb598749e899bc20514a4b9f583974fd13457550',
      callbackURL: 'http://localhost:3000/github/callback',
      successUrl: '/blog',
      userKey: 'githubuser',    //save this key to session
      headers: {"user-agent": "bendi"}
    }
  }
}
