/**
 * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
 * ComposedComponent  {React-Element}   [被包围的子组件]
 */
export default (ComposedComponent) => {
  return class extends ComposedComponent {
    constructor(props) {
      super(props);
			this.intent = this.props.intent || [];
    }

    componentDidMount(){
			let self = this
			let that = React.findDOMNode(this);

			if( this.props.itemDefaultMethod ){
				if (this.props.itemMethod) this.props.itemMethod.call(self, that, self.intent)
				setTimeout(function(){
					if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(self, that, self.intent)
				}, 17)
			} else if (this.props.itemMethod){
				this.props.itemMethod.call(self, that, self.intent)
			}

      super.componentDidMount()
		}
  }
}
