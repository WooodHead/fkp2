import {inject} from 'libs'
import {wrapItem, countdown} from 'component/client'
const Cd = countdown()
function index(router){
  return <Cd.x cd={60}  title={'发送验证码'} />
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
