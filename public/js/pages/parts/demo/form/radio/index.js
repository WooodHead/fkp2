import {validator} from 'libs'
import { tips as msgtips } from 'component/client'
import {
  input as Input,
  item as itemComp,
} from 'component'
import itemHlc from 'component/mixins/itemhlc'

// Radio&Checkbox
const configBox = [
  {
    title: '单选框',
    input: {
      type: 'radio',
      name:  ['ddd', 'ddd', 'ddd'],
      title: ['选项1', '选项2', '选项3'],
      value: ['1', '2', '3']
    }
  },
  '分隔符',
  {
    input:{
      type: 'checkbox',
      name:  ['www', 'www', 'www'],
      title: ['选项1', '选项2', '选项3'],
      value: ['1', '2', '3']
    }
  },
]
const formBox = Input({data: configBox})
formBox.render('demo-form')
