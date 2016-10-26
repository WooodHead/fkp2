"use strict";
let debug = Debug('pages:deep2')

function hello(oridata) {
  return {
    get: async function(ctx){
      oridata.fkp = 'FKP2'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { hello as getData }
