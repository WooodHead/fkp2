/**
 * 列表
 */
import {timeDiff} from 'libs'
import BaseX from 'component/class/basex'
const isClient = (() => typeof window !== 'undefined')()

class CountDown extends React.Component {
  constructor(props){
    super(props)
    const _cd = this.props.cd ? (this.props.cd+1) : 61
    const tdiff = timeDiff.add(_cd)
    this.state = {
      cd: _cd,
      timeDiff: tdiff
    }
  }

  componentDidMount() {
    const dom = React.findDOMNode(this)
    if (typeof this.props.itemMethod == 'function') {
      this.props.itemMethod(dom)
    }
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

    if (_cd == 0 && typeof this.props.cdafter == 'function') {
      _cder = this.props.cdafter()
    }

    // console.log(_cder);

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

let pageCount = 1
const Actions = {
  COUNTDOWN: function(state, props){
    const cur = this.curState
    let differ = cur.timeDiff.differ
    const _diff = timeDiff.getDiff((differ-1000))
    pageCount = _diff.seconds
    cur.timeDiff = _diff
    return cur
  },
  RESTART: function(state, props){
    console.log(state);
    return state
  }
}

// let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    this.timmer
    this.combinex(CountDown, Actions)
  }
  start(){
    clearTimeout(this.timmer)
    this.timmer = setTimeout(()=>{
      if (pageCount != 0) {
        this.dispatch('COUNTDOWN', {})
        this.start()
      }
      else {
        clearTimeout(this.timmer)
      }
    }, 1000)
  }
  restart(){
    pageCount = 1
    this.dispatch('RESTART', {})
    this.start()
  }
  pause(){
    clearTimeout(this.timmer)
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
