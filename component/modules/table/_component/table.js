import ItemHlc from 'component/mixins/itemhlc'

export class Table extends React.Component{
  constructor(props){
    super(props)
    // this.state = {
    //   data: [],
    //   control: []
    // }
  }

  componentWillMount() {
    // if (this.props.data){
    //   if (this.props.control){
    //     this.setState({
    //       data: this.props.data,
    //       control: this.props.control
    //     })
    //   } else {
    //     this.setState({
    //       data: this.props.data
    //     })
    //   }
    // }
  }

  render(){
    let _tablle = <table className={this.props.listClass} data-toggle="table">

      </table>
    return _tablle
  }
}

let BootstrapTable = ItemHlc(Table)
export {BootstrapTable}
