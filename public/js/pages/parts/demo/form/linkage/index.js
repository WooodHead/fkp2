import itemHlc from 'component/mixins/itemhlc'
import { tips as msgtips } from 'component/client'
import {
  input as Input,
  item as itemComp,
} from 'component'


// 简单联动
const configUnion = [
  {title: '用户名:', input:{id: 'test', type: 'text', placehold: '用户名'}},
  {title: '手机号码', input:{id: 'iphone', type: 'text', placehold:'手机号码', desc: '我在后面'} },
  {
    title: '公司:',
    input:{id: 'icompany', type: 'text', placehold:'公司'},
    union: {
      id: 'iphone',
    }
  }
]
const formUni = Input({data: configUnion})
formUni.render('demo-form')
