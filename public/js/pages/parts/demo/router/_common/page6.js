import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  // <i className="j-badge">99+</i>    主要添加这个样式就好了
  const Page = wrapItem(
    <div className="content-container">
      <h2>进度条</h2>
        <div style={{position: 'relative', width: '55px',height: '55px', display:'inline-block', marginRight: '16px'}}>
          <a style={{width: '55px',height: '55px',borderRadius: '6px', background: 'red',display: 'block'}}></a>
          <i className="j-badge">99+</i>
        </div>
        <div style={{position: 'relative', width: '42px',height: '42px', display:'inline-block', marginRight: '16px'}}>
          <a style={{width: '42px',height: '42px',borderRadius: '6px', background: 'red',display: 'block'}}></a>
          <i className="j-badge">9</i>
        </div>
        <div style={{position: 'relative', width: '55px',height: '55px', display:'inline-block', marginRight: '16px'}}>
          <a style={{width: '55px',height: '55px',borderRadius: '6px', background: 'red',display: 'block'}}></a>
          <i className="j-badge-dot"></i>
        </div>
        <div style={{position: 'relative', width: '80px',height: '80px', display:'inline-block', marginRight: '16px'}}>
          <a style={{width: '80px',height: '80px',borderRadius: '6px', background: 'red',display: 'block'}}></a>
          <i className="j-badge">99</i>
        </div>
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
