/**
 * 列表
 */
import {timeDiff} from 'libs'
import BaseX from 'component/class/basex'
const isClient = (() => typeof window !== 'undefined')()

class CountDown extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      cd: this.props.cd ? (this.props.cd+1) : 61
    }
  }
  componentWillMount() {
    const tdiff = timeDiff.add(this.state.cd)
    this.setState({
      timeDiff: tdiff
    })
    console.log(this.state);
    

  }
  render(){
    const itemClassName = this.props.itemClass
    const listClassName = this.props.listClass

    const t = this.state.timeDiff

    const _cd = t.seconds
    let _cder = _cd+'秒'
    if (typeof this.props.cding == 'function') {
      _cder = this.props.cding(_cd) || _cder
    }

    const title = this.props.title ? <span>{this.props.title}</span> : ''
    return (
      <div className="cd_wrap">
        {title}
        <ul>
          <li>{_cder}</li>
        </ul>
      </div>
    )
  }
}

// <CD.x cd=60 title='发送验证码' cding={cb}, cdafter={fun} then={fun}/>


const Actions = {

}

// let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    this.combinex(CountDown, Actions)
  }
}

export default function countdown(opts){
  let noop = function(){}
  let dft = {
    theme: 'countdown',
    autoinject: true,
    props: false,
    container: false,
    itemClass: '',
    itemMethod: ''
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return new App(dft)
}

export function pure(props){
  return countdown(props)
}
