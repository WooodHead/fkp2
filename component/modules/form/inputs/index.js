import { inject } from 'libs'
let Input = require('../_part/input')
let render = React.render;

function text(data, opts, callback){
  let noop = function(){}
  let dft = {
    container: '',
    theme: 'form',
    itemMethod: noop
  }
  if (typeof opts == 'function') {
    callback = opts
    opts = undefined
  }
  if (_.isPlainObject(opts)) dft = _.assign(dft, opts)
  if (data) dft.data = data
  inject().css('/css/m/'+dft.theme+'.css')

  let _fun = function(data, ele, cb){
    this.data = data
    this.value = {}
    this.form = {}
    this.eles = undefined
    let self = this
    // ItemMixin的回调方法
    // @intent，props.intent | this.intent
    function dm(intent){
      // 引入select的插件
      // self.ipt, self.value
      self.ipt = this
      require('../_part/select')(self, intent)
      if (typeof cb == 'function') cb.call(this, self)
    }

    let Inputs = undefined
    if( typeof ele === 'string') Inputs = Input(ele)
    else {
      Inputs = Input()
    }

    if (!dft.container) {
       this.eles = <Inputs data={data} itemMethod={dft.itemMethod} itemDefaultMethod={dm}/>
    } else {
      render(
        <Inputs data={data} itemMethod={dft.itemMethod} itemDefaultMethod={dm}/>,
        (function(){return ele.nodeType ? ele : document.getElementById(ele)}())
      )
    }
  }

  _fun.prototype = {
    getValue: function(){
      var values = {}
      if(_.isArray(this.data)){
        this.data.map(function(item, i){
          if (_.isObject(item)){
            let _isRadioOrCbx = ['radio','checkbox'].indexOf(item.input.type)
            let _item = _isRadioOrCbx > -1 ? $('input[name='+item.input.name[0]+']:checked') : $('#'+item.input.id)
            _isRadioOrCbx>-1
            ? item.input.type==='checkbox'
              ? (()=>{
                if( _item.length ){
                  let _val = _item.each((j, it) => {
                    return it.value
                  })||[]
                  values[item.input.name[0]] = _val
                }
                else { values[item.input.name[0]]=[] }
              })()
              : values[item.input.name[0]] = _item.val()
            : values[item.input.id] = _item.attr('data-value')|| _item.val()
          }
        })
        return values;
      }
    }
  }
  return new _fun(dft.data, dft.container, callback)
}

text.pure = function(){
  return Input()
}

module.exports = text
