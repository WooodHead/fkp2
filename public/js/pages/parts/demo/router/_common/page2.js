import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

export default function(router){
  return {
    main: function(data){
      return (
        <div>
          good man
        </div>
      )
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
