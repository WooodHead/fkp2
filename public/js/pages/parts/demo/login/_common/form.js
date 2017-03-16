import {validator} from 'libs'
import {
  input as Input,
  item as itemComp,
  tips as msgtips,
  wrapItem
} from 'component/client'

const Validator = validator()
const STATE = SAX('Login')

const ValideButton = wrapItem(
        <a className="btn btn-primary">获取动态码</a>
        ,function(dom){}
      ),

      ValideButton2 = wrapItem(
        <div className="code"> <a class="refreshCode">刷新</a> </div>
        ,function(dom){
          $(dom).find('.refreshCode').click(function(){ })
        }
      ),

      configForm = [
        {title: '账号:', input:{id: 'username', type: 'text', placehold: '手机号/邮箱'} },
        // {title: '验证码:', input:{id: 'valide', type: 'text'}, desc: <ValideButton />},
        {title: '验证码:', input:{id: 'code', type: 'text'}, desc: <ValideButton2 />},
        {title: '密码:', input:{id: 'password', type: 'password', placehold:'请输入密码'} }
      ],

      registerForm = Input({data: configForm}),

      valideSome = {
        username: function(val, regu) {
          if (!val) return false
          return regu.email.test(val) ? 'email' : regu.mobile.test(val) ? 'mobile' : undefined
        }
      },

      Submint = wrapItem(
        <button className="btn btn-primary btn-center submit">登录</button>
        ,function(dom){
          console.log(dom);
        }
      ),

      registerBody =(
        <div className="registerDom">
          {registerForm.render()}
          <div className="other-info fo">
            <div className="fl">
              <p>是否自动登录</p>
            </div>
            <a className="fr" href="#">忘记密码</a>
          </div>
          <Submint />
        </div>
      ),

      registerDom = itemComp({
        data:{
          title: registerBody,
          body: [
            { k: <span className='item-attribute fl'></span>,
              v: <a className='item-attribute fr' href="#">注册新账号</a> }
          ]
        }
      })

export default registerDom
