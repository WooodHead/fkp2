import {validator} from 'libs'
import { tips as msgtips } from 'component/client'
import {
  input as Input,
  item as itemComp,
} from 'component'
const Validator = validator()

const validCode = (
  <img
    className="j-zbj-checkcode-imgcode-img zbj-checkcode-imgcode-img"
    alt="请输入您看到的内容"
    role="captchaimg"
    title="点击刷新图片校验码"
    src="https://login.zbj.com/login/verify?seed=1488531942756"
  />
)
const configForm = [
  {title: '账号:', input:{id: 'username', type: 'text', placehold: '手机号/邮箱'} },
  {title: '密码:', input:{id: 'password', type: 'password', placehold:'请输入密码'} },
  {title: '验证码:', input:{id: 'valide', type: 'text'}, desc: validCode}
]
const registerForm = Input({data: configForm})

const valideSome = {
  username: function(val, regu) {
    if (!val) return false
    return regu.email.test(val) ? 'email' : regu.mobile.test(val) ? 'mobile' : undefined
  }
}


registerForm.rendered = function(){
  $('#username').blur(function(){
    const values = registerForm.values()
    const stat = Validator(this.value, 'noop', values::valideSome.username)()
    stat
    ? registerForm.warning('username', 'no')
    : registerForm.warning('username')
  })

  $('#password').blur(function(){
    const stat = Validator(this.value, 'password')()
    if (stat) registerForm.warning('password', 'no')
    else {
      registerForm.warning('password')
      msgtips.toast('6位密码，包含字符串，数字和符号')
    }
  })
}

const registerBody = (
  <div clclassName="registerDom">
    {registerForm.render()}
    <button>注册</button>
  </div>
)

const registerDom = itemComp({
  data:{
    title: registerBody,
    body: [
      {
        k: <span className='item-attribute'>服务协议</span>,
        v: <span className='item-attribute for-login'>已有账号，登录</span>
      }
    ]
  }
})

export default registerDom
