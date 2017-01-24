// import itemHlc from 'component/mixins/itemhlc'
// import { input as Input, iscroll } from 'component'
// // import stickys from './sticky'
// // const stGrids = stickys.grids
//
// const bars = {
//   menus: ()=>{
//     const Start = itemHlc(
//       <button className="btn" id="for-admin">管理</button>,
//       function(dom){
//         $(dom).click(function(){
//           toolDock.right(bars.admin)
//         })
//         $('body').on('click', '.return', function(){
//           toolDock.right(bars.main)
//         })
//       }
//     )
//     return <Start />
//   },
//
//   admin: [
//     <a><i className="iconfont icon-myfill login" style={{color: '#748cf4'}}/></a>,
//     <a><i className="iconfont icon-favorfill mylist" style={{color: '#748cf4'}}/></a>,
//     <a><i className="iconfont icon-roundaddfill" style={{color: '#748cf4'}}/></a>,
//     <a><i className="iconfont icon-arrow_left return" style={{color: '#748cf4'}}/></a>
//   ],
//
//   main: Input({
//     theme: 'form/blog',
//     listClass: 'formSearch',
//     data: [{ input:
//         {type: 'text',id:'search', placeholder: 'xxx', desc: <a><i className="iconfont icon-search" /></a>},
//     } ]
//   }).render()
// }
//
// // 底部功能栏
// const toolDock = {
//   left: function(cfg){
//     if (React.isValidElement(cfg)){
//       stGrids.botLeft.replace(cfg)
//       return
//     }
//     stGrids.botLeft.replace(bars.menus())
//   },
//   right: function(cfg){
//     if (React.isValidElement(cfg)){
//       stGrids.botRight.replace(cfg)
//       return
//     }
//     const toolBar = iscroll({
//       data: cfg,
//       theme: 'list/books',
//       listClass: 'books',
//       iscroll: { scrollX: true }
//     })
//     stGrids.botRight.replace(toolBar.render())
//   }
// }
//
// export default {bars, toolDock}

import itemHlc from 'component/mixins/itemhlc'
import { input as Input} from 'component'

const myItem = {
  login:  <a><i className="iconfont icon-myfill login" style={{color: '#748cf4'}}/></a>,
  mylist: <a><i className="iconfont icon-favorfill mylist" style={{color: '#748cf4'}}/></a>,
  back:   <a><i className="iconfont icon-arrow_left back" style={{color: '#748cf4'}}/></a>
}


function init(){
  const BLOG = SAX('Blog')
  const Config = BLOG.get()
  const bars = Config.bars()
  const bottomBar = Config.bottomBar()
  const Modal = Config.Modal
  const Msgtips = Config.Msgtips
  const main = Config.main
  const loginFormStructor = Config.loginFormStructor
  const loginStat = BLOG.roll('CHECKLOGIN')
  const getBlog = Config.getBlog
  const getMyBlog = Config.getMyBlog
  const listInstance = Config.listInst
  return {
    loginStat,
    bars,
    bottomBar,
    Modal,
    loginFormStructor,
    main,
    getBlog,
    getMyBlog,
    Msgtips,
    listInstance
  }
}
const myItemAction = {
  login: (dom)=>{
    const that = myItemAction
    const cfg = init()
    if (!that.loginStat) {
      $(dom).click(function(){
        cfg.Modal(
          <div style={{textAlign: 'left'}}>
            <div>{cfg.loginFormStructor.render()}</div>
            <p>第三方登录</p>
            <a href='/auth/sign'>
              <i className="iconfont icon-github"></i>
            </a>
          </div>
        )
      })
    }
  },

  mylist: async (dom)=>{
    const that = myItemAction
    const cfg = init()
    let mylist = await cfg.listInstance('mylist')
    $(dom).click(function(){
      if (mylist) {
        cfg.main.replace(mylist.render())
      } else {
        cfg.Msgtips.toast('请先登录')
      }
    })
  },

  back: async function(dom){
    const that = myItemAction
    const cfg = init()
    let blog = await cfg.listInstance()
    $(dom).click(function(){
      cfg.bottomBar.docker(cfg.bars.main)
      cfg.main.replace(blog.render())
    })
  }
}


export function start(){
  return itemHlc( <button className="btn" id="for-admin">管理</button> )
}

export function main(){
  return Input({
    theme: 'form/blog',
    listClass: 'formSearch',
    data: [{ input:
        {type: 'text',id:'search', placeholder: 'xxx', desc: <a><i className="iconfont icon-search" /></a>},
    } ]
  })
}

export function my(){
  return [
    // wrapItem(myItem.login, myItemAction.login),
    wrapItem(myItem.mylist, myItemAction.mylist),
    <a><i className="iconfont icon-roundaddfill" style={{color: '#748cf4'}}/></a>,
    wrapItem(myItem.back, myItemAction.back)
  ]
}

function wrapItem(item, cb){
  const Item = itemHlc(item, cb)
  return <Item />
}
