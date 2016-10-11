// import api from 'api'
// import libs from 'libs'
require('./_common/xyz')
libs.msgtips('abc')

setTimeout(function(){
    console.log(libs);
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
