//store
export default (id, ComposedComponent) => {
  try {
    if (typeof SAX == undefined) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
    if (!id) throw 'storehlc id must be set'
    return class extends ComposedComponent {
      constructor(props) {
        super(props)
        SAX.bind(id, this)
        this.state.globalName = id
      }
    }
  } catch (e) {
    return ComposedComponent
  }
}
