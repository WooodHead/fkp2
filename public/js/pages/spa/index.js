let router = require('libs/router').router
let route = require('libs/router').route

//添加自己的路由
let routeConfig = {
  first: require('./_part/first'),
  second: require('./_part/second'),
  three: require('./_part/three')
}

route
.init(routeConfig)
.start('first')
