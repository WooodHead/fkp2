/**
* Module dependencies.
*/
var fs = require('fs')

// 从map.json拿取获取静态资源 hash 名称
let getMapJson = () => {
    let mode = process.env.whichMode
    let mapFilePath = CONFIG.mapDevJson
    if (mode === 'pro'){
      mapFilePath = CONFIG.mapJson
    }
    if (fs.existsSync(mapFilePath)){
      return JSON.parse(fs.readFileSync(mapFilePath,'utf-8'))
    } else {
      return false
    }
}


//设置全局变脸_mapper
let getMapper = () => {
  	let _mapper = getMapJson();
  	if(!_mapper){
      // throw new Error('静态映射文件不存在')
    }
    else {
      _mapper.commonJs = _mapper.commonDependencies.js
      _mapper.commonCss = _mapper.commonDependencies.css
      _mapper.pageJs = _mapper.dependencies.js
      _mapper.pageCss = _mapper.dependencies.css
      _mapper.length = Object.keys(_mapper).length
    }
    CONFIG.mapper = _mapper
    return _mapper
}

module.exports = getMapper()
