import {inject} from 'libs'
import { dropdown } from 'component/client'

inject().css(`
  #demo_dd{
    width: 200px;
    margin: 1em;
  }
`)

const data = [
  {title: <div>123<span>456</span></div>},
  {title: 'yyy'},
  {title: 'zzz'},
  {title: 'aaa'}
]

const xxx = dropdown({
  data: data,
  listClass: 'dropdown-item dropdown-button',
  container: 'demo_dd',
  placeholder: '请选择',
  itemMethod: function(dom){
    const ctx = this
    $(dom).click(function(e){
      e.stopPropagation()
      ctx.text(this.innerHTML)
      ctx.value(this.innerHTML)
      ctx.toggle()
    })
  }
})

xxx.render()
