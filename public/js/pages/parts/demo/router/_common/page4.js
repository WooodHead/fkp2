import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  const Page = wrapItem(
    <div className="content-container">
      <h2>步骤条</h2>
        <ul className="j-steps">
          <li className="j-steps-status-finish">
            <div className="j-steps-tail"><i></i></div>
            <div className="j-steps-step">
              <span className="j-steps-icon"></span>
              <p className="j-steps-word">确认用户</p>
            </div>
          </li>
          <li className="j-steps-status-process">
            <div className="j-steps-tail"><i></i></div>
            <div className="j-steps-step">
              <span className="j-steps-icon">1</span>
              <p className="j-steps-word">验证用户</p>
            </div>
          </li>
          <li>
            <div className="j-steps-step">
              <span className="j-steps-icon">1</span>
              <p className="j-steps-word">重置密码</p>
            </div>
          </li>
        </ul>
        <ul className="j-steps">
          <li>
            <div className="j-steps-tail"><i></i></div>
            <div className="j-steps-step">
              <span className="j-steps-icon">1</span>
              <p className="j-steps-word">确认用户</p>
            </div>
          </li>
          <li>
            <div className="j-steps-tail"><i></i></div>
            <div className="j-steps-step">
              <span className="j-steps-icon">2</span>
              <p className="j-steps-word">确认用户</p>
            </div>
          </li>
          <li>
            <div className="j-steps-tail"><i></i></div>
            <div className="j-steps-step">
              <span className="j-steps-icon">3</span>
              <p className="j-steps-word">验证用户</p>
            </div>
          </li>
          <li>
            <div className="j-steps-step">
              <span className="j-steps-icon">4</span>
              <p className="j-steps-word">重置密码</p>
            </div>
          </li>
        </ul>
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
