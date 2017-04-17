import { inject, objtypeof } from 'libs'
import itemHlc from 'component/mixins/itemhlc'
import Base from 'component/class/base'

let bsCount = 0
let loaded = false
let loadedFun = []
const ij = inject()
ij
.css('/css/t/bootstrap_table.css')
.js('/js/t/bootstrap_table.js', () => {
  ij.js('/js/t/bootstrap_table_zh_CN.js', ()=>{
    loaded = true
    if (loadedFun.length) {
      for (let ii=0; ii<loadedFun.length; ii++) {
        if (typeof loadedFun[ii] == 'function') {
          loadedFun[ii]()
        }
      }
    }
  })
})
function itemDefaultMethod(element, intent){
  let dft = this.config
  const bsConfig = dft.bstable
  if (loaded) {
    $(element).bootstrapTable(bsConfig);
    this.table = $(element) //这个是获取整个 table的结构 ，可以通过这个去调用 bootstrap的一些方法，在业务的页面上  如：(bt).table.bootstrap('getData')
  } else {
    loadedFun.push(function(){
      $(element).bootstrapTable(bsConfig);
      this.table = $(element) //这个是获取整个 table的结构 ，可以通过这个去调用 bootstrap的一些方法，在业务的页面上  如：(bt).table.bootstrap('getData')
    })
  }
}

class _BoostrapTbale extends Base {
  constructor(config){
    config.listClass = `bt-table-${bsCount}`
    super(config)
    this.table = ''

    itemDefaultMethod = this::itemDefaultMethod
    bsCount++
  }

  componentWill(){
    const Tablehtml = itemHlc( <table className="" data-toggle="table"></table> )
    this.eles = <Tablehtml itemMethod={itemDefaultMethod}/>
  }
}

export function BTable(opts){
  let dft = {
    container: '',
    bstable:{
      classes: 'table table-hover',     //设置 table的类
      method: 'post',
      url: undefined,                          //数据链接
      ajax: undefined,
      cache: true,                      //开启缓存
      data: [],                         //json 数据
      dataType: "json",
      striped: false,                      //使表格带有条纹
      sortable: false,                    //是否启用排序
      pagination: true,                     //在表格底部显示分页工具栏
      pageSize: 10,
      pageNumber: 1,
      // pageList: [10, 20, 50, 100, 200, 500],
      pageList: [10],
      sidePagination: "client",           //服务端处理分页 server
      // cardView: false,                      //设置为True时显示名片（card）布局
      showColumns: false,                  //显示隐藏列

      silentSort: true,                   // ajax交互的时候是否显示loadding加载信息


      singleSelect: false,                 //复选框只能选择一条记录
      clickToSelect: false,                //点击行即可选中单选/复选框
      checkboxHeader: false,              //为否隐藏全选按钮

      search: false,// 是否支持搜索
      searchOnEnterKey: false,            // enter键开启搜索
      searchText: '',                     // 初始化搜索内容
      strictSearch: false,                // 搜索框输入内容是否须和条目显示数据严格匹配，false时只要键入部分值就可获得结果
      searchAlign: 'right',               // 搜索框对齐方式

      // queryParams: queryParams, //参数

      showRefresh: false,                    //显示刷新按钮
      silent: false,                       //刷新事件必须设置
      checkboxHeader: false,
      uniqueId: "id",                       //每一行的唯一标识，一般为主键列
      showToggle:false,                     //是否显示详细视图和列表视图的切换按钮
      showExport: false,                     //是否显示导出
      exportDataType: "basic",              //basic', 'all', 'selected'.

      // iconSize: undefined,// 按钮、搜索输入框通用大小，使用bootstrap的sm、md、lg等
      // iconsPrefix: 'glyphicon', // 按钮通用样式
      // icons: {
      //  paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',// 显示分页按钮
      //  paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',// 隐藏分页按钮
      //  refresh: 'glyphicon-refresh icon-refresh',// 刷新按钮
      //  toggle: 'glyphicon-list-alt icon-list-alt',// 切换表格详情显示、卡片式显示按钮
      //  columns: 'glyphicon-th icon-th',// 筛选条目按钮
      //  detailOpen: 'glyphicon-plus icon-plus',// 卡片式详情展开按钮
      //  detailClose: 'glyphicon-minus icon-minus'// 卡片式详情折叠按钮
      // },// 工具栏按钮具体样式
      onAll: function (name, args) {
       return false;
      },
      onClickCell: function (field, value, row, $element) {
       return false;
      },
      onDblClickCell: function (field, value, row, $element) {
       return false;
      },
      onClickRow: function (item, $element) {
       return false;
      },
      onDblClickRow: function (item, $element) {
       return false;
      },
      onSort: function (name, order) {
       return false;
      },
      onCheck: function (row) {
       return false;
      },
      onUncheck: function (row) {
       return false;
      },
      onCheckAll: function (rows) {
       return false;
      },
      onUncheckAll: function (rows) {
       return false;
      },
      onCheckSome: function (rows) {
       return false;
      },
      onUncheckSome: function (rows) {
       return false;
      },
      onLoadSuccess: function (data) {
       return false;
      },
      onLoadError: function (status) {
       return false;
      },
      onColumnSwitch: function (field, checked) {
       return false;
      },
      onPageChange: function (number, size) {
       return false;
      },
      onSearch: function (text) {
       return false;
      },
      onToggle: function (cardView) {
       return false;
      },
      onPreBody: function (data) {
       return false;
      },
      onPostBody: function () {
       return false;
      },
      onPostHeader: function () {
       return false;
      },
      onExpandRow: function (index, row, $detail) {
       return false;
      },
      onCollapseRow: function (index, row) {
       return false;
      },
      onRefreshOptions: function (options) {
       return false;
      },
      onResetView: function () {
       return false;
      },
      formatLoadingMessage: function () {
        return "请稍等，正在加载中...";
      },
      formatNoMatches: function () {  //没有匹配的结果
        return '无符合条件的记录';
      },
      formatter: function(){},
      columns: [],
    }

  }

  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  return new _BoostrapTbale(dft)
}

export function pure(props){
  return BTable(props)
}
