// writeMemoryfile.plugin.js

var fs = require('fs');
var path = require('path');
var md5 = require('md5');
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
