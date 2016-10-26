/**
 * writeMemoryfile.plugin.js
 * webpack-dev-server启动时，所有的文件均在内存中，这个插件将内存中的文件写入文本，但不会影响dev-server的运行
 * author: 天天修改
 * site: www.agzgz.com
 */

var fs = require('fs');
var path = require('path');
var md5 = require('blueimp-md5');
var _ = require('lodash')
var ConcatSource = require("webpack-core/lib/ConcatSource");

function WriteMemoryFilePlugin(_file, type) { }

module.exports = WriteMemoryFilePlugin;

WriteMemoryFilePlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    var assets = stats.compilation.assets
    Object.keys(assets).forEach(function(fileName) {
      if(process.env.NODE_ENV === 'development'){
        var file = assets[fileName]
        var contents = file.source()
        fs.writeFileSync(file.existsAt, contents, 'utf-8')
      }
    })
  })
}
