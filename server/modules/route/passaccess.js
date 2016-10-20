var libs = require('libs')
let debug = Debug('modules:route:passacess')


async function passaccess(oridata, control) {
  // let xxx = await Fetch.get('163')
  // console.log(xxx);
  let apilist = Fetch.apilist

  control.get = async function(){
    return oridata;
  }

  control.post = async function(){
    let passdata;
    let body = this.body
    let _jss = []
    if(body){
      if( apilist.list[route] || route === 'redirect') passdata = await Fetch.post(route, body)
      // 批处理加载大量js
      if (route === 'staticjs'){
        // if (body.js) 
      }

      // 一般用作第三方开放api的数据请求
      // 第三方返回数据格式为 [config, data]，如微信，qq，github
      // 如果由后台自定义返回数据，请注意格式的一致性
      if (passdata && passdata[1]) {
        // 特殊的header
        if (passdata[0].headers.login){
          this.response.set('login', passdata[0].headers.login); //设置response的header
        }
        return passdata[1]
      } else {
        if (passdata && passdata[1]==='') return Errors['1010']
        debug('java/php后端返回数据出错')
        return Errors['60002']
      }
    }
  }

  return control.run()
}

export { hello as getData }
