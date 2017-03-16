import {validator} from 'libs'
import { tips as msgtips } from 'component/client'
import {
  input as Input,
  item as itemComp,
} from 'component'
import itemHlc from 'component/mixins/itemhlc'
const Validator = validator()
const STATE = SAX('Login')

const valideButton = ()=>{
  const Vb = itemHlc(<a className="btn btn-primary">获取动态码</a>, function(dom){
    $(dom).click(function(){
      const values = registerForm.values()
      const stat = Validator($('#username').val(), 'noop', values::valideSome.username)()
      if(stat){
        $(dom).html('60秒后重新获取')
        $(dom).addClass('disabled-link').attr('disabled','disabled')
      }else {
        registerForm.warning('username')
        msgtips.toast('请输入手机号')
      }
    })
  })
  return <Vb />
}
const valideButton2 = ()=>{
  // <img src="http://10.10.10.109:8080/tp-web-api/captcha.svl" />
  const Vb = itemHlc(
    <div className="code">
      <a class="refreshCode">刷新</a>
    </div>,
    function(dom){
      $(dom).find('.refreshCode').click(function(){ }
    )
  })
  return <Vb />
}

const configForm = [
  {title: '账号:', input:{id: 'username', type: 'text', placehold: '手机号/邮箱'} },
  // {title: '验证码:', input:{id: 'valide', type: 'text'}, desc: valideButton()},
  {title: '验证码:', input:{id: 'code', type: 'text'}, desc: valideButton2()},
  {title: '密码:', input:{id: 'password', type: 'password', placehold:'请输入密码'} }
]
const registerForm = Input({data: configForm})

const valideSome = {
  username: function(val, regu) {
    if (!val) return false
    return regu.email.test(val) ? 'email' : regu.mobile.test(val) ? 'mobile' : undefined
  }
}

const submint = ()=> {
  const Vb = itemHlc(
    <button className="btn btn-primary btn-center submit">登录</button>
    ,function(dom){
      console.log(dom);
    }
  )
  return <Vb />
}

const registerBody =(
  <div clclassName="registerDom">
    {registerForm.render()}
    <div className="other-info fo">
      <div className="fl">
        <p>是否自动登录</p>
      </div>
      <a className="fr" href="#">忘记密码</a>
    </div>
    {submint()}
  </div>
)

const registerDom = itemComp({
  data:{
    title: registerBody,
    body: [
      {
        k: <span className='item-attribute fl'></span>,
        v: <a className='item-attribute fr' href="#">注册新账号</a>
      }
    ]
  }
})

export default registerDom
