import {wrapItem as combinex} from 'component/client'

class Abc extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show: false
    }
  }
  render(){
    const bbb = <div>456</div>
    return (
      <div className="myContainer">
        { this.state.show ? bbb : 'ni mei a' }
      </div>
    )
  }
}

const Yyy = combinex(Abc, {
  will: function(){
    return { show: true }
  },
  hide: function(){
    return {show: false}
  }
})


const Buton = combinex(<button className='btn'>123</button>, function(dom){
  $(dom).click(function(){
    Yyy.dispatch('will')
  })
})

const container = (
  <div className="boxer">
    <div className="boxer-body">
      <Yyy.element />
    </div>
    <Buton />
  </div>
)


React.render(container, document.querySelector('#test'))
