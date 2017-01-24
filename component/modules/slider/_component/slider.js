import ItemHlc from 'component/mixins/itemhlc'

export class Pure extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data: [],
      control: []
    }
  }

  componentWillMount() {
    if (this.props.data){
      if (this.props.control){
        this.setState({
          data: this.props.data,
          control: this.props.control
        })
      } else {
        this.setState({
          data: this.props.data
        })
      }
    }
  }

  render(){
    let _slieder = <div className="for-slider"><ul className={this.props.listClass}> {this.state.data} </ul></div>
    if (this.state.control.length){
      _slieder = <div className="for-slider-control">
        {_slieder}
        <ul className={'bx-wrapper slider-control '+this.props.listClass+"-control"}> {this.state.control} </ul>
      </div>
    }
    return _slieder
  }
}

let BXSlider = ItemHlc(Pure)
export {BXSlider}
