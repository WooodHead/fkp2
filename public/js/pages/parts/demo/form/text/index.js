import {validator} from 'libs'
import { tips as msgtips } from 'component/client'
import {
  input as Input,
  item as itemComp,
} from 'component'
import itemHlc from 'component/mixins/itemhlc'
const Validator = validator()

// TEXT 类型
const configText = [
  {title: '用户名:', input:{id: 'username', type: 'text', placehold: '用户名'}},
  {title: '手机号码', input:{id: 'mobile', type: 'text', placehold:'手机号码', desc: '我在后面'} },
  {title: '公司:', input:{id: 'company', type: 'text', placehold:'公司'} }
]
const formText = Input({data: configText})
formText.render('form_text')




// 表单合并
const configText1 = [
  {
    input: [
      {title: 'title1', id: 'usernamea', type: 'text', placehold: '用户名'},
      {id: 'mobileb', type: 'text', placehold:'手机号码'},
      {id: 'btn', type: 'button', value: '按钮', desc: '按钮的描述'},
    ]
  }
]
const formText1 = Input({data: configText1})
formText1.render('form_text1')




// 简单联动
const configUnion = [
  {title: '用户名:', input:{id: 'test', type: 'text', placehold: '用户名'}},
  {title: '手机号码', input:{id: 'iphone', type: 'text', placehold:'手机号码', desc: '我在后面'} },
  {
    title: '公司:',
    input:{id: 'icompany', type: 'text', placehold:'公司'},
    union: {
      id: 'test',
      cb: function(form){
        $('#test').on('input',function(){
          $('#icompany').val($('#test').val())
        })
      }
    }
  }
]
const formUni = Input({data: configUnion})
formUni.render('form_uni')





// Password 类型
const configPwd = [
  {title: '密码:', input:{id: 'password', type: 'password', placehold: '请输入密码'} },
  {title: '再次输入:', input:{id: 'repassword', type: 'password', placehold:'请输入密码'} }
]
const formPwd = Input({data: configPwd})
formPwd.render('form_pwd')





// 分隔符
const configSplit = [
  '分割符',
  {title: '密码:', input:{id: 'username1', type: 'text'} },
  '华丽的分割符',
  {title: '再次输入:', input:{id: 'username4', type: 'text'} },
]
const formSpl = Input({data: configSplit})
formSpl.render('form_spl')
