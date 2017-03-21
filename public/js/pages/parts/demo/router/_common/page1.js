import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  // const Btn = wrapItem(<button>路由跳转</button>, (dom)=>{
  //   $(dom).click(function(){
  //     router.goto('page2', {xxx: '123'})
  //   })
  // })

  // const pagegrid = grids({}
  const Pagegrid = wrapItem(
    <div className="content-container">
      <h2>星星评分</h2>
      <ul className="j-rate">
        <li className="j-rate-full"><i></i></li>
        <li className="j-rate-full"><i></i></li>
        <li><i></i></li>
        <li><i></i></li>
        <li><i></i></li>
      </ul>
    </div>
    ,function(dom){
      $(dom).click(function(){
        router.goto('page2', {xxx: '123'})
      })
    }
  )

  // return pagegrid.render()
  return <Pagegrid/>

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
