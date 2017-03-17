import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  const Btn = wrapItem(<button>路由跳转</button>, (dom)=>{
    $(dom).click(function(){
      router.goto('page2', {xxx: '123'})
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
