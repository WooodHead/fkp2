//store
export default (id, ComposedComponent) => {
  try {
    if (typeof SAX == undefined) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    if (!id) throw 'storehlc id must be set'

    return class extends ComposedComponent {
      constructor(props) {
        super(props)
        this._act = this._act.bind(this)
      }

      _act(data){
        this.setState(data)
      }

      componentWillMount() {
        SAX.setter( id, null, this._act )
        super.componentWillMount()
      }
    }
  } catch (e) {
    console.log(e);
    return
  }
}
