/* pages类及pages生周期 */
function pages(opts){
  var page = SAX.get('_CURENT_PAGE')
  if (page) this.intent = SAX.get(page)
  else {
    this.intent = false;
  }
  
  var _this = this;
  var dft, funs
  var defaults = {
    init: function(){},
    ready: function(){},
    main: function(){}
  }

  var _dft = Object.keys(defaults)
  if ( _.isObject(opts) ) dft = _.extend({}, defaults, opts)

  funs = Object.keys(dft)
  funs.map(function(item, i){
    _this[item] = dft[item];
  })

  function run(){
    var _this = this;
    funs.map(function(item, i){
      if (typeof dft[item] == 'function'){
        if (_.indexOf(_dft, item)>-1) dft[item].bind(_this, _this, _this.intent)
      }
    })
  }

  this.next = function(stat, data){
    if (stat){
      if (!this.innerData) this.innerData = data
      else{
        this.innerData = _.extend({}, this.innerData, data)
      }
      run.call(this)
    }
  }

  if (_.indexOf(funs, 'boot')>-1){
    var stat = dft['boot'].call(this, this)
    if (stat) run.call(this);
  }
  else run.call(this)
  return this;
}

pages.prototype = {
  render: function(obj, ele){
    var dom;
    if (!ele) return false;
    if (typeof ele === 'string'){
      dom = document.getElementById(ele)
      if (!dom) return false;
    }
    else if (ele.nodeType) dom = ele;

    if (dom){
      if (_.isObject(obj)) {
        if (React && React.isValidElement(obj)) React.render(obj, dom)
      } else if (typeof obj === 'string'){
        if (Zepto||jQuery){
          var $$ = Zepto||jQuery||$;
          $$(dom).html($$(obj))
        }
      }
    }
    this.render = React.render;
  },
  watch: function(){}
}

pages.new = function(opts){
  return new pages(opts)
}

module.exports = pages
