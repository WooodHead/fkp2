import {inject} from 'libs'

// BaseCombine
export default class  {
  constructor(config){
    this.config = config
    this.client = (() => typeof window !== 'undefined')()
    this.element
    this.inject = this::this.inject

    this.inject()
  }

  inject(src){
    if (this.client) {
      const ij = inject()
      if (this.config.theme && this.config.autoinject) {
        ij.css(['/css/m/'+this.config.theme])  //注入样式
      }
      if (typeof src == 'function') {
        src(ij)
      }
      return ij
    }
  }
}
