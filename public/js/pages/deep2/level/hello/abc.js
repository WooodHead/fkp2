// import api from 'api'
import * as libs from 'libs'
import './_common/xyz'

setTimeout( () => {
  console.log(libs)
  libs.msgtips('deep2')
},500)

setTimeout( () => {
  console.log('======= ggg');
},1000)
