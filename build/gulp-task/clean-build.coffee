del = require('del');
config = require('../out_config')

module.exports = (gulp,$) ->
  return () ->
    del.sync [
      config.jsBuildPath,
      config.cssBuildPath,
      config.imagesBuildPath,
      config.fontsBuildPath,
      config.htmlBuildPath,
      config.staticPath+'map.json'
    ], {
      force: true
    }
