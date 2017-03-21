import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  const Page = wrapItem(
    <div className="content-container">
      <h2>时间控件</h2>
      <input type="text" className="some_class" value="" id="some_class_1"/>
	    <input type="text" className="some_class" value="" id="some_class_2"/>
    </div>
  )
  return <Page/>
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
