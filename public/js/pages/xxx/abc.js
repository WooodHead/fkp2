var api = require('api');
var libs = require('libs');
require('./_common/xyz')
libs.msgtips('abc')

setTimeout(function(){
    console.log('======== xxx');
    // api.get('/hello', function(data){
    //     libs.msgtips(data.pdata)
    // })
},500)

setTimeout(function(){
  console.log('======= ggg');
    // api.req('/hello', function(data){
    //     libs.msgtips(data.pdata)
    // })
},1000)
