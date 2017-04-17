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
      restart: false,
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
    const title = this.props.title
    ? typeof this.props.title == 'string'
      ? <span>{this.props.title}</span>
      : this.props.title
    : ''
    let t = this.state.timeDiff
    delete t.diff

    const tObj = {
      seconds: t.seconds,
      minute: t.minute,
      hour: t.hour,
      day: t.day,
      month: t.month
    }

    const _cdCls = this.props.cdClass ? this.props.cdClass:''
    const _cdingCls = this.props.cdingClass ? this.props.cdingClass :''
    let _cdClass

    let _cd = t.$seconds
    if (_cd && _cd <10) _cd = '0' + _cd
    let _cder = <span><i>{_cd+'秒'}</i></span>
    let ary = []
    if (this.differ<121) {
      if (typeof this.props.cding == 'function') _cder = this.props.cding(_cd) || _cder
      if (this.differ == (t.differ/1000) && !this.state.restart) _cder = title
    }
    else {
      for (let x in tObj) {
        if (tObj[x]) ary.unshift(tObj[x])
      }

      const tmp_cder = ary.map( (item, ii) => {
        if (ii<(ary.length-1)) item = item+':'
        return <i key={'timer_'+ii}>{item}</i>
      })

      _cder = <span>{tmp_cder}</span>
      if (typeof this.props.cding == 'function') _cder = this.props.cding(ary) || _cder
    }
    if (_cd == 0 && typeof this.props.cdafter == 'function') {
      _cder = this.props.cdafter() || <span><i>重新发送</i></span>
      _cdClass = _cdCls
    }
    if(this.differ == _cd || _cd == 0){
      _cdClass = _cdCls
    }
    else{
      _cdClass = _cdingCls
    }

    return (
      <div className={"cd_wrap " + (_cdClass?_cdClass:'')} >
        {this.differ<121 ? '' : title}
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
    cur.restart = false
    return cur
  },
  RESTART: function(state, props){
    let differ = state.timeDiff.differ
    const _diff = timeDiff.getDiff((differ))
    pageCount = _diff.$seconds
    state.timeDiff = _diff
    state.restart = true
    return state
  }
}

// let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    this.timmer
    this.disable = false
    this.combinex(CountDown, Actions)
  }
  _start(){
    this.timmer = setTimeout(()=>{
      if (pageCount != 0) {
        this.dispatch('COUNTDOWN', {})
        this._start()
      }
      else {
        pageCount = 1
        this.disable = false
        clearTimeout(this.timmer)
      }
    }, 1000)
  }
  start(){
    if (this.disable) return
    this.disable = true
    this._start()

  }
  restart(){
    console.log('======= 7777')
    pageCount = 1
    this.dispatch('RESTART', {})
    this.start()
  }
  stop(){
    clearTimeout(this.timmer)
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
