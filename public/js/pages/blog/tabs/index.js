import itemHlc from 'component/mixins/itemhlc'
import { input as Input, iscroll, tabs as Tabs, cards as Cards, grids as Grids } from 'component'
import { tips as msgtips, modal } from 'component/client'
import {mediaQuery} from 'libs'
import adapter from 'component/adapter/mgbloglist'
import * as bar from './_common/toolbars'

const USER = SAX('User', {login: false, info: {} })
const BLOG = SAX('Blog')

// actions方法集合
BLOG.setActions({
  CHECKLOGIN: async function(){
    const userInfo = SAX.get('User')
    if (userInfo.login) {
      return true
    } else {
      const data = await ajax.get('/auth/isLogin')
      if (!data.error) {
        SAX.set('User', {login: true, info: data})
        return true
      }
    }
  }
})

// 异步拿取数据
BLOG.append({
  pullBlogList: async function(api, page) {
    if (!api) api = '/blog/get'
    let _data = await ajax.get(api, {page: page})
    if (!_data.error) {
      _data.lists = adapter(_data.lists)
      return _data
    }
  },

  Modal: mediaQuery({
    mobile: ()=>modal.p60,
    tablet: ()=>modal.p60,
    pc: ()=>modal.p30,
  }),

  Msgtips: msgtips
})

// 栅格，用于灵活置换其中内容
BLOG.append({
  main: Grids({
    data : ['main'],
    theme: 'grids/blog'
  }),

  grids:{
    start: Grids({ data: [ 'start' ] }),
    docker: Grids({ data: [ 'docker' ] })
  }
})

BLOG.append({
  // tabs menu的头部是否登录结构
  treeHeader: Cards({
    theme: 'cards/blog',
    data: [
      { img: '/images/logo128-1.png',
        body:[
          {title: <div>天天修改</div>},
          {title: <hr />},
        ]
      }
    ]
  }),
  // 列表页触发加载结构
  triggerBar: itemHlc(
    <div className='tb-bar'>
      <button className='btn' type="button">加载更多内容</button>
    </div>
  )
})

// sticky栏组
BLOG.append({
  stickys: require('./_common/sticky')
})

// 底部状态栏
BLOG.append({
  bars: function(){
    const Start = bar.start()
    const main = bar.main()
    const my = bar.my()
    return {
      start: <Start itemMethod={startAction}/>,
      main: main.render(),
      my: my
    }
  },

  bottomBar: function(){
    const bars = this.bars()
    return {
      start: cfg => {
        if (React.isValidElement(cfg)){
          this.grids.start.replace(cfg)
          return
        }
        this.grids.start.replace(bars.start)
      },

      docker: cfg => {
        if (React.isValidElement(cfg)){
          this.grids.docker.replace(cfg)
          return
        }
        const toolBar = iscroll({
          data: cfg,
          theme: 'list/books',
          listClass: 'books',
          iscroll: { scrollX: true }
        })
        this.grids.docker.replace(toolBar.render())
      }
    }
  }
})

// blog 列表
const blogList = require('./_common/bloglist')
BLOG.append({
  getBlog: blogList.load_list_data,
  getMyBlog: blogList.my_list_data,
  listInst: blogList.listInstance
})

// 登录modal及表单
BLOG.append({
  loginFormStructor: require('./_common/loginform')
})

const Config = BLOG.get()
const stickys = Config.stickys
const bottomBar = Config.bottomBar()
const bars = Config.bars()

// <Start /> render后执行的动作
function startAction(dom){
  $(dom).click(async function(){
    const loginStat = await BLOG.roll('CHECKLOGIN')
    if (loginStat) bottomBar.docker(bars.my)
    else {
      const Modal = Config.Modal
      const loginFormStructor = Config.loginFormStructor
      Modal(
        <div style={{textAlign: 'left'}}>
          <div>{loginFormStructor.render()}</div>
          <p>第三方登录</p>
          <a href='/auth/sign'>
            <i className="iconfont icon-github"></i>
          </a>
        </div>
      )
    }
  })
}

// tabs 结构
async function startIndex(){
  await BLOG.roll('CHECKLOGIN')
  const bloglist = await Config.getBlog(0)

  bottomBar.start()
  bottomBar.docker(bars.main)
  Config.main.replace(bloglist.render())

  const tabsConfig = [
    {title: 'AGZGZ', idf: 'category'},
    {title: '博客', content: Config.main.render(), parent: 'category'},
    {title: '用户', content: '444', parent: 'category'}
  ]

  const tabs = Tabs({
    data: tabsConfig,
    select: 1,
    treeHeader: Config.treeHeader.render(),
    container: 'blog',
    theme: 'tabs/blog',  // = /css/m/tabs/blog
    fold: false,
    itemMethod: tabsUnitFun
  })

  tabs.rendered = function(){
    const loginInfo = SAX.get('User')
    $(stickys.bot.container).css({width: '100%'})
    if (loginInfo.login) {
      Config.treeHeader.edit(0, {
        img: '/images/logo128.png',
        body:[
          {title: <div>天天修改111</div>},
          {title: <hr />},
        ]
      })
    }
  }

  tabs.render()
}

// tabs的菜单部分 子项目点击方法
function tabsUnitFun(dom, index){
  $(dom).click( e => {
    e.stopPropagation()
    if (index == 1 ) {
      stickys.top.show()
      stickys.bot.show()
    }
    if (index != 1 && index != 0) {
      stickys.dytop('hide')
      stickys.top.hide()
      stickys.bot.hide()
    }
    this.select(index, dom)
  })
}

startIndex()
