import {inject, mediaQuery, validator} from 'libs'
import { BTable } from 'component/modules/table'
import itemHlc from 'component/mixins/itemhlc'
import { input as Input } from 'component'
import { tips as msgtips, modal } from 'component/client'

const Icon = require('component/widgets/icon')
inject().css('/css/m/table')
inject().css('/css/parts')
inject().css('/css/m/modal')

const Validator = validator()
const _datas = require("./_data/data.js")


function getRowId(){
  return $.map(bt.elt.bootstrapTable('getSelections'), function (row) {
    return row.id;
  });
}


// 表格上面的搜索条件
//表单结构
const inputData = [
  {input: {id: "name", type: "text"}, title: '名称:'},
  {input: {id: "price", type: "text"}, title: '价钱:'},
  {input: {id: "status", type: "text"}, title: '状态:'},
  {input: {id: "apply", type: "button", value: '搜索'}, title: ' '},
  {input: {id: "reset", type: "button", value: '重置'}, title: ' '}
]
let repForm = Input({
  data: inputData
})
repForm.rendered = function(){
  $('#name').blur(function(){
    const values = registerForm.values()
    const stat = Validator(this.value, 'noop')()
    stat
    ? registerForm.warning('name', 'no')
    : registerForm.warning('name')
  })
  $('#apply').click(()=>{
    let values = repForm.values()
    let chk = Validator
      (values.name, 'name')
      ((query, errs)=>{
        if (errs.length) {
          errs.map((item)=>{
            switch (item.key) {
              case 'name':
                repForm.warning('name')
                msgtips.toast('6位密码，包含字符串，数字和符号')
                break;
              // case 'noop':
              //   repForm.warning('repassword')
              //   break;
            }
            msgtips.error(item.info)
          })
        } else {
          submit(values)
        }
      })
  })
  $('#reset').click(()=>{
    $('#names').val(''),
    $('#prices').val('')
  })
}
// 提交搜索条件
function submit(val){
  // ajax.post(resetPassWordUrl, val)
  let nD = $('#names').val()
  let pD = $('#prices').val()
  // bt.elt.bootstrapTable('refresh', { url: '/?orderId=' + nD + '&busNo=' +pD })

}
//添加、删除表格数据按钮
const TbBtn = itemHlc(
  <div className="tb-btn">
    <button className="btn btn-primary addData" >添加</button>
    <button className="btn btn-default delData">删除</button>
    <button className="btn btn-default refreshData">刷新</button></div>
    , function(dom){
      $(dom).find('.addData').click(function(){
        modal(<ModalInner />)
      })
      $(dom).find('.delData').click(function(){
        if(!$('input[name=btSelectAll]:checked').val() && !$('input[name=btSelectItem]:checked').val()){
          alert('请选择要删除的数据！')
        }else{
          // 需要获取 table中的id,一个或多个，如何去获取呢
          modal(<ModalDel />)
        }
      })
      $(dom).find('.refreshData').click(function(){
        $(dom).parents('.bt-table-0').bootstrapTable('refresh',{url:'/'})
      })
    }
)



// bootstrapTable
// 点击编辑
const editData = [
  {input: {id: "names", type: "text"}, title: '名称:'},
  {input: {id: "prices", type: "text"}, title: '价钱:'},
  // {input: {id: "status", type: "text"}, title: '状态:'},
]
let editForm = Input({
  data: editData
})
editForm.rendered = function(){
  $('#name').blur(function(){
    const values = registerForm.values()
    const stat = Validator(this.value, 'noop')()
    stat
    ? registerForm.warning('name', 'no')
    : registerForm.warning('name')
  })
}

//点击添加进出现的 modal
const ModalInner = itemHlc(
  <div className="modal">
    <div className="modal-head b-b"><h2 >添加</h2><Icon id="my-icon" className="my-icon modal-clone" /></div>
    <div className="modal-main">
      {editForm.render()}
    </div>
    <div className="modal-foot b-t">
      <button  className="btn btn-primary btn-add">确定</button>
      <button className="btn btn-default">关闭</button>
    </div>
  </div>
  ,function(dom){
    $(dom).find('.btn-add').click(function(){
      let appendData =  {
        "name": $('#names').val(),
        "price": $('#prices').val()
      }
      bt.elt.bootstrapTable('prepend',appendData)
     })
  }
)
//点击编辑进出现的 modal
const ModalEdit = itemHlc(
  <div className="modal"  data-id=''>
    <div className="modal-head b-b"><h2 >编辑</h2><Icon id="my-icon" className="my-icon modal-clone" /></div>
    <div className="modal-main" >
      {editForm.render()}
    </div>
    <div className="modal-foot b-t">
      <button  className="btn btn-primary btn-edit">修改</button>
      <button className="btn btn-default">关闭</button>
    </div>
  </div>
  ,function(dom){
    $(dom).find('.btn-edit').click(function(){
      bt.elt.bootstrapTable('updateRow',{
        index: $(dom).attr('data-id'),
        row: {
           name: $('#names').val(),
           price:  $('#prices').val()
         }
      })
     })
  }
)
//点击删除出现的 modal
const ModalDel = itemHlc(
  <div className="modal">
    <div className="modal-head"><h2 className="disN">确认框</h2><Icon id="my-icon" className="my-icon modal-clone" /></div>
    <div className="modal-main vertical-center" >
      <p className="modal-center vc-main">你确定要删除选中的数据吗？</p>
    </div>
    <div className="modal-foot">
      <button className="btn btn-primary btn-del">确定</button>
      <button className="btn btn-default">关闭</button>
    </div>
  </div>
  , function(dom){
    $(dom).find('.btn-del').click(function(){
      bt.elt.bootstrapTable('remove',{
          field: 'id',
          values: getRowId()
      })
      // $('.modal-bg').addClass('disN')
    })
  }
)

function actionFormatter(value, row, index) {
    return [
      '<a class="btn btn-primary edit" href="javascript:void(0)" title="Edit">修改</a>',
      '<a class="btn btn-default remove" href="javascript:void(0)" title="Remove">删除</a>'
    ].join('');
}

let actionEvents = {
    'click .edit': function (e, value, row, index) {
      _.delay(()=>{
        $('.modal').attr('data-id',index)
        $('#names').val(row.name)
        $('#prices').val(row.price)
      }, 500)
      modal(<ModalEdit />)
    },
    'click .remove': function (e, value, row, index) {
      modal(<ModalDel />)
    }
};
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
         events: actionEvents,
         formatter: actionFormatter,
      }
    ],
    clickToSelect: true,                //点击行即可选中单选/复选框
    checkboxHeader: true,              //为否隐藏全选按钮
    toolbar: '.tb-btn',    //工具按钮用哪个容器
    onCheck: function (row, $element) {
      // $element.attr('data-xxx',row.id)
     return false;
    },
    onUncheckSome: function (rows) {
     return false;
    },
  }
})

let Table = (
  <div className="xxxx">
    <div className="searchTb" >
      {repForm.render()}
      <TbBtn />
    </div>

    {bt.render()}
  </div>
)
if (document.getElementById('bootstrapTB')) {
  React.render(Table, document.getElementById('bootstrapTB') )
}
