import {validator} from 'libs'
import {
  input as Input,
  item as itemComp,
  tips as msgtips
} from 'component/client'

const Validator = validator()

// // TEXT 类型
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
      {title: 'title1', id: 'usernamea1', type: 'text', placeholder: '用户名'},
      {id: 'mobileb1', type: 'text', placeholder:'手机号码'},
      {id: 'btn', type: 'button', value: '按钮', desc: '按钮的描述'},
    ]
  }
]
const formText1 = Input({data: configText1})
formText1.render('form_text1')


// radio & checkbox
const configBox = [
  {
    input: {
      type: 'radio',
      title: '什么',
      name:  'ddd',
      value: ['1', '2', '3'],
    },
  },
  '分隔符',
  {
    input:{
      type: 'checkbox',
      name:  'www',
      title: ['选项1', '选项2', '选项3'],
      value: ['1', '2', '3'],
    }
  },
]
const formBox = Input({data: configBox})
formBox.render('demo_rcbox')
