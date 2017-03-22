import Icon from 'component/widgets/icon'
import {
  tips as msgtips,
  input as Input,
  item as itemComp,
} from 'component/client'


// 简单联动
const formAsset = [
  {title: '用户名:', input:{id: 'aaa', type: 'text', placeholder: '用户名'} },
  {title: '手机号码', input:{id: 'bbb', type: 'text', placeholder:'手机号码', desc: '我在后面'}},
  {title: '公司:', input:{id: 'ccc', type: 'text', placeholder:'公司'},
    union: { id: 'bbb' }
  }
]
const formSimple = Input({data: formAsset})
formSimple.render('demo_simple')



const formAsset1 = [
  {title: '时间:', input:{id: 'dpicker', type: 'date', placeholder: '请选择时间'},
    assets: {
      startDate: "2017-03-02",
      endDate: "2017-03-22"
    }
  },

  {title: '到达时间:', input:{id: 'dpicker2', type: 'date', placeholder: '请选择时间'},
    assets: {
      // startDate: "2017-03-02",
      // endDate: "2017-03-22"
    },
    union: {
      id: 'dpicker',
      cb: function(ctx){
        let val = ctx.src.value
        this.refresh({
          startDate: val
        })
      }
    }
  },

  {title: '手机号码', input:{id: 'eee', type: 'text', placeholder:'手机号码', desc: '我在后面'} },
  {title: '公司:',
    input:{id: 'fff', type: 'text', placeholder:'公司'},
    union: {
      id: 'eee',
      cb: function(ctx){ this.value(ctx.src.value) }
    }
  }
]
const formCb = Input({data: formAsset1})
formCb.render('demo_cb')




const formAsset2 = [
{
  title: '选择',
  input:{
    id:    'select',
    type:  'select',
    options: [
      {title: 'aaa', attr: {'value': 1}},
      {title: 'bbb', attr: {'value': 2}},
      {title: 'ccc', attr: {'value': 3}},
    ],
    itemMethod: function(dom){ },
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
      const data = [   // options 选项
        {title: 'xxx', attr: {'value': 4}},
        {title: 'yyy', attr: {'value': 5}},
        {title: 'zzz', attr: {'value': 6}},
      ]
      this.value(data)
    }
  }
}]
const formSelect = Input({data: formAsset2})
formSelect.render('demo_dd')



// // 简单联动
// const configUnion = [
//   {title: '用户名:', input:{id: 'test', type: 'text', placeholder: '用户名'} },
//   {title: '手机号码', input:{id: 'iphone', type: 'text', placeholder:'手机号码', desc: '我在后面'} },
//   {title: '公司:',
//     input:{id: 'icompany', type: 'text', placeholder:'公司'},
//     union: {
//       id: 'iphone',
//       cb: function(ctx){ this.value(ctx.src.value) }
//     }
//   },
//
//   {
//     title: '选择',
//     input:{
//       id:    'select',
//       type:  'select',
//       options: [
//         {title: 'aaa', attr: {'value': 1}},
//         {title: 'bbb', attr: {'value': 2}},
//         {title: 'ccc', attr: {'value': 3}},
//       ],
//       optionMethod: function(dom){
//         // console.log(dom);
//       },
//       placeholder: '请选择'
//     }
//   },
//
//   {
//     title: '选择',
//     input:{
//       id:    'xxx',
//       type:  'select',
//       placeholder: '请选择'
//     },
//     union: {
//       id: 'select',
//       cb: function(ctx){
//         const data = [   // options 选项
//           {title: 'xxx', attr: {'value': 4}},
//           {title: 'yyy', attr: {'value': 5}},
//           {title: 'zzz', attr: {'value': 6}},
//         ]
//         this.value(data)
//       }
//     }
//   },
//   {title: ' ', input: {type: 'button', id: 'go', value: 'gogogo'} }
// ]
//
// const formUni = Input({data: configUnion})
//
// formUni.rendered = function(){
//   const elements = formUni.elements
//   const warning = formUni.addWarn
//   const rmvWarn = formUni.removeWarn
//
//   $(elements('go')).click(function(){
//     warning('test', <Icon src='circle' style={{width: '1em', height: '1em'}}/>)
//   })
// }
// formUni.render('demo-form')
