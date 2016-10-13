del = require('del')
config = require '../out_config'

module.exports = (gulp,$) ->
  return () ->
    del.sync [
      config.htmlDevPath,
      config.jsDevPath,
      config.cssDevPath,
      config.imagesDevPath,
      config.fontsDevPath,
      config.tmpPath
    ], {
      force: true
    }
