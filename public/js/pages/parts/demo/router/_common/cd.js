import {inject} from 'libs'
import {wrapItem, countdown} from 'component/client'
const Cd = countdown()
function index(router){
  const Cdbtn = wrapItem(
    <button className="btn">开始倒计时</button>
    , function(dom){
      $(dom).click(function(){
        Cd.start()
      })
    }
  )
  function sendCode(dom){
    $(dom).click(function(){
      Cd.start()
    })
  }

  function cding(count){
    console.log(count)
    return <span>{count} second</span>
    // return <span>{count} second</span>
  }

  function cdafter(count) {
    const Re = wrapItem(
      <span>重新发送</span>
      , function(dom){
        $(dom).click(()=>{
          Cd.restart()
        })
      }
    )
    return <Re />
  }
  return (
    <div className='testCd'>
      <Cd.x cd={10} title={'剩余时间:'} itemMethod={sendCode} cding={cding} cdafter={cdafter}/>
    </div>
  )
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
