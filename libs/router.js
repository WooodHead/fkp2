// popstate的bug，在ios上popstate首次进入就被执行了
(function() {
  //解决方案  http://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome
  //android 和 iphone上页面刷新就会直接执行popstate，这是一个浏览器的bug
  var blockPopstateEvent = document.readyState!="complete";
  window.addEventListener("load", function() {
    // The timeout ensures that popstate-events will be unblocked right
    // after the load event occured, but not in the same event-loop cycle.
    setTimeout(function(){ blockPopstateEvent = false; }, 0);
  }, false)
  window.addEventListener("popstate", function(evt) {
    if (blockPopstateEvent && document.readyState=="complete") {
      evt.preventDefault();
      evt.stopImmediatePropagation();
    } else {
      bindFn()
    }
  }, false)
}())


let qs = require('querystring')
let libs = require('./libs_client')
let _multiDom = false
let allow_router_cb = false  // router.cb允许在业务页面指定后退的特殊地址，权重较高

// 绑定popstate
function bindFn(e){
  if (allow_router_cb){
    var url = libs.urlparse(location.href);
    if (url.params.goback) {
      if (url.params.goback.indexOf('_')>-1) {
        var tmp = url.params.goback.split('_')
        var uri = tmp[0]
        var hash = tmp[1]
        var _url = '/'+uri+'#'+hash
        router(_url)
      } else { router(url.params.goback) }
    }
    else if (router.cb && (typeof router.cb == 'function')) { router.cb() }
    else{
      let _history = SAX.get('_HISTORY')
      let _history_data = SAX.get('_HISTORY_DATA')
      if (!_history.length || _history.length === 1){
        if (_history.hash) {
          _history.replaceState(null,null, history.source)
          router(_history.hash, false, true)
        }
        typeof wx == undefined ? window.history.go(-1) : wx.closeWindow()
      }
      else{
        let pop = SAX.pop('_HISTORY')
        let pophistory = pop[0]
        let hist = pophistory[pophistory.length-1]
        if(hist.hash){
          history.replaceState(null,null, hist.source)
          router(hist.hash, false, true)
        } else { window.location.href = hist.source }
      }


    }
  }
}

