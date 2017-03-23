import {inject} from 'libs'
import {wrapItem, dropdown} from 'component/client'

inject().css(
  `
    .dropdown-list{
      margin: 4% auto;
    }
  `
)

function index(router){
  const dropdownsdata = [
    {title: '全部'},
    {title: '你是猪'},
    {title: '你就是猪'},
    {title: '你才是猪'},
    {title: '哈哈'}
  ]

  const dropdownsdata2 = [
    {title: '你是猪'},
    {title: '你就是猪'},
    {title: '你才是猪'},
    {title: '哈哈'}
  ]
  const dropdownsdata3 = [
    {title: '你是猪'},
    {title: '你就是猪'},
    {title: '你才是猪'},
    {title: '哈哈'}
  ]

  const dropdowns = dropdown({
    data: dropdownsdata,
    // container: 'demo_dd',
    listClass: 'dropdown-item dropdown-button',
    itemMethod: function(ctx){
      $(this).click(function(e){
        e.stopPropagation()
        ctx.text(this.innerHTML)
        ctx.value(this.innerHTML)
        ctx.toggle()
      })
    }
  })
  const dropdowns2 = dropdown({
    data: dropdownsdata2,
    listClass: 'dropdown-item dropdown-link',
    placeholder: '请选择',
    itemMethod: function(ctx){
      $(this).click(function(e){
        e.stopPropagation()
        ctx.text(this.innerHTML)
        ctx.value(this.innerHTML)
        ctx.toggle()
      })
    }
  })

  const dropdowns3 = dropdown({
    data: dropdownsdata3,
    // container: 'demo_dd',
    listClass: 'dropdown-item dropdown-button-icon-border',
    itemMethod: function(ctx){
      $(this).click(function(e){
        e.stopPropagation()
        ctx.text(this.innerHTML)
        ctx.value(this.innerHTML)
        ctx.toggle()
      })
    }
  })


  const DrodownHtml = wrapItem(
    <div className="dropdown-list">
      {dropdowns.render()}
      {dropdowns3.render()}
      {dropdowns2.render()}
    </div>
  )
  return <DrodownHtml/>
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
