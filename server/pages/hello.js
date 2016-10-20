"use strict";
let debug = Debug('pages:hello')

async function hello(oridata, hlo) {
  // let xxx = await Fetch.get('163')
  // console.log(xxx);

  hlo.get = async function(){
    oridata.fkp = 'FKP-REST'
    if (this.local.query._stat_ && this.local.query._stat_ === 'DATA' ){
      this.body = {pdata: '我是get数据'}
    }
    return oridata;
  }

  hlo.post = async function(){
    return {pdata: '我是post数据'}
  }

  return hlo.run()
}

export { hello as getData }
