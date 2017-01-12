//store
export default (id, ComposedComponent) => {
  try {
    if (typeof SAX == undefined) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    if (!id) throw 'storehlc id must be set'

    return class extends ComposedComponent {
      constructor(props) {
        super(props)
        this.state.globalName = id
      }

      componentWillMount() {
        SAX.bind(id, this)
        super.componentWillMount()
      }
    }
  } catch (e) {
    // console.log(e);
    return ComposedComponent
  }
}
