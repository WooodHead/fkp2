let _sax = window.SAX
if (!_sax) {
  _sax = require('fkp-sax')
  window.SAX = _sax
}
module.exports = _sax