var rt = libs.$class.create()
rt.prototype = {
  init: function(name, data, back){
    SAX.set("_routerInstanc", this)
    SAX.set('_HISTORY', []);
    SAX.set('_HISTORY_DATA', []);
    this.multiDom = _multiDom;
    this.intent;
    this.isBack = false;
    this.hideStack = []
    this._injectionCss();
    this.distribute(name, data, back)
  },

  //router专用css
  //css在global/index.less中
  _injectionCss: function(){
    libs.inject().css('/css/t/router.css')
  },

  distribute: function(name, data, back){
    SAX.set('_TRUE_URL', location.href)
    this.name = name;
    this.back = back;
    this.intent = data
    this.url = libs.urlparse(location.href);
    router.cb = undefined;
    this.isBack = false;
    allow_router_cb = false;

    let _back = this._parseBack()
    let rtstat = this._parseRoute()
    if (rtstat){
      this._deal();
      this._multiDom();
    }
  },

  _parseBack: function(){
    if (!this.back) this.isBack = false
    if (typeof this.back == 'boolean') this.isBack = this.back
  },

  _parseRoute: function(){
    let name = this.name
    let url = this.url;

    if (router.cb && (typeof router.cb === 'function')){
      if (this.back === true){
        router.cb.call(this, this.name)
        return false;
      }
    }

    if (name && (name.indexOf('/')==0 || name.indexOf('http')==0)) {
      console.log('-------router jump ------');
      if (name.indexOf('#')>-1){
        var next = name.substring(0,name.indexOf('#'))
        if (url.path==next){
          var hash = name.substring(name.indexOf('#')+1)
          this.name = hash
          return true;
        }
      }
      window.location.href = name
      return false;
    } else {
      let _uri, tmp_url
      if (url.params.hash){
        let hash = url.params.hash;
        let href = window.location;
        if (!this.isBack){
          if (hash !== name) {
            _uri = href+'#'+name;
            historyStat({uri: _uri}, '1null', _uri)
            tmp_url = libs.urlparse(location.href);
            this.url = tmp_url;
            url = tmp_url
          }
          SAX.append('_HISTORY', url);
        }
      } else {
        if (!this.isBack){
          _uri = name;
          historyStat({uri: _uri}, '2null', '#'+name)
          tmp_url = libs.urlparse(location.href);
          this.url = tmp_url;
          url = tmp_url
          SAX.append('_HISTORY', url);
        }
      }
      return true;
    }
  },

  _deal: function(){
    var name = this.name;
    var isBack = this.isBack;
    var intent = this.intent
    var temp = SAX.getter(name)
    if (temp){
      var prev_page = SAX.getter('_CURENT_PAGE')
      this.prev_page = prev_page
      if (prev_page) {
        var prev_name = prev_page.data
        prev_page.run(intent, prev_name)
      }
      SAX.set('_CURENT_PAGE', name)
      router.cb = false;

      SAX.append('_HISTORY_DATA', intent)
      var cur_page = SAX.getter(name)

      if (this.multiDom) SAX.setter(name, intent)
      else {
        SAX.setter(name, intent)
      }
      historyStatBehavior()
    }
  },

  //多id dom 容器结构
  _multiDom: function(){
    var prev_id
    , prev_dom
    , name = this.name;
    if (name.indexOf('/')>0){
      name = name.replace(/\//g, '_')
    }
    if (_multiDom){
      if (this.prev_page){
        if (this.prev_page.data){
          prev_id = this.prev_page.data
          if (prev_id.indexOf('/')>0) prev_id = prev_id.replace(/\//g, '_')
          prev_dom = $(document.querySelector('#'+prev_id)).parent()[0]

          if (_.find(this.hideStack, {key: name})) {
            prev_dom.className = 'container-box router-container router-container-rehidden'
          } else {
            this.hideStack.push({key: prev_id})
            prev_dom.className = 'container-box router-container router-container-hidden'
          }
        }
      }

      function putItems2right(items){
        if (!items.length) return
        items.map((val)=>{
          $('#'+val.key).parent()[0].className = 'container-box router-container'
        })
      }

      var nameDom = $(document.querySelector('#'+name)).parent()[0]
      _.forEachRight(this.hideStack, (val, index)=>{
        if (val.key==name) {
          let reStatStack = []
          reStatStack = this.hideStack.splice(index+1)
          putItems2right(reStatStack)
        }
      })
      nameDom.className = 'container-box router-container router-container-block'
      router.clear()
    }
  }
}

function router(name, data, isback){
  let _url = libs.urlparse(location.href);
  if (_url.params.hash){
    let _src = _url.source.replace('hash='+_url.params.hash, '').replace('?&', '?')
    history.replaceState(null,null, _src)
  }
  let instance = SAX.get('_routerInstanc');
  if (instance){ instance.distribute(name, data, isback) }
  else { new rt(name, data, isback) }
}

// 弹出上一步的地址，但不执行
router.pre = function(){
  var _h = SAX.get('_HISTORY');
  return _h[(_h.length-2)];
}

// router 回退一步
router.goback = function(name, data){
  setTimeout(function(){
    _goback(name, data, true)
  }, 0)
}

function historyStatBehavior(){
  // initialURL = location.href;
  allow_router_cb = true;
}


function historyStat(args, title, uri){
  console.log('========= pushState history')
  window.history.pushState(args, title, uri)
}

function _goback(name, data, isback){
  var url = libs.urlparse(location.href);
  if (url.params.goback) {
    if (url.params.goback.indexOf('_')>-1) {
      let tmp = url.params.goback.split('_')
      let uri = tmp[0]
      let hash = tmp[1]
      let _url = '/'+uri+'#'+hash
      router(_url)
    } else { router(url.params.goback) }
  } else {
    if (!name) name = false
    else if (libs.objtypeof(name)==='object'){ data = name }

    if (typeof name === 'string') { router(name) }
    else{
      let _history = SAX.get('_HISTORY')
      if (!_history.length || _history.length === 1){
        if (_history.hash) {
          _history.replaceState(null,null, history.source)
          router(_history.hash, data, isback)
        }
        typeof wx == undefined ? window.history.go(-1) : wx.closeWindow()
      }
      else{
        let pop = SAX.pop('_HISTORY')
        let pophistory = pop[0]
        let hist = pophistory[pophistory.length-1]
        if(hist.hash){
          history.replaceState(null,null, hist.source)
          router(hist.hash, data, isback)
        } else { window.location.href = hist.source }
      }
    }
  }
}

router.clear = function(){ }


/*
 * 清除掉url中的指定params，并重写url，并不跳转url
 * 如 ?tag=xxx，清除掉tag
 * clearState('tag')
 * @tag {String} url中的query的指定key值
*/
function clearState(tag){
  var url = libs.urlparse(location.href);
  var params = url.params;
  if (params[tag]){
    var _src = url.relative.replace(tag+'='+url.params[tag], '')
    .replace('?&', '')
    .replace('?#','#')
    .replace('&&', '&')
    .replace('&#', '#')
    .replace('?', '')

    history.replaceState(null,null, _src)
    setTimeout(function(){ history.replaceState(null,null, _src) }, 0)
  }
}
router.clearState = clearState;

/*
 * 重置url中的指定params，并重写url，并不跳转url
 * 如 ?tag=xxx，重置tag的值为yyy
 * reState('tag', 'yyy')
 * @tag {String} url中的query的指定key值
 * @value {String}  key对应的值
*/
function reState(tag, value){
  var url = libs.urlparse(location.href);
  var params = url.params;
  params[tag] = value;
  var rct = qs.stringify(params)
  rct = url.relative.replace(url.path, url.path+'?'+rct)
  history.replaceState(null,null, rct)
}
router.reState = reState;


let route = function(name, handle){
  if(typeof SAX!='object'){
    console.log("have't global SAX function  ");
    return
  }

  if(libs.objtypeof(name)=='object'){
    let keys = Object.keys(name);
    keys.map(function(item, i){
      SAX.setter(item, name[item])
    })
  }

  if(typeof name === 'string'){
    if(typeof handle === 'function'){
      SAX.setter(name, handle)
    }
  }
}


/*
 * 为每一个key新增一个div, id为key值
 * @name {String} div的id，允许格式 'aaa', 'aaa/bbb', 'bbb/ccc'
 * @options {Object} 引用带page类的页面

 * SAMPLE: route.init({'xxx': require('xxx')})
*/

let _utile = function(){}
_utile.prototype.plugins = function(name, fn){
  _utile.prototype[name] = fn
}

route.init = function(name, options, cb){
  if (!window.SAX){
    console.error("SAX不存在，router依赖SAX");
    return false;
  }
  _multiDom = true;  //全局变量

  let url = libs.urlparse(location.href);
  if (url.params.reurl){
    SAX._reurl = url.params.reurl
    clearState('reurl')
  }

  let dft = {
    container: 'body'
  }

  let opts = _.extend(dft, options)

  $(opts.container).append('<div id="router-wrap" style="width:100%;position:relative;height:100%;"></div>');
  let _wrap = $('#router-wrap')[0];

  if(libs.objtypeof(name)==='object'){
    let keys = Object.keys(name);
    let tmp={};
    keys.map(function(item, i){
      //插入id到body
      var _id = item;
      if (item.indexOf('/')>0) _id = item.replace(/\//g, '_')
      $(_wrap).append('<div class="container-box router-container"><div id="'+_id+'" style="height:100%;overflow:auto;"></div></div>')

      let subdom = $('#'+_id)[0]
      let utile = new _utile()
      utile.plugins('router', router)
      utile.plugins('libs', libs)
      var page_instence = name[item](_id, subdom, utile)

      if (page_instence.goback || page_instence.trigger || page_instence.end){
        if (page_instence.goback
          && libs.objtypeof(page_instence.goback)==='function'){
          SAX.set(item, page_instence.goback, [page_instence])
        }
        if (page_instence.trigger
          && libs.objtypeof(page_instence.trigger)==='function'){
          SAX.set(item, page_instence.trigger, [page_instence])
        }
        if (page_instence.end
          && libs.objtypeof(page_instence.end)==='function'){
          page_instence.end.args = [page_instence]
          tmp[item] = page_instence.end
          SAX.set('_CURENT_PAGE', item, tmp)
          // SAX.set(item, page_instence.end, [page_instence])
        }
      }
      else{
        SAX.set(item, name[item], [_id])
      }
    })
  }
  return route
}

route.start = function(key){
  if (!key || typeof key!=='string'){
    console.error('请指定默认首页');
    return false;
  }
  var url = libs.urlparse(location.href);
  if(url.params.hash){
    var hash = url.params.hash
    clearState('hash')
    router(hash)
  }else{
    if (url.hash) router(url.hash)
    else router(key)   //跳转到默认首页
  }
}


// let context = {}
// function store(name, Comp){
//   let C = Comp.type
//   let P = Comp.props
//   let Tmp = class extends C {
//     constructor(props){
//       super(props)
//       context[name] = this
//     }
//   }
//   return React.createElement(Tmp, P)
// }
//
// class Father extends React.Component {
//   constructor(props){
//     super(props)
//     this.state.data = []
//     SAX.bind('STORE', this)
//     let props = this.props
//     if (props.config && libs.objtypeof(props.config) == 'object') {
//       let theConfig = props.config
//       let that = this
//       this.childs = Object.keys(theConfig).map((item)=>{
//         this.state[item] = false
//         this[item] = context[item]::function(data){
//           let tmp={}
//           tmp[item] = true
//           tmp[data] = data||[]
//           that.setState(tmp)
//         }
//         return {key: item, component: theConfig[item]}
//       })
//     }
//   }
//
//   componentWillMount() {
//     if (this.props.config) this.setState(this.props.config)
//   }
//
//   render(){
//     let fill = this.childs.map((item)=>{
//       if (this.state[item.key]) {
//         return item.component
//       }
//     })
//     return (
//       <div className='router-container'>
//         {fill}
//       </div>
//     )
//   }
// }
//
// route.wrap = function(name, options, cb){
//   if (!window.SAX){
//     console.error("SAX不存在，router依赖SAX");
//     return false;
//   }
//
//   let url = libs.urlparse(location.href);
//   if (url.params.reurl){
//     SAX._reurl = url.params.reurl
//     clearState('reurl')
//   }
//
//   let dft = { container: 'body' }
//   let opts = _.extend(dft, options)
//
//   let fatherConfig = {}
//   if(libs.objtypeof(name)==='object'){
//     Object.keys(name).map(function(item, ii){
//       var _id = item;
//       var utile = new _utile()
//       utile.plugins('router', router)
//       utile.plugins('libs', libs)
//       var page_component = name[item](_id, utile)   //must return react component
//       fatherConfig[name] = store(item, page_component)
//     })
//   }
// }


module.exports = {
  router: router,
  route: route
}
