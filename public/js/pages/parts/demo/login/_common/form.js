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
  const Vb = itemHlc(<button>动态码</button>, function(dom){
    $(dom).click(function(){
      alert(123)
    })
  })
  return <Vb />
}
const configForm = [
  {title: '账号:', input:{id: 'username', type: 'text', placehold: '手机号/邮箱'} },
  {title: ' ', input:{id: 'valide', type: 'text'}, desc: valideButton()},
  {title: '密码:', input:{id: 'password', type: 'password', placehold:'请输入密码'} }
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
    if (stat) {
      if (stat == 'mobile') {
        $(registerForm.elements['valide']).addClass('block')
      }
      registerForm.warning('username', 'no')
    } else {
      registerForm.warning('username')
    }
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
