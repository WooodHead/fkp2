import {inject} from 'libs'
import {wrapItem, grids} from 'component/client'

function index(router){
  const Page = wrapItem(
    <div className="content-container">
      <h2>步骤条</h2>
        <ul className="steps">
          <li className="steps-status-finish">
            <div className="steps-tail"><i></i></div>
            <div className="steps-step">
              <span className="steps-icon"></span>
              <p className="steps-word">确认用户</p>
            </div>
          </li>
          <li className="steps-status-process">
            <div className="steps-tail"><i></i></div>
            <div className="steps-step">
              <span className="steps-icon">1</span>
              <p className="steps-word">验证用户</p>
            </div>
          </li>
          <li>
            <div className="steps-step">
              <span className="steps-icon">1</span>
              <p className="steps-word">重置密码</p>
            </div>
          </li>
        </ul>
        <ul className="steps">
          <li>
            <div className="steps-tail"><i></i></div>
            <div className="steps-step">
              <span className="steps-icon">1</span>
              <p className="steps-word">确认用户</p>
            </div>
          </li>
          <li>
            <div className="steps-tail"><i></i></div>
            <div className="steps-step">
              <span className="steps-icon">2</span>
              <p className="steps-word">确认用户</p>
            </div>
          </li>
          <li>
            <div className="steps-tail"><i></i></div>
            <div className="steps-step">
              <span className="steps-icon">3</span>
              <p className="steps-word">验证用户</p>
            </div>
          </li>
          <li>
            <div className="steps-step">
              <span className="steps-icon">4</span>
              <p className="steps-word">重置密码</p>
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
