function isFunction(cb) {
  return typeof cb == 'function'
}

let dpickerAssets = {
  minView: "month", //选择日期后，不会再跳转去选择时分秒
  language: 'zh-CN',
  format: "yyyy-mm-dd",                //格式化日期
  autoclose: true
}

function select(_intent, ctx){
  const intent = ctx.actions.data.intent
  
  const allocation = ctx.allocation // 配置文件, 每一个有id的表单的配置文件都在这个对象下
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

  function getrcBoxName(pdata){
    let superID
    if (_.isArray(pdata.name)) return P.name[0]
    else {
      return pdata.name
    }
  }

  // console.log(elements);
  // console.log(allocation);

  function dealRcbox(item){
    const _name = getrcBoxName(item)
    const lable = elements[_name]
    const thisInput = $(lable).find('input[name='+_name+']')
    $(thisInput).change(function(){
      if (item.type == 'checkbox') {
        let cbVal = []
        thisInput.each( (ii, item) => {
          if (item.checked) cbVal.push(item.value)
        })
        ctx.form[_name] = cbVal;
      } else {
        ctx.form[_name] = this.value;
      }
      const itMtd = item.itemMethod || item.attr.itemMethod
      if (typeof itMtd == 'function') {
        itMtd.call(this, thisInput)
      }
    })
  }

  function dealDatePicker(item){
    const thisInput = elements['#'+item.id]
    if (!thisInput) return
    if (!item.profile.union) {
      const dftAssets = _.extend(dpickerAssets, item.profile.assets)
      ctx.actions.setActions({
        datapicker: function(){
          $(thisInput).datetimepicker(dftAssets);
        }
      })
    }

    const hasUnion = checkUnion({id: item.id}, dealWithUnion)
    $(thisInput).on('change', function(){
      let targetIt = {}
      targetIt[item.id] = this.value;
      ctx.values(targetIt)
      if (hasUnion) {
        dealWatchs({id: thisInput.id})
      }
    })
  }

  function forceDealWithUnion(item){
    const hasUnion = checkUnion({id: item.id}, dealWithUnion)
    if (hasUnion) {
      dealWatchs({id: item.id})
    }
  }

  Object.keys(allocation).forEach( unit => {
    const item = allocation[unit]
    const itMtd = item.itemMethod || item.attr.itemMethod

    let thisInput
    let lable
    switch (item.type) {
      case 'date':
        dealDatePicker(item)
        break;
      case 'checkbox':
        dealRcbox(item)
        break;

      case 'radio':
        dealRcbox(item)
        break;

      case 'select':
        const watch = item.profile.watch

        thisInput = elements['#'+item.id]
        lable = elements[item.id]
        const ddMenu = elements['+'+item.id]  //下拉菜单容器
        let change = true

        !isSelect[item.id]
        ? isSelect[item.id] = { ...item, ddMenu: ddMenu }
        : ''

        $(document).click(function(e){
          $(ddMenu).hide()
        })

        if (watch) {
          $(thisInput).on('input', function(){
            forceDealWithUnion(item)
          })
        }

        $(thisInput).on('change', function(e){
          e.stopPropagation()
          const hasUnion = checkUnion({id: item.id}, dealWithUnion)
          if (hasUnion) {
            dealWatchs({id: thisInput.id})
          }
        })

        const _ctx = {
          toggle: function(){
            $(ddMenu).toggle()
          },
          value: function(val){
            ctx.form[item.id] = val
            thisInput.setAttribute('data-value', val)
            thisInput.value = val
          }
        }

        $(elements[item.id]).on('toggledd', function(){
          if (isFunction(itMtd)) {
              const willToggle = itMtd.call(_ctx, elements['+'+item.id])
              if (willToggle) $(ddMenu).toggle()
          } else {
            $(ddMenu).toggle()
          }
        })

        $(thisInput).on('click', function(e){
          e.stopPropagation()
          $(elements[item.id]).trigger('toggledd')
          if (watch) {
            forceDealWithUnion(item)
          }
        })

        $(ddMenu).on('click', '.fkp-dd-option', function(e){
          e.stopPropagation()
          const _val = this.getAttribute('data-value')
          change = ctx.form[item.id] == _val ? false : true

          $(elements[item.id]).trigger('toggledd')
          if (change) {
            ctx.form[item.id] = _val
            thisInput.setAttribute('data-value', _val)
            thisInput.value = this.innerHTML
            $(thisInput).trigger('change')
          }
        })
        break;

      default:
        thisInput = elements['#'+item.id]
        const hasUnion = checkUnion({id: item.id}, dealWithUnion);
        if (hasUnion) {
          $(thisInput).on('input', function(e){
            ctx.form[item.id] = this.value
            if (isFunction(itMtd)) itMtd(this)  // ???
            dealWatchs({id: thisInput.id})
          })
        } else {
          $(thisInput).on('input', function(e){
            if (isFunction(itMtd)) itMtd(this)  // ???
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

      // 清空目标的值
      if (src_id != target_id) {
        let targetIt = {}
        targetIt[target_id] = '';
        ctx.values(targetIt)
      }

      // target 为select类型
      function options(data, text){
        let xxx = isSelect[target_id]
        ctx.actions.roll('UPDATESELECT', {
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

      if (isSelect[target_id]) {
        xctx.options = function(val, text){
          options(val, text)
        }
      }

      let ctx_dpicker = {
        refresh: function(asset){
          const dftAssets = _.extend(dpickerAssets, asset)
          $(targetDom).datetimepicker(dftAssets);
        }
      }

      if (unionObj.target.type == 'date') {
        xctx = ctx_dpicker
      }

      // 执行关联方法
      if (src_id == target_id) {
        if (isFunction(unionObj.cb)) unionObj.cb.call(xctx, _ctx.src)
        return
      }

      if (isFunction(unionObj.cb)) unionObj.cb.call(xctx, _ctx)
      else if(unionObj.target.type == 'date'){
        return
      }
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
    })
  }
}

module.exports = function(ctx, intent){
  return select(intent, ctx)
}
