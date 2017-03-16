import {validator} from 'libs'
import {
  tips as msgtips,
  input as Input,
  item as itemComp,
} from 'component/client'


// Radio&Checkbox
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
formBox.render('demo-form')
