function encapStore( storeName, config ){
  // for server
  if (storeName===true || !storeName) return React.createClass( config )

  // for client
  var Store = require('../mixins/store')
  var _storeName = storeName
  var _rct = _.cloneDeep(config)

	if( _rct.mixins && _rct.mixins.length ) _rct.mixins.push( Store( _storeName ))
	else _rct.mixins = [ Store( _storeName ) ]
  return React.createClass( _rct );
}

module.exports = encapStore;
