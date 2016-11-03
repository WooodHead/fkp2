let src = CONFIG.apis.apiip + CONFIG.apis.port;

function getApiPath() {
  return {
    base: src,
    dirs: {

    },
    // special api
    weixin: {
      wx_token: 'https://api.weixin.qq.com/cgi-bin/token',
      wx_web_token: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      //oauth2方式的api会以 '_web' 方式结尾
      userlist: 'https://api.weixin.qq.com/cgi-bin/user/get',
      querymenu: 'https://api.weixin.qq.com/cgi-bin/menu/get',        //?access_token=ACCESS_TOKEN
      createmenu: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN',    //?access_token=ACCESS_TOKEN
      getticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',            //?access_token=ACCESS_TOKEN&type=jsapi
      userinfo_web: 'https://api.weixin.qq.com/sns/userinfo'  //?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
    },

    list: {
      163: 'http://www.163.com'
    }
  }
}

module.exports = getApiPath
