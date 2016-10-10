// attachment2common.plugin.js

var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var _ = require('lodash')
var ConcatSource = require("webpack-core/lib/ConcatSource");
function AppendPlugin(_file, type) {
  this.attachFile = _file
  if (!type) type = 'prepend'
  this.attachType = type
}

module.exports = AppendPlugin;

AppendPlugin.prototype.apply = function(compiler) {
  attachFile = this.attachFile
  attachType = this.attachType
  compiler.plugin("compilation", function(compilation, params) {
    compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
      chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file) {
          if(!chunk.parents.length && chunk.filenameTemplate){
            var _attachFileBuffer = new Buffer(fs.readFileSync(attachFile))
            var attachFileContent = {
              source: function(){
                return _attachFileBuffer
              },
              size: function(){
                return _attachFileBuffer.length
              }
            }
            compilation.assets[file] = new ConcatSource(attachFileContent, "\/**attachment2common**\/", "\n", compilation.assets[file]);
          }
        });
      });
      callback();
    });
  });

  // compiler.plugin('done', function(stats) {

    // var assets = stats.compilation.assets
    // var allContent = ''
    // attachFile = this.outputPath+'/'+attachFile
    //
    // if (!fs.existsSync(attachFile)){
    //   return false
    // }
    // else {
    //   Object.keys(assets).forEach(function(fileName) {
    //     if (fileName.indexOf('_common') === 0 ){
    //       var file = assets[fileName];
    //       var attachFileContent = fs.readFileSync(attachFile)
    //       if (attachType === 'prepend'){
    //         allContent = attachFileContent + file.source()
    //       }
    //       else {
    //         allContent = file.source() + attachFileContent
    //       }
    //     }
    //   })
    //
    //   fs.writeFile(attachFile, allContent, 'utf-8')
    // }

    // var htmlFiles = [];
    // var hashFiles = [];
    // var assets = stats.compilation.assets;

    // Object.keys(assets).forEach(function(fileName) {
    //   var file = assets[fileName];
    //   if (/\.(css|js)$/.test(fileName)) {
    //     var hash = md5(file.source());
    //     var newName = fileName.replace(/(.js|.css)$/, '.' + hash + '$1');
    //     hashFiles.push({
    //       originName: fileName,
    //       hashName: newName
    //     });
    //     fs.rename(file.existsAt, file.existsAt.replace(fileName, newName));
    //   }
    //   else if (/\.html$/) {
    //     htmlFiles.push(fileName);
    //   }
    // });
    //
    // htmlFiles.forEach(function(fileName) {
    //   var file = assets[fileName];
    //   var contents = file.source();
    //   hashFiles.forEach(function(item) {
    //     contents = contents.replace(item.originName, item.hashName);
    //   });
    //   fs.writeFile(file.existsAt, contents, 'utf-8');
    // });

  // });
};
