import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'
import { BTable } from 'component/modules/table'

inject().css('/css/m/table')
const _datas = require("../../table/_data/table.js")

function index(router){
  /**
  * 以下是表格里的数据，参数、及方法
  */

  let bt = BTable({
  // container: 'btTable',
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
           visible: false,
           align: 'center',
           valign: 'middle'
        },
        {
           field: 'name',
           title: '名称',
           align: 'center',
           valign: 'middle',
           sortable: true,
           editable: true
        },
        {
           field: 'price',
           title: '价钱',
           align: 'center',
           valign: 'middle'
        },
        {
           field: 'Desc',
           title: '操作',
           align: 'center',
           valign: 'middle',
           width: 140,
          //  events: actionEvents,
          //  formatter: actionFormatter,
        }
      ]
    }
  })
  let Table = wrapItem(
    <div className="xxxx">
      {bt.render()}
    </div>
  )
  return <Table/>

}

export default function(router){
  return {
    main: function(data){
      return index(router)
    },

    enter: function(data){
      return this.main(data)
    },

    leave: function(){
    },

    loaded: function(dom){

    }
  }
}
