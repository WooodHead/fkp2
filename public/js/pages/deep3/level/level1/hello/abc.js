// import api from 'api'
import * as libs from 'libs'
import './_common/xyz'

setTimeout( () => {
  libs.msgtips('deep3')
},500)

setTimeout( () => {
  ajax.post('/deep3/level/level1/hello')
  .then( (data) => {
    console.log(data);
    libs.msgtips('get post data')
  })
},1000)
