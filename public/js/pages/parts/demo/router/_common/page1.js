import {inject} from 'libs'
import {grids} from 'component'
import itemHlc from 'component/mixins/itemhlc'

function main(router){
  const Btn = itemHlc(<button>路由跳转</button>, (dom)=>{
    $(dom).click(function(){
      router.goto('page2')
    })
  })

  const pagegrid = grids({
    data: [
      {content: <Btn />},
      {content: '2part'}
    ]
  })

  return pagegrid.render()
}

export default function(router){
  return {
    main: function(data){
      return main(router)
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
