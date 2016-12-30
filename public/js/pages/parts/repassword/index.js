import {objtypeof, inject, validator, msgtips} from 'libs'
import input from 'component/modules/form/inputs'

const injectStatic = inject()
injectStatic.css('/css/m/form')
const resetPassWordUrl = '/auth/resetpwd'

// 密码校验方法
// repassword是否==password
function equalPassword(value, block, errmsg){
  return this.password == this.repassword
}

//表单结构
let Input = input([
  {input: {id: "password", type: "password"}, title: '密码:'},
  {input: {id: "repassword", type: "password"}, title: '再一次:'},
  {input: {id: "apply", type: "button", value: '提交'}, title: ' '}
], formAction)

// 校验密码
let Validator = validator()
function formAction(form){
  $('#repassword').blur(function(){
    let values = form.values()
    let stat = Validator(this.value, 'noop', values::equalPassword)()
    if (stat) form.warning('repassword', 'no')
    else {
      form.warning('repassword')
    }
  })
  $('#password').blur(function(){
    let stat = Validator(this.value, 'password')()
    if (stat) form.warning('password', 'no')
    else {
      form.warning('password')
    }
  })
  $('#apply').click(()=>{
    let values = form.values()
    let chk = Validator
      (values.password, 'password')
      (values.repassword, 'noop', values::equalPassword)
      ((query, errs)=>{
        if (errs.length) {
          errs.map((item)=>{
            switch (item.key) {
              case 'password':
                form.warning('password')
                break;
              case 'noop':
                form.warning('repassword')
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
  <div className="announce announce60">
    <div className="row" style={{textAlign: "left"}}>
      <div className="col-md-3"></div>
      <div className="col-md-6">
        {Input.eles}
      </div>
      <div className="col-md-3"></div>
    </div>
  </div>
)

if (document.getElementById('formBox')) {
  React.render(RePassword, document.getElementById('formBox'))
}
