// widget/item默认绑定方法
// 1、前／后置icon
// 2、绑定默认方法 itemDefaultMethod
// 3、绑定外传方法 itemMethod

function itemMixin(){
    return {
        getInitialState: function() {
    		return {
          	params: '',
            icon: '',
            iconPre: ''
    	    };
    	},
      componentWillMount: function(){
          this.intent = this.props.intent || [];
          this.intent.ctx = this;
      },
      componentDidMount: function() {
          //React.findDOMNode(this) // var box = React.findDOMNode(this.refs.popbox);
          var self = this;
          var that = React.findDOMNode(this);
          const ctx = {
            idf: this.idf,
            getState: this.getState,
            updateState: this.updateState,
            parent: this.parent,
            refs: this.refs
          }

          if(this.props.itemDefaultMethod){
            if(this.props.itemMethod){
                var mtd = this.props.itemMethod;
                mtd.call(ctx, that, self.intent);
            }
            setTimeout(function(){
              var dMtd = self.props.itemDefaultMethod;
        			if(typeof dMtd==='function'){
        				dMtd.call(ctx, that, self.intent);
        			}
            }, 17)
	        } else if(this.props.itemMethod){
            var mtd = this.props.itemMethod;
            mtd.call(ctx, that, self.intent);
          }
      }
    }
}

module.exports = itemMixin();
