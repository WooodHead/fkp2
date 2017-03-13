function isFunction(cb) {
  return typeof cb == 'function'
}

function select(_intent, ctx){
  const intent = ctx.actions.data.intent
  const allocation = ctx.actions.data.allocation // 配置文件, 每一个有id的表单的配置文件都在这个对象下
  const elements = ctx.elements('all')
  let isSelect = {}   // 注册所有的select到这个对象下
  let watchs = {}  // 所有联动的联动方法都会被注册到这个对下下
  let that = ctx

  /*
   * 检测单项是否有联动操作
   * param {JSON} {id: xxx}
   * cb {function}  回调函数
   * 通过lodash的filter函数匹配出符合param条件的联动项数组，从intent中
   * 在对数组项做处理，输出结构，及补全操作
   */
  function checkUnion(param, cb){
    const ary = _.filter(intent, param)
    if (ary.length) {
      watchs[param.id] = function(){
        if (isFunction(cb)) cb(ary)
      }
      return true
    }
  }

  function dealWatchs(param){
    if (watchs[param.id]) watchs[param.id]()
  }


  /*
   * radio子项动作
   * change
   */
  const radios = $(that.ipt).find('.radioItem').find('input[type=radio]')
  $(radios).change(function(){
    that.form[this.name] = this.value;
  })

  /*
   * checkbox子项动作
   * chang
   */
  // $('.checkboxItem').find('input[type=checkbox]')
  const ckboxs = $(that.ipt).find('.checkboxItem').find('input[type=checkbox]')
  $(ckboxs).change(function(){
    var _items = $('input[name='+this.name+']:checked');
    if( _items.length ){
      that.form[this.name] =_items.map( it => it.value )
    }
  })

  Object.keys(allocation).forEach( unit => {
    const item = allocation[unit]
    let thisInput = elements['#'+item.id]
    switch (item.type) {
      case 'checkbox':
        break;

      case 'radio':
        break;

      case 'select':
        const lable = elements[item.id]
        const ddMenu = elements['+'+item.id]  //下拉菜单容器
        let change = true

        !isSelect[item.id]
        ? isSelect[item.id] = { ...item, ddMenu: ddMenu }
        : ''

        $(document).click(function(e){
          $(ddMenu).hide()
        })

        $(thisInput).on('click', function(e){
          e.stopPropagation()
          $(ddMenu).toggle()
        })

        $(ddMenu).on('click', '.fkp-dd-option', function(e){
          e.stopPropagation()
          const _val = this.getAttribute('data-value')
          change = ctx.form[item.id] == _val ? false : true
          $(ddMenu).toggle()

          if (change) {
            ctx.form[item.id] = _val
            thisInput.setAttribute('data-value', _val)
            thisInput.value = this.innerHTML

            if (isFunction(item.optionMethod)) item.optionMethod(this)

            const hasUnion = checkUnion({id: item.id}, dealWithUnion)
            if (hasUnion) {
              dealWatchs({id: thisInput.id})
            }
          }
        })
        break;

      default:
        const hasUnion = checkUnion({id: item.id}, dealWithUnion);
        if (hasUnion) {
          $(thisInput).on('input', function(e){
            ctx.form[item.id] = this.value
            dealWatchs({id: thisInput.id})
          })
        } else {
          $(thisInput).on('input', function(e){
            ctx.form[item.id] = this.value
          })
        }
    }
  })


  /*
   * 处理union动作
   * unionAry  {Array}  匹配到的 input 元素
   * data {JSON}  父级下拉选项的值  val, txt, attr
   * 支持异步数据处理
   */
  function dealWithUnion(unionAry, data){
    unionAry.forEach( unionObj => {
      const src_id = unionObj.id
      const target_id = unionObj.target.id

      const targetDom = elements['#'+target_id]
      const srcDom = elements['#'+src_id]

      const _ctx = {
        src: srcDom,
        target: targetDom,
        elements: ctx.elements,
        values: ctx.values
      }

      if (src_id == target_id) {
        if (isFunction(unionObj.cb)) unionObj.cb.call(targetDom, _ctx)
        return
      }

      if (unionObj.url){
        if (unionObj.param){
          var _str =  JSON.stringify(unionObj.param).replace('$value', data.val) .replace('$text', data.txt) .replace('$attr', data.attr)
          unionObj.param = JSON.parse(_str)
        }

        //关联select取回数据
        ajax.get(unionObj.url, unionObj.param)
        .then(function(data){
          if (unionObj.target.type==='select'){
            if (isFunction(unionObj.cb)) targetDom::unionObj.cb(_ctx)
          } else {
            if (isFunction(unionObj.cb)) targetDom::unionObj.cb(_ctx)
          }
        })
      }

      else {
        // 清空关联项的数据
        let targetIt = {}
        targetIt[target_id] = '';
        ctx.values(targetIt)

        // target 为select类型
        function options(data, text){
          let xxx = isSelect[target_id]
          ctx.actions.roll('UPDATE', {
            index: xxx._index,
            options: data
          })
        }

        let xctx = {
          value: function(val, text){
            let targetValue = {}
            targetValue[target_id] = val
            if (isSelect[target_id]) options(val, text)  // 目标对象是 select类型
            else {
              ctx.values(targetValue)
            }
          }
        }


        if (isFunction(unionObj.cb)) unionObj.cb.call(xctx, _ctx)
        else {
          let targetValue = {}
          targetValue[target_id] = srcDom.value
          if (isSelect[target_id]) {
            switch (allocation[src_id].type) {
              case 'select':
                /* 不应该到这里来，应该去cb */
              break;
              default:
                /* 不应该到这里来，应该去cb */
                targetDom.value = srcDom.value
                targetDom.setAttribute('data-value', srcDom.value)
            }
          } else {
            ctx.values(targetValue)
          }
        }
      }
    })
  }
}

module.exports = function(ctx, intent){
  return select(intent, ctx)
}
