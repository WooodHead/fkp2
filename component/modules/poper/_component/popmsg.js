import React from 'react'
import ReactDom from 'react-dom'


let _poper_msg_ctx
class InitMsgContainer extends React.Component{
	constructor(props) {
		super(props);
		let noop = function(){}
		this.state = {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			center: false,
			centerSty: {left: '54.5%', top: '83%', margin: 'auto', width: '70%'},
			// centerSty: {left: 0, top: 0, right: 0, bottom: 0, position: 'fixed', margin: 'auto', width: '70%', height: '50%'},
			content: '',
			callback: noop,
			visible: true
		}
	}

  componentWillMount() {
    this.setState({
      left: this.props.data.left||0,
      top: this.props.data.top||0,
			width: this.props.data.width||'200px',
			height: this.props.data.height||'100px',
      content: this.props.data.content||'',
			center: this.props.data.center
    })

		if (this.props.append){
			this.append = this.props.append
		}
  }

	shouldComponentUpdate(nextProps, nextState) {
		return true
	}

	componentDidMount() {
    _poper_msg_ctx = this;
		let that = ReactDom.findDOMNode(this);
    if (typeof this.props.itemMethod === 'function'){
			this.props.itemMethod.call(this, that)
		}
	}

	//已加载组件收到新的参数时调用
	componentWillReceiveProps(nextProps){
		// this.setState(nextProps);
	}

  componentDidUpdate(){
		let self = this
		let that = ReactDom.findDOMNode(this);
		if (typeof this.props.itemMethod === 'function'){
			this.props.itemMethod.call(this, that)
		}
  }

	render(){
		let _style = this.state.center ? this.state.centerSty : { left: this.state.left, top: this.state.top }
		let shpitz = this.state.center
		? false
		: ( <div className="shpitz up">
					<div className="rectangle">
					</div>
				</div>
			)

		if (!this.state.visible){
			_style = {left: '-2000px', top: '0'}
		}

		let _cls = 'message-poper'
		switch (this.props.type) {
			case 'Modal':
				_cls = 'message-poper modal'
				break;
			case 'Static':
				_cls = 'static'
				break;
		}
		return (
				<div className={_cls} style={_style}>
					<div className="message-poper-inner inner">{this.state.content}</div>
					{shpitz}
				</div>
		)
	}
}

class _poperMessage {
	constructor(type){  //poper, modal, tips
		let that = this
		this.other = []
		this.box
		this._state={}
		this.ctx
		this.cb
		this.type = type ? type : 'normal'
		this.isRender = false

		this.renderPoperOuter()
		// this.renderPoper()
	}

	renderPoperOuter(){
		let poperOuer = document.createElement('div')
		let container = document.querySelector('#message-poper-container')
		let cls = 'message-poper-outer'
		poperOuer.setAttribute("class", cls)
		container.appendChild(poperOuer)
		this.box = poperOuer
		return this
	}

	renderPoper(){
		let that = this
		function cb(poperDom){
			that.ctx = this
			that.poperDom = poperDom
			if (typeof that.cb === 'function'){
				that.cb.call(this, poperDom, ...that.other)
			}
		}
		this.poper = (
			<InitMsgContainer type={this.type} data={that._state} itemMethod={cb}/>
		)

		ReactDom.render(
			this.poper,
			this.box
		)
		this.isRender = true
	}

	unmountPoper(){
		ReactDOM.unmountComponentAtNode(this.box)
		return this
	}

	destory(){
		ReactDOM.unmountComponentAtNode(this.box)
		this.box.remove()
		return this
	}

	show(content, position, cb, ...other){
		let _state = {...position, content: content}
		this.cb = cb
		this.other = [...other]

		switch (this.type) {
			case 'Modal':
				_state = {center: true, content: content}
				break;
			case 'Static':
				_state = {center: false, content: content}
				break;
			default:
				if (typeof position === 'string'){
					_state = {center: true, content: content}
				}
		}

		_state.visible = true
		this._state = _state

		if (this.isRender){
			this.ctx.setState(_state)
		}
		else {
			this.isRender = true
			this.renderPoper()
		}

		return this
	}

	fresh(cotent, position, cb, ...other){
		this.isRender = false
		this.unmountPoper()
		let _state = {...position, content: content}
		this.cb = cb
		this.other = [...other]

		switch (this.type) {
			case 'Modal':
				_state = {center: true, content: content}
				break;
			default:
				if (typeof position === 'string'){
					_state = {center: true, content: content}
				}
		}

		this._state = _state
		this.renderPoper()
		return this
	}

	hide(){
		if (this.isRender){
			this.ctx.setState({
				visible: false
			})
		}
		return this
	}

	then(cb){
		cb.call(this, this)
		return this
	}


}

export default function poperMessage(type){
	let _id = document.querySelector('#message-poper-container')
	if (!_id){
		let msgContainerInstance = document.createElement('div')
		msgContainerInstance.setAttribute("id", 'message-poper-container');
		document.body.appendChild(msgContainerInstance)
		return new _poperMessage(type)
	}
	else {
		return new _poperMessage(type)
	}
}
