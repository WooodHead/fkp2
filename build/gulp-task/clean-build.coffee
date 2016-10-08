del = require('del');
config = require('../out_config')

module.exports = (gulp,$) ->
  return () ->
    del.sync [
      config.jsBuildPath,
      config.cssBuildPath,
      config.imagesBuildPath,
      config.fontsBuildPath,
      config.fontsBuildPath,
      config.htmlBuildPath,
      config.tmpPath
    ], {
      force: true
    }
    # gulp.src( [config.htmlDevPath, config.jsDevPath, config.cssDevPath, config.imagesDevPath, config.fontsDevPath,config.tmpPath])
    # .pipe($.rimraf())
