export default class GitHub {
  constructor(ctx, operate){
    this.ctx = ctx
    this.operate = operate
    this.config = CONFIG.auth.github

    this.sign = this::this.sign
    this.callback = this::this.callback
    this.hasuser = this::this.hasuser
    this.signup = this::this.signup
  }

  async hasuser(opts){
    return await this.operate.hasuser({id: opts.id})
  }

  async signup(opts){
    return await this.operate.signup(opts, 'github')
  }

  sign(){
    const ctx = this.ctx
    const C = this.config
    if (ctx.session.$user){
      ctx.redirect(C.successUrl)
    } else {
      ctx.redirect("https://github.com/login?return_to=/login/oauth/authorize?client_id="+C.clientID+"&redirect_uri="+C.callbackURL+"&response_type=code")
    }
  }

  async callback(){
    const query = this.ctx.query
    const C = this.config
    const ctx = this.ctx

    if (query.code){
      const postdata = {
        client_id: C.clientID,
        client_secret: C.clientSecret,
        code: query.code,
        redirect_uri: C.callbackURL,
      }

      // for token
      const result = await Fetch.post('https://github.com/login/oauth/access_token', postdata)

      // for github user info
      const requestUser = {
        access_token: result.data.access_token,
        headers: {
          'User-Agent': 'Awesome-Octocat-App'
        }
      }
      const github_user = await Fetch.get('https://api.github.com/user', requestUser);
      const github_user_info = JSON.parse(github_user.data)

      // 老用户
      // has local user 本地数据库是否有该用户
      const hasUser = await this.hasuser(github_user_info)
      if (hasUser){
        ctx.session.$user = hasUser
        return ctx.redirect(C.successUrl)
      }

      // 新用户
      // 将github的用户注册为本地新用户
      const signupUser = await this.signup(github_user_info, 'github')
      if (signupUser) {
        ctx.session.$user = signupUser;
        return ctx.redirect('/auth/repassword')
      }
    }
  }
}
