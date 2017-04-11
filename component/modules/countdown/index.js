/**
 * 列表
 */
import {timeDiff} from 'libs'
import BaseX from 'component/class/basex'
const isClient = (() => typeof window !== 'undefined')()

class CountDown extends React.Component {
  constructor(props){
    super(props)
    const _cd = this.props.cd ? (this.props.cd) : 60
    const tdiff = timeDiff.add(_cd)
    this.differ = tdiff.differ/1000
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
    let t = this.state.timeDiff
    delete t.diff
    
    const tObj = {
      seconds: t.seconds,
      minute: t.minute,
      hour: t.hour,
      day: t.day,
      month: t.month
    }
    
    const _cd = t.$seconds
    let _cder = <span>{_cd+'秒'}</span>
    let ary = []
    if (this.differ<121) {
      if (typeof this.props.cding == 'function') _cder = this.props.cding(_cd) || _cder
    } else {
      for (let x in tObj) {
        if (tObj[x]) ary.unshift(tObj[x])
      }

      const tmp_cder = ary.map( (item, ii) => {
        let _item = item
        if (ii<(ary.length-1)) {
          _item = _item+':'
        }
        return <li key={'timer_'+ii}>{_item}</li> 
      })
      _cder = <ul>{tmp_cder}</ul>
      
      if (typeof this.props.cding == 'function') {
        _cder = this.props.cding(ary) || _cder
      }
    }

    if (_cd == 0 && typeof this.props.cdafter == 'function') {
      _cder = this.props.cdafter()
    }

    const title = this.props.title ? <span>{this.props.title}</span> : ''
    return (
      <div className="cd_wrap">
        {title}
        {_cder}
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
    pageCount = _diff.$seconds
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
