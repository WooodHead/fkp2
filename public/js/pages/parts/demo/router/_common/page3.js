import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  const Jdt = wrapItem(
    <div className="progress-line">
      <div className="progress-outer">
        <div className="progress-inner">
          <div className="progress-bg" style={{width:'70%'}}></div>
        </div>
      </div>
      <span className="progress-text">70%</span>
    </div>
  )
  const Page = wrapItem(
    <div class="content-container">
      <h2>进度条</h2>
      <Jdt/>
      <button>下一章</button>
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
