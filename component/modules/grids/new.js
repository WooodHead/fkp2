/**
 * 列表
 */

import BaseX from 'component/class/basex'
import combineX from 'component/mixins/combinex'
const isClient = (() => typeof window !== 'undefined')()

class GridsBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[]
    }
  }
  render(){
    const itemClassName = this.props.itemClass
    const listClassName = this.props.listClass

    const list = this.state.data.map( (item, ii)=>{
      return <li className={"grids_item "+itemClassName} key={'grids_'+ii}>{item}</li>
    })
    return (
      <div className="grids_wrap">
        <ul className={"grids_list "+listClassName}>
          {list}
        </ul>
      </div>
    )
  }
}

const Actions = {
  REPLACE: function(state, props){   // state = ostate, props=传进来的参数
    if (!props) return
    if (typeof props == 'string' || typeof props == 'number'){
      state.data[0] = props
    }
    if (typeof props == 'object' && props.props) {
      state.data[0] = props
    }
    if (props.index) {
      state.data[props.index] = props.content
    }
    return state
  }
}

let CombX
class App extends BaseX {
  constructor(config) {
    super(config)
    CombX = combineX(GridsBase, Actions)
    this.x = CombX.element
    this.setActions = CombX.saxer.setActions
    this.roll = CombX.saxer.roll
  }

  replace(props){
    CombX.dispatch('REPLACE', props)
  }
}

export function grids(opts){
  let noop = function(){}
  let dft = {
    theme: 'grids',
    autoinject: true
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return new App(dft)
}

export function pure(props){
  return grids(props)
}
