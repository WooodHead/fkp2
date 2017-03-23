import {inject} from 'libs'
import {wrapItem, dropdown} from 'component/client'

inject().css('/css/test.css')

function index(router){


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
