/*
 * const xxx = Hook('xxx')
 * xxx.mount(function(data){})   // deal with data and return JSON
 * xxx.mount(function(data){})
 * xxx.mount(function(data){})
 * xxx.mount(function(data){})
 * xxx.mount(function(data){})
 * let yyy = xxx.trigger(originalData)
 */

export default class Hooker {
  constructor(name, data){
    this.name = name
    this.data = data
    this.hookWill = this::this.hookWill
    this.mount = this::this.mount
    this.trigger = this::this.trigger
    this.hookWill()
    return this
  }
  hookWill(){
    this.sax = SAX(this.name, this.data)
    this.sax.bind(this.name, this)
  }
  mount(fun){
    this.sax.store.acter(fun)
  }
  trigger(data){
    try {
      let _data = this.sax.trigger(data)
      if (_data) {
        let isJson = true
        _data.map( item => {
          if (!_.isPlainObject(item)) { isJson = false }
        })
        if (!isJson) throw `请确保hook${this.name}内挂载方法返回json数据`
        return _.extend(..._data)
      } else {
        return {}
      }
    } catch (e) {
      console.log(e);
    }
  }
}
