import {objtypeof, inject, validator } from 'libs'
import { input as Input } from 'component'
import { tips as msgtips } from 'component/client'
const Validator = validator()
const injectStatic = inject()
injectStatic.css(`
  /* === public/js/parts/repassword === */
  input[type=text]{
    width: 12em;
  }
  input[type=password]{
    width: 12em;
  }
  .inputGroup input[type=button]{
    border: 1px solid #999;
  }
`)
const resetPassWordUrl = '/auth/resetpwd'

// 密码校验方法
// repassword是否==password
function equalPassword(value, block, errmsg){
  return this.password == this.repassword
}

//表单结构
const inputData = [
  {input: {id: "password", type: "password"}, title: '密码:'},
  {input: {id: "repassword", type: "password"}, title: '再一次:'},
  {input: {id: "apply", type: "button", value: '提交'}, title: ' '}
]

let repForm = Input({
  data: inputData
})

repForm.rendered = function(){
  $('#repassword').blur(function(){
    let values = repForm.values()
    let stat = Validator(this.value, 'noop', values::equalPassword)()
    if (stat) repForm.warning('repassword', 'no')
    else {
      repForm.warning('repassword')
    }
  })

  $('#password').blur(function(){
    let stat = Validator(this.value, 'password')()
    if (stat) repForm.warning('password', 'no')
    else {
      repForm.warning('password')
      msgtips.toast('6位密码，包含字符串，数字和符号')
    }
  })
  $('#apply').click(()=>{
    let values = repForm.values()
    let chk = Validator
      (values.password, 'password')
      (values.repassword, 'noop', values::equalPassword)
      ((query, errs)=>{
        if (errs.length) {
          errs.map((item)=>{
            switch (item.key) {
              case 'password':
                repForm.warning('password')
                msgtips.toast('6位密码，包含字符串，数字和符号')
                break;
              case 'noop':
                repForm.warning('repassword')
                break;
            }
            msgtips.error(item.info)
          })
        } else {
          submit(values)
        }
      })
  })
}

// 提交修改
function submit(val){
  ajax.post(resetPassWordUrl, val)
  .then((data)=>{
    if (data.success) {
      msgtips.success('修改成功')
      setTimeout(()=>{
        window.location.href = '/'
      },2000)
    }
  })
}

let RePassword = (
  <div className="announce announce60" style={{textAlign: 'left'}}>
    {repForm.render()}
  </div>
)

if (document.getElementById('formBox')) {
  React.render(RePassword, document.getElementById('formBox') )
}
