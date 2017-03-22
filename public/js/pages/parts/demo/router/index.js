import {inject} from 'libs'
import {grids, router, wrapItem} from 'component/client'

import page1 from './_common/page1'
import page2 from './_common/page2'
import page3 from './_common/page3'
import page4 from './_common/page4'
import page5 from './_common/page5'
import page6 from './_common/page6'
import page7 from './_common/page7'
import page8 from './_common/page8'
// const  Page4 = wrapItem( <div>我才是最后一页</div>, function(dom){ $(dom).click(function(){alert(1)}) } )



const Test1 = wrapItem(
  <div>
    <span style={{display: 'inline-block', marginRight: '0.4em'}}>1234</span>
    <span id='gotest' style={{display: 'inline-block'}}>点我</span>
  </div>
  , function(dom){
    $('#gotest').click( function(e){
      e.stopPropagation()
      alert('123')
    })
  }
)
if ($('#side-content').length) {
  const rter = router({
    container: 'side-content',
    animate: 'fade',
    // mulitple: true,
    scrollMenu: true,         //开启 srcoll
    select: 1,
    data: [
      // {title: '个人资料', content: page1, path: 'page1', idf: 'personal'},
      // {title: '基本信息', content: page1, path: 'page1', parent: 'personal'},
      //
      // {title: '账号安全', content: page2, path: 'page2', idf: 'security'},
      // {title: '安全级别', content: page2, path: 'page2', parent: 'security'},
      // {title: '修改登录密码', content: page2, path: 'page2', parent: 'security'},
      // {title: '手机绑定', content: page2, path: 'page2', parent: 'security'},
      // {title: '邮箱绑定', content: page2, path: 'page2', parent: 'security'},
      // {title: '实名认证资料', content: page2, path: 'page2', parent: 'security',idf: 'aa'},
      // {title: '实名认333', content: page2, path: '/', parent: 'aa'},
      //
      //
      // {title: '快捷登录', content: page3, path: 'page3', idf: 'quick'},
      // {title: '微信/QQ绑定', content: page3, path: 'page3', parent: 'quick'},
      //
      // {title: '主子账号', content: <Page4 />, path: 'page4', idf: 'master'},
      // {title: '我的子账号', content: <Page4 />, path: 'page4', parent: 'master'},
      // {title: '员工管理', content: <Page4 />, path: 'page4', parent: 'master'},
      // {title: '岗位管理', content: <Page4 />, path: 'page4', parent: 'master'},
      // {title: '部门管理', content: <Page4 />, path: 'page4', parent: 'master'},
      // {title: '子账号日志监控', content: <Page4 />, path: 'page4', parent: 'master'},
      //
      // {title: '附属账号', content: <Page4 />, path: 'page4', idf: 'affiliate'},
      // {title: '开通附属账号', content: <Page4 />, path: 'page4', parent: 'affiliate'},
      //
      // {title: '积分账户', content: <Page4 />, path: 'page4', idf: 'integral'},
      // {title: '我的积分', content: <Page4 />, path: 'page4', parent: 'integral'},
      // {title: '交易记录', content: <Page4 />, path: 'page4', parent: 'integral'},
      // {title: '资金明细', content: <Page4 />, path: 'page4', parent: 'integral'},
      // {title: '修改支付密码', content: <Page4 />, path: 'page4', parent: 'integral'},
      //
      // {title: 'Widgets', content: page1, path: 'page1'},
      {title: <span className="caption"><i className='icon-time'></i>UI 元素<i className="icon-arrow_down"></i></span>, idf: 'ui'},
      {title: 'Rate 星星评分', content: page1, path: 'page1', parent: 'ui'},
      {title: 'Progress bars 进度条', content: page2, path: 'page2', parent: 'ui'},
      {title: 'Table 表格', content: page3, path: 'page3', parent: 'ui'},
      {title: 'Steps 步骤条', content: page4, path: 'page4', parent: 'ui'},
      {title: 'Time 日期选择', content: page5, path: 'page5', parent: 'ui'},
      {title: 'Badge 徽标数', content: page6, path: 'page6', parent: 'ui'},
      {title: 'Side 侧边栏', content: page7, path: 'page7', parent: 'ui'},
      {title: 'Dropdown 下拉菜单', content: page8, path: 'page8', parent: 'ui'},

      {title: <span className="caption"><i className='icon-circle'></i>Forms 表单<i className="icon-arrow_down"></i></span>, content: page1, path: 'a1', idf: 'forms'},
      {title: <span className="caption"><i className='icon-recordfill'></i>Tables 表格<i className="icon-arrow_down"></i></span>, content: page1, path: 'a2', idf: 'tables'},
      {title: <span className="caption"><i className='icon-weblock'></i>ECharts 图表<i className="icon-arrow_down"></i></span>, content: page1, path: 'a3', idf: 'echarts'},
      {title: <span className="caption"><i className='icon-my'></i>Map 地图<i className="icon-arrow_down"></i></span>, content: page1, path: 'a4', idf: 'map'},

      {title: <span className="caption"><i className='icon-write'></i>测试<i className="icon-arrow_down"></i></span>, content: page1, path: 'a5', idf: 'test'},
      {title: <span className="caption">测试2<i className="icon-arrow_down"></i></span>, content: page7, path: 'a6', parent: 'test', idf: 'xxx'},
      {title: 'Side 侧边栏', content: 'page7', path: 'a7', parent: 'xxx'},
      {title: 'Side 侧边栏', content: 'page8', path: 'a8', parent: 'xxx'},


    ],
    treeHeader: <div className="left-sidebar-head"><div className="left-sidebar-img"><img src="/images/logo128.png"/></div></div>,
  })
  rter.render()
}
