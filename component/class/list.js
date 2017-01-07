import BaseClass from './base'

// 基于list的抽象类
export default class extends BaseClass {
  constructor(config){
    super(config)
    // actions
    this.append = this::this.append
    this.loaded = this::this.loaded
    this.loading = this::this.loading
    this.trigger = this::this.trigger
    this.update = this::this.update
    this.edit = this::this.edit
    this.over = this::this.over
    this.hidechild = this::this.hidechild
    this.select = this::this.select
  }

  append(ary){
    this.client ? this.update(ary, 'append') : ''
  }

  loaded(){
    this.client ? this.actions.roll('LOADED') : ''
  }

  loading(cb){
    this.client ? this.actions.roll('LOADING', {next: cb}) : ''
  }

  trigger(cb){
    this.client ? this.actions.roll('TRIGGER', {bar: cb}) : ''
  }

  edit(index, data){
    this.actions.roll('EDIT', {index: index, data: data})
  }

  update(ary, type){
    if (this.client) {
      this.loaded()
      if (ary.length) {
        if (type == 'append') {
          this.data = this.data.concat(ary)
        } else {
          this.data = ary
        }
        this.actions.roll('UPDATE', {news: ary, type: type})
      }
      else { this.over() }
    }
  }

  over(){
    this.client ? this.actions.roll('OVER') : ''
  }

  hidechild(){
    this.client ? this.actions.roll('HIDECHILDREN') : ''
  }

  select(){}
}
