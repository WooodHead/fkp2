export default _props => {
	let props = Object.assign({}, _props);
	const item = require('./_data/'+props.src)
	if (item) {
		delete props.src

		let syblomsList = (
			<symbol id={item.id} viewBox={item.viewBoxs}>
				<path d={item.paths} />
			</symbol>
		)

		return (
			<div>
				<svg className='f-hidden'>
					{syblomsList}
				</svg>
				<svg { ...props }>
			  		<use xlinkHref={ `#${ item.id }` } />
				</svg>
			</div>
		)
	}
}
