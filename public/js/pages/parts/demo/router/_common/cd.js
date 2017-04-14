import {inject} from 'libs'
import {wrapItem, countdown} from 'component/client'

inject().css('/css/m/form/jx')
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
      console.log('====');
      const lis = count.map( (item, ii) => {
        if (ii<count.length-1) item += ':'
        return <i  key={"cding_"+ii}>{item+'秒后重新获取'}</i>
      })
      return <span className='cding'>{lis}</span>
    }
    return <span className='cding'><i className="cding">{count+'秒后重新获取'}</i></span>
  }

  function cdafter(count) {
    const Re = wrapItem(
      <span className="cdafter"><i>重新发送</i></span>
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
      <Cd.x cd={3} title={'获取验证码'} itemMethod={sendCode} cdClass='btn-fab427' cdingClass='btn-disabled' cdafter={cdafter} cding={cding}/>
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
