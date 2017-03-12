import itemHlc from 'component/mixins/itemhlc'
import { tips as msgtips } from 'component/client'
import {
  input as Input,
  item as itemComp,
} from 'component'


// 简单联动
const configUnion = [
  // {title: '用户名:', input:{id: 'test', type: 'text', placeholder: '用户名'} },
  // {title: '手机号码', input:{id: 'iphone', type: 'text', placeholder:'手机号码', desc: '我在后面'} },
  // {
  //   title: '公司:',
  //   input:{id: 'icompany', type: 'text', placeholder:'公司'},
  //   union: {
  //     id: 'iphone',
  //     cb: function(ctx){
  //       this.value = ctx.src.value
  //     }
  //   }
  // }

  {
    title: '选择',
    input:{
      id:    'select',
      type:  'select',
      // value: [[1,2,3], ['a','b','c']],
      options: [
        {title: 'aaa', attr: {'value': 1}},
        {title: 'bbb', attr: {'value': 2}},
        {title: 'ccc', attr: {'value': 3}},
      ],
      placeholder: '请选择'
    }
  },

  {
    title: '选择',
    input:{
      id:    'xxx',
      type:  'select',
      placeholder: '请选择'
    },
    union: {
      id: 'select',
      cb: function(ctx){
        // console.log(this);
        console.log(ctx);
      }
    },

  },
]
const formUni = Input({data: configUnion})
formUni.render('demo-form')
