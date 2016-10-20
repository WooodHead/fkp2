import path from 'path'
import request from 'request'
import {stringify} from 'querystring'
import { inherits, objtypeof, errors } from 'libs'
import getapis  from 'apis/apilist'
let debug = Debug('modules:fetch:weixin')

export default function(){
  let date = new Date()
  let _WX = CONFIG.weixin
  return {
    _wxAccessToken: async function(){
      debug('uuuuuuuuuu get weixin normal access token uuuuuuu');
      let apiPath = this.apilist
      let tmp = await this.get(apiPath.weixin['wx_token'], {
        grant_type: 'client_credential',
        appid: _WX.appid,
        secret: _WX.appsecret
      })

      let token = JSON.parse(tmp[0].body);
      debug('normal token: '+token);
      let now = date.getTime()/1000;
      let sess_wx = {
          token: token.access_token,
          token_expire: now + token.expires_in,
          token_renew: 7200
      }

      if(token.access_token) the.session.wx = sess_wx
    },

    _wxWebAccessToken: async function(){
      debug('uuuuuuuuuu get web access token uuuuuuu')
      var tmp = await this.get(apiPath.weixin['wx_web_token'], {
        appid: _WX.appid,
        secret: _WX.appsecret,
        code: params.code,
        grant_type: 'authorization_code'
      })

      let token = JSON.parse(tmp[0].body)
      debug('web token: '+token);
      let _now = date.getTime()/1000;
      let sess_wx = {
        openid: token.openid,
        scope: token.scope,
        refresh_token: token.refresh_token,
        token: token.access_token,
        token_expire: _now + token.expires_in,
        token_renew: 7200
      }
      if(token.openid) the.session.wwx = sess_wx
    },

    weixin: async function(api, param, method){
      debug(api);
      let apiPath = this.apilist
      let tmp = undefined

      if(params.code){   //web access token
        this._wxWebAccessToken()
        tmp = the.session.wwx
      } else {   //normal access token
        if(api.indexOf('_web')===-1){
          if(!the.session.wx) this._wxAccessToken()   //暂时关闭
          tmp = the.session.wx
        }else{
          if(!the.session.wwx) this._wxWebAccessToken()  //暂时关闭
          tmp = the.session.wwx
        }
      }

      if(tmp){
        let _now = date.getTime()/1000
        if(_now-tmp.token_expire>6500){
          if( the.session.wx) this._wxAccessToken()
          if( the.session.wwx ) this._wxWebAccessToken();
        } else {
          tmp.token_renew = _now - tmp.token_expire;
        }
      }

      if (api == 'wx_web_token') return { token: this.ctx.session.wwx.token }
      if (api.indexOf('_web')===-1){
        if(api==='token') return { token: this.ctx.session.wx.token }
        debug('append access token to weixin api')
      }

      let url = apiPath.weixin[api]
      if (url.indexOf('ACCESS_TOKEN')>-1) url = url.replace(/ACCESS_TOKEN/, this.ctx.session.wx.token)

      if(!method||method==='get'||method==='GET') return this.get(url, param)
      return this.post(url, param)
    }
  }
}
