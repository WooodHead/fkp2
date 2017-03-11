import { BTable } from 'component/modules/table'
const _datas = require("./_data/table.js")

// bootstarp table
let bt = BTable({
  container: 'btTable',
  bstable:{
    data: _datas.rows,
    columns: [
      {
         checkbox: true,
         field: 'state',
         align: 'center',
         valign: 'middle'
      },
      {
         field: 'id',
         title: 'id',
        //  visible: false,
         align: 'center',
         valign: 'middle'
      },
      {
         field: 'name',
         title: '名称',
         align: 'center',
         valign: 'middle',
        //  searchable: true,
         sortable: true,
         editable: true
      },
      {
         field: 'price',
         title: '价钱',
         align: 'center',
         valign: 'middle'
      }
    ],
    striped: true,                      //使表格带有条纹
    sortable: true,                    //是否启用排序
    search: true,                        // 是否支持搜索
    searchOnEnterKey: true,            // enter键开启搜索
  }
}).render()
