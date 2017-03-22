import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

inject()
  .js('/js/t/boostrap_datepick.js',() =>{
    inject().js('/js/t/bootstrap_datetimepicker.zh_CN.js')
  })


function index(router){
  const Page = wrapItem(
    <div className="content-container">
      <h2>时间控件</h2>
      <input type="text" className="some_class" value="" id="some_class_1"/>
	    <input type="text" className="some_class" value="" id="some_class_2"/>
    </div>
    ,function(dom){
      $('.some_class').datetimepicker({
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        language: 'zh-CN',
        format: "yyyy-mm-dd",                //格式化日期
        autoclose: true,
        startDate: "2017-03-02",
        endDate: "2017-03-22",
        todayBtn: true
      });
    }
  )
  return <Page/>
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
