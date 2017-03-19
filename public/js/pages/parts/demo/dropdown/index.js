import { dropdown } from 'component/client'

const data = [
  {title: 'xxx'},
  {title: 'yyy'},
  {title: 'zzz'},
  {title: 'aaa'}
]

const xxx = dropdown({
  data: data,
  container: 'demo_dd',
  itemMethod: function(ctx){
    $(this).click(function(e){
      e.stopPropagation()
      ctx.text(this.innerHTML)
      ctx.value(this.innerHTML)
      ctx.toggle()
    })
  }
})

xxx.render()
