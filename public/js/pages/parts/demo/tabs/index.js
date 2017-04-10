import {inject} from 'libs'
import { htabs as Tabs } from 'component/client'


inject().css(`
  #test{
    width: 400px;
    height: 600px;
  }
`)
const configTabs = [
  {title: '账号登录', content: 'partForm'},
  {title: '微信/QQ登录', content: 'qrcodeDom'},
]

const tabsxx = Tabs({
  data: configTabs,
  theme: 'tabs/contentpop',
  itemMethod: function(dom, index){
    $(dom).click( e => {
      e.stopPropagation()
      this.select(index)
    })
  }
})

tabsxx.render('test')
