import {inject} from 'libs'
import {wrapItem, countdown} from 'component/client'

inject().css('/css/m/countdown')
.css(
  `
  .testCd{
    margin:40px auto;
    width: 400px
  }
  `
)

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
    if (typeof count == 'object') {
      const lis = count.map( (item, ii) => {
        if (ii<count.length-1) item += ':'
        return <li className='cding' key={"cding_"+ii}>{item+'秒后重新获取'}</li>
      })
      return <ul>{lis}</ul>
    }
    return <ul><li className="cding">{count+'秒后重新获取'}</li></ul>
  }

  function cdafter(count) {
    const Re = wrapItem(
      <ul className="cdafter"><li>重新发送</li></ul>
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
      <Cd.x cd={10} title={'获取验证码'} itemMethod={sendCode}  cdafter={cdafter} cding={cding}/>
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
      Cd.stop()
    },

    loaded: function(dom){

    }
  }
}
