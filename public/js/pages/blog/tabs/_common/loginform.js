import { input as Input } from 'component'
import { tips as msgtips, modal } from 'component/client'
import {inject, mediaQuery} from 'libs'

const BLOG = SAX('Blog')
const Config = BLOG.get()

inject().css(`
  a{
    text-decoration: none;
  }
  .split{
    margin:0.8em 0;
  }
  .icon-github::before{
    font-size: 2em;
    color: #dddddd;
  }
`)

// 登录html结构
const formAsset = [
  ':---请登录后使用',
  { input: <input type='text' id='username' placehold="username/email" value='' />, title: '用户名：' },
  { input: <input type='password' id='password' value='' />, title: "密码：" },
  { input: <input type='button' id='login' value='登录' />, title: ' ' }
]

function loginFormAction(form){
  $('#username').blur(function(){
    let stat = Validator(this.value, 'username', chkUsername)()
    if (!stat) form.warning('username')
    else form.warning('username','no')
  })

  $('#password').blur(function(){
    let stat = Validator(this.value, 'password')()
    if (!stat) form.warning('password')
    else form.warning('password','no')
  })

  $('#login').click(()=>{
    let values = form.values()
    let chk = Validator
      (values.username, 'username', chkUsername)
      (values.password, 'password')
      ((query, errs)=>{
        if (errs.length) {
          errs.map( item => {
            switch (item.key) {
              case 'username':
                form.warning('username')
              break;
              case 'password':
                form.warning('password')
              break;
            }
            msgtips.error(item.info)
          })
        } else {
          // login
        }
      })
  })
}

const loginFormStructor = Input({
  data: formAsset,
  theme: 'notheme',
  rendered: loginFormAction
})

export default loginFormStructor
// BLOG.append({loginFormStructor})

// export default function thenAction(){
//   const loginInfo = SAX.get('User')
//   if (loginInfo.login) {
//     Config.treeHeader.edit(0, {
//       img: '/images/logo128.png',
//       body:[
//         {title: <div>天天修改111</div>},
//         {title: <hr />},
//       ]
//     })
//   }
// }
