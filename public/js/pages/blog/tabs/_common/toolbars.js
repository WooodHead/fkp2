import itemHlc from 'component/mixins/itemhlc'
import { input as Input, baselist} from 'component'
import { inject } from 'libs'
const RUNTIME = SAX('Runtime')
inject().css(`
  .mainBtn{
    width: 2em;
  }
  .mainBtn a{
    display: block;
  }
`)

function init(){
  const BLOG = SAX('Blog')
  const Config = BLOG.get()
  const bars = Config.bars()
  const bottomBar = Config.bottomBar()
  const Modal = Config.Modal
  const Msgtips = Config.Msgtips
  const stickys = Config.stickys
  const main = Config.main
  const loginFormStructor = Config.loginFormStructor
  const loginStat = BLOG.roll('CHECKLOGIN')
  const getBlog = Config.getBlog
  const getMyBlog = Config.getMyBlog
  const listInstance = Config.listInst
  const grids = Config.grids
  const createlist = Config.createlist
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
    listInstance,
    stickys,
    grids,
    createlist
  }
}

const myItem = {
  mylist: <a><i className="iconfont icon-favorfill mylist" style={{color: '#748cf4'}}/></a>,
  back:   <a><i className="iconfont icon-arrow_left back" style={{color: '#748cf4'}}/></a>,
  add:   <a href="/blog/add" target="_blank"><i className="iconfont icon-roundaddfill" style={{color: '#748cf4'}}/></a>
}

const myItemAction = {
  mylist: async (dom)=>{
    const cfg = init()
    let mylist = await cfg.listInstance('mylist')

    const formConfig = [
      {
        input: [
          {type: 'checkbox', id:['checkALL'], name: ['checkALL'], value: ['4'], desc: '全选', itemClass: 'switch'},
          {type: 'button', id: 'deleteArticleItem',  value: '删除', itemClass: 'btn'},
        ]
      }
    ]
    const fi = Input({
      data: formConfig,
      autoinjec: false
    })

    $(dom).click(function(){
      if (mylist) {
        RUNTIME.update({ docker: 'mylist' })
        cfg.main.replace(mylist.render())
        cfg.stickys.toolbar('show')
        cfg.grids.toolbar.replace(<div style={{padding: '0.6em'}}>{fi.render()}</div>)
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
      RUNTIME.update({ docker: '' })
      cfg.stickys.toolbar('hide')
      cfg.bottomBar.docker(cfg.bars.main)
      cfg.main.replace(blog.render())
    })
  }
}


export function start(){
  return itemHlc( <button className="btn" id="for-admin" style={{backgroundColor:'#fff'}}>我的</button> )
}

export function main(stickys){
  const _desc = [
    <a key='main1' id="yyy"><i className="iconfont icon-search" /></a>,
    <a key='main2' id="blogtags"><i className="iconfont icon-commandfill"/></a>
  ]

  const btns = baselist({
    data: _desc,
    theme: 'list/books',
    listClass: 'books',
    itemClass: 'mainBtn'
  })

  btns.rendered = function(){
    let dystickyShow = false
    $('body').on('click', '#blogtags', function(){
      if (dystickyShow) {
        dystickyShow = false
        stickys.dytop('hide')
      } else {
        dystickyShow = true
        stickys.dytop('show')
      }
    })
  }

  return btns

  // iscroll({
  //   data: cfg,
  //   theme: 'list/books',
  //   listClass: 'books',
  //   iscroll: { scrollX: true }
  // })


  // return Input({
  //   autoinjec: false,
  //   listClass: 'formSearch',
  //   data: [{ input:
  //       {type: 'text',id:'search', placeholder: 'xxx', style: {width: '8em'}, desc: btns.render()}
  //   } ]
  // })
}

export function my(){
  return [
    wrapItem(myItem.mylist, myItemAction.mylist),
    myItem.add,
    wrapItem(myItem.back, myItemAction.back)
  ]
}

function wrapItem(item, cb){
  const Item = itemHlc(item, cb)
  return <Item />
}
